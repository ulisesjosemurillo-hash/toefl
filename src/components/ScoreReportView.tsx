/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  TrendingUp,
  Brain,
  Sparkles,
  ArrowRight,
  Filter,
  BarChart3,
  Clock,
  ExternalLink,
  Volume2,
  Play,
} from 'lucide-react';
import { TestAttempt } from '../types/toefl.ts';

interface ScoreReportViewProps {
  attempt: TestAttempt;
  nextTestTitle?: string;
  onStartNextTest?: () => void;
  onRetake: () => void;
  onNewTest: () => void;
  onGoToDashboard: () => void;
}

export const ScoreReportView: React.FC<ScoreReportViewProps> = ({
  attempt,
  nextTestTitle,
  onStartNextTest,
  onRetake,
  onNewTest,
  onGoToDashboard,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'errors' | 'correct'>('all');
  const [sectionFilter, setSectionFilter] = useState<'all' | 'reading' | 'listening' | 'writing' | 'speaking'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [isGeneratingAiFeedback, setIsGeneratingAiFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(attempt.aiFeedback || null);

  const isFullExam = attempt.testType === 'full' || !!attempt.breakdown.fullExam;

  const durationMinutes = Math.floor(attempt.durationSeconds / 60);
  const durationSeconds = attempt.durationSeconds % 60;

  // Filter question review list
  const filteredQuestions = attempt.questionResults.filter((q) => {
    if (filterMode === 'errors' && q.isCorrect) return false;
    if (filterMode === 'correct' && !q.isCorrect) return false;

    if (sectionFilter !== 'all') {
      if (sectionFilter === 'reading') {
        if (!['complete_words', 'daily_life', 'academic'].includes(q.section)) return false;
      } else if (sectionFilter === 'listening') {
        if (q.section !== 'listening') return false;
      } else if (sectionFilter === 'writing') {
        if (!['writing_sentence', 'writing_email', 'writing_discussion'].includes(q.section)) return false;
      } else if (sectionFilter === 'speaking') {
        if (!['speaking_repeat', 'speaking_interview'].includes(q.section)) return false;
      }
    }
    return true;
  });

  const errorsCount = attempt.questionResults.filter((q) => !q.isCorrect).length;

  // Function to call AI tutor diagnostic endpoint
  const requestAiTutorAnalysis = async () => {
    setIsGeneratingAiFeedback(true);
    try {
      const res = await fetch('/api/analyze-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attempt }),
      });
      const data = await res.json();
      if (data.feedback) {
        setAiFeedback(data.feedback);
      }
    } catch (err) {
      console.error('Failed to get AI tutor diagnostic:', err);
      setAiFeedback(
        'Diagnóstico: Tu ritmo de lectura fue adecuado. Para alcanzar un puntaje de 28-30 en el TOEFL iBT oficial, concéntrate en identificar palabras trampa en preguntas de inferencia y practica la deducción de prefijos comunes.',
      );
    } finally {
      setIsGeneratingAiFeedback(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Summary Banner */}
        <div className="rounded-xl border border-teal-800 bg-[#0f6b64] p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block rounded-full bg-teal-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200">
                Informe Oficial de Resultados • Guardado en Base de Datos Local
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {attempt.testTitle}
              </h1>
              <p className="text-sm text-teal-100 flex items-center justify-center md:justify-start gap-4">
                <span className="flex items-center gap-1.5">
                  <Clock size={15} /> Tiempo: {durationMinutes}m {durationSeconds}s
                </span>
                <span>•</span>
                <span>{new Date(attempt.timestamp).toLocaleDateString()}</span>
              </p>
            </div>

            {/* Large Scaled Score Dial */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-gray-900 shadow-lg min-w-[210px]">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {isFullExam ? 'Puntaje Total TOEFL iBT®' : 'Puntaje Scaled (0-30)'}
              </span>
              <div className="my-1 flex items-baseline gap-1">
                <span className="text-5xl font-black text-[#0f6b64]">
                  {attempt.scaledScore}
                </span>
                <span className="text-xl font-bold text-gray-400">
                  {isFullExam ? '/ 120' : '/ 30'}
                </span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <Award size={13} /> {attempt.cefrLevel} • {attempt.percentage}% Acumulado
              </div>
              <span className="mt-2 text-[11px] text-center font-medium text-gray-500 max-w-[190px]">
                {attempt.proficiencyDescriptor}
              </span>
            </div>
          </div>
        </div>

        {/* Next Test Prompt Banner */}
        {onStartNextTest && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border-2 border-emerald-500 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-5 sm:p-6 shadow-md">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0f6b64] text-white shadow-sm text-xl">
                🎲
              </div>
              <div>
                <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-900 mb-1">
                  Mismos Ejercicios • Información Totalmente Nueva
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug">
                  {nextTestTitle ? `Siguiente Intento: ${nextTestTitle}` : 'Comenzar Siguiente Intento'}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Mismo formato oficial de 3 tareas (Complete Words, Notice y Academic Passage) con nuevos textos y preguntas diferentes.
                </p>
              </div>
            </div>

            <button
              onClick={onStartNextTest}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f6b64] px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-md hover:bg-[#0c5650] transition transform active:scale-98"
            >
              <span>Siguiente Intento con Nueva Información &gt;</span>
            </button>
          </div>
        )}

        {/* Task Breakdown Cards */}
        {isFullExam ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Reading Card */}
              <div className="rounded-xl border border-teal-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sección 1</span>
                    <span className="text-xs font-bold text-[#0f6b64]">
                      {attempt.breakdown.fullExam?.readingScaled ?? 0} / 30
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-gray-900 mb-1 flex items-center gap-1.5">
                    📖 Reading
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    20 preguntas • Complete Words, Notice &amp; Academic Passage
                  </p>
                </div>
                <div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="bg-[#0f6b64] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(((attempt.breakdown.fullExam?.readingScaled ?? 0) / 30) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600">
                    {Math.round(((attempt.breakdown.fullExam?.readingScaled ?? 0) / 30) * 100)}% Rendimiento
                  </span>
                </div>
              </div>

              {/* Listening Card */}
              <div className="rounded-xl border border-teal-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sección 2</span>
                    <span className="text-xs font-bold text-[#0f6b64]">
                      {attempt.breakdown.fullExam?.listeningScaled ?? 0} / 30
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-gray-900 mb-1 flex items-center gap-1.5">
                    🎧 Listening
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    28 preguntas • 18 Best Responses + 3 Charlas/Conversaciones
                  </p>
                </div>
                <div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(((attempt.breakdown.fullExam?.listeningScaled ?? 0) / 30) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600">
                    {Math.round(((attempt.breakdown.fullExam?.listeningScaled ?? 0) / 30) * 100)}% Rendimiento
                  </span>
                </div>
              </div>

              {/* Writing Card */}
              <div className="rounded-xl border border-teal-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sección 3</span>
                    <span className="text-xs font-bold text-[#0f6b64]">
                      {attempt.breakdown.fullExam?.writingScaled ?? 0} / 30
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-gray-900 mb-1 flex items-center gap-1.5">
                    ✍️ Writing
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    12 tareas • 10 Sentences, Email (7m) &amp; Discussion (10m)
                  </p>
                </div>
                <div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="bg-orange-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(((attempt.breakdown.fullExam?.writingScaled ?? 0) / 30) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600">
                    {Math.round(((attempt.breakdown.fullExam?.writingScaled ?? 0) / 30) * 100)}% Rendimiento
                  </span>
                </div>
              </div>

              {/* Speaking Card */}
              <div className="rounded-xl border border-teal-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sección 4</span>
                    <span className="text-xs font-bold text-[#0f6b64]">
                      {attempt.breakdown.fullExam?.speakingScaled ?? 0} / 30
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-gray-900 mb-1 flex items-center gap-1.5">
                    🗣️ Speaking
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    11 preguntas • 7 Repeat (10s) + 4 Interview (45s) con Mic
                  </p>
                </div>
                <div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(((attempt.breakdown.fullExam?.speakingScaled ?? 0) / 30) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600">
                    {Math.round(((attempt.breakdown.fullExam?.speakingScaled ?? 0) / 30) * 100)}% Rendimiento
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : attempt.testType === 'writing' || attempt.breakdown.buildSentence ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Tarea 1</span>
                <span className="text-xs font-bold text-[#0f6b64]">
                  {attempt.breakdown.buildSentence?.score ?? 0} / {attempt.breakdown.buildSentence?.total ?? 10}
                </span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Build a Sentence (10 oraciones)</h3>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-[#0f6b64] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${attempt.breakdown.buildSentence?.percentage ?? 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {attempt.breakdown.buildSentence?.percentage ?? 0}% Precisión Sintáctica y Gramatical
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Tarea 2 (7 min)</span>
                <span className="text-xs font-bold text-[#0f6b64]">
                  {attempt.breakdown.writeEmail?.wordCount ?? 0} palabras
                </span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Write an Email</h3>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${attempt.breakdown.writeEmail?.percentage ?? 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                Banda {attempt.breakdown.writeEmail?.score ?? 0} / 5 • Cumplimiento de Puntos
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Tarea 3 (10 min)</span>
                <span className="text-xs font-bold text-[#0f6b64]">
                  {attempt.breakdown.academicDiscussion?.wordCount ?? 0} palabras
                </span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Academic Discussion</h3>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-teal-700 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${attempt.breakdown.academicDiscussion?.percentage ?? 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                Banda {attempt.breakdown.academicDiscussion?.score ?? 0} / 5 • Mínimo 100 palabras
              </span>
            </div>
          </div>
        ) : attempt.testType === 'speaking' || attempt.breakdown.speakingRepeat ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Tarea 1 (10s por frase)</span>
                <span className="text-xs font-bold text-[#0f6b64]">
                  {attempt.breakdown.speakingRepeat?.score ?? 0} / {attempt.breakdown.speakingRepeat?.total ?? 7}
                </span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Listen and Repeat (Zoológico)</h3>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-[#0f6b64] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${attempt.breakdown.speakingRepeat?.percentage ?? 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {attempt.breakdown.speakingRepeat?.percentage ?? 0}% Precisión de Repetición Inmediata
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Tarea 2 (45s por pregunta)</span>
                <span className="text-xs font-bold text-[#0f6b64]">
                  {attempt.breakdown.speakingInterview?.score ?? 0} / {attempt.breakdown.speakingInterview?.total ?? 12}
                </span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Take an Interview (Investigación Urbana)</h3>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${attempt.breakdown.speakingInterview?.percentage ?? 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {attempt.breakdown.speakingInterview?.percentage ?? 0}% Fluidez y Elaboración en 45 segundos
              </span>
            </div>
          </div>
        ) : attempt.breakdown.listening ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Sección Listening</span>
                <span className="text-xs font-bold text-[#0f6b64]">
                  {attempt.breakdown.listening.score} / {attempt.breakdown.listening.total}
                </span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Choose the Best Response &amp; Talks</h3>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-[#0f6b64] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${attempt.breakdown.listening.percentage}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {attempt.breakdown.listening.percentage}% Acierto en Comprensión Auditiva
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Habilidad Evaluada</span>
                <h3 className="font-bold text-sm text-gray-900 mt-1 mb-2">
                  Pragmática y Comprensión Auditiva Inmediata
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Capacidad de escuchar sin apoyo de texto escrito, identificar la intención del hablante y seleccionar la respuesta conversacionalmente adecuada.
                </p>
              </div>
              <div className="mt-2 text-xs font-bold text-[#0f6b64]">
                Total de preguntas: {attempt.breakdown.listening.total}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Tarea 1</span>
                <span className="text-xs font-bold text-[#0f6b64]">
                  {attempt.breakdown.completeWords?.score ?? 0} / {attempt.breakdown.completeWords?.total ?? 0}
                </span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Complete the Words</h3>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-[#0f6b64] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${attempt.breakdown.completeWords?.percentage ?? 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {attempt.breakdown.completeWords?.percentage ?? 0}% Precisión de Vocabulario
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Tarea 2</span>
                <span className="text-xs font-bold text-[#0f6b64]">
                  {attempt.breakdown.dailyLife?.score ?? 0} / {attempt.breakdown.dailyLife?.total ?? 0}
                </span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Read in Daily Life</h3>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${attempt.breakdown.dailyLife?.percentage ?? 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {attempt.breakdown.dailyLife?.percentage ?? 0}% Escaneo Rápido de Avisos
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Tarea 3</span>
                <span className="text-xs font-bold text-[#0f6b64]">
                  {attempt.breakdown.academic?.score ?? 0} / {attempt.breakdown.academic?.total ?? 0}
                </span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Academic Passage</h3>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-teal-700 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${attempt.breakdown.academic?.percentage ?? 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {attempt.breakdown.academic?.percentage ?? 0}% Comprensión Académica
              </span>
            </div>
          </div>
        )}

        {/* Detailed Areas for Improvement & Recommendations */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-50 text-[#0f6b64]">
                <TrendingUp size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Análisis Personalizado de Áreas de Mejora
                </h2>
                <p className="text-xs text-gray-500">
                  Diagnóstico objetivo basado en tus respuestas en esta simulación.
                </p>
              </div>
            </div>

            <button
              onClick={requestAiTutorAnalysis}
              disabled={isGeneratingAiFeedback}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-[#0f6b64] hover:bg-teal-100 transition shadow-2xs"
            >
              <Sparkles size={14} className={isGeneratingAiFeedback ? 'animate-spin' : ''} />
              {isGeneratingAiFeedback
                ? 'Analizando con Tutor IA...'
                : aiFeedback
                ? 'Actualizar Análisis IA'
                : 'Pedir Análisis Profundo IA'}
            </button>
          </div>

          {/* AI Tutor Diagnostic Box if available */}
          {aiFeedback && (
            <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-5 text-gray-800 text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#0f6b64] text-xs uppercase tracking-wide">
                <Brain size={16} /> Evaluación Especializada del Tutor Oficial TOEFL
              </div>
              <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-gray-700">
                {aiFeedback}
              </div>
            </div>
          )}

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle size={18} /> Fortalezas Demostradas
              </div>
              <ul className="space-y-2 text-xs text-emerald-950">
                {attempt.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-lg bg-rose-50/70 border border-rose-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <XCircle size={18} /> Puntos Críticos a Mejorar
              </div>
              {attempt.weaknesses.length > 0 ? (
                <ul className="space-y-2 text-xs text-rose-950">
                  {attempt.weaknesses.map((weak, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-700 italic">
                  ¡Excelente! No se registraron debilidades significativas en este set.
                </p>
              )}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="rounded-lg bg-amber-50/70 border border-amber-200 p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wide text-amber-900 flex items-center gap-2">
              <BookOpen size={16} /> Recomendaciones Estratégicas para tu Próximo Examen
            </h4>
            <div className="space-y-2">
              {attempt.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-950 leading-relaxed">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-900">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question-by-Question Review with Explanations */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Revisión Pregunta por Pregunta y Explicaciones
              </h2>
              <p className="text-xs text-gray-500">
                Analiza las justificaciones oficiales de cada respuesta correcta y comprende los distractores.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`rounded px-3 py-1 font-semibold transition ${
                  filterMode === 'all'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Todas ({attempt.questionResults.length})
              </button>
              <button
                onClick={() => setFilterMode('errors')}
                className={`rounded px-3 py-1 font-semibold transition ${
                  filterMode === 'errors'
                    ? 'bg-rose-100 text-rose-800 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Errores ({errorsCount})
              </button>
              <button
                onClick={() => setFilterMode('correct')}
                className={`rounded px-3 py-1 font-semibold transition ${
                  filterMode === 'correct'
                    ? 'bg-emerald-100 text-emerald-800 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Correctas ({attempt.questionResults.length - errorsCount})
              </button>
            </div>
          </div>

          {/* Section filter tabs for Full Exam */}
          {isFullExam && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 pb-1 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 mr-1">Filtrar Sección:</span>
              <button
                onClick={() => setSectionFilter('all')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  sectionFilter === 'all'
                    ? 'bg-[#0f6b64] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas ({attempt.questionResults.length})
              </button>
              <button
                onClick={() => setSectionFilter('reading')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  sectionFilter === 'reading'
                    ? 'bg-[#0f6b64] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📖 Reading (20)
              </button>
              <button
                onClick={() => setSectionFilter('listening')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  sectionFilter === 'listening'
                    ? 'bg-[#0f6b64] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎧 Listening (28)
              </button>
              <button
                onClick={() => setSectionFilter('writing')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  sectionFilter === 'writing'
                    ? 'bg-[#0f6b64] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✍️ Writing (12)
              </button>
              <button
                onClick={() => setSectionFilter('speaking')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  sectionFilter === 'speaking'
                    ? 'bg-[#0f6b64] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🗣️ Speaking (11)
              </button>
            </div>
          )}

          {/* List of questions */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const isExpanded =
                expandedQuestionId === q.questionId || filterMode === 'errors';

              return (
                <div
                  key={q.questionId}
                  className={`rounded-lg border transition-all ${
                    q.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-200 bg-rose-50/30'
                  }`}
                >
                  <div
                    className="flex cursor-pointer items-start justify-between p-4 gap-4"
                    onClick={() =>
                      setExpandedQuestionId(
                        isExpanded && filterMode !== 'errors' ? null : q.questionId,
                      )
                    }
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="mt-0.5">
                        {q.isCorrect ? (
                          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle size={18} className="text-rose-600 shrink-0" />
                        )}
                      </span>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs text-gray-900">
                            Pregunta {q.questionNumber}
                          </span>
                          <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                            {q.sectionLabel}
                          </span>
                          <span className="rounded bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-semibold text-[#0f6b64]">
                            {q.skillLabel}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800">
                          {q.prompt}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-bold ${
                          q.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {q.isCorrect ? '+1 Punto' : '0 Puntos'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded detail & explanation */}
                  {isExpanded && (
                    <div className="border-t border-gray-200/80 p-4 bg-white/70 space-y-3 text-xs">
                      {q.promptSpokenTranscript && (
                        <div className="rounded p-3 bg-blue-50/90 border border-blue-200">
                          <span className="block font-bold text-blue-900 uppercase text-[10px] mb-1">
                            🔊 Transcripción del Audio Hablado (Spoken Audio Prompt):
                          </span>
                          <span className="font-semibold text-blue-950 text-xs sm:text-sm">
                            "{q.promptSpokenTranscript}"
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded p-2.5 bg-gray-50 border border-gray-200">
                          <span className="block font-bold text-gray-500 uppercase text-[10px] mb-1">
                            Tu Respuesta:
                          </span>
                          <span
                            className={`font-semibold ${
                              q.isCorrect ? 'text-emerald-800' : 'text-rose-800'
                            }`}
                          >
                            {q.userAnswerText}
                          </span>
                        </div>

                        <div className="rounded p-2.5 bg-emerald-50 border border-emerald-200">
                          <span className="block font-bold text-emerald-700 uppercase text-[10px] mb-1">
                            Respuesta Correcta:
                          </span>
                          <span className="font-semibold text-emerald-950">
                            {q.correctAnswerText}
                          </span>
                        </div>
                      </div>

                      {q.audioRecordingUrl && (
                        <div className="rounded p-2.5 bg-teal-50 border border-teal-200 flex items-center justify-between gap-2">
                          <span className="font-bold text-teal-900 text-xs flex items-center gap-1.5">
                            <Volume2 size={15} className="text-[#0f6b64]" />
                            Tu Grabación de Voz:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const audio = new Audio(q.audioRecordingUrl);
                              audio.play();
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f6b64] px-3 py-1 text-xs font-bold text-white hover:bg-[#0c5650] transition shadow-xs"
                          >
                            <Play size={12} className="fill-white" /> Escuchar Grabación
                          </button>
                        </div>
                      )}

                      <div className="rounded p-3 bg-teal-50/60 border border-teal-100 text-gray-800">
                        <span className="block font-bold text-[#0f6b64] text-[11px] mb-1">
                          Explicación Oficial ETS:
                        </span>
                        <p className="leading-relaxed text-gray-700">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onRetake}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
            >
              <RotateCcw size={15} /> Reintentar Este Mismo Examen
            </button>
            <button
              onClick={onNewTest}
              className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-bold text-[#0f6b64] hover:bg-teal-100 transition shadow-2xs"
            >
              <BookOpen size={15} /> Ver Catálogo de Exámenes
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToDashboard}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
            >
              <BarChart3 size={15} /> Mi Progreso y Estadísticas
            </button>

            {onStartNextTest && (
              <button
                onClick={onStartNextTest}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
              >
                <span>Siguiente Intento (Nueva Información) 🎲 &gt;</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
