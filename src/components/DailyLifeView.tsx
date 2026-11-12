/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Camera,
  Search,
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  User,
} from 'lucide-react';
import { DailyLifeNotice, DailyLifeQuestion } from '../types/toefl.ts';

interface DailyLifeViewProps {
  notice: DailyLifeNotice;
  question: DailyLifeQuestion;
  questionIndex: number;
  totalNoticeQuestions: number;
  userAnswer?: number;
  onSelectAnswer: (optionIndex: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DailyLifeView: React.FC<DailyLifeViewProps> = ({
  notice,
  question,
  questionIndex,
  totalNoticeQuestions,
  userAnswer,
  onSelectAnswer,
  onNext,
  onBack,
}) => {
  const letters = ['A', 'B', 'C', 'D'];
  const isSocialMedia = notice.format === 'social_media_post';
  const isEmail = notice.format === 'email';
  const authorName = notice.author || 'Sofia Baker';
  const emailDetails = notice.emailDetails;

  // Header Title based on task type
  let headerTitle = 'Read a notice.';
  if (isEmail) headerTitle = 'Read an email.';
  else if (isSocialMedia) headerTitle = 'Read a social media post.';

  // Parse paragraphs from contentHtml or split by newlines
  const paragraphs = notice.contentHtml
    ? notice.contentHtml
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-8 flex flex-col justify-between min-h-0">
      <div className="mx-auto max-w-6xl w-full">
        {/* Title / Task Type Header */}
        <h2 className="mb-6 text-center text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          {headerTitle}
        </h2>

        {isEmail ? (
          /* ============================================================== */
          /* AUTHENTIC ETS EMAIL CLIENT LAYOUT (Side-by-side)               */
          /* ============================================================== */
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 mb-8">
            {/* Left: Authentic ETS Email Client Window */}
            <div className="w-full max-w-[480px] shrink-0">
              <div
                className="rounded-sm p-3.5 sm:p-4 shadow-md border-2 border-black/40"
                style={{
                  backgroundColor: emailDetails?.borderColor || '#006d63',
                }}
              >
                {/* Email Header Fields: To, From, Date, Subject */}
                <div className="space-y-1.5 mb-2.5 text-xs sm:text-[13px]">
                  {/* To: */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 sm:w-20 bg-white border border-black/80 px-2 py-1 font-bold text-gray-800 text-xs sm:text-[13px] shrink-0">
                      To:
                    </div>
                    <div className="flex-1 bg-white border border-black/80 px-2.5 py-1 font-medium text-gray-950 text-xs sm:text-[13px] truncate">
                      {emailDetails?.to || 'recipient@dmail.com'}
                    </div>
                  </div>

                  {/* From: */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 sm:w-20 bg-white border border-black/80 px-2 py-1 font-bold text-gray-800 text-xs sm:text-[13px] shrink-0">
                      From:
                    </div>
                    <div className="flex-1 bg-white border border-black/80 px-2.5 py-1 font-medium text-gray-950 text-xs sm:text-[13px] truncate">
                      {emailDetails?.from || 'sender@dmail.com'}
                    </div>
                  </div>

                  {/* Date (Optional) */}
                  {emailDetails?.date && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 sm:w-20 bg-white border border-black/80 px-2 py-1 font-bold text-gray-800 text-xs sm:text-[13px] shrink-0">
                        Date:
                      </div>
                      <div className="flex-1 bg-white border border-black/80 px-2.5 py-1 font-medium text-gray-950 text-xs sm:text-[13px] truncate">
                        {emailDetails.date}
                      </div>
                    </div>
                  )}

                  {/* Subject: */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 sm:w-20 bg-white border border-black/80 px-2 py-1 font-bold text-gray-800 text-xs sm:text-[13px] shrink-0">
                      Subject:
                    </div>
                    <div className="flex-1 bg-white border border-black/80 px-2.5 py-1 font-medium text-gray-950 text-xs sm:text-[13px] truncate">
                      {emailDetails?.subject || notice.title}
                    </div>
                  </div>
                </div>

                {/* Email Body Pane */}
                <div className="bg-white border border-black/80 p-4 sm:p-5 min-h-[220px] max-h-[380px] overflow-y-auto text-xs sm:text-[13px] text-gray-900 leading-relaxed font-sans shadow-inner space-y-3">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((para, idx) => (
                      <p key={idx} className="whitespace-pre-line text-gray-950">
                        {para}
                      </p>
                    ))
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: notice.contentHtml,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right: Question & Multiple Choice Options */}
            <div className="w-full flex-1 max-w-lg">
              <div className="rounded-xl border border-gray-200 bg-gray-50/90 p-5 sm:p-7 shadow-xs">
                {/* Meta info */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-gray-500">
                  <span className="font-bold text-gray-700">
                    Email Question • Pregunta {questionIndex + 1} de {totalNoticeQuestions}
                  </span>
                  {userAnswer !== undefined ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px]">
                      <CheckCircle2 size={13} /> Opción {letters[userAnswer]} seleccionada
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold text-[11px]">
                      Selecciona una opción abajo
                    </span>
                  )}
                </div>

                {/* Question Prompt */}
                <h3 className="mb-5 text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  {question.question}
                </h3>

                {/* Options */}
                <div className="space-y-3" role="radiogroup" aria-label={question.question}>
                  {question.options.map((option, idx) => {
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

                        {/* Radio Circle */}
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
                          {option}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : isSocialMedia ? (
          /* ============================================================== */
          /* AUTHENTIC ETS TABLET SOCIAL MEDIA POST LAYOUT (Side-by-side)  */
          /* ============================================================== */
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 mb-8">
            {/* Left: Pixel-Perfect Tablet Device Frame */}
            <div className="w-full max-w-[430px] shrink-0">
              {/* Tablet outer casing */}
              <div className="relative rounded-[32px] bg-[#404040] p-3 shadow-xl border-2 border-[#2b2b2b]">
                {/* Side volume / power buttons simulation on left edge */}
                <div className="absolute -left-[5px] top-24 h-9 w-[3px] rounded-l-sm bg-[#2b2b2b]" />
                <div className="absolute -left-[5px] top-36 h-14 w-[3px] rounded-l-sm bg-[#2b2b2b]" />
                <div className="absolute -left-[5px] top-54 h-14 w-[3px] rounded-l-sm bg-[#2b2b2b]" />

                {/* Tablet screen bezel */}
                <div className="relative rounded-[22px] bg-black p-2 overflow-hidden">
                  {/* Top front camera & sensor notch */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#1a1a1a] ring-1 ring-white/10" />
                  </div>

                  {/* Tablet inner display */}
                  <div className="rounded-[16px] bg-white overflow-hidden flex flex-col text-gray-900 shadow-inner">
                    {/* App Header Bar (Teal) */}
                    <div className="bg-[#0d7a71] text-white px-3 py-2 flex items-center justify-between shadow-xs">
                      {/* Left: Signal bars & camera */}
                      <div className="flex items-center gap-2">
                        {/* 3 signal bars */}
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-0.5 h-1.5 bg-white/80 rounded-xs" />
                          <span className="w-0.5 h-2.5 bg-white/90 rounded-xs" />
                          <span className="w-0.5 h-3 bg-white rounded-xs" />
                        </div>
                        <Camera size={15} className="ml-1 opacity-90" />
                      </div>

                      {/* Center: Search pill */}
                      <div className="flex-1 max-w-[170px] mx-2 h-5 bg-[#095750] rounded-full flex items-center justify-end px-2">
                        <Search size={10} className="text-teal-200" />
                      </div>

                      {/* Right: Message / Chat icon */}
                      <MessageSquare size={15} className="opacity-90" />
                    </div>

                    {/* Social Media Post Body */}
                    <div className="p-4 sm:p-5 flex flex-col gap-3 text-xs sm:text-[13px] leading-relaxed text-gray-800">
                      {/* Author Header */}
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className="h-8 w-8 rounded-full bg-[#e78b68] flex items-center justify-center text-white shrink-0 shadow-2xs">
                          <User size={18} />
                        </div>
                        <div className="font-bold text-gray-950 text-sm">
                          {authorName}
                        </div>
                      </div>

                      {/* Post Content Paragraphs */}
                      <div className="space-y-3 text-justify leading-normal">
                        {paragraphs.length > 0 ? (
                          paragraphs.map((p, idx) => (
                            <p key={idx} className="text-gray-900">
                              {p}
                            </p>
                          ))
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: notice.contentHtml,
                            }}
                          />
                        )}
                      </div>

                      {/* Like & Comment Bar */}
                      <div className="border-t border-gray-200 pt-2.5 mt-2 flex items-center gap-6 text-xs text-gray-500 font-semibold select-none">
                        <div className="flex items-center gap-1.5 hover:text-teal-700 cursor-pointer">
                          <ThumbsUp size={13} />
                          <span>Like</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-teal-700 cursor-pointer">
                          <MessageCircle size={13} />
                          <span>Comment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom speaker port simulation */}
                <div className="mx-auto mt-1 h-1 w-6 rounded-full bg-[#2b2b2b]" />
              </div>
            </div>

            {/* Right: Question & Multiple Choice Options */}
            <div className="w-full flex-1 max-w-lg">
              <div className="rounded-xl border border-gray-200 bg-gray-50/90 p-5 sm:p-7 shadow-xs">
                {/* Meta info */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-gray-500">
                  <span className="font-bold text-gray-700">
                    Social Media Post • Pregunta {questionIndex + 1} de {totalNoticeQuestions}
                  </span>
                  {userAnswer !== undefined ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px]">
                      <CheckCircle2 size={13} /> Opción {letters[userAnswer]} seleccionada
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold text-[11px]">
                      Selecciona una opción abajo
                    </span>
                  )}
                </div>

                {/* Question */}
                <h3 className="mb-5 text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  {question.question}
                </h3>

                {/* Multiple choice options */}
                <div className="space-y-3" role="radiogroup" aria-label={question.question}>
                  {question.options.map((option, idx) => {
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

                        {/* Radio Circle */}
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
                          {option}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* STANDARD NOTICE CARD LAYOUT (Classic Institutional Notice)     */
          /* ============================================================== */
          <div className="mx-auto max-w-3xl w-full">
            {/* Notice Card */}
            <div className="notice-box mb-8 rounded-sm shadow-sm border-2 border-gray-300 bg-white p-6">
              <div className="mb-2 text-lg font-bold text-gray-900 tracking-tight">
                {notice.title}
              </div>
              {notice.subtitle && (
                <div className="mb-4 text-xs sm:text-sm font-semibold text-gray-700">
                  {notice.subtitle}
                </div>
              )}
              <div className="text-xs sm:text-sm leading-relaxed text-gray-800 text-left">
                {notice.contentHtml}
              </div>
            </div>

            {/* Question & Options Card */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-6 sm:p-8 shadow-xs">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-gray-500">
                <span className="font-bold text-gray-700">
                  Lectura Cotidiana • Pregunta {questionIndex + 1} de {totalNoticeQuestions}
                </span>
                {userAnswer !== undefined ? (
                  <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px]">
                    <CheckCircle2 size={13} /> Opción {letters[userAnswer]} seleccionada
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold text-[11px]">
                    Selecciona una de las 4 opciones abajo
                  </span>
                )}
              </div>

              <h3 className="mb-6 text-base sm:text-lg font-bold text-gray-900 leading-snug">
                {question.question}
              </h3>

              {/* Interactive Multiple Choice Options */}
              <div className="space-y-3" role="radiogroup" aria-label={question.question}>
                {question.options.map((option, idx) => {
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
                      className={`group flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 select-none ${
                        isChecked
                          ? 'bg-teal-50/90 border-[#0f6b64] shadow-sm ring-1 ring-[#0f6b64]/30'
                          : 'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50/30'
                      }`}
                    >
                      {/* Letter badge: A, B, C, D */}
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-black mr-3 transition-colors ${
                          isChecked
                            ? 'bg-[#0f6b64] text-white shadow-2xs'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-teal-100 group-hover:text-[#0f6b64]'
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
                          isChecked ? 'text-gray-950 font-semibold' : 'text-gray-800'
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prominent Bottom Action Bar */}
      <div className="mx-auto max-w-4xl w-full border-t border-gray-200 pt-6 mt-8 pb-4 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
        >
          <ChevronLeft size={16} /> Pregunta Anterior
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
        >
          <span>Siguiente Pregunta (Next)</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
