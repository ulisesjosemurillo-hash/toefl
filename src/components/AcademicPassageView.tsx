/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Columns,
  Maximize2,
  X,
} from 'lucide-react';
import { AcademicPassage, AcademicQuestion } from '../types/toefl.ts';

interface AcademicPassageViewProps {
  passage: AcademicPassage;
  question: AcademicQuestion;
  questionIndex: number;
  totalAcademicQuestions: number;
  isLastQuestion: boolean;
  userAnswer?: number;
  onSelectAnswer: (optionIndex: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AcademicPassageView: React.FC<AcademicPassageViewProps> = ({
  passage,
  question,
  questionIndex,
  totalAcademicQuestions,
  isLastQuestion,
  userAnswer,
  onSelectAnswer,
  onNext,
  onBack,
}) => {
  const letters = ['A', 'B', 'C', 'D'];
  // View mode for compact/mobile viewports: 'split' (both), 'question' (focus on Q), 'passage' (focus on text)
  const [compactViewMode, setCompactViewMode] = useState<'split' | 'question' | 'passage'>('split');
  const [showPassageModal, setShowPassageModal] = useState(false);

  // Safety fallback if passage or question is somehow missing
  if (!question || !passage) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Pregunta de Lectura Académica</h3>
        <p className="text-sm text-gray-600 mb-6">Cargando datos del pasaje académico...</p>
        <button
          onClick={onNext}
          className="rounded-lg bg-[#0f6b64] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0c5650]"
        >
          {isLastQuestion ? 'Finalizar Examen' : 'Continuar >'}
        </button>
      </div>
    );
  }

  const safeOptions =
    Array.isArray(question.options) && question.options.length > 0
      ? question.options
      : ['Opción A', 'Opción B', 'Opción C', 'Opción D'];

