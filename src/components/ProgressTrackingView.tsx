/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  Sparkles,
  BookOpen,
  Target,
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
  Volume2,
  PenTool,
  Mic,
} from 'lucide-react';
import {
  TestAttempt,
  ToeflTest,
  ListeningTest,
  WritingTest,
  SpeakingTest,
  UserStats,
} from '../types/toefl.ts';
import {
  clearAllAttempts,
  deleteAttempt,
  exportLocalDatabase,
  importLocalDatabase,
  saveSettings,
  getSettings,
} from '../utils/storage.ts';

interface ProgressTrackingViewProps {
  stats: UserStats;
  attempts: TestAttempt[];
  availableTests: ToeflTest[];
  availableListeningTests?: ListeningTest[];
  availableWritingTests?: WritingTest[];
  availableSpeakingTests?: SpeakingTest[];
  savedSession?: {
    savedAt: number;
    examVariant: 'A' | 'B';
    fullExamCurrentSection: 'reading' | 'listening' | 'writing' | 'speaking';
    isFullExamMode: boolean;
  } | null;
  onResumeSavedSession?: () => void;
  onDiscardSavedSession?: () => void;
  onStartFullExam?: (variant: 'A' | 'B') => void;
  onStartTest: (test: ToeflTest) => void;
  onStartListeningTest?: (test: ListeningTest) => void;
  onStartWritingTest?: (test: WritingTest) => void;
  onStartSpeakingTest?: (test: SpeakingTest) => void;
  onStartDynamicTest?: () => void;
  onViewAttemptReport: (attempt: TestAttempt) => void;
  onGenerateTestWithAi: (topic: string) => Promise<void>;
  isGeneratingTest: boolean;
  initialTab?: 'overview' | 'catalog' | 'history';
  onRefreshData: () => void;
}

