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
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  playBeepTone,
  createAudioLevelMeter,
  evaluateInterviewSpoken,
  InterviewEvaluationResult,
} from '../utils/audioRecording.ts';

interface SpeakingInterviewViewProps {
  question: SpeakingInterviewQuestion;
  questionIndex: number; // 0 to 3 (Questions 8 to 11)
  totalInterviewQuestions: number; // 4
  volume: number;
  onFinishResponse: (transcript: string, audioBlob?: Blob, audioUrl?: string) => void;
  onNext: () => void;
}

export const SpeakingInterviewView: React.FC<SpeakingInterviewViewProps> = ({
  question,
  questionIndex,
  totalInterviewQuestions,
  volume,
  onFinishResponse,
  onNext,
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);
  const meterCleanupRef = useRef<(() => void) | null>(null);

  // Spoken interview audio when screen opens
  useEffect(() => {
    setPhase('listening');
    setCountdownSeconds(3);
    setSecondsRemaining(question.responseTimeSeconds || 45);
    setRecordedTranscript('');
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setIsMicActive(false);
    setAudioLevel(0);

    let isCancelled = false;

    const playQuestion = () => {
      if (question.audioUrl) {
        const audio = new Audio(question.audioUrl);
        audioRef.current = audio;
        audio.volume = (volume || 85) / 100;
        setIsPlayingQuestion(true);

        audio.onended = () => {
          if (!isCancelled) {
            setIsPlayingQuestion(false);
            startCountdownPhase();
          }
        };

        audio.onerror = () => {
          speakWithBrowser(question.questionSpoken, () => {
            if (!isCancelled) {
              setIsPlayingQuestion(false);
              startCountdownPhase();
            }
          });
        };

        audio.play().catch(() => {
          speakWithBrowser(question.questionSpoken, () => {
            if (!isCancelled) {
              setIsPlayingQuestion(false);
              startCountdownPhase();
            }
          });
        });
      } else {
        speakWithBrowser(question.questionSpoken, () => {
          if (!isCancelled) {
            setIsPlayingQuestion(false);
            startCountdownPhase();
          }
        });
      }
    };

    const timer = setTimeout(playQuestion, 700);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
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
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (meterCleanupRef.current) {
      meterCleanupRef.current();
      meterCleanupRef.current = null;
    }
    stopMicrophone();
  };

  const speakWithBrowser = (text: string, onEnd: () => void) => {
    if (!('speechSynthesis' in window)) {
      setTimeout(onEnd, 3500);
      return;
    }
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
  };

  // Phase 2: 3-Second Countdown before recording begins
  const startCountdownPhase = () => {
    setPhase('countdown');
    setCountdownSeconds(3);

    countdownIntervalRef.current = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
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

    await startMicrophone();

    timerIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          finishRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startMicrophone = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        mediaStreamRef.current = stream;

        // Hook up live VU volume meter
        if (meterCleanupRef.current) meterCleanupRef.current();
        meterCleanupRef.current = createAudioLevelMeter(stream, (lvl) => {
          setAudioLevel(lvl);
        });

        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/webm; codecs=opus',
          });
          const url = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(url);

          finalizeEvaluation(recordedTranscript, audioBlob, url);
        };

        recorder.start();
        setIsMicActive(true);
      }
    } catch (err) {
      console.warn('Microphone permission error or fallback:', err);
      setIsMicActive(true);
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
          setRecordedTranscript(str.trim());
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
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    stopMicrophone();

    setTimeout(() => {
      if (!evaluation) {
        finalizeEvaluation(recordedTranscript);
      }
    }, 200);
  };

  const finalizeEvaluation = (
    transcript: string,
    audioBlob?: Blob,
    audioUrl?: string,
  ) => {
    const textToEvaluate = transcript.trim();
    const evalResult = evaluateInterviewSpoken(
      textToEvaluate,
      question.sampleModelAnswer,
      question.responseTimeSeconds || 45,
    );
    setEvaluation(evalResult);
    setPhase('completed');
    onFinishResponse(textToEvaluate, audioBlob, audioUrl);
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
            alt="Researcher Dr. Sarah Adams"
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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex flex-col items-center justify-center text-white p-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-400 bg-amber-500/90 shadow-2xl animate-bounce">
                <span className="text-5xl font-black">{countdownSeconds}</span>
              </div>
              <p className="mt-4 text-base font-extrabold tracking-wide uppercase text-amber-200">
                Prepárate para responder...
              </p>
              <p className="text-xs text-white/80 mt-1">
                El micrófono se encenderá automáticamente en {countdownSeconds}s
              </p>
            </div>
          )}
        </div>

        {/* RESPONSE TIME Box with 45-second timer matching image_36efe0fd.png */}
        <div className="mt-6 w-80 rounded-2xl overflow-hidden border-2 border-teal-700 shadow-lg bg-white">
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
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-75 rounded-full"
                    style={{ width: `${Math.max(6, audioLevel)}%` }}
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
            <div className="bg-rose-50 px-3 py-1.5 text-center border-t border-rose-200 text-xs font-bold text-rose-800 animate-pulse">
              ● GRABANDO EN VIVO (45s)... ¡Habla con volumen firme!
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
          <div className="mt-6 w-full max-w-2xl rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-lg space-y-4">
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
                  ) : (
                    <span className="text-amber-800 italic">
                      Audio registrado sin transcripción clara de palabras.
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
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="w-full max-w-4xl border-t border-gray-200 pt-4 mt-6 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500">
          Take an Interview • Pregunta {questionIndex + 1} de {totalInterviewQuestions} (45s)
        </span>

        {phase === 'completed' ? (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f6b64] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
          >
            <span>
              {isLastQuestion
                ? 'Finalizar y Calificar Speaking Oficial &gt;'
                : 'Siguiente Pregunta (45s) &gt;'}
            </span>
            <ChevronRight size={16} />
          </button>
        ) : phase === 'recording' ? (
          <button
            onClick={finishRecording}
            className="rounded-lg bg-teal-800 text-white px-4 py-1.5 text-xs font-bold hover:bg-teal-700 transition shadow-xs"
          >
            Terminar y Calificar Respuesta
          </button>
        ) : (
          <span className="text-xs text-gray-400 italic">
            {phase === 'listening' ? 'Escuchando a la investigadora...' : 'Preparando grabación...'}
          </span>
        )}
      </div>
    </div>
  );
};
