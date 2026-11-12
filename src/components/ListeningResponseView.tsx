/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Volume2,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { ListeningQuestion } from '../types/toefl.ts';

interface ListeningResponseViewProps {
  question: ListeningQuestion;
  questionIndex: number;
  totalQuestions: number;
  userAnswer?: number;
  volume?: number; // 0 to 100
  onSelectAnswer: (optionIndex: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ListeningResponseView: React.FC<ListeningResponseViewProps> = ({
  question,
  questionIndex,
  totalQuestions,
  userAnswer,
  volume = 80,
  onSelectAnswer,
  onNext,
  onBack,
}) => {
  const letters = ['A', 'B', 'C', 'D'];
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dynamicAudioCache = useRef<Map<string, string>>(new Map());

  // Stop any currently playing audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  // Play audio from a URL or data URI
  const playAudioSource = useCallback(
    (src: string, rate: number = playbackRate) => {
      try {
        stopAudio();
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.playbackRate = rate;
        audio.volume = Math.max(0.05, Math.min(1.0, volume / 100));

        audio.onplay = () => {
          setIsPlaying(true);
          setHasPlayedOnce(true);
          setIsLoadingAudio(false);
        };

        audio.onended = () => {
          setIsPlaying(false);
        };

        audio.onerror = (e) => {
          console.warn('Audio element error:', e);
          setIsPlaying(false);
          setIsLoadingAudio(false);
          // Fall back to server TTS API or safe English TTS
          fallbackToSpeechSynthesis(rate);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Audio play was prevented by browser autoplay policy:', err);
            setIsPlaying(false);
            setIsLoadingAudio(false);
          });
        }
      } catch (err) {
        console.warn('Could not initialize audio:', err);
        fallbackToSpeechSynthesis(rate);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playbackRate, volume, stopAudio],
  );

  // Safe fallback to Web Speech API strictly in English
  const fallbackToSpeechSynthesis = (rate: number) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(question.promptSpoken);
      utterance.rate = rate;
      utterance.volume = Math.max(0.1, Math.min(1.0, volume / 100));

      // Strictly enforce English voices (never allow Spanish voice reading English)
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find((v) => v.lang.startsWith('en-US') || v.lang.startsWith('en_US')) ||
        voices.find((v) => v.lang.startsWith('en'));

      if (enVoice) {
        utterance.voice = enVoice;
        utterance.lang = enVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setHasPlayedOnce(true);
      };
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis fallback failed:', e);
      setIsPlaying(false);
    }
  };

  // Main playback handler
  const playPromptAudio = useCallback(
    async (rate: number = playbackRate) => {
      // 1. If we have a pre-recorded WAV file URL, try that first
      if (question.audioUrl) {
        playAudioSource(question.audioUrl, rate);
        return;
      }

      // 2. Check dynamic audio cache
      const cached = dynamicAudioCache.current.get(question.id);
      if (cached) {
        playAudioSource(cached, rate);
        return;
      }

      // 3. Request real human TTS from backend (/api/tts)
      setIsLoadingAudio(true);
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: question.promptSpoken,
            voiceName: question.voiceName,
            speakerGender: question.speakerGender,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            const dataUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
            dynamicAudioCache.current.set(question.id, dataUrl);
            playAudioSource(dataUrl, rate);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch server TTS:', err);
      } finally {
        setIsLoadingAudio(false);
      }

      // 4. Fallback if server call fails
      fallbackToSpeechSynthesis(rate);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question, playbackRate, playAudioSource],
  );

  // Auto-play when question loads
  useEffect(() => {
    setHasPlayedOnce(false);
    const timer = setTimeout(() => {
      playPromptAudio();
    }, 350);

    return () => {
      clearTimeout(timer);
      stopAudio();
    };
  }, [question.id, questionIndex, playPromptAudio, stopAudio]);

  // Adjust volume dynamically
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0.05, Math.min(1.0, volume / 100));
    }
  }, [volume]);

  const hasVisibleQuestion = Boolean(question.questionText);

  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-8 flex flex-col justify-between min-h-0 select-none">
      <div className="mx-auto max-w-5xl w-full">
        {/* Title: Authentic TOEFL Task Header */}
        {!hasVisibleQuestion ? (
          <>
            <h2 className="mb-6 text-center text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight">
              Choose the best response.
            </h2>
            <div className="mb-6 mx-auto max-w-xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3.5 py-1 text-xs font-semibold text-teal-800 shadow-2xs">
                <Headphones size={13} className="text-[#0f6b64]" />
                <span>Voz nativa humana (ETS Audio) • Escucha con atención y elige la mejor respuesta</span>
              </div>
            </div>
          </>
        ) : (
          <div className="mb-6 mx-auto max-w-xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3.5 py-1 text-xs font-semibold text-teal-800 shadow-2xs">
              <Headphones size={13} className="text-[#0f6b64]" />
              <span>Responde la pregunta basada en la conversación o charla que escuchaste</span>
            </div>
          </div>
        )}

        {/* Split screen layout matching TOEFL screenshots */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 lg:gap-14 mb-8">
          {/* Left Pane: Speaker Photograph & Audio Controller */}
          <div className="flex flex-col items-center">
            {/* Speaker Image Card */}
            <div className="relative group rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 bg-gray-50 max-w-[280px]">
              <img
                src={question.speakerImage}
                alt={question.speakerName || 'TOEFL Speaker'}
                className="w-full h-auto object-cover transition duration-300 group-hover:scale-102"
              />

              {/* Animated audio badge while speaking */}
              {isPlaying && (
                <div className="absolute top-3 right-3 rounded-full bg-emerald-600/95 text-white px-3 py-1 text-xs font-bold flex items-center gap-1.5 shadow-md animate-pulse">
                  <span className="flex items-center gap-0.5 h-3">
                    <span className="w-1 bg-white rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 bg-white rounded-full animate-bounce h-3" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 bg-white rounded-full animate-bounce h-2" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span>Hablando en vivo...</span>
                </div>
              )}

              {/* Voice info overlay badge */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white rounded-lg px-2.5 py-1 text-[11px] font-medium flex items-center justify-between">
                <span>{question.speakerName || 'Interlocutor'}</span>
                <span className="text-teal-300 text-[10px] uppercase font-bold tracking-wider">
                  {question.speakerGender === 'female' ? 'Voz Femenina' : 'Voz Masculina'}
                </span>
              </div>
            </div>

            {/* Audio Controls below picture */}
            <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-[280px]">
              <button
                onClick={() => playPromptAudio()}
                disabled={isPlaying || isLoadingAudio}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md transition transform active:scale-98 ${
                  isPlaying
                    ? 'bg-emerald-600 text-white cursor-default'
                    : isLoadingAudio
                    ? 'bg-gray-400 text-white cursor-wait'
                    : 'bg-[#0f6b64] text-white hover:bg-[#0c5650] hover:shadow-lg'
                }`}
              >
                {isLoadingAudio ? (
                  <>
                    <Volume2 size={16} className="animate-spin text-white" />
                    <span>Cargando audio nativo...</span>
                  </>
                ) : isPlaying ? (
                  <>
                    <Volume2 size={16} className="animate-pulse text-white" />
                    <span>Reproduciendo audio...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={15} />
                    <span>{hasPlayedOnce ? '🔊 Escuchar de nuevo (Replay)' : '🔊 Reproducir Audio'}</span>
                  </>
                )}
              </button>

              {/* Speed selector */}
              <div className="flex items-center justify-between w-full text-[11px] text-gray-500 font-semibold px-1 mt-1">
                <span>Velocidad:</span>
                <div className="flex items-center gap-1">
                  {[0.85, 1.0, 1.15].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        playPromptAudio(rate);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                        playbackRate === rate
                          ? 'bg-teal-100 text-[#0f6b64] border border-teal-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane: Multiple Choice Options (Prompt text is HIDDEN during test) */}
          <div className="w-full flex-1 max-w-lg">
            <div className="rounded-xl border border-gray-200 bg-gray-50/90 p-5 sm:p-7 shadow-xs">
              {/* Question metadata badge */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-gray-500">
                <span className="font-bold text-gray-700">
                  Listening • Pregunta {questionIndex + 1} de {totalQuestions}
                </span>
                {userAnswer !== undefined ? (
                  <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px]">
                    <CheckCircle2 size={13} /> Opción {letters[userAnswer]} seleccionada
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold text-[11px]">
                    Elige la respuesta correcta
                  </span>
                )}
              </div>

              {/* Explicit Question Prompt (For Part 2 questions as shown in screenshots) */}
              {question.questionText && (
                <h3 className="mb-5 text-base sm:text-lg font-extrabold text-gray-950 leading-snug">
                  {question.questionText}
                </h3>
              )}

              {/* Multiple Choice Radio List */}
              <div className="space-y-3" role="radiogroup" aria-label="Listening choices">
                {question.options.map((option, idx) => {
                  const isChecked = userAnswer === idx;
                  const letter = letters[idx];

                  return (
                    <div
                      key={idx}
                      role="radio"
                      aria-checked={isChecked}
                      tabIndex={0}
                      onClick={() => onSelectAnswer(idx)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          onSelectAnswer(idx);
                        }
                      }}
                      className={`group flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 select-none shadow-2xs ${
                        isChecked
                          ? 'bg-teal-50 border-[#0f6b64] shadow-sm ring-1 ring-[#0f6b64]/30'
                          : 'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50/20'
                      }`}
                    >
                      {/* Letter badge: A, B, C, D */}
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-black mr-3 transition-colors ${
                          isChecked
                            ? 'bg-[#0f6b64] text-white shadow-2xs'
                            : 'bg-gray-100 text-gray-700 group-hover:bg-teal-100 group-hover:text-[#0f6b64]'
                        }`}
                      >
                        {letter}
                      </span>

                      {/* Radio Circle matching official screenshots */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mr-3 mt-0.5 transition-all ${
                          isChecked
                            ? 'border-[#0f6b64] bg-white ring-2 ring-teal-200'
                            : 'border-gray-400 bg-white group-hover:border-[#0f6b64]'
                        }`}
                      >
                        {isChecked && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0f6b64]" />
                        )}
                      </div>

                      {/* Option text */}
                      <span
                        className={`font-medium text-sm sm:text-base leading-relaxed ${
                          isChecked ? 'text-gray-950 font-bold' : 'text-gray-800'
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Bottom Navigation Bar */}
      <div className="mx-auto max-w-4xl w-full border-t border-gray-200 pt-6 mt-8 pb-4 flex items-center justify-between gap-4">
        <button
          onClick={() => {
            stopAudio();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
        >
          <ChevronLeft size={16} /> Pregunta Anterior
        </button>

        <button
          onClick={() => {
            stopAudio();
            onNext();
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
        >
          <span>Siguiente Pregunta (Next)</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
