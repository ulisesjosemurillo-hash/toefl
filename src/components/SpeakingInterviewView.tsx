/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SpeakingInterviewQuestion } from '../types/toefl.ts';
import {
  Volume2,
  Mic,
  MicOff,
  Check,
  Play,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Square,
} from 'lucide-react';
import {
  playBeepTone,
  createAudioLevelMeter,
  evaluateInterviewSpoken,
  evaluateSpeakingWithGemini,
  GeminiSpeakingEvaluation,
  InterviewEvaluationResult,
  requestMicrophoneAccess,
  getSupportedAudioMimeType,
} from '../utils/audioRecording.ts';

interface SpeakingInterviewViewProps {
  question: SpeakingInterviewQuestion;
  questionIndex: number; // 0 to 3 (Questions 8 to 11)
  totalInterviewQuestions: number; // 4
  volume: number;
  onFinishResponse: (
    transcript: string,
    audioBlob?: Blob,
    audioUrl?: string,
    aiEval?: GeminiSpeakingEvaluation,
  ) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const SpeakingInterviewView: React.FC<SpeakingInterviewViewProps> = ({
  question,
  questionIndex,
  totalInterviewQuestions,
  volume,
  onFinishResponse,
  onNext,
  onBack,
}) => {
  // Phases: 'listening' | 'countdown' | 'recording' | 'completed'
  const [phase, setPhase] = useState<'listening' | 'countdown' | 'recording' | 'completed'>('listening');
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(question.responseTimeSeconds || 45);
  const [isMicActive, setIsMicActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordedTranscript, setRecordedTranscript] = useState('');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluationResult | null>(null);
  const [geminiEvaluation, setGeminiEvaluation] = useState<GeminiSpeakingEvaluation | null>(null);
  const [isAiEvaluating, setIsAiEvaluating] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const recordedTranscriptRef = useRef<string>('');
  const timerIntervalRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);
  const safetyTimerRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);
  const meterCleanupRef = useRef<(() => void) | null>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const hasFinalizedRef = useRef<boolean>(false);

  // Spoken interview audio when screen opens
  useEffect(() => {
    isTransitioningRef.current = false;
    hasFinalizedRef.current = false;
    setPhase('listening');
    setCountdownSeconds(3);
    setSecondsRemaining(question.responseTimeSeconds || 45);
    setRecordedTranscript('');
    recordedTranscriptRef.current = '';
    audioChunksRef.current = [];
    audioBlobRef.current = null;
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setGeminiEvaluation(null);
    setIsAiEvaluating(false);
    setMicError(null);
    setIsMicActive(false);
    setAudioLevel(0);

    let isCancelled = false;

    const playQuestion = () => {
      // 6.5s safety timer
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        if (!isCancelled && !isTransitioningRef.current) {
          triggerCountdown();
        }
      }, 6500);

      if (question.audioUrl) {
        try {
          const audio = new Audio(question.audioUrl);
          audioRef.current = audio;
          audio.volume = Math.max(0.2, (volume || 85) / 100);
          setIsPlayingQuestion(true);

          audio.onended = () => {
            if (!isCancelled && !isTransitioningRef.current) {
              if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
              setIsPlayingQuestion(false);
              triggerCountdown();
            }
          };

          audio.onerror = () => {
            speakWithBrowser(question.questionSpoken, () => {
              if (!isCancelled && !isTransitioningRef.current) {
                if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
                setIsPlayingQuestion(false);
                triggerCountdown();
              }
            });
          };

          audio.play().catch(() => {
            speakWithBrowser(question.questionSpoken, () => {
              if (!isCancelled && !isTransitioningRef.current) {
                if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
                setIsPlayingQuestion(false);
                triggerCountdown();
              }
            });
          });
        } catch {
          speakWithBrowser(question.questionSpoken, () => {
            if (!isCancelled && !isTransitioningRef.current) {
              if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
              setIsPlayingQuestion(false);
              triggerCountdown();
            }
          });
        }
      } else {
        speakWithBrowser(question.questionSpoken, () => {
          if (!isCancelled && !isTransitioningRef.current) {
            if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
            setIsPlayingQuestion(false);
            triggerCountdown();
          }
        });
      }
    };

    const timer = setTimeout(playQuestion, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      cleanupAllAudio();
    };
  }, [question.id]);

  const cleanupAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      userAudioPlayerRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
    if (meterCleanupRef.current) {
      meterCleanupRef.current();
      meterCleanupRef.current = null;
    }
    stopMicrophone();
  };

  const speakWithBrowser = (text: string, onEnd: () => void) => {
    if (!('speechSynthesis' in window)) {
      setTimeout(onEnd, 3000);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.volume = (volume || 85) / 100;

      const voices = window.speechSynthesis.getVoices();
      const femaleVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Zira') ||
              v.name.includes('Samantha') ||
              v.name.includes('Female')),
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (femaleVoice) utterance.voice = femaleVoice;

      utterance.onend = onEnd;
      utterance.onerror = onEnd;
      setIsPlayingQuestion(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setTimeout(onEnd, 2500);
    }
  };

  const triggerCountdown = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {}
    }
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setIsPlayingQuestion(false);
    startCountdownPhase();
  };

  // Phase 2: 3-Second Countdown before recording begins
  const startCountdownPhase = () => {
    setPhase('countdown');
    setCountdownSeconds(3);

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          playBeepTone(880, 250); // Start tone
          startRecordingPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Phase 3: 45-Second Response Phase with Real Microphone
  const startRecordingPhase = async () => {
    setPhase('recording');
    setSecondsRemaining(question.responseTimeSeconds || 45);
    audioChunksRef.current = [];
    audioBlobRef.current = null;
    recordedTranscriptRef.current = '';

    await startMicrophone();

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
          finishRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startMicrophone = async () => {
    setMicError(null);
    hasFinalizedRef.current = false;

    const micResult = await requestMicrophoneAccess();
    if (micResult.granted && micResult.stream) {
      const stream = micResult.stream;
      mediaStreamRef.current = stream;

      // Hook up live VU volume meter
      if (meterCleanupRef.current) meterCleanupRef.current();
      meterCleanupRef.current = createAudioLevelMeter(stream, (lvl) => {
        setAudioLevel(lvl);
      });

      if (typeof MediaRecorder !== 'undefined') {
        try {
          const mimeType = getSupportedAudioMimeType();
          const recorder = mimeType
            ? new MediaRecorder(stream, { mimeType })
            : new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };

          recorder.onstop = () => {
            const blobType = mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunksRef.current, { type: blobType });
            audioBlobRef.current = audioBlob;
            const url = URL.createObjectURL(audioBlob);
            setRecordedAudioUrl(url);

            const transcriptToUse = recordedTranscriptRef.current;
            finalizeEvaluation(transcriptToUse, audioBlob, url);
          };

          recorder.start(250);
          setIsMicActive(true);
        } catch (recErr: any) {
          setMicError(
            `Error iniciando MediaRecorder: ${recErr?.message || String(recErr)}`,
          );
          setIsMicActive(false);
        }
      } else {
        setMicError('Este navegador no soporta grabación MediaRecorder.');
        setIsMicActive(false);
      }
    } else {
      setMicError(
        micResult.error ||
          'No se pudo acceder al micrófono. Verifica los permisos del navegador.',
      );
      setIsMicActive(false);
    }

    const SpeechRec =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const rec = new SpeechRec();
        speechRecognitionRef.current = rec;
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let str = '';
          for (let i = 0; i < event.results.length; i++) {
            str += event.results[i][0].transcript + ' ';
          }
          const cleaned = str.trim();
          recordedTranscriptRef.current = cleaned;
          setRecordedTranscript(cleaned);
        };

        rec.onerror = () => {};
        rec.start();
      } catch (e) {
        console.warn('SpeechRecognition error:', e);
      }
    }
  };

  const stopMicrophone = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (meterCleanupRef.current) {
      meterCleanupRef.current();
      meterCleanupRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
    }
    setIsMicActive(false);
  };

  const finishRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    const recorderActive =
      mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive';
    stopMicrophone();

    setTimeout(() => {
      if (!hasFinalizedRef.current && !recorderActive) {
        finalizeEvaluation(
          recordedTranscriptRef.current,
          audioBlobRef.current || undefined,
          recordedAudioUrl || undefined,
        );
      } else if (!hasFinalizedRef.current) {
        finalizeEvaluation(
          recordedTranscriptRef.current,
          audioBlobRef.current || undefined,
          recordedAudioUrl || undefined,
        );
      }
    }, 600);
  };

  const finalizeEvaluation = async (
    transcript: string,
    audioBlob?: Blob,
    audioUrl?: string,
  ) => {
    if (hasFinalizedRef.current) return;
    hasFinalizedRef.current = true;

    const textToEvaluate = (transcript || '').trim();
    const hasAudio = !!audioBlob && audioBlob.size > 1500;
    const evalResult = evaluateInterviewSpoken(
      textToEvaluate,
      question.sampleModelAnswer,
      question.responseTimeSeconds || 45,
      hasAudio,
    );
    setEvaluation(evalResult);
    setPhase('completed');
    onFinishResponse(textToEvaluate, audioBlob, audioUrl);

    // Call real Gemini Audio Evaluation in background
    setIsAiEvaluating(true);
    try {
      const aiResult = await evaluateSpeakingWithGemini(
        audioBlob,
        textToEvaluate,
        question.questionSpoken,
        'interview',
        question.topic,
        question.responseTimeSeconds || 45,
        question.sampleModelAnswer,
      );
      setGeminiEvaluation(aiResult);
      const effectiveTranscript = (aiResult.transcript || textToEvaluate).trim();
      if (aiResult.transcript && aiResult.transcript.trim()) {
        setRecordedTranscript(aiResult.transcript.trim());
        recordedTranscriptRef.current = aiResult.transcript.trim();
        const updatedLocal = evaluateInterviewSpoken(
          aiResult.transcript.trim(),
          question.sampleModelAnswer,
          question.responseTimeSeconds || 45,
          hasAudio,
        );
        setEvaluation(updatedLocal);
      }
      onFinishResponse(effectiveTranscript, audioBlob, audioUrl, aiResult);
    } catch (e) {
      console.warn('Gemini interview eval call failed:', e);
    } finally {
      setIsAiEvaluating(false);
    }
  };

  const handlePlayRecorded = () => {
    if (!recordedAudioUrl) return;
    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    userAudioPlayerRef.current = audio;
    setIsPlayingRecorded(true);

    audio.onended = () => setIsPlayingRecorded(false);
    audio.onerror = () => setIsPlayingRecorded(false);
    audio.play().catch(() => setIsPlayingRecorded(false));
  };

  const handleDirectNext = () => {
    cleanupAllAudio();
    onNext();
  };

  const handleDirectBack = () => {
    cleanupAllAudio();
    if (onBack) onBack();
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `00:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isLastQuestion = questionIndex === totalInterviewQuestions - 1;

  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-8 flex flex-col justify-between items-center min-h-0 select-none">
      <div className="mx-auto max-w-4xl w-full flex flex-col items-center">
        {/* Title matching image_36efe0fd.png */}
        <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
          Please answer the interviewer’s questions.
        </h1>

        {/* Researcher Video / Portrait Photo with authentic ETS presentation */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-gray-300 shadow-md max-w-md w-full bg-slate-900 flex items-center justify-center">
          <img
            src={question.interviewerImage}
            alt={`Entrevistador: ${question.interviewerName}`}
            className="w-full h-auto object-cover max-h-[320px]"
          />

          {phase === 'listening' && (
            <div className="absolute top-4 right-4 rounded-full bg-teal-900/90 text-white px-3.5 py-1 text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-xs animate-pulse">
              <Volume2 size={16} />
              <span>La investigadora está hablando...</span>
            </div>
          )}

          {/* 3-Second Automatic Countdown Overlay */}
          {phase === 'countdown' && (
            <div className="absolute inset-0 bg-black/55 backdrop-blur-2xs flex flex-col items-center justify-center text-white p-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-400 bg-amber-500/90 shadow-2xl animate-bounce">
                <span className="text-5xl font-black">{countdownSeconds}</span>
              </div>
              <p className="mt-4 text-base font-extrabold tracking-wide uppercase text-amber-200">
                Prepárate para responder...
              </p>
              <p className="text-xs text-white/90 mt-1">
                El micrófono se encenderá automáticamente en {countdownSeconds}s
              </p>
            </div>
          )}
        </div>

        {/* Manual quick trigger if user wants to speak immediately without waiting */}
        {phase === 'listening' && (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={triggerCountdown}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-teal-800 shadow-xs transition"
            >
              <Mic size={14} />
              <span>🎙️ Responder Ahora (Saltar Audio)</span>
            </button>
          </div>
        )}

        {/* RESPONSE TIME Box with 45-second timer matching image_36efe0fd.png */}
        <div className="mt-5 w-80 rounded-2xl overflow-hidden border-2 border-teal-700 shadow-lg bg-white">
          <div className="bg-[#0f6b64] text-white text-center py-2 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2">
            <span>RESPONSE TIME</span>
            {phase === 'recording' && (
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
            )}
          </div>

          <div className="p-4 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-3">
              <div
                className={`rounded-full p-2.5 transition-all ${
                  phase === 'recording'
                    ? 'bg-rose-100 text-rose-600 animate-pulse'
                    : phase === 'countdown'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {phase === 'recording' ? (
                  <Mic size={24} />
                ) : (
                  <MicOff size={24} />
                )}
              </div>

              <span className="text-3xl font-mono font-black text-gray-900 tracking-wider">
                {formatTimer(secondsRemaining)}
              </span>
            </div>

            {/* Live Audio Level VU Meter while recording */}
            {phase === 'recording' && (
              <div className="w-full mt-1 space-y-1">
                <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase">
                  <span>Volumen de tu voz</span>
                  <span>{audioLevel}%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-75 rounded-full"
                    style={{ width: `${Math.max(8, audioLevel)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {phase === 'countdown' && (
            <div className="bg-amber-50 px-3 py-1.5 text-center border-t border-amber-200 text-xs font-bold text-amber-800">
              ⏱ Comienza en {countdownSeconds} segundos...
            </div>
          )}

          {phase === 'recording' && (
            <div className="bg-rose-50 px-3 py-2 text-center border-t border-rose-200 text-xs font-bold text-rose-800 flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
              <span>GRABANDO EN VIVO (45s)... ¡Habla con volumen firme!</span>
            </div>
          )}

          {phase === 'completed' && (
            <div className="bg-emerald-50 px-3 py-1.5 text-center border-t border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
              <Check size={14} />
              <span>Respuesta grabada con éxito</span>
            </div>
          )}
        </div>

        {/* Phase 4: Instant Evaluation Card (¿Está bien o está mal?) */}
        {phase === 'completed' && evaluation && (
          <div className="mt-5 w-full max-w-2xl rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                    evaluation.rubricScore >= 3
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : evaluation.rubricScore === 2
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  <Sparkles size={14} />
                  <span>
                    {evaluation.rubricScore >= 3
                      ? '✅ Nivel Aprobatorio'
                      : '⚠️ Requiere Mayor Desarrollo'}
                  </span>
                </span>
                <span className="text-xs font-bold text-gray-700">
                  {evaluation.gradeLabel}
                </span>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-[#0f6b64]">
                  {evaluation.wordCount} palabras
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Ritmo: ~{evaluation.wordsPerMinute} palabras/min
                </span>
              </div>
            </div>

            {/* Transcribed speech vs Model Answer */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <p className="font-bold text-gray-800">Lo que grabó tu micrófono:</p>
                <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-teal-950 font-medium text-xs leading-relaxed">
                  {recordedTranscript ? (
                    `"${recordedTranscript}"`
                  ) : recordedAudioUrl ? (
                    <span className="text-teal-900 font-medium">
                      🎙️ Tu respuesta oral de 45 segundos fue capturada en el archivo de audio con éxito.
                    </span>
                  ) : (
                    <span className="text-amber-800 italic">
                      Audio registrado sin transcripción textual detectada.
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-800">
                  Respuesta modelo de referencia (Banda C1/B2):
                </p>
                <p className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-xs leading-relaxed">
                  "{question.sampleModelAnswer}"
                </p>
              </div>
            </div>

            {/* Audio Playback Controls & Suggestions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
              {recordedAudioUrl && (
                <button
                  type="button"
                  onClick={handlePlayRecorded}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f6b64] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0c5650] shadow-xs transition"
                >
                  <Play size={14} className="fill-white" />
                  <span>
                    {isPlayingRecorded
                      ? 'Reproduciendo...'
                      : '▶️ Escuchar tu grabación (45s)'}
                  </span>
                </button>
              )}

              <p className="text-[11px] text-gray-600 max-w-sm">
                {evaluation.feedback}
              </p>
            </div>

            {micError && (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-900 font-semibold">
                ⚠️ {micError}
              </div>
            )}

            {/* Gemini AI Acoustic & Fluency Evaluation */}
            {isAiEvaluating && (
              <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-3.5 flex items-center gap-3 text-xs text-teal-900 animate-pulse">
                <Sparkles size={16} className="text-teal-600 shrink-0 animate-spin" />
                <span className="font-semibold">
                  Evaluando discurso, fluidez, pronunciación y gramática con IA (Estimación práctica ETS 2026)...
                </span>
              </div>
            )}

            {geminiEvaluation && (
              <div
                className={`rounded-xl border p-4 space-y-2.5 text-xs ${
                  !geminiEvaluation.evaluated
                    ? 'border-amber-300 bg-amber-50 text-amber-950'
                    : 'border-teal-200 bg-teal-50/80 text-teal-950'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-200/50 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-teal-700" />
                    <span className="font-bold">
                      Evaluación Oral de IA • Estimación de Práctica (ETS 2026):
                    </span>
                  </div>
                  {geminiEvaluation.evaluated ? (
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-teal-700 px-2 py-0.5 font-mono text-[11px] font-black text-white">
                        Banda Est.: {geminiEvaluation.overallScore.toFixed(1)} / 6.0
                      </span>
                      <span className="rounded-md bg-white border border-teal-300 px-2 py-0.5 text-[11px] font-bold text-teal-800">
                        ~{geminiEvaluation.scaledScore30} / 30 pts
                      </span>
                    </div>
                  ) : (
                    <span className="rounded-md bg-amber-200 px-2 py-0.5 text-[11px] font-black text-amber-900">
                      ⚠️ No evaluado
                    </span>
                  )}
                </div>

                {geminiEvaluation.transcript && (
                  <p className="text-xs italic bg-white/80 rounded-lg p-2 border border-teal-200">
                    <strong className="not-italic text-teal-900">Transcripción real detectada:</strong> "{geminiEvaluation.transcript}"
                  </p>
                )}

                <p className="text-xs leading-relaxed font-medium">
                  {geminiEvaluation.feedback}
                </p>

                {geminiEvaluation.grammarErrors &&
                  geminiEvaluation.grammarErrors.length > 0 && (
                    <div>
                      <span className="font-bold text-gray-700 block mb-1">
                        Puntos gramaticales a pulir:
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-gray-700">
                        {geminiEvaluation.grammarErrors.map((ge, gIdx) =>
                          typeof ge === 'string' ? (
                            <li key={gIdx} className="list-disc ml-4">{ge}</li>
                          ) : (
                            <li
                              key={gIdx}
                              className="rounded-lg bg-amber-50/90 border border-amber-200 px-2.5 py-1.5 text-amber-950"
                            >
                              <span className="line-through text-rose-700">{ge.mistake}</span>{' '}
                              ➔ <strong className="text-emerald-800">{ge.correction}</strong>
                              {ge.explanation && (
                                <span className="block text-gray-600 mt-0.5">{ge.explanation}</span>
                              )}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                {geminiEvaluation.recommendations &&
                  geminiEvaluation.recommendations.length > 0 && (
                    <div>
                      <span className="font-bold text-gray-700 block mb-1">
                        Recomendaciones para el examen:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-gray-700">
                        {geminiEvaluation.recommendations.map((rec, rIdx) => (
                          <li key={rIdx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {geminiEvaluation.modelResponse && (
                  <div className="rounded-lg bg-white/90 border border-teal-200 p-2.5 text-[11px] text-gray-800">
                    <strong className="text-teal-900 block mb-0.5">Respuesta mejorada sugerida (C1):</strong>
                    "{geminiEvaluation.modelResponse}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="w-full max-w-4xl border-t border-gray-200 pt-4 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={handleDirectBack}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
            >
              <ChevronLeft size={16} />
              <span>Volver</span>
            </button>
          )}
          <span className="text-xs font-bold text-gray-500">
            Take an Interview • Pregunta {questionIndex + 1} de {totalInterviewQuestions} (45s)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {phase === 'recording' && (
            <button
              onClick={finishRecording}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 text-white px-4 py-2 text-xs font-bold hover:bg-rose-700 transition shadow-xs animate-pulse"
            >
              <Square size={13} className="fill-white" />
              <span>Finalizar Grabación</span>
            </button>
          )}

          {phase === 'completed' ? (
            <button
              onClick={handleDirectNext}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f6b64] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
            >
              <span>
                {isLastQuestion
                  ? 'Finalizar y Calificar Speaking'
                  : 'Siguiente Pregunta (45s)'}
              </span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleDirectNext}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-600 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 transition shadow-2xs"
              title="Avanzar a la siguiente pregunta"
            >
              <span>
                {isLastQuestion
                  ? 'Finalizar Speaking'
                  : 'Siguiente Pregunta (Next)'}
              </span>
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
