/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BuildSentenceQuestion } from '../types/toefl.ts';
import { RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';

interface WritingBuildSentenceViewProps {
  question: BuildSentenceQuestion;
  questionIndex: number;
  totalQuestions: number;
  userSlots: string[]; // array of strings placed in slots
  onUpdateSlots: (slots: string[]) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export const WritingBuildSentenceView: React.FC<WritingBuildSentenceViewProps> = ({
  question,
  questionIndex,
  totalQuestions,
  userSlots,
  onUpdateSlots,
  onNext,
  onBack,
}) => {
  // Local state for slots
  const [placedWords, setPlacedWords] = useState<string[]>(() => {
    if (userSlots && userSlots.length === question.speaker2.totalSlots) {
      return [...userSlots];
    }
    return new Array(question.speaker2.totalSlots).fill('');
  });

  // Sync when question changes
  useEffect(() => {
    if (userSlots && userSlots.length === question.speaker2.totalSlots) {
      setPlacedWords([...userSlots]);
    } else {
      setPlacedWords(new Array(question.speaker2.totalSlots).fill(''));
    }
  }, [question.id, userSlots]);

  // Determine which words from wordBank have been used
  const usedCounts: Record<string, number> = {};
  placedWords.forEach((w) => {
    if (w) usedCounts[w] = (usedCounts[w] || 0) + 1;
  });

  // Handle clicking a word from the bank to place in next empty slot
  const handleSelectWord = (word: string) => {
    const nextEmptyIndex = placedWords.findIndex((slot) => !slot);
    if (nextEmptyIndex === -1) return; // all slots full

    const nextPlaced = [...placedWords];
    nextPlaced[nextEmptyIndex] = word;
    setPlacedWords(nextPlaced);
    onUpdateSlots(nextPlaced);
  };

  // Handle clicking a placed word in a slot to remove it
  const handleRemoveSlot = (slotIdx: number) => {
    if (!placedWords[slotIdx]) return;
    const nextPlaced = [...placedWords];
    nextPlaced[slotIdx] = '';
    setPlacedWords(nextPlaced);
    onUpdateSlots(nextPlaced);
  };

  const handleReset = () => {
    const empty = new Array(question.speaker2.totalSlots).fill('');
    setPlacedWords(empty);
    onUpdateSlots(empty);
  };

  // Split slots if middleText exists (e.g. Q2 "she will be", Q3 "tell me")
  const prefixCount = question.speaker2.prefixSlotsCount ?? question.speaker2.totalSlots;
  const suffixCount = question.speaker2.suffixSlotsCount ?? 0;

  const filledCount = placedWords.filter(Boolean).length;
  const isComplete = filledCount === question.speaker2.totalSlots;

  return (
    <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-10 flex flex-col justify-between min-h-0 select-none">
      <div className="mx-auto max-w-4xl w-full">
        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
          Make an appropriate sentence.
        </h1>

        {/* Conversation Dialog Area */}
        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Speaker 1 (Top) */}
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <img
                src={question.speaker1.avatar}
                alt="Speaker 1"
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-emerald-700 object-cover shadow-sm"
              />
            </div>
            <div className="text-base sm:text-lg font-medium text-gray-900">
              {question.speaker1.speech}
            </div>
          </div>

          {/* Speaker 2 (Bottom - Sentence Builder) */}
          <div className="flex items-start gap-6 pt-2">
            <div className="relative shrink-0">
              <img
                src={question.speaker2.avatar}
                alt="Speaker 2"
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-emerald-700 object-cover shadow-sm"
              />
            </div>

            <div className="flex-1 pt-3 leading-loose text-base sm:text-lg text-gray-900 font-normal">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-4">
                {/* Prefix text if any (e.g., "The", "I used", "She") */}
                {question.speaker2.prefixText && (
                  <span className="font-medium text-gray-900 pr-1">
                    {question.speaker2.prefixText}
                  </span>
                )}

                {/* Prefix slots */}
                {Array.from({ length: prefixCount }).map((_, idx) => {
                  const word = placedWords[idx];
                  return (
                    <button
                      key={`slot-${idx}`}
                      type="button"
                      onClick={() => handleRemoveSlot(idx)}
                      className={`min-w-[70px] sm:min-w-[90px] h-9 px-2.5 pb-1 border-b-2 border-gray-800 flex items-center justify-center transition group text-sm sm:text-base ${
                        word
                          ? 'bg-teal-50 text-teal-950 font-bold border-teal-700 hover:bg-rose-50 hover:border-rose-500 rounded-t-sm'
                          : 'hover:border-teal-500 border-gray-400'
                      }`}
                      title={word ? 'Click para quitar esta palabra' : 'Espacio para palabra'}
                    >
                      {word ? (
                        <span className="truncate group-hover:line-through group-hover:text-rose-600">
                          {word}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300 select-none">•</span>
                      )}
                    </button>
                  );
                })}

                {/* Middle text if any (e.g., "she will be", "tell me") */}
                {question.speaker2.middleText && (
                  <span className="font-medium text-gray-900 px-1">
                    {question.speaker2.middleText}
                  </span>
                )}

                {/* Suffix slots if any */}
                {suffixCount > 0 &&
                  Array.from({ length: suffixCount }).map((_, sIdx) => {
                    const actualIdx = prefixCount + sIdx;
                    const word = placedWords[actualIdx];
                    return (
                      <button
                        key={`slot-${actualIdx}`}
                        type="button"
                        onClick={() => handleRemoveSlot(actualIdx)}
                        className={`min-w-[70px] sm:min-w-[90px] h-9 px-2.5 pb-1 border-b-2 border-gray-800 flex items-center justify-center transition group text-sm sm:text-base ${
                          word
                            ? 'bg-teal-50 text-teal-950 font-bold border-teal-700 hover:bg-rose-50 hover:border-rose-500 rounded-t-sm'
                            : 'hover:border-teal-500 border-gray-400'
                        }`}
                        title={word ? 'Click para quitar esta palabra' : 'Espacio para palabra'}
                      >
                        {word ? (
                          <span className="truncate group-hover:line-through group-hover:text-rose-600">
                            {word}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300 select-none">•</span>
                        )}
                      </button>
                    );
                  })}

                {/* Suffix punctuation / text (e.g., "?", ".", "fantastic.") */}
                {question.speaker2.suffixText && (
                  <span className="font-medium text-gray-900 pl-0.5">
                    {question.speaker2.suffixText}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Word Bank (bottom) */}
        <div className="mt-12 pt-6 border-t border-gray-200 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Palabras disponibles (haz click para colocar en los espacios)
            </span>
            {placedWords.some(Boolean) && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rose-600 transition"
                title="Reiniciar espacios"
              >
                <RotateCcw size={13} />
                <span>Reiniciar</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-2">
            {question.wordBank.map((word, wordIdx) => {
              const usedTimes = usedCounts[word] || 0;
              const countBefore = question.wordBank
                .slice(0, wordIdx)
                .filter((w) => w === word).length;
              const isThisChipUsed = countBefore < usedTimes;

              return (
                <button
                  key={`chip-${wordIdx}-${word}`}
                  type="button"
                  disabled={isThisChipUsed}
                  onClick={() => handleSelectWord(word)}
                  className={`rounded-lg px-4 py-2 text-sm sm:text-base font-semibold transition shadow-xs transform active:scale-95 ${
                    isThisChipUsed
                      ? 'bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed opacity-50'
                      : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-[#0f6b64] hover:bg-teal-50 hover:text-teal-900 cursor-pointer'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="w-full max-w-4xl mx-auto border-t border-gray-200 pt-4 mt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
            >
              <ChevronLeft size={16} />
              <span>Volver</span>
            </button>
          )}
          <span className="text-xs font-bold text-gray-500">
            Build a Sentence • Pregunta {questionIndex + 1} de {totalQuestions} ({filledCount}/{question.speaker2.totalSlots} espacios)
          </span>
        </div>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs sm:text-sm font-bold transition shadow-md hover:shadow-lg transform active:scale-98 ${
              isComplete
                ? 'bg-[#0f6b64] text-white hover:bg-[#0c5650]'
                : 'bg-teal-700 text-white hover:bg-teal-800'
            }`}
          >
            <span>
              {questionIndex === totalQuestions - 1
                ? 'Continuar a Write an Email &gt;'
                : 'Siguiente Pregunta (Next) &gt;'}
            </span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
