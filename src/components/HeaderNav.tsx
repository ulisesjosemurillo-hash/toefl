/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Clock,
  Eye,
  EyeOff,
  ListOrdered,
  LogOut,
  Flag,
  HelpCircle,
  Shuffle,
  Mic,
} from 'lucide-react';

interface HeaderNavProps {
  testTitle: string;
  sectionName?: string;
  questionIndicator: string;
  isFirstScreen: boolean;
  isLastScreen: boolean;
  onBack: () => void;
  onNext: () => void;
  onOpenReview: () => void;
  onExit: () => void;
  onChangeTestInfo?: () => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  isCurrentMarked: boolean;
  onToggleMarkCurrent: () => void;
  showMarkCheckbox: boolean;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  onOpenMicCheck?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  testTitle,
  sectionName = 'Reading',
  questionIndicator,
  isFirstScreen,
  isLastScreen,
  onBack,
  onNext,
  onOpenReview,
  onExit,
  onChangeTestInfo,
  timerSeconds,
  isCurrentMarked,
  onToggleMarkCurrent,
  showMarkCheckbox,
  volume: externalVolume,
  onVolumeChange,
  onOpenMicCheck,
}) => {
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [internalVolume, setInternalVolume] = useState(80);
  const volume = externalVolume !== undefined ? externalVolume : internalVolume;
  const setVolume = (v: number) => {
    setInternalVolume(v);
    onVolumeChange?.(v);
  };
  const [isMuted, setIsMuted] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Format MM:SS
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeCritical = timerSeconds <= 180 && timerSeconds > 0;

  const playTestChime = () => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime((volume / 100) * 0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  return (
    <header className="w-full select-none">
      {/* Top Navigation Bar */}
      <div className="toefl-top-nav flex items-center justify-between px-4 py-2 sm:px-6 shadow-sm">
        {/* Left: ETS Logo & Test Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-white">
            <span className="flex h-5 items-center justify-center rounded bg-white px-1.5 text-xs font-black text-[#0f6b64]">
              ETS
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold opacity-95 hidden sm:inline">
              TOEFL iBT®
            </span>
          </div>

          <span className="text-teal-200 text-xs hidden md:inline">|</span>
          <span className="text-xs font-medium text-teal-50 truncate max-w-[200px] sm:max-w-xs hidden md:inline" title={testTitle}>
            {testTitle}
          </span>
        </div>

        {/* Center: Timer & Controls */}
        <div className="flex items-center gap-3">
          {/* Official Timer */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#0a4d48] px-3 py-1 text-xs text-white">
            <Clock size={13} className={isTimeCritical ? 'animate-pulse text-rose-300' : 'text-teal-200'} />
            {showTimer ? (
              <span className={`font-mono font-bold tracking-wider ${isTimeCritical ? 'text-rose-300' : 'text-white'}`}>
                {formattedTime}
              </span>
            ) : (
              <span className="font-mono text-xs text-teal-200">Oculto</span>
            )}
            <button
              onClick={() => setShowTimer(!showTimer)}
              title={showTimer ? 'Ocultar reloj' : 'Mostrar reloj'}
              className="ml-1 text-teal-200 hover:text-white transition"
              aria-label="Alternar temporizador"
            >
              {showTimer ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>

          {/* Volume button */}
          <div className="relative">
            <button
              onClick={() => setShowVolumeModal(!showVolumeModal)}
              className="toefl-btn toefl-btn-dark text-xs py-1 px-2.5"
              title="Ajustes de Sonido"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span className="hidden sm:inline">Volume</span>
            </button>

            {/* Volume dropdown popover */}
            {showVolumeModal && (
              <div className="absolute right-0 top-9 z-50 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-xl text-gray-800">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-700">Ajuste de Audio</span>
                  <button
                    onClick={() => setShowVolumeModal(false)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 rounded text-gray-600 hover:bg-gray-100"
                  >
                    {isMuted ? <VolumeX size={16} className="text-rose-500" /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    disabled={isMuted}
                    onChange={(e) => {
                      setVolume(Number(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="h-1.5 flex-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f6b64]"
                  />
                  <span className="text-xs font-mono w-7 text-right">{isMuted ? 0 : volume}%</span>
                </div>
                <button
                  onClick={playTestChime}
                  className="w-full text-center py-1.5 text-xs font-semibold rounded bg-teal-50 text-[#0f6b64] hover:bg-teal-100 border border-teal-200 transition"
                >
                  Probar sonido de campana 🔔
                </button>
              </div>
            )}
          </div>

          {/* Microphone Calibration button (Speaking section) */}
          {sectionName === 'Speaking' && onOpenMicCheck && (
            <button
              onClick={onOpenMicCheck}
              className="toefl-btn toefl-btn-dark text-xs py-1 px-2.5 flex items-center gap-1.5 text-emerald-200 hover:text-white"
              title="Permiso y prueba de micrófono en vivo"
            >
              <Mic size={14} className="text-emerald-400" />
              <span className="hidden sm:inline">Micrófono</span>
            </button>
          )}

          {/* Help button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="toefl-btn toefl-btn-dark text-xs py-1 px-2.5 hidden sm:inline-flex"
            title="Instrucciones y Ayuda"
          >
            <HelpCircle size={14} />
            <span>Help</span>
          </button>

          {/* Review Question List Button */}
          <button
            onClick={onOpenReview}
            className="toefl-btn toefl-btn-dark text-xs py-1 px-2.5"
            title="Abrir tabla de revisión de preguntas"
          >
            <ListOrdered size={14} />
            <span>Review</span>
          </button>

          {/* Change Information / Alternate Passages Button */}
          {onChangeTestInfo && (
            <button
              onClick={onChangeTestInfo}
              className="toefl-btn toefl-btn-dark text-xs py-1 px-2.5 hidden md:inline-flex bg-teal-800/80 hover:bg-teal-900 border border-teal-600"
              title="Cambiar la información y textos del examen manteniendo el mismo tipo de ejercicios"
            >
              <Shuffle size={13} className="text-teal-200" />
              <span>Cambiar Textos 🔀</span>
            </button>
          )}
        </div>

        {/* Right: Back & Next Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-back"
            onClick={onBack}
            disabled={isFirstScreen}
            className="toefl-btn"
          >
            &lt; Back
          </button>
          <button
            id="btn-next"
            onClick={onNext}
            className={`toefl-btn font-bold px-3.5 py-1.5 shadow-sm text-xs ${
              isLastScreen
                ? 'bg-amber-300 text-gray-950 border border-amber-400 font-extrabold hover:bg-amber-400'
                : 'bg-white text-[#0f6b64] hover:bg-teal-50'
            }`}
          >
            {isLastScreen ? 'Finalizar Examen (Finish)' : 'Siguiente (Next) >'}
          </button>

          <button
            onClick={onExit}
            className="p-1.5 rounded-full text-teal-100 hover:text-white hover:bg-[#0c5650] ml-1 transition"
            title="Salir al Menú Principal"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="sub-nav flex items-center justify-between bg-white border-b border-gray-300 px-4 py-1.5 text-xs">
        <div className="flex items-center">
          <span className="mr-2 border-r border-gray-400 pr-2 font-bold text-gray-800">{sectionName}</span>
          <span id="question-indicator" className="font-semibold text-gray-700">
            {questionIndicator}
          </span>
        </div>

        {showMarkCheckbox && (
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs text-gray-700 hover:text-gray-900">
            <input
              type="checkbox"
              checked={isCurrentMarked}
              onChange={onToggleMarkCurrent}
              className="rounded border-gray-400 text-[#0f6b64] focus:ring-[#0f6b64] h-3.5 w-3.5 cursor-pointer"
            />
            <Flag size={13} className={isCurrentMarked ? 'text-amber-600 fill-amber-500' : 'text-gray-400'} />
            <span className="font-medium">Mark for Review</span>
          </label>
        )}
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-3 border-b pb-2">
              Instrucciones de la Sección Reading (TOEFL iBT®)
            </h3>
            <div className="text-xs leading-relaxed text-gray-700 space-y-2 mb-6">
              <p>
                <strong>Estructura del examen:</strong> La sección de lectura evalúa tu habilidad para comprender textos académicos y de la vida diaria en inglés universitario.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Complete the Words:</strong> Llena las letras faltantes en los recuadros grises. Puedes moverte con las flechas o el cursor.
                </li>
                <li>
                  <strong>Read in Daily Life:</strong> Lee avisos institucionales y responde preguntas sobre detalles clave.
                </li>
                <li>
                  <strong>Read an Academic Passage:</strong> Analiza pasajes universitarios con preguntas de idea principal, vocabulario en contexto, factuales, preguntas negativas (EXCEPT) e inferencias.
                </li>
                <li>
                  <strong>Navegación:</strong> Usa <em>&lt; Back</em> y <em>Next &gt;</em> para moverte entre preguntas. Usa el botón <em>Review</em> para saltar directamente a cualquier ejercicio antes de finalizar.
                </li>
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="rounded bg-[#0f6b64] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0c5650]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
