/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SpeakingRepeatQuestion } from '../types/toefl.ts';
import {
  Volume2,
  Mic,
  MicOff,
  Check,
  Play,
  Pause,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  playBeepTone,
  createAudioLevelMeter,
  evaluateListenRepeatSpoken,
  RepeatEvaluationResult,
} from '../utils/audioRecording.ts';

interface SpeakingListenRepeatViewProps {
  question: SpeakingRepeatQuestion;
  questionIndex: number; // 0 to 6
  totalRepeatQuestions: number; // 7
  volume: number;
  onFinishResponse: (transcript: string, audioBlob?: Blob, audioUrl?: string) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const SpeakingListenRepeatView: React.FC<SpeakingListenRepeatViewProps> = ({
  question,
  questionIndex,
  totalRepeatQuestions,
  volume,
  onFinishResponse,
  onNext,
  onBack,
}) => {
  // Phases:
  // 'listening'   -> Narrator speaks the sentence once
  // 'countdown'   -> 3-second preparation countdown (3... 2... 1... with tone)
  // 'recording'   -> Microphone automatically on, 10s countdown
  // 'completed'   -> Evaluation shown: ¿Está bien o mal?, word comparison, audio playback
  const [phase, setPhase] = useState<'listening' | 'countdown' | 'recording' | 'completed'>('listening');
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(question.responseTimeSeconds || 10);
  const [isMicActive, setIsMicActive] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordedTranscript, setRecordedTranscript] = useState('');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [evaluation, setEvaluation] = useState<RepeatEvaluationResult | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);
  const meterCleanupRef = useRef<(() => void) | null>(null);

  // Play spoken sentence audio when question opens
  useEffect(() => {
    setPhase('listening');
    setCountdownSeconds(3);
    setSecondsRemaining(question.responseTimeSeconds || 10);
    setRecordedTranscript('');
    setRecordedAudioUrl(null);
    setEvaluation(null);
    setIsMicActive(false);
    setAudioLevel(0);

    let isCancelled = false;

    const playSentence = () => {
      if (question.audioUrl) {
        const audio = new Audio(question.audioUrl);
        audioRef.current = audio;
        audio.volume = (volume || 85) / 100;
        setIsPlayingOriginal(true);

        audio.onended = () => {
          if (!isCancelled) {
            setIsPlayingOriginal(false);
            startCountdownPhase();
          }
        };

        audio.onerror = () => {
          speakWithBrowser(question.spokenSentence, () => {
            if (!isCancelled) {
              setIsPlayingOriginal(false);
              startCountdownPhase();
            }
          });
        };

        audio.play().catch(() => {
          speakWithBrowser(question.spokenSentence, () => {
            if (!isCancelled) {
              setIsPlayingOriginal(false);
              startCountdownPhase();
            }
          });
        });
      } else {
        speakWithBrowser(question.spokenSentence, () => {
          if (!isCancelled) {
            setIsPlayingOriginal(false);
            startCountdownPhase();
          }
        });
      }
    };

    const timer = setTimeout(playSentence, 600);

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
      setTimeout(onEnd, 2500);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.volume = (volume || 85) / 100;

    const voices = window.speechSynthesis.getVoices();
    const enVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Zira')),
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (enVoice) utterance.voice = enVoice;

    utterance.onend = onEnd;
    utterance.onerror = onEnd;
    setIsPlayingOriginal(true);
    window.speechSynthesis.speak(utterance);
  };

  // Phase 2: 3-Second Automatic Countdown before microphone turns on
  const startCountdownPhase = () => {
    setPhase('countdown');
    setCountdownSeconds(3);

    countdownIntervalRef.current = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          playBeepTone(880, 220); // Official ETS start beep
          startRecordingPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Phase 3: 10-Second Response Phase with Real Microphone & Live Transcription
  const startRecordingPhase = async () => {
    setPhase('recording');
    setSecondsRemaining(question.responseTimeSeconds || 10);
    audioChunksRef.current = [];

    // Activate real microphone
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

        // Initialize MediaRecorder to save audio Blob
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

          // Evaluate immediately
          finalizeEvaluation(recordedTranscript, audioBlob, url);
        };

        recorder.start();
        setIsMicActive(true);
      }
    } catch (err) {
      console.warn('Microphone permission error or fallback:', err);
      setIsMicActive(true);
    }

    // Start Web Speech recognition for transcription
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

    // If mediaRecorder did not fire onstop immediately (e.g. mock fallback)
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
    const evalResult = evaluateListenRepeatSpoken(
      textToEvaluate,
      question.spokenSentence,
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

  const handlePlayOriginalSentence = () => {
    speakWithBrowser(question.spokenSentence, () => {
      setIsPlayingOriginal(false);
    });
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `00:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-8 flex flex-col justify-between items-center min-h-0 select-none">
      <div className="mx-auto max-w-4xl w-full flex flex-col items-center">
        {/* Title matching image_951297cd.png */}
        <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
          Listen and repeat only once.
        </h1>

        {/* Zoo Scene Image with authentic ETS borders */}
        <div className="relative rounded-lg overflow-hidden border border-gray-400 shadow-md max-w-2xl w-full bg-gray-50 flex items-center justify-center">
          <img
            src={question.sceneImage}
            alt="Zoo Exhibit Scene"
            className="w-full h-auto object-contain max-h-[350px]"
          />

          {/* Playing Audio Overlay */}
          {phase === 'listening' && (
            <div className="absolute top-4 right-4 rounded-full bg-teal-900/90 text-white px-3.5 py-1 text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-xs animate-pulse">
              <Volume2 size={16} />
              <span>Escuchando el enunciado...</span>
            </div>
          )}

          {/* 3-Second Automatic Countdown Overlay */}
          {phase === 'countdown' && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex flex-col items-center justify-center text-white p-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-400 bg-amber-500/90 shadow-2xl animate-bounce">
                <span className="text-5xl font-black">{countdownSeconds}</span>
              </div>
              <p className="mt-4 text-base font-extrabold tracking-wide uppercase text-amber-200">
                Prepárate para hablar...
              </p>
              <p className="text-xs text-white/80 mt-1">
                El micrófono se encenderá automáticamente en {countdownSeconds}s
              </p>
            </div>
          )}
        </div>

        {/* RESPONSE TIME Box matching image_951297cd.png and image_0431e5e4.png */}
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
                  <span>Voz detectada</span>
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
              ● GRABANDO (10 segundos)... ¡Habla ahora!
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
            {/* Header with grade badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                    evaluation.grade === 'excellent'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : evaluation.grade === 'good'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  <Sparkles size={14} />
                  <span>
                    {evaluation.isCorrect ? '✅ Respuesta Correcta' : '❌ Necesita Mejorar'}
                  </span>
                </span>
                <span className="text-xs font-bold text-gray-700">
                  {evaluation.gradeLabel}
                </span>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-[#0f6b64]">
                  Precisión: {evaluation.accuracyPercentage}%
                </span>
                <span className="text-[11px] text-gray-500 block">
                  {evaluation.matchingCount} de {evaluation.totalTargetWords} palabras
                </span>
              </div>
            </div>

            {/* Word by word breakdown */}
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="font-bold text-gray-700">Frase objetivo oficial:</p>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-gray-50 border border-gray-200">
                {evaluation.wordsDetails.map((w, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded-md font-semibold text-xs ${
                      w.status === 'correct'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300 line-through'
                    }`}
                  >
                    {w.word}
                  </span>
                ))}
              </div>

              {recordedTranscript ? (
                <div className="pt-1">
                  <p className="font-bold text-gray-700">Lo que detectó tu micrófono:</p>
                  <p className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-100 text-teal-950 font-medium italic text-xs">
                    "{recordedTranscript}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-amber-800 italic">
                  (Se grabó audio pero no se detectaron palabras legibles en inglés)
                </p>
              )}
            </div>

            {/* Audio Playback Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {recordedAudioUrl && (
                  <button
                    type="button"
                    onClick={handlePlayRecorded}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f6b64] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0c5650] shadow-xs transition"
                  >
                    <Play size={14} className="fill-white" />
                    <span>
                      {isPlayingRecorded ? 'Reproduciendo...' : '▶️ Escuchar tu voz'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePlayOriginalSentence}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  <Volume2 size={14} />
                  <span>🔊 Modelo original</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-500">{evaluation.feedback}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="w-full max-w-4xl border-t border-gray-200 pt-4 mt-6 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500">
          Listen and Repeat • Frase {questionIndex + 1} de {totalRepeatQuestions} (10s)
        </span>

        {phase === 'completed' ? (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f6b64] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
          >
            <span>
              {questionIndex === totalRepeatQuestions - 1
                ? 'Continuar a Take an Interview &gt;'
                : 'Siguiente Frase &gt;'}
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
            {phase === 'listening' ? 'Escuchando frase...' : 'Preparando grabación...'}
          </span>
        )}
      </div>
    </div>
  );
};
