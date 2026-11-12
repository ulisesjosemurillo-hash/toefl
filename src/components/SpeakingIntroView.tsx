/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronRight, Mic, Volume2 } from 'lucide-react';

interface SpeakingIntroViewProps {
  type: 'section_intro' | 'repeat_intro' | 'interview_task_intro' | 'interview_scenario_intro';
  onNext: () => void;
  onOpenMicrophoneCheck?: () => void;
}

export const SpeakingIntroView: React.FC<SpeakingIntroViewProps> = ({
  type,
  onNext,
  onOpenMicrophoneCheck,
}) => {
  // Screen 1: Speaking Section Main Intro (image_33e325dd.png)
  if (type === 'section_intro') {
    return (
      <div className="flex-1 overflow-y-auto bg-white p-8 sm:p-14 flex flex-col justify-between min-h-0 select-none">
        <div className="mx-auto max-w-3xl w-full text-left pt-6">
          <div className="mb-6 border-b border-gray-200 pb-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <Mic size={28} className="text-[#0f6b64]" />
              Speaking Section
            </h1>
          </div>

          <p className="mb-6 text-base sm:text-lg text-gray-800 leading-relaxed font-normal">
            In the speaking section, you will answer 11 questions to demonstrate how well you can
            speak English. There are two types of tasks.
          </p>

          {/* Authentic ETS Table */}
          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm max-w-2xl mb-8">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr className="bg-[#cca8a4] text-gray-900 border-b border-gray-400 font-bold">
                  <th className="py-3 px-5 border-r border-gray-300 w-1/2">Type of Task</th>
                  <th className="py-3 px-5 w-1/2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-gray-800">
                <tr className="hover:bg-gray-50 transition">
                  <td className="py-3 px-5 border-r border-gray-200 font-medium">Listen and Repeat</td>
                  <td className="py-3 px-5">Listen and repeat what you heard</td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="py-3 px-5 border-r border-gray-200 font-medium">Take an Interview</td>
                  <td className="py-3 px-5">Answer questions from the interviewer</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Real Microphone Check Card */}
          <div className="max-w-2xl rounded-2xl border-2 border-teal-600 bg-gradient-to-r from-teal-50 via-emerald-50 to-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f6b64] text-white">
                <Mic size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                  Requisito de Micrófono Real para Grabación
                </h3>
                <p className="text-xs text-gray-600">
                  El sistema grabará tu voz, la transcribirá y evaluará si tu pronunciación y fluidez están bien o mal.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-teal-100">
              <span className="text-[11px] font-semibold text-teal-900">
                ⏱ Cuenta regresiva automática de 3 segundos antes de cada grabación.
              </span>

              {onOpenMicrophoneCheck && (
                <button
                  type="button"
                  onClick={onOpenMicrophoneCheck}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f6b64] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c5650] shadow-xs transition"
                >
                  <Mic size={14} />
                  <span>Probar y Calibrar Micrófono</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl w-full border-t border-gray-200 pt-6 mt-12 pb-4 flex items-center justify-end">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-7 py-3 text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
          >
            <span>Continuar (Next)</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Screen 2: Task 1 Intro: Listen and Repeat (image_9d3cb7fe.png)
  if (type === 'repeat_intro') {
    return (
      <div className="flex-1 overflow-y-auto bg-white p-8 sm:p-14 flex flex-col justify-between min-h-0 select-none">
        <div className="mx-auto max-w-3xl w-full text-left pt-6">
          <div className="mb-6 border-b border-gray-200 pb-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Listen and Repeat
            </h1>
          </div>

          <div className="space-y-6 text-base sm:text-lg text-gray-800 leading-relaxed font-normal">
            <p>
              You will listen as someone speaks to you. Listen carefully and then repeat what you have
              heard. The clock will indicate how much time you have to speak.
            </p>
            <p className="font-semibold text-gray-900">
              No time for preparation will be provided.
            </p>
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900 flex items-center gap-3">
              <Volume2 size={20} className="text-[#0f6b64] shrink-0" />
              <span>
                Tiempo oficial de respuesta para cada frase: <strong>10 segundos</strong>. Escuchas el enunciado una sola vez y repites de inmediato al activarse el micrófono.
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl w-full border-t border-gray-200 pt-6 mt-12 pb-4 flex items-center justify-end">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-7 py-3 text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
          >
            <span>Comenzar Listen and Repeat</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Screen 3: Task 2 General Intro: Take an Interview (image_84abadac.png)
  if (type === 'interview_task_intro') {
    return (
      <div className="flex-1 overflow-y-auto bg-white p-8 sm:p-14 flex flex-col justify-between min-h-0 select-none">
        <div className="mx-auto max-w-3xl w-full text-left pt-6">
          <div className="mb-6 border-b border-gray-200 pb-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Take an Interview
            </h1>
          </div>

          <div className="space-y-6 text-base sm:text-lg text-gray-800 leading-relaxed font-normal">
            <p>
              An interviewer will ask you questions. Answer the questions and be sure to say as much
              as you can in the time allowed.
            </p>
            <p className="font-semibold text-gray-900">
              No time for preparation will be provided.
            </p>
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900 flex items-center gap-3">
              <Mic size={20} className="text-[#0f6b64] shrink-0" />
              <span>
                Tiempo oficial de respuesta para la entrevista: <strong>45 segundos</strong> por cada pregunta de la investigadora.
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl w-full border-t border-gray-200 pt-6 mt-12 pb-4 flex items-center justify-end">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-7 py-3 text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
          >
            <span>Continuar a la Entrevista</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Screen 4: Interview Scenario Intro (image_d58b64ef.png)
  return (
    <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-10 flex flex-col justify-between min-h-0 select-none">
      <div className="mx-auto max-w-4xl w-full text-center space-y-6 pt-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug max-w-3xl mx-auto">
          You have agreed to take part in a research study about urban life. You will have a short
          online interview with a researcher. The researcher will ask you some questions.
        </h2>

        {/* Researcher Video / Portrait Photo */}
        <div className="flex justify-center pt-2">
          <div className="relative overflow-hidden rounded-2xl border-2 border-gray-300 shadow-md max-w-md w-full">
            <img
              src="/assets/aistudio/image_d58b64ef.png"
              alt="Researcher Dr. Sarah Adams"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl w-full border-t border-gray-200 pt-6 mt-8 pb-4 flex items-center justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-7 py-3 text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
        >
          <span>Iniciar Preguntas de la Entrevista (45s)</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