  // Highlight target word in passage if applicable
  const renderParagraph = (text: string, pIdx: number) => {
    if (question.highlightedWord) {
      try {
        const regex = new RegExp(`\\b(${question.highlightedWord})\\b`, 'gi');
        const parts = text.split(regex);
        return (
          <p key={pIdx} className="leading-relaxed text-gray-800 text-sm sm:text-base">
            {parts.map((part, i) =>
              regex.test(part) ? (
                <strong
                  key={i}
                  className="bg-amber-200/90 px-1.5 py-0.5 rounded font-bold text-gray-950 border border-amber-300 shadow-2xs"
                >
                  {part}
                </strong>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
        );
      } catch {
        // Fallback without regex if special chars occur
      }
    }
    return (
      <p key={pIdx} className="leading-relaxed text-gray-800 text-sm sm:text-base">
        {text}
      </p>
    );
  };

  const getSkillLabel = (skill: string) => {
    switch (skill) {
      case 'academic_vocabulary':
        return 'Vocabulario en Contexto';
      case 'academic_negative_factual':
        return 'Pregunta Negativa (EXCEPT)';
      case 'academic_main_idea':
        return 'Idea Principal';
      case 'academic_inference':
        return 'Inferencia';
      case 'academic_factual':
      default:
        return 'Información Factual';
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Compact Viewport Segmented Mode Switcher (visible on narrow screens / mobile / iframe <= 960px) */}
      <div className="flex lg:hidden items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <span className="rounded bg-[#0f6b64] px-2 py-0.5 text-white text-[11px]">
            Pregunta {questionIndex + 1}/{totalAcademicQuestions}
          </span>
          <span className="text-gray-500 hidden sm:inline">•</span>
          <span className="text-gray-600 truncate max-w-[180px] hidden sm:inline">
            {passage.title}
          </span>
        </div>

        <div className="flex items-center rounded-lg bg-gray-200 p-0.5 text-xs font-semibold text-gray-700">
          <button
            onClick={() => setCompactViewMode('split')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
              compactViewMode === 'split'
                ? 'bg-white text-[#0f6b64] shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Ver pasaje arriba y pregunta abajo"
          >
            <Columns size={13} />
            <span className="hidden xs:inline">Ambos</span>
          </button>
          <button
            onClick={() => setCompactViewMode('passage')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
              compactViewMode === 'passage'
                ? 'bg-white text-[#0f6b64] shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Ver texto de lectura completo"
          >
            <BookOpen size={13} />
            <span>Pasaje</span>
          </button>
          <button
            onClick={() => setCompactViewMode('question')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
              compactViewMode === 'question'
                ? 'bg-white text-[#0f6b64] shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Ver pregunta y opciones para responder"
          >
            <HelpCircle size={13} />
            <span>Pregunta</span>
            {userAnswer !== undefined && (
              <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-emerald-600" />
            )}
          </button>
        </div>
      </div>

      {/* Main Container: Responsive Split Screen or Mode Controlled */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Pane: Academic Passage */}
        <div
          className={`overflow-y-auto bg-white p-5 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-200 transition-all ${
            // In large desktop, always 50% width
            'lg:w-1/2 lg:flex-1 lg:block'
          } ${
            // In compact viewports:
            compactViewMode === 'passage'
              ? 'flex-1 block'
              : compactViewMode === 'split'
              ? 'h-48 sm:h-64 lg:h-full shrink-0 block'
              : 'hidden lg:block'
          }`}
        >
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-2.5 mb-5">
              <h2 className="font-bold text-lg sm:text-xl text-gray-900">
                {passage.title}
              </h2>
              {compactViewMode === 'split' && (
                <button
                  onClick={() => setShowPassageModal(true)}
                  className="lg:hidden text-gray-500 hover:text-[#0f6b64] p-1 rounded hover:bg-gray-100"
                  title="Expandir pasaje a pantalla completa"
                >
                  <Maximize2 size={15} />
                </button>
              )}
            </div>

            <div className="space-y-4 text-justify">
              {passage.paragraphs.map((p, idx) => renderParagraph(p, idx))}
            </div>

            {/* Quick button to jump to question on compact screen */}
            {compactViewMode === 'passage' && (
              <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end lg:hidden">
                <button
                  onClick={() => setCompactViewMode('question')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f6b64] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#0c5650]"
                >
                  <span>Ir a la Pregunta y Responder</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Question, Radio Options & Navigation */}
        <div
          className={`flex-1 overflow-y-auto bg-[#fafafa] p-5 sm:p-8 lg:p-10 flex flex-col justify-between min-h-0 ${
            // In large desktop, always 50% width
            'lg:w-1/2 lg:block'
          } ${
            // In compact viewports:
            compactViewMode === 'passage'
              ? 'hidden lg:flex'
              : 'flex'
          }`}
        >
          <div className="max-w-lg mx-auto w-full">
            {/* Header / Skill info */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-gray-500">
              <span className="font-bold text-gray-800">
                Pregunta Académica {questionIndex + 1} de {totalAcademicQuestions}
              </span>

              <div className="flex items-center gap-2">
                <span className="rounded bg-teal-100 px-2.5 py-0.5 text-[11px] font-bold text-[#0f6b64]">
                  {getSkillLabel(question.skill)}
                </span>
                {/* Button to quickly view passage if in question-only mode */}
                {compactViewMode === 'question' && (
                  <button
                    onClick={() => setShowPassageModal(true)}
                    className="lg:hidden inline-flex items-center gap-1 text-[11px] font-bold text-[#0f6b64] underline hover:text-[#0c5650]"
                  >
                    <BookOpen size={12} /> Ver Texto
                  </button>
                )}
              </div>
            </div>

            {/* Question Text */}
            <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-4 leading-snug">
              {question.question}
            </h3>

            {/* Answer Status Feedback */}
            {userAnswer !== undefined ? (
              <div className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-full shadow-2xs">
                <CheckCircle2 size={15} /> Opción {letters[userAnswer]} seleccionada
              </div>
            ) : (
              <div className="mb-4 rounded-md border border-amber-200 bg-amber-50/80 px-3 py-1.5 text-xs text-amber-900 font-medium">
                👉 Haz clic en una de las 4 opciones abajo para responder:
              </div>
            )}

            {/* Interactive Multiple Choice Options */}
            <div className="space-y-3 mb-8" role="radiogroup" aria-label={question.question}>
              {safeOptions.map((opt, idx) => {
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

                    {/* Bulletproof Custom Radio Circle */}
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
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation Buttons inside the right pane */}
          <div className="max-w-lg mx-auto w-full border-t border-gray-200 pt-5 mt-auto flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
            >
              <ChevronLeft size={16} /> Anterior
            </button>

            <button
              onClick={onNext}
              className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md transition transform active:scale-98 ${
                isLastQuestion
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-[#0f6b64] hover:bg-[#0c5650] text-white'
              }`}
            >
              <span>{isLastQuestion ? 'Finalizar y Calificar Examen' : 'Siguiente Pregunta (Next)'}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Passage Modal (for easy reading on compact/mobile screens) */}
      {showPassageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#0f6b64] px-5 py-3.5 text-white">
              <div className="flex items-center gap-2">
                <BookOpen size={18} />
                <h3 className="font-bold text-sm sm:text-base">{passage.title}</h3>
              </div>
              <button
                onClick={() => setShowPassageModal(false)}
                className="rounded p-1 text-teal-100 hover:bg-[#0c5650] hover:text-white"
                aria-label="Cerrar ventana de lectura"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-justify text-sm sm:text-base leading-relaxed text-gray-800">
              {passage.paragraphs.map((p, idx) => renderParagraph(p, idx))}
            </div>
            <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex justify-end">
              <button
                onClick={() => setShowPassageModal(false)}
                className="rounded-lg bg-[#0f6b64] px-5 py-2 text-xs font-bold text-white hover:bg-[#0c5650]"
              >
                Volver a la Pregunta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
