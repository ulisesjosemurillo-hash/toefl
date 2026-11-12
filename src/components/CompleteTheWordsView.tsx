/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { CompleteTheWordsSection } from '../types/toefl.ts';

interface CompleteTheWordsViewProps {
  section: CompleteTheWordsSection;
  userAnswers: Record<string, string>; // keyed by `cw-1-0`, `cw-1-1` etc.
  onChangeAnswer: (slotId: string, char: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CompleteTheWordsView: React.FC<CompleteTheWordsViewProps> = ({
  section,
  userAnswers,
  onChangeAnswer,
  onNext,
  onBack,
}) => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Collect ordered slots for keyboard navigation across all blanks
  const allSlotIds: string[] = [];
  section.passageTextSegments.forEach((seg) => {
    if (seg.type === 'word') {
      for (let i = 0; i < seg.item.length; i++) {
        allSlotIds.push(`${seg.item.id}-${i}`);
      }
    }
  });

  // Auto-focus the first slot when component mounts
  useEffect(() => {
    if (allSlotIds.length > 0 && inputRefs.current[allSlotIds[0]]) {
      inputRefs.current[allSlotIds[0]]?.focus();
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    slotId: string,
    nextSlotId?: string,
  ) => {
    const rawVal = e.target.value;
    const cleanVal = rawVal.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const lastChar = cleanVal.slice(-1);
    onChangeAnswer(slotId, lastChar);

    if (lastChar && nextSlotId && inputRefs.current[nextSlotId]) {
      inputRefs.current[nextSlotId]?.focus();
      inputRefs.current[nextSlotId]?.select();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    slotId: string,
    prevSlotId?: string,
    nextSlotId?: string,
  ) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && prevSlotId) {
      e.preventDefault();
      const prevInput = inputRefs.current[prevSlotId];
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    } else if (e.key === 'ArrowLeft' && prevSlotId) {
      inputRefs.current[prevSlotId]?.focus();
    } else if (e.key === 'ArrowRight' && nextSlotId) {
      inputRefs.current[nextSlotId]?.focus();
    } else if (e.key === 'Enter') {
      onNext();
    }
  };

  const filledLettersCount = allSlotIds.filter((id) => !!userAnswers[id]).length;
  const isComplete = filledLettersCount === allSlotIds.length;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-12 md:px-20 bg-white flex flex-col justify-between">
      <div className="mx-auto max-w-4xl w-full">
        {/* Official TOEFL Header */}
        <div className="mb-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {section.instruction}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Completa las letras faltantes en los bloques grises. Al terminar, presiona el botón <strong>Siguiente &gt;</strong> abajo o en la barra superior.
          </p>
        </div>

        {/* Paragraph with inline inputs */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-6 sm:p-10 shadow-xs mb-8">
          <div className="text-base sm:text-lg leading-loose text-gray-800 font-normal select-text">
            {section.passageTextSegments.map((segment, index) => {
              if (segment.type === 'text') {
                return <span key={index}>{segment.text}</span>;
              }

              const item = segment.item;
              return (
                <span key={item.id} className="inline-block whitespace-nowrap my-1">
                  <span className="font-semibold text-gray-900 tracking-wide">
                    {item.prefix}
                  </span>
                  <span className="grey-input-block shadow-xs border border-gray-300">
                    {Array.from({ length: item.length }).map((_, letterIdx) => {
                      const slotId = `${item.id}-${letterIdx}`;
                      const overallIdx = allSlotIds.indexOf(slotId);
                      const prevSlotId = overallIdx > 0 ? allSlotIds[overallIdx - 1] : undefined;
                      const nextSlotId =
                        overallIdx < allSlotIds.length - 1
                          ? allSlotIds[overallIdx + 1]
                          : undefined;

                      const val = userAnswers[slotId] || '';

                      return (
                        <input
                          key={slotId}
                          ref={(el) => {
                            inputRefs.current[slotId] = el;
                          }}
                          type="text"
                          maxLength={1}
                          value={val}
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck="false"
                          className="letter-slot"
                          aria-label={`Letra ${letterIdx + 1} de ${item.prefix}`}
                          onChange={(e) => handleInputChange(e, slotId, nextSlotId)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, slotId, prevSlotId, nextSlotId)
                          }
                          onFocus={(e) => e.target.select()}
                        />
                      );
                    })}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Status notice */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-teal-200 bg-teal-50/80 p-4 text-xs text-teal-950">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0f6b64] text-[10px] font-bold text-white">
              i
            </span>
            <span>
              {isComplete
                ? '¡Has completado todas las casillas! Haz clic en "Siguiente Pregunta" para continuar.'
                : `Progreso: ${filledLettersCount} de ${allSlotIds.length} letras ingresadas. Puedes continuar en cualquier momento.`}
            </span>
          </div>

          {isComplete && (
            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
              <CheckCircle2 size={13} /> Listo para avanzar
            </span>
          )}
        </div>
      </div>

      {/* Prominent Bottom Action Bar for Easy Navigation */}
      <div className="mx-auto max-w-4xl w-full border-t border-gray-200 pt-6 mt-6 pb-4 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
        >
          <ChevronLeft size={16} /> Volver a Instrucciones
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
        >
          <span>Siguiente Pregunta: Read a Notice</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
