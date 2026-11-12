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
  Headphones,
  Sparkles,
} from 'lucide-react';
import { ListeningPassage } from '../types/toefl.ts';

interface ListeningPassageViewProps {
  passage: ListeningPassage;
  passageIndex: number;
  totalPassages: number;
  volume?: number; // 0 to 100
  onProceedToQuestions: () => void;
  onBack?: () => void;
}

export const ListeningPassageView: React.FC<ListeningPassageViewProps> = ({
  passage,
  passageIndex,
  totalPassages,
  volume = 80,
  onProceedToQuestions,
  onBack,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playAudio = useCallback(
    (rate: number = playbackRate) => {
      if (!passage.audioUrl) return;
      try {
        stopAudio();
        const audio = new Audio(passage.audioUrl);
        audioRef.current = audio;
        audio.playbackRate = rate;
        audio.volume = Math.max(0.05, Math.min(1.0, volume / 100));

        audio.onplay = () => {
          setIsPlaying(true);
          setHasPlayedOnce(true);
        };

        audio.onended = () => {
          setIsPlaying(false);
        };

        audio.onerror = () => {
          setIsPlaying(false);
        };

        audio.play().catch((err) => {
          console.warn('Autoplay prevented:', err);
          setIsPlaying(false);
        });
      } catch (err) {
        console.warn('Audio play error:', err);
        setIsPlaying(false);
      }
    },
    [passage.audioUrl, playbackRate, volume, stopAudio],
  );

  // Auto-play passage audio on load
  useEffect(() => {
    setHasPlayedOnce(false);
    const timer = setTimeout(() => {
      playAudio();
    }, 400);

    return () => {
      clearTimeout(timer);
      stopAudio();
    };
  }, [passage.id, playAudio, stopAudio]);

  // Sync volume dynamically
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0.05, Math.min(1.0, volume / 100));
    }
  }, [volume]);

  return (
    <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-10 flex flex-col justify-between min-h-0 select-none">
      <div className="mx-auto max-w-4xl w-full flex flex-col items-center">
        {/* Official Section Header matching user screenshots */}
        <h2 className="mb-4 text-center text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
          {passage.headerText}
        </h2>

        {/* Helpful instructions badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-4 py-1.5 text-xs font-semibold text-teal-800 shadow-2xs">
          <Headphones size={14} className="text-[#0f6b64]" />
          <span>
            Escucha con atención el audio nativo. En el examen oficial solo escucharás una vez antes de responder.
          </span>
        </div>

        {/* Large Scene Image Card matching official TOEFL iBT interface */}
        <div className="relative group rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 bg-gray-50 max-w-2xl w-full flex justify-center items-center p-4 sm:p-6 min-h-[320px]">
          <img
            src={passage.sceneImage}
            alt={passage.headerText}
            className="max-h-[380px] w-auto object-contain transition duration-300"
          />

          {/* Animated "Speaking" overlay pill */}
          {isPlaying && (
            <div className="absolute top-4 right-4 rounded-full bg-emerald-600/95 text-white px-3.5 py-1.5 text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-1 bg-white rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                <span className="w-1 bg-white rounded-full animate-bounce h-3.5" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-white rounded-full animate-bounce h-2" style={{ animationDelay: '300ms' }} />
              </span>
              <span>Audio en reproducción...</span>
            </div>
          )}
        </div>

        {/* Audio controls beneath scene */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-xl bg-gray-50 border border-gray-200 rounded-xl p-3 sm:px-6">
          <button
            onClick={() => playAudio()}
            disabled={isPlaying}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-xs sm:text-sm font-bold shadow-sm transition transform active:scale-98 ${
              isPlaying
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-[#0f6b64] text-white hover:bg-[#0c5650] hover:shadow'
            }`}
          >
            {isPlaying ? (
              <>
                <Volume2 size={16} className="animate-pulse text-white" />
                <span>Reproduciendo pasaje...</span>
              </>
            ) : (
              <>
                <RotateCcw size={15} />
                <span>{hasPlayedOnce ? '🔊 Escuchar de nuevo (Replay)' : '🔊 Iniciar Audio'}</span>
              </>
            )}
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
            <span>Velocidad:</span>
            <div className="flex items-center gap-1">
              {[0.85, 1.0, 1.15].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setPlaybackRate(rate);
                    playAudio(rate);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition ${
                    playbackRate === rate
                      ? 'bg-teal-100 text-[#0f6b64] border border-teal-300'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Bottom Navigation Bar */}
      <div className="mx-auto max-w-4xl w-full border-t border-gray-200 pt-6 mt-8 pb-4 flex items-center justify-between gap-4">
        {onBack ? (
          <button
            onClick={() => {
              stopAudio();
              onBack();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
          >
            <ChevronLeft size={16} /> Volver
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => {
            stopAudio();
            onProceedToQuestions();
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
        >
          <span>Ir a las Preguntas (Questions)</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
