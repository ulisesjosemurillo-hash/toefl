/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flag, X, CheckCircle, AlertCircle } from 'lucide-react';

interface QuestionReviewStatus {
  screenIndex: number;
  questionNumber: number;
  title: string;
  section: string;
  isAnswered: boolean;
  isMarked: boolean;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionReviewStatus[];
  onJumpToQuestion: (screenIndex: number) => void;
  onSubmitTest: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  questions,
  onJumpToQuestion,
  onSubmitTest,
}) => {
  if (!isOpen) return null;

  const answeredCount = questions.filter((q) => q.isAnswered).length;
  const markedCount = questions.filter((q) => q.isMarked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#0f6b64] px-6 py-4 text-white rounded-t-lg">
          <div>
            <h2 className="text-lg font-bold">Review Questions (Revisión de Preguntas)</h2>
            <p className="text-xs text-teal-100">
              Haz clic en cualquier pregunta para regresar a ella y modificar tu respuesta.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-[#0c5650] text-teal-100 hover:text-white transition"
            aria-label="Cerrar revisión"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stats banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs">
          <div className="flex items-center gap-4 text-gray-700">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle size={14} /> Respondidas: {answeredCount} de {questions.length}
            </span>
            {markedCount > 0 && (
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                <Flag size={14} /> Marcadas para revisión: {markedCount}
              </span>
            )}
          </div>
          <span className="text-gray-500 italic">
            {answeredCount === questions.length
              ? '¡Todas las preguntas respondidas!'
              : `Quedan ${questions.length - answeredCount} preguntas sin responder.`}
          </span>
        </div>

        {/* Table of questions */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-100 text-xs font-bold text-gray-700">
                <th className="py-2.5 px-3">Nº</th>
                <th className="py-2.5 px-3">Sección / Tipo de Tarea</th>
                <th className="py-2.5 px-3">Descripción</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
                <th className="py-2.5 px-3 text-center">Revisión</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {questions.map((q) => (
                <tr
                  key={`${q.screenIndex}-${q.questionNumber}`}
                  className="hover:bg-teal-50/60 transition cursor-pointer"
                  onClick={() => {
                    onJumpToQuestion(q.screenIndex);
                    onClose();
                  }}
                >
                  <td className="py-3 px-3 font-semibold text-gray-900">
                    Q{q.questionNumber}
                  </td>
                  <td className="py-3 px-3 text-gray-600 font-medium text-xs">
                    {q.section}
                  </td>
                  <td className="py-3 px-3 text-gray-800 text-xs max-w-xs truncate">
                    {q.title}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {q.isAnswered ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                        <CheckCircle size={11} /> Respondida
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                        <AlertCircle size={11} /> Sin Responder
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {q.isMarked ? (
                      <span className="inline-flex items-center text-amber-600 font-bold text-xs" title="Marcada para revisar">
                        <Flag size={14} className="fill-amber-500 text-amber-600" />
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      className="text-xs font-semibold text-[#0f6b64] hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onJumpToQuestion(q.screenIndex);
                        onClose();
                      }}
                    >
                      Ir &gt;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-lg">
          <button
            onClick={onClose}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            Volver a la Prueba
          </button>
          <button
            onClick={() => {
              onClose();
              onSubmitTest();
            }}
            className="rounded bg-[#0f6b64] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#0c5650] transition"
          >
            Finalizar y Enviar Examen
          </button>
        </div>
      </div>
    </div>
  );
};