export const ProgressTrackingView: React.FC<ProgressTrackingViewProps> = ({
  stats,
  attempts,
  availableTests,
  availableListeningTests = [],
  availableWritingTests = [],
  availableSpeakingTests = [],
  initialTab = 'overview',
  savedSession,
  onResumeSavedSession,
  onDiscardSavedSession,
  onStartFullExam,
  onStartTest,
  onStartListeningTest,
  onStartWritingTest,
  onStartSpeakingTest,
  onViewAttemptReport,
  onGenerateTestWithAi,
  isGeneratingTest,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'history'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [customTopic, setCustomTopic] = useState('');
  const [catalogSection, setCatalogSection] = useState<'reading' | 'listening' | 'writing' | 'speaking'>('reading');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetScoreInput, setTargetScoreInput] = useState(stats.targetScore || 26);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleUpdateTarget = () => {
    saveSettings({ targetScore: Number(targetScoreInput) });
    setEditingTarget(false);
    onRefreshData();
  };

  const handleExport = () => {
    const json = exportLocalDatabase();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toefl_ibt_progress_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const success = importLocalDatabase(text);
        if (success) {
          setImportStatus('¡Base de datos local restaurada exitosamente!');
          onRefreshData();
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Error: Archivo de respaldo no válido.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAttempt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Eliminar este intento del registro local?')) {
      deleteAttempt(id);
      onRefreshData();
    }
  };

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de que deseas reiniciar todo el historial de práctica?')) {
      clearAllAttempts();
      onRefreshData();
    }
  };

  // Target progress calculation
  const targetPct = stats.targetScore > 0
    ? Math.min(100, Math.round((stats.averageScaledScore / stats.targetScore) * 100))
    : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation Tabs & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0f6b64]">
              Simulador Completo ETS • Formato Vigente Enero 2026
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Simulador Oficial TOEFL iBT®
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Elige una de las dos modalidades completas (Reading, Listening, Writing y Speaking) y recibe tu banda 1.0 – 6.0 + equivalencia 0 – 120.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition shadow-2xs ${
                activeTab === 'overview'
                  ? 'bg-[#0f6b64] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <TrendingUp size={14} className="inline mr-1.5" /> Exámenes y Métricas
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition shadow-2xs ${
                activeTab === 'history'
                  ? 'bg-[#0f6b64] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Layers size={14} className="inline mr-1.5" /> Historial ({attempts.length})
            </button>
          </div>
        </div>

        {importStatus && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-300 p-3 text-xs font-semibold text-emerald-800">
            {importStatus}
          </div>
        )}

        {/* TAB 1: OVERVIEW & ONLY 2 MAIN EXAM MODALITIES */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Resume Active Interrupted Session Banner */}
            {savedSession && onResumeSavedSession && (
              <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                      Sesión Guardada Automáticamente
                    </span>
                    <span className="text-xs font-semibold text-amber-900">
                      {new Date(savedSession.savedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    Tienes un examen en curso ({savedSession.examVariant === 'B' ? 'Opción B: Prueba Nueva' : 'Opción A: Prueba del TOEFL'}) en la sección{' '}
                    <span className="uppercase text-[#0f6b64]">{savedSession.fullExamCurrentSection}</span>.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  {onDiscardSavedSession && (
                    <button
                      onClick={onDiscardSavedSession}
                      className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition"
                    >
                      Descartar
                    </button>
                  )}
                  <button
                    onClick={onResumeSavedSession}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0f6b64] px-4 py-2 text-xs font-black text-white hover:bg-[#0c5650] shadow transition"
                  >
                    <Play size={14} className="fill-white" /> Continuar Examen
                  </button>
                </div>
              </div>
            )}

            {/* ONLY TWO MAIN EXAM MODALITIES */}
            {onStartFullExam && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* OPCIÓN A: PRUEBA DEL TOEFL (BANCO ORIGINAL) */}
                <div className="rounded-2xl border-2 border-[#0f6b64] bg-gradient-to-br from-[#093d39] via-[#0f6b64] to-[#135c56] text-white p-6 shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden">
                  <div className="space-y-3 z-10">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-amber-400 text-gray-950 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider">
                        OPCIÓN A • PRUEBA DEL TOEFL
                      </span>
                      <span className="text-xs font-bold text-teal-200">
                        Banco Original ETS
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                      Prueba Completa del TOEFL iBT®
                    </h2>

                    <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                      Examen completo con el banco original del repositorio de principio a fin, siguiendo la estructura oficial vigente ETS (Enero 2026).
                    </p>

                    <div className="rounded-xl bg-white/10 border border-white/15 p-3.5 space-y-1.5 text-xs text-teal-50">
                      <p><strong>1. Reading (20q):</strong> Complete the Words, Read in Daily Life &amp; A History of Mirrors.</p>
                      <p><strong>2. Listening (28q):</strong> 18 Best Responses + Conversaciones y Attention Restoration Theory.</p>
                      <p><strong>3. Writing (12 tareas):</strong> 10 Build a Sentence, Email de Solicitud y Discusión sobre Voluntariado.</p>
                      <p><strong>4. Speaking (11q):</strong> 7 Listen &amp; Repeat (Zoológico, 10s) + 4 Interview (Dr. Sarah Adams, 45s).</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartFullExam('A')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 text-gray-950 px-6 py-4 text-sm font-black hover:bg-amber-300 shadow-lg transition transform active:scale-98 z-10"
                  >
                    <span>Iniciar Opción A: Prueba del TOEFL</span>
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* OPCIÓN B: PRUEBA NUEVA (100% CONTENIDO DISTINTO) */}
                <div className="rounded-2xl border-2 border-indigo-600 bg-gradient-to-br from-[#1b2448] via-[#263468] to-[#1e3a5f] text-white p-6 shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden">
                  <div className="space-y-3 z-10">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-emerald-400 text-gray-950 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider">
                        OPCIÓN B • PRUEBA NUEVA
                      </span>
                      <span className="text-xs font-bold text-indigo-200">
                        Contenido 100% Diferente
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                      Prueba Nueva Equivalente TOEFL iBT®
                    </h2>

                    <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                      Segundo examen completo e inédito con textos, audios, conversaciones, ejercicios escritos y entrevista oral totalmente distintos, con el mismo formato y dificultad oficial.
                    </p>

                    <div className="rounded-xl bg-white/10 border border-white/15 p-3.5 space-y-1.5 text-xs text-indigo-50">
                      <p><strong>1. Reading (20q):</strong> The Human Brain, Emails (Art Workshop &amp; Gym) y Paradox of Choice.</p>
                      <p><strong>2. Listening (28q):</strong> 18 nuevos diálogos + Biblioteca, Proyecto Grupal y Bioluminiscencia Marina.</p>
                      <p><strong>3. Writing (12 tareas):</strong> 10 nuevas oraciones, Email de Alojamiento y Debate de Semana de 4 Días.</p>
                      <p><strong>4. Speaking (11q):</strong> 7 Listen &amp; Repeat (Museo de Ciencias, 10s) + 4 Interview (Dr. David Chen, 45s).</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartFullExam('B')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 text-gray-950 px-6 py-4 text-sm font-black hover:bg-emerald-300 shadow-lg transition transform active:scale-98 z-10"
                  >
                    <span>Iniciar Opción B: Prueba Nueva</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Official 2026 Format & Hardware Notice */}
            <div className="rounded-xl border border-teal-200 bg-teal-50/80 px-5 py-3.5 text-xs text-teal-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>
                <strong>Sistema de Evaluación Vigente ETS (desde 21 Ene 2026):</strong> Escala de banda <strong>1.0 – 6.0</strong> (incrementos de 0.5) por sección y promedio global + equivalencia orientativa <strong>0 – 120</strong>.
              </span>
              <span className="font-semibold text-[#0f6b64] shrink-0">
                🎙️ Micrófono real requerido en Speaking
              </span>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Exámenes Realizados
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900">
                    {stats.totalAttempts}
                  </span>
                  <span className="text-xs text-gray-500">sesiones</span>
                </div>
                <span className="mt-1 block text-[11px] text-gray-500">
                  Práctica ilimitada disponible
                </span>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Promedio Scaled
                  </span>
                  <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-[#0f6b64]">
                    0-30
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#0f6b64]">
                    {stats.averageScaledScore || 0}
                  </span>
                  <span className="text-sm font-semibold text-gray-400">/ 30</span>
                </div>
                <span className="mt-1 block text-[11px] text-emerald-700 font-semibold">
                  {stats.averageScaledScore >= 24
                    ? 'Nivel Avanzado (C1/C2)'
                    : stats.averageScaledScore >= 18
                    ? 'Intermedio Alto (B2)'
                    : stats.averageScaledScore >= 10
                    ? 'Intermedio Bajo (B1)'
                    : 'Nivel Inicial'}
                </span>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Puntaje Récord (Best)
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-emerald-600">
                    {stats.highestScaledScore || 0}
                  </span>
                  <span className="text-sm font-semibold text-gray-400">/ 30</span>
                </div>
                <span className="mt-1 block text-[11px] text-gray-500">
                  {stats.highestScaledScore >= 26
                    ? 'Supera meta de admisión'
                    : 'En camino a tu meta'}
                </span>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Tiempo Total de Estudio
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900">
                    {Math.round(stats.totalPracticeTimeSeconds / 60)}
                  </span>
                  <span className="text-xs text-gray-500">minutos</span>
                </div>
                <span className="mt-1 block text-[11px] text-gray-500">
                  Entrenamiento cronometrado
                </span>
              </div>
            </div>

            {/* Target Score Tracker Banner */}
            <div className="rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50/50 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#0f6b64] text-white">
                    <Target size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">
                      Meta de Puntaje TOEFL Reading
                    </h3>
                    <p className="text-xs text-gray-600">
                      Puntaje objetivo recomendado para becas y admisiones universitarias internacionales (Grado/Máster).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editingTarget ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={targetScoreInput}
                        onChange={(e) => setTargetScoreInput(Number(e.target.value))}
                        className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-bold text-gray-900"
                      />
                      <button
                        onClick={handleUpdateTarget}
                        className="rounded bg-[#0f6b64] px-3 py-1 text-xs font-bold text-white hover:bg-[#0c5650]"
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-[#0f6b64]">
                        {stats.targetScore} / 30
                      </span>
                      <button
                        onClick={() => setEditingTarget(true)}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline"
                      >
                        Cambiar Meta
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress toward target */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span>
                    Progreso hacia la meta: {stats.averageScaledScore} de {stats.targetScore} pts
                  </span>
                  <span>{targetPct}%</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0f6b64] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${targetPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Score Evolution Chart & Skill Accuracies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolution Chart */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <TrendingUp size={16} className="text-[#0f6b64]" />
                      Evolución del Puntaje Scaled (0-30)
                    </h3>
                    <span className="text-[11px] font-semibold text-gray-500">
                      Últimos 10 exámenes
                    </span>
                  </div>

                  {stats.recentScores.length > 1 ? (
                    <div className="h-44 w-full flex items-end gap-2 pt-6 pb-2 border-b border-gray-200">
                      {stats.recentScores.map((pt, i) => {
                        const heightPct = Math.round((pt.scaledScore / 30) * 100);
                        const isTargetMet = pt.scaledScore >= stats.targetScore;
                        return (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
                          >
                            <span className="text-[10px] font-bold text-gray-700 group-hover:text-[#0f6b64]">
                              {pt.scaledScore}
                            </span>
                            <div
                              className={`w-full rounded-t transition-all ${
                                isTargetMet ? 'bg-[#0f6b64]' : 'bg-teal-400'
                              } group-hover:bg-[#0c5650]`}
                              style={{ height: `${heightPct}%` }}
                            />
                            <span className="text-[9px] text-gray-400 truncate max-w-full">
                              {pt.date}
                            </span>

                            {/* Tooltip */}
                            <div className="pointer-events-none absolute bottom-full mb-2 hidden group-hover:block z-10 w-36 rounded bg-gray-900 p-2 text-[10px] text-white shadow-lg">
                              <p className="font-bold">{pt.testTitle}</p>
                              <p>Puntaje: {pt.scaledScore}/30</p>
                              <p>Fecha: {pt.date}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-gray-300 text-center p-4 text-xs text-gray-500">
                      Completa al menos 2 exámenes para visualizar la curva de evolución de tu puntaje a lo largo del tiempo.
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#0f6b64]" /> Meta ({stats.targetScore}+)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-teal-400" /> Intentos registrados
                  </span>
                </div>
              </div>

              {/* Skills Mastery Matrix */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <Award size={16} className="text-[#0f6b64]" />
                    Dominio por Habilidad Cognitiva
                  </h3>
                  <span className="text-[11px] font-semibold text-gray-500">
                    Diagnóstico acumulado
                  </span>
                </div>

                {Object.keys(stats.skillAccuracies).length > 0 ? (
                  <div className="space-y-3.5">
                    {Object.entries(stats.skillAccuracies).map(([key, data]) => {
                      const isHigh = data.percentage >= 80;
                      const isMed = data.percentage >= 60 && data.percentage < 80;

                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-gray-800 truncate max-w-[240px]">
                              {data.name}
                            </span>
                            <span
                              className={`font-bold ${
                                isHigh
                                  ? 'text-emerald-700'
                                  : isMed
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {data.percentage}% ({data.correct}/{data.total})
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                isHigh
                                  ? 'bg-emerald-600'
                                  : isMed
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${data.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-gray-300 text-center p-4 text-xs text-gray-500">
                    No hay datos de habilidades suficientes aún. Comienza tu primera prueba para mapear tus fortalezas y debilidades.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: TEST CATALOG & AI GENERATOR */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Biblioteca de Módulos TOEFL iBT®
                </h2>
                <p className="text-xs text-gray-500">
                  Practica por sección oficial: Reading (11 módulos) o Listening (preguntas con audio y voz real).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c5650] shadow transition"
                >
                  <Sparkles size={15} /> Generar Examen con IA
                </button>
              </div>
            </div>

            {/* Section Switcher in Catalog */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
              <button
                onClick={() => setCatalogSection('reading')}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  catalogSection === 'reading'
                    ? 'bg-[#0f6b64] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📖 Reading ({availableTests.length})
              </button>
              <button
                onClick={() => setCatalogSection('listening')}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  catalogSection === 'listening'
                    ? 'bg-[#0f6b64] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎧 Listening ({availableListeningTests.length})
              </button>
              <button
                onClick={() => setCatalogSection('writing')}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  catalogSection === 'writing'
                    ? 'bg-[#0f6b64] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✍️ Writing ({availableWritingTests.length} Módulo • 12 Preguntas)
              </button>
              <button
                onClick={() => setCatalogSection('speaking')}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  catalogSection === 'speaking'
                    ? 'bg-[#0f6b64] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🗣️ Speaking ({availableSpeakingTests.length} Módulo • 10s y 45s)
              </button>
            </div>

            {/* WRITING SECTION CATALOG */}
            {catalogSection === 'writing' && (
              <div className="space-y-4">
                {availableWritingTests.map((wTest) => (
                  <div
                    key={wTest.id}
                    className="rounded-xl border-2 border-teal-600 bg-white p-6 shadow-md hover:border-[#0f6b64] transition flex flex-col md:flex-row items-center justify-between gap-6"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-teal-100 text-[#0f6b64] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                          {wTest.category}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {wTest.estimatedMinutes} min • {wTest.totalQuestions} Preguntas
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {wTest.title}
                      </h3>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        Formato oficial TOEFL iBT Writing con las 3 tareas completas: 10 ejercicios interactivos de <strong>Build a Sentence</strong> (con banco de palabras y distractores), 1 redacción de <strong>Write an Email</strong> (7 minutos con barra de herramientas Cut/Paste/Undo y contador) y 1 participación en <strong>Academic Discussion</strong> (10 minutos, mínimo 100 palabras con el profesor y compañeros de clase).
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-teal-800 font-semibold">
                        <span>• 10 oraciones con avatares ETS auténticos</span>
                        <span>• Tarea 2: Redacción de Email en 7 minutos</span>
                        <span>• Tarea 3: Discusión Académica sobre voluntariado</span>
                      </div>
                    </div>

                    <div className="w-full md:w-auto shrink-0">
                      {onStartWritingTest && (
                        <button
                          onClick={() => onStartWritingTest(wTest)}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f6b64] px-6 py-3.5 text-xs sm:text-sm font-black text-white hover:bg-[#0c5650] shadow-md hover:shadow-lg transition transform active:scale-98"
                        >
                          <PenTool size={16} />
                          <span>Iniciar Writing ✍️</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SPEAKING SECTION CATALOG */}
            {catalogSection === 'speaking' && (
              <div className="space-y-4">
                {availableSpeakingTests.map((spkTest) => (
                  <div
                    key={spkTest.id}
                    className="rounded-xl border-2 border-emerald-600 bg-white p-6 shadow-md hover:border-[#0f6b64] transition flex flex-col md:flex-row items-center justify-between gap-6"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                          {spkTest.category}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {spkTest.estimatedMinutes} min • {spkTest.totalQuestions} Preguntas
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {spkTest.title}
                      </h3>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        Formato oficial TOEFL iBT Speaking estructurado en 2 tareas con temporizadores oficiales exactos:
                        <strong> Tarea 1: Listen and Repeat</strong> (7 frases con escenas fotográficas del zoológico, tiempo de respuesta estricto de <strong>10 segundos</strong> por frase) y
                        <strong> Tarea 2: Take an Interview</strong> (4 preguntas con la investigadora de estudios urbanos Dr. Sarah Adams, con tiempo de respuesta de <strong>45 segundos</strong> por turno).
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-emerald-800 font-semibold">
                        <span>• Listen and Repeat: 10 segundos exactos por respuesta</span>
                        <span>• Take an Interview: 45 segundos exactos por pregunta</span>
                        <span>• Grabación de voz en tiempo real con transcripción</span>
                      </div>
                    </div>

                    <div className="w-full md:w-auto shrink-0">
                      {onStartSpeakingTest && (
                        <button
                          onClick={() => onStartSpeakingTest(spkTest)}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f6b64] px-6 py-3.5 text-xs sm:text-sm font-black text-white hover:bg-[#0c5650] shadow-md hover:shadow-lg transition transform active:scale-98"
                        >
                          <Mic size={16} />
                          <span>Iniciar Speaking 🗣️</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* LISTENING SECTION CATALOG */}
            {catalogSection === 'listening' && (
              <div className="space-y-4">
                {availableListeningTests.map((lisTest) => (
                  <div
                    key={lisTest.id}
                    className="rounded-xl border-2 border-teal-500 bg-white p-6 shadow-md hover:border-[#0f6b64] transition flex flex-col md:flex-row items-center justify-between gap-6"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-teal-100 text-[#0f6b64] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                          {lisTest.category}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {lisTest.estimatedMinutes} min • {lisTest.totalQuestions} Preguntas
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {lisTest.title}
                      </h3>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {lisTest.partType === 'part1_responses' &&
                          'Formato oficial TOEFL iBT: el enunciado se escucha por voz con fotos de personajes en campus. El texto del estímulo NO aparece en pantalla (solo escuchas el audio y seleccionas la mejor respuesta). Incluye retroalimentación y transcripción al terminar.'}
                        {lisTest.partType === 'part2_passages' &&
                          'Formato oficial TOEFL iBT Part 2: 2 conversaciones estudiantiles, 1 anuncio en clase y 1 conferencia académica (Attention Restoration Theory). Incluye pantalla de introducción, audios de pasajes completos con fotos de escena, y preguntas de opción múltiple.'}
                        {lisTest.partType === 'full_exam' &&
                          'Simulación completa e integrada de la sección de Listening de TOEFL iBT: incluye las 18 respuestas conversacionales de la Parte 1 seguidas de las 4 conversaciones/conferencias y 10 preguntas de la Parte 2.'}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-teal-800 font-semibold">
                        {lisTest.partType === 'part1_responses' && (
                          <>
                            <span>• 18 situaciones de campus y turnos de habla</span>
                            <span>• Enunciado por voz con prompt oculto en pantalla</span>
                            <span>• Voces nativas de hombre y mujer</span>
                          </>
                        )}
                        {lisTest.partType === 'part2_passages' && (
                          <>
                            <span>• 4 pasajes de audio con fotos oficiales</span>
                            <span>• Pantalla de introducción oficial TOEFL iBT</span>
                            <span>• 10 preguntas con retroalimentación completa</span>
                          </>
                        )}
                        {lisTest.partType === 'full_exam' && (
                          <>
                            <span>• 28 preguntas oficiales en orden auténtico</span>
                            <span>• Transición automática entre Parte 1 y Parte 2</span>
                            <span>• Calificación completa con puntaje 0-30</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="w-full md:w-auto shrink-0">
                      {onStartListeningTest && (
                        <button
                          onClick={() => onStartListeningTest(lisTest)}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f6b64] px-6 py-3.5 text-xs sm:text-sm font-black text-white hover:bg-[#0c5650] shadow-md hover:shadow-lg transition transform active:scale-98"
                        >
                          <Volume2 size={16} />
                          <span>Iniciar Listening 🎧</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* READING SECTION CATALOG */}
            {catalogSection === 'reading' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTests.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs hover:border-[#0f6b64] transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-[10px] font-bold text-[#0f6b64]">
                        {t.category}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {t.estimatedMinutes} min
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                      {t.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-gray-600 mb-6">
                      <p className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0f6b64]" />
                        <strong>Complete the Words:</strong>{' '}
                        {t.completeWords.passageTextSegments.filter((s) => s.type === 'word').length} palabras
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        <strong>
                          {t.dailyLifeNotice.format === 'email'
                            ? 'Email:'
                            : t.dailyLifeNotice.format === 'social_media_post'
                            ? 'Social Media Post:'
                            : 'Notice:'}
                        </strong>{' '}
                        {t.dailyLifeNotice.title} ({t.dailyLifeNotice.questions.length} preguntas)
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-700" />
                        <strong>Academic:</strong> {t.academicPassage.title} ({t.academicPassage.questions.length} preguntas)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xs font-semibold text-gray-500">
                      Total: {t.completeWords.passageTextSegments.filter((s) => s.type === 'word').length + t.dailyLifeNotice.questions.length + t.academicPassage.questions.length} ejercicios puntuados
                    </span>
                    <button
                      onClick={() => onStartTest(t)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f6b64] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#0c5650] transition shadow-xs"
                    >
                      Iniciar Examen <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMPLETE HISTORY & DATABASE TOOLS */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Historial de Exámenes en Base de Datos Local
                </h2>
                <p className="text-xs text-gray-500">
                  Registro detallado de cada intento completado con acceso a su informe de diagnóstico.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  title="Descargar copia de seguridad en JSON"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs"
                >
                  <Download size={13} /> Exportar JSON
                </button>

                <label
                  title="Restaurar copia de seguridad"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs"
                >
                  <Upload size={13} /> Importar
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportFile}
                  />
                </label>

                {attempts.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    title="Borrar todo el historial"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 shadow-2xs"
                  >
                    <Trash2 size={13} /> Reiniciar
                  </button>
                )}
              </div>
            </div>

            {/* History Table */}
            {attempts.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 font-bold text-gray-700">
                        <th className="py-3 px-4">Fecha & Hora</th>
                        <th className="py-3 px-4">Examen</th>
                        <th className="py-3 px-4 text-center">Puntaje Scaled</th>
                        <th className="py-3 px-4 text-center">Nivel CEFR</th>
                        <th className="py-3 px-4 text-center">Tiempo</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {attempts.map((a) => {
                        const mins = Math.floor(a.durationSeconds / 60);
                        const secs = a.durationSeconds % 60;

                        return (
                          <tr
                            key={a.id}
                            className="hover:bg-teal-50/50 transition cursor-pointer"
                            onClick={() => onViewAttemptReport(a)}
                          >
                            <td className="py-3 px-4 text-gray-600 font-medium whitespace-nowrap">
                              {new Date(a.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 font-bold text-gray-900 max-w-xs truncate">
                              {a.testTitle}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-block rounded-full bg-teal-100 px-2.5 py-0.5 font-black text-[#0f6b64]">
                                {a.etsBandScore2026
                                  ? `${a.etsBandScore2026.toFixed(1)} / 6.0 (${a.scaledScore}/120)`
                                  : `${a.scaledScore} / ${a.testType === 'full' ? 120 : 30}`}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700">
                                {a.cefrLevel}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-gray-500 whitespace-nowrap">
                              {mins}m {secs}s
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewAttemptReport(a);
                                }}
                                className="mr-3 font-semibold text-[#0f6b64] hover:underline"
                              >
                                Ver Análisis
                              </button>
                              <button
                                onClick={(e) => handleDeleteAttempt(a.id, e)}
                                className="text-gray-400 hover:text-rose-600 transition"
                                title="Eliminar registro"
                              >
                                <Trash2 size={14} className="inline" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 space-y-3">
                <BookOpen size={36} className="mx-auto text-gray-400" />
                <h3 className="font-bold text-gray-700">Aún no hay exámenes en el historial</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Tus resultados, respuestas, debilidades detectadas y notas se guardarán aquí permanentemente para tu seguimiento personalizado.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="rounded-lg bg-[#0f6b64] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c5650]"
                >
                  Tomar primer examen
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Test Generator Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#0f6b64] font-bold text-base">
                <Sparkles size={18} />
                <h3>Generador de Exámenes TOEFL con IA</h3>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Crea un examen completo y único con la estructura idéntica oficial de ETS: <strong>Complete the Words</strong>, <strong>Read in Daily Life</strong> y <strong>Academic Passage</strong> (con 5 preguntas de idea principal, vocabulario, factuales, EXCEPT e inferencias).
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Tema de Estudio (o elige una sugerencia):
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Ej. Astronomía de Exoplanetas, Inteligencia Artificial, El Imperio Romano..."
                className="w-full rounded-lg border border-gray-300 p-2.5 text-xs text-gray-900 focus:border-[#0f6b64] focus:ring-1 focus:ring-[#0f6b64] outline-none"
              />

              {/* Topic quick suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Biología Marina y Arrecifes',
                  'Evolución del Cerebro Humano',
                  'Arquitectura de la Antigua Roma',
                  'Física de Energías Renovables',
                  'Psicología de la Memoria',
                ].map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => setCustomTopic(sugg)}
                    className="rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-700 hover:bg-teal-50 hover:text-[#0f6b64] transition"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isGeneratingTest}
                onClick={async () => {
                  const topic = customTopic.trim() || 'Ciencia general y medio ambiente';
                  setShowGenerateModal(false);
                  await onGenerateTestWithAi(topic);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f6b64] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c5650] shadow transition disabled:opacity-50"
              >
                <Sparkles size={14} className={isGeneratingTest ? 'animate-spin' : ''} />
                {isGeneratingTest ? 'Generando examen...' : 'Generar y Comenzar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
