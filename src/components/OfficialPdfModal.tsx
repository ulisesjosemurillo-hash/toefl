/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  FileText,
  ExternalLink,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Key,
  Maximize2,
  ChevronRight,
} from 'lucide-react';

interface OfficialPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPracticeModule?: (section: 'reading_mod1' | 'reading_mod2' | 'listening_mod1' | 'listening_mod2' | 'writing' | 'speaking') => void;
}

export const OfficialPdfModal: React.FC<OfficialPdfModalProps> = ({
  isOpen,
  onClose,
  onSelectPracticeModule,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pdfUrl = '/assets/aistudio/toefl-ibt-full-length-practice-test1_0cb74dae.pdf';

  if (!isOpen) return null;

  const quickNavItems = [
    {
      title: 'Reading Módulo 1',
      page: 3,
      desc: 'Págs. 3-7 • Cave Dancing, Municipal Charter, Social Media Post & The Mirror Test (20 Qs)',
      icon: <BookOpen size={16} className="text-teal-600" />,
      actionKey: 'reading_mod1' as const,
    },
    {
      title: 'Reading Módulo 2',
      page: 8,
      desc: 'Págs. 8-12 • The Human Brain, Art Workshop, Fitness Center & The Paradox of Choice (20 Qs)',
      icon: <BookOpen size={16} className="text-teal-600" />,
      actionKey: 'reading_mod2' as const,
    },
    {
      title: 'Claves Reading (Answer Keys)',
      page: 13,
      desc: 'Págs. 13-14 • Respuestas oficiales Módulos 1 y 2 con explicaciones',
      icon: <Key size={16} className="text-amber-600" />,
    },
    {
      title: 'Listening Módulo 1',
      page: 15,
      desc: 'Págs. 15-20 • 18 preguntas: Best response + Talk, Announcement & Conversation',
      icon: <Headphones size={16} className="text-sky-600" />,
      actionKey: 'listening_mod1' as const,
    },
    {
      title: 'Listening Módulo 2',
      page: 21,
      desc: 'Págs. 21-24 • 16 preguntas: Conversación de campus, Biología y Arqueología',
      icon: <Headphones size={16} className="text-sky-600" />,
      actionKey: 'listening_mod2' as const,
    },
    {
      title: 'Claves Listening (Answer Keys)',
      page: 25,
      desc: 'Págs. 25-26 • Respuestas oficiales Listening Módulos 1 y 2',
      icon: <Key size={16} className="text-amber-600" />,
    },
    {
      title: 'Writing Section',
      page: 27,
      desc: 'Págs. 27-31 • 12 preguntas: 10 Build a Sentence + Email (7m) + Academic Discussion (10m)',
      icon: <PenTool size={16} className="text-orange-600" />,
      actionKey: 'writing' as const,
    },
    {
      title: 'Speaking Section',
      page: 33,
      desc: 'Págs. 33-35 • 11 preguntas: 7 Listen & Repeat (10s) + 4 Interview (45s)',
      icon: <Mic size={16} className="text-purple-600" />,
      actionKey: 'speaking' as const,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4">
      <div className="flex h-full max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-300">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#0f6b64] px-4 py-3 sm:px-6 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-7 items-center justify-center rounded bg-white px-2 text-xs font-black text-[#0f6b64]">
              ETS
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight">
                TOEFL iBT® Full-Length Practice Test 1 (PDF Oficial)
              </h2>
              <p className="text-[11px] text-teal-100 hidden sm:block">
                Documento oficial completo de 35 páginas con todas las secciones y hojas de respuestas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-800/80 hover:bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white transition"
              title="Abrir en pestaña nueva"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Pestaña Nueva</span>
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-teal-100 hover:bg-teal-800 hover:text-white transition"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Jumps Bar */}
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max text-xs">
            <span className="font-bold text-gray-700 flex items-center gap-1">
              <FileText size={14} className="text-gray-500" /> Ir a sección:
            </span>
            {quickNavItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(item.page)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition text-xs ${
                  currentPage === item.page
                    ? 'bg-[#0f6b64] text-white font-bold shadow-xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
                <span className="text-[10px] opacity-75">(p. {item.page})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Left Index (collapsed on mobile) + Right PDF Embed */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Index Sidebar */}
          <div className="hidden md:flex w-72 flex-col border-r border-gray-200 bg-white p-3 overflow-y-auto space-y-2 shrink-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 pt-1">
              Navegación del Documento
            </p>
            {quickNavItems.map((item, idx) => (
              <div
                key={idx}
                className={`group rounded-xl p-2.5 transition border text-left cursor-pointer ${
                  currentPage === item.page
                    ? 'border-teal-500 bg-teal-50/70 shadow-2xs'
                    : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setCurrentPage(item.page)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-xs font-bold text-gray-900 group-hover:text-teal-700">
                      {item.title}
                    </span>
                  </div>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
                    p. {item.page}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-gray-500 leading-snug">
                  {item.desc}
                </p>
                {item.actionKey && onSelectPracticeModule && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPracticeModule(item.actionKey!);
                      onClose();
                    }}
                    className="mt-2 inline-flex items-center gap-1 rounded bg-[#0f6b64] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#0c5650] transition"
                  >
                    <span>Practicar Interactivo</span>
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* PDF Viewer Frame */}
          <div className="flex-1 bg-gray-200 relative flex flex-col">
            <iframe
              key={`pdf-page-${currentPage}`}
              src={`${pdfUrl}#page=${currentPage}&view=FitH`}
              className="w-full flex-1 border-0"
              title="Official TOEFL iBT PDF Practice Test 1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
