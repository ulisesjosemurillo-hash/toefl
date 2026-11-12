/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { AcademicDiscussionTask } from '../types/toefl.ts';
import { Eye, EyeOff, ChevronRight, ChevronLeft } from 'lucide-react';

interface WritingAcademicDiscussionViewProps {
  task: AcademicDiscussionTask;
  userResponse: string;
  onChangeResponse: (text: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export const WritingAcademicDiscussionView: React.FC<
  WritingAcademicDiscussionViewProps
> = ({ task, userResponse, onChangeResponse, onNext, onBack }) => {
  const [showWordCount, setShowWordCount] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Undo/Redo history stack
  const historyRef = useRef<string[]>([userResponse || '']);
  const historyIndexRef = useRef<number>(0);

  // Word count computation
  const wordCount = (userResponse || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChangeResponse(val);

    if (historyRef.current[historyIndexRef.current] !== val) {
      const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      nextHistory.push(val);
      historyRef.current = nextHistory;
      historyIndexRef.current = nextHistory.length - 1;
    }
  };

  const handleCut = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return;

    const selectedText = textarea.value.substring(start, end);
    navigator.clipboard.writeText(selectedText);
    const updated = textarea.value.substring(0, start) + textarea.value.substring(end);
    onChangeResponse(updated);
  };

  const handlePaste = async () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    try {
      const text = await navigator.clipboard.readText();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const updated = textarea.value.substring(0, start) + text + textarea.value.substring(end);
      onChangeResponse(updated);
    } catch {
      // Fallback
    }
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prev = historyRef.current[historyIndexRef.current];
      onChangeResponse(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const next = historyRef.current[historyIndexRef.current];
      onChangeResponse(next);
    }
  };

  const isGoalReached = wordCount >= task.minimumWords;

  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-7 flex flex-col justify-between min-h-0 select-text">
      <div className="mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Left Column: Professor Prompt & Instructions (image_21be855e.png) */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-normal">
              {task.scenario}
            </p>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-gray-900 leading-snug">
                In your response, you should do the following.
              </h2>
              <ul className="space-y-1.5 text-sm sm:text-base text-gray-800 pl-4 list-disc marker:text-gray-900">
                {task.instructions.map((inst, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {inst}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              An effective response will contain at least {task.minimumWords} words.
            </p>
          </div>

          {/* Professor Question Card */}
          <div className="flex flex-col items-center space-y-4 pt-2">
            <img
              src={task.professor.avatar}
              alt={task.professor.name}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-emerald-800 object-cover shadow-sm"
            />
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed text-left">
              {task.professor.prompt}
            </p>
          </div>
        </div>

        {/* Right Column: Classmate Opinions & User Post Area (image_21be855e.png) */}
        <div className="flex flex-col space-y-5">
          {/* Classmates opinions */}
          <div className="space-y-4">
            {task.classmates.map((student, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-emerald-800 object-cover shrink-0 mt-0.5"
                />
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed pt-1">
                  {student.opinion}
                </p>
              </div>
            ))}
          </div>

          {/* ETS Formatting Toolbar */}
          <div className="rounded-xl border border-gray-300 bg-gray-50 p-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCut}
                className="rounded-lg bg-[#0f6b64] px-3.5 py-1 text-xs font-bold text-white hover:bg-[#0c5650] transition shadow-xs"
              >
                Cut
              </button>
              <button
                type="button"
                onClick={handlePaste}
                className="rounded-lg bg-gray-200 px-3.5 py-1 text-xs font-bold text-gray-800 hover:bg-gray-300 transition"
              >
                Paste
              </button>
              <button
                type="button"
                onClick={handleUndo}
                className="rounded-lg bg-[#0f6b64] px-3.5 py-1 text-xs font-bold text-white hover:bg-[#0c5650] transition shadow-xs"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={handleRedo}
                className="rounded-lg bg-gray-200 px-3.5 py-1 text-xs font-bold text-gray-800 hover:bg-gray-300 transition"
              >
                Redo
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowWordCount(!showWordCount)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-teal-950 transition"
              >
                {showWordCount ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showWordCount ? 'Hide Word Count' : 'Show Word Count'}</span>
              </button>

              {showWordCount && (
                <span
                  className={`min-w-[32px] text-center rounded px-2.5 py-0.5 text-xs font-bold transition ${
                    isGoalReached
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                  title={
                    isGoalReached
                      ? `Meta de palabras alcanzada (${wordCount}/${task.minimumWords})`
                      : `Faltan ${task.minimumWords - wordCount} palabras para el mínimo recomendado`
                  }
                >
                  {wordCount}
                </span>
              )}
            </div>
          </div>

          {/* Response Textarea */}
          <div className="flex-1 flex flex-col min-h-[260px]">
            <textarea
              ref={textareaRef}
              value={userResponse}
              onChange={handleTextChange}
              placeholder="In my opinion, ..."
              className="w-full flex-1 min-h-[260px] rounded-xl border border-gray-300 p-4 text-sm sm:text-base leading-relaxed text-gray-900 focus:border-[#0f6b64] focus:outline-hidden focus:ring-1 focus:ring-[#0f6b64] resize-y font-sans shadow-inner"
              spellCheck="false"
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="mx-auto max-w-6xl w-full border-t border-gray-200 pt-4 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
            >
              <ChevronLeft size={16} />
              <span>Volver a Email</span>
            </button>
          )}
          <span className="text-xs font-bold text-gray-500">
            Task 3: Academic Discussion • {wordCount} palabras (mínimo sugerido: {task.minimumWords})
          </span>
        </div>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f6b64] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
          >
            <span>Finalizar y Calificar Writing &gt;</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
