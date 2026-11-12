/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { HeaderNav } from './components/HeaderNav.tsx';
import { CompleteTheWordsView } from './components/CompleteTheWordsView.tsx';
import { DailyLifeView } from './components/DailyLifeView.tsx';
import { AcademicPassageView } from './components/AcademicPassageView.tsx';
import { ListeningResponseView } from './components/ListeningResponseView.tsx';
import { ListeningPassageView } from './components/ListeningPassageView.tsx';
import { ReviewModal } from './components/ReviewModal.tsx';
import { ScoreReportView } from './components/ScoreReportView.tsx';
import { ProgressTrackingView } from './components/ProgressTrackingView.tsx';
import { WritingIntroView } from './components/WritingIntroView.tsx';
import { WritingBuildSentenceView } from './components/WritingBuildSentenceView.tsx';
import { WritingEmailView } from './components/WritingEmailView.tsx';
import { WritingAcademicDiscussionView } from './components/WritingAcademicDiscussionView.tsx';
import { SpeakingIntroView } from './components/SpeakingIntroView.tsx';
import { SpeakingListenRepeatView } from './components/SpeakingListenRepeatView.tsx';
import { SpeakingInterviewView } from './components/SpeakingInterviewView.tsx';
import { MicrophoneCheckModal } from './components/MicrophoneCheckModal.tsx';
import { OfficialPdfModal } from './components/OfficialPdfModal.tsx';
import { OFFICIAL_PREBUILT_TESTS } from './data/tests.ts';
import { OFFICIAL_LISTENING_TESTS } from './data/listeningTests.ts';
import { OFFICIAL_WRITING_TESTS } from './data/writingTests.ts';
import { OFFICIAL_SPEAKING_TESTS } from './data/speakingTests.ts';
import {
  TestAttempt,
  ToeflTest,
  ListeningTest,
  ListeningQuestion,
  ListeningPassage,
  WritingTest,
  SpeakingTest,
  UserStats,
} from './types/toefl.ts';
import {
  evaluateAttempt,
  evaluateListeningAttempt,
  evaluateWritingAttempt,
  evaluateSpeakingAttempt,
  evaluateFullExamAttempt,
} from './utils/scoring.ts';
import {
  getAttempts,
  getCustomTests,
  getUserStats,
  saveAttempt,
  saveCustomTest,
} from './utils/storage.ts';
import { getNextUnrepeatedTest } from './utils/testRotation.ts';

type AppView = 'dashboard' | 'test' | 'report';
type TestMode = 'reading' | 'listening' | 'writing' | 'speaking';

export type ListeningScreenItem =
  | {
      type: 'part2_intro';
      title: string;
      subtitle: string;
      description1: string;
      description2: string;
    }
  | {
      type: 'passage';
      passage: ListeningPassage;
      passageIndex: number;
      totalPassages: number;
    }
  | {
      type: 'question';
      question: ListeningQuestion;
      questionIndex: number;
      totalQuestions: number;
      passage?: ListeningPassage;
    };

export function buildListeningScreens(test: ListeningTest): ListeningScreenItem[] {
  const screens: ListeningScreenItem[] = [];

  // Part 1 only (Choose the Best Response 1-18)
  if (!test.partType || test.partType === 'part1_responses') {
    test.questions.forEach((q, idx) => {
      screens.push({
        type: 'question',
        question: q,
        questionIndex: idx,
        totalQuestions: test.questions.length,
      });
    });
    return screens;
  }

  // Part 2 only (Conversation, Announcement, and Academic Talk)
  if (test.partType === 'part2_passages') {
    screens.push({
      type: 'part2_intro',
      title: 'Listening',
      subtitle: 'Conversation, Announcement, and Academic Talk',
      description1: 'You will listen only one time and then answer questions.',
      description2: 'In an actual test, the clock will indicate how much time you have to answer.',
    });

    let qGlobalIdx = 0;
    (test.passages || []).forEach((passage, pIdx) => {
      screens.push({
        type: 'passage',
        passage,
        passageIndex: pIdx,
        totalPassages: test.passages?.length || 1,
      });

      passage.questions.forEach((q) => {
        screens.push({
          type: 'question',
          question: q,
          questionIndex: qGlobalIdx++,
          totalQuestions: test.totalQuestions,
          passage,
        });
      });
    });
    return screens;
  }

  // Full Exam (Part 1 + Part 2)
  if (test.partType === 'full_exam') {
    const part1Questions = test.questions.slice(0, 18);
    part1Questions.forEach((q, idx) => {
      screens.push({
        type: 'question',
        question: q,
        questionIndex: idx,
        totalQuestions: test.totalQuestions,
      });
    });

    screens.push({
      type: 'part2_intro',
      title: 'Listening',
      subtitle: 'Conversation, Announcement, and Academic Talk',
      description1: 'You will listen only one time and then answer questions.',
      description2: 'In an actual test, the clock will indicate how much time you have to answer.',
    });

    let qGlobalIdx = 18;
    (test.passages || []).forEach((passage, pIdx) => {
      screens.push({
        type: 'passage',
        passage,
        passageIndex: pIdx,
        totalPassages: test.passages?.length || 1,
      });

      passage.questions.forEach((q) => {
        screens.push({
          type: 'question',
          question: {
            ...q,
            questionNumber: qGlobalIdx + 1,
          },
          questionIndex: qGlobalIdx++,
          totalQuestions: test.totalQuestions,
          passage,
        });
      });
    });
    return screens;
  }

  return screens;
}

export default function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [testMode, setTestMode] = useState<TestMode>('reading');
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [customTests, setCustomTests] = useState<ToeflTest[]>([]);
  const [activeTest, setActiveTest] = useState<ToeflTest>(OFFICIAL_PREBUILT_TESTS[0]);
  const [activeListeningTest, setActiveListeningTest] = useState<ListeningTest>(OFFICIAL_LISTENING_TESTS[0]);
  const [activeAttempt, setActiveAttempt] = useState<TestAttempt | null>(null);
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'catalog' | 'history'>('overview');

  // Active Test State (Reading)
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [userAnswersCW, setUserAnswersCW] = useState<Record<string, string>>({});
  const [userAnswersMCQ, setUserAnswersMCQ] = useState<Record<string, number>>({});

  // Active Test State (Listening)
  const [listeningScreenIndex, setListeningScreenIndex] = useState(0);
  const [userAnswersListening, setUserAnswersListening] = useState<Record<string, number>>({});
  const [audioVolume, setAudioVolume] = useState(85);

  const listeningScreens = useMemo(() => {
    return buildListeningScreens(activeListeningTest);
  }, [activeListeningTest]);

  // Active Test State (Writing)
  const [activeWritingTest, setActiveWritingTest] = useState<WritingTest>(OFFICIAL_WRITING_TESTS[0]);
  const [writingScreenIndex, setWritingScreenIndex] = useState(0);
  const [userSentenceSlots, setUserSentenceSlots] = useState<Record<string, string[]>>({});
  const [userEmailText, setUserEmailText] = useState('');
  const [userDiscussionText, setUserDiscussionText] = useState('');

  // Active Test State (Speaking)
  const [activeSpeakingTest, setActiveSpeakingTest] = useState<SpeakingTest>(OFFICIAL_SPEAKING_TESTS[0]);
  const [speakingScreenIndex, setSpeakingScreenIndex] = useState(0);
  const [speakingRepeatTranscripts, setSpeakingRepeatTranscripts] = useState<Record<string, string>>({});
  const [speakingInterviewTranscripts, setSpeakingInterviewTranscripts] = useState<Record<string, string>>({});
  const [speakingRepeatAudioUrls, setSpeakingRepeatAudioUrls] = useState<Record<string, string>>({});
  const [speakingInterviewAudioUrls, setSpeakingInterviewAudioUrls] = useState<Record<string, string>>({});
  const [markedScreens, setMarkedScreens] = useState<Record<number, boolean>>({});
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(18 * 60); // 18 minutes official timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [testStartTime, setTestStartTime] = useState(0);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isMicCheckModalOpen, setIsMicCheckModalOpen] = useState(false);

  // Full Exam Simulation Mode State (Reading + Listening + Writing + Speaking -> 120 pts)
  const [isFullExamMode, setIsFullExamMode] = useState(false);
  const [fullExamCurrentSection, setFullExamCurrentSection] = useState<'reading' | 'listening' | 'writing' | 'speaking'>('reading');
  const [showSectionTransition, setShowSectionTransition] = useState(false);
  const [transitionCompletedSection, setTransitionCompletedSection] = useState<'reading' | 'listening' | 'writing'>('reading');
  const [fullExamStartTime, setFullExamStartTime] = useState(0);

  const timerRef = useRef<any>(null);

  // Load persistent data from local storage on mount
  const refreshStorageData = () => {
    const loadedAttempts = getAttempts();
    setAttempts(loadedAttempts);
    setStats(getUserStats());
    setCustomTests(getCustomTests());
  };

  useEffect(() => {
    refreshStorageData();
  }, []);

  // Timer interval handling
  useEffect(() => {
    if (view === 'test' && isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, isTimerRunning]);

  const allAvailableTests = [...OFFICIAL_PREBUILT_TESTS, ...customTests];

  // Support both single dailyLifeNotice and multi-notice array (e.g. Municipal Charter + Sofia Baker)
  const activeDailyLifeNotices = useMemo(() => {
    return activeTest.dailyLifeNotices && activeTest.dailyLifeNotices.length > 0
      ? activeTest.dailyLifeNotices
      : [activeTest.dailyLifeNotice];
  }, [activeTest]);

  const activeDailyLifeQuestions = useMemo(() => {
    return activeDailyLifeNotices.flatMap((n) => n.questions);
  }, [activeDailyLifeNotices]);

  // Helper to map global daily life question index to notice & internal index
  const getDailyLifeNoticeItem = (qIdx: number) => {
    let accumulated = 0;
    for (const notice of activeDailyLifeNotices) {
      if (qIdx < accumulated + notice.questions.length) {
        const questionIdxInNotice = qIdx - accumulated;
        return {
          notice,
          question: notice.questions[questionIdxInNotice],
          questionIndex: questionIdxInNotice,
          totalNoticeQuestions: notice.questions.length,
        };
      }
      accumulated += notice.questions.length;
    }
    const fallbackNotice = activeDailyLifeNotices[0];
    return {
      notice: fallbackNotice,
      question: fallbackNotice.questions[0],
      questionIndex: 0,
      totalNoticeQuestions: fallbackNotice.questions.length,
    };
  };

  const totalScreens =
    1 + // Intro
    1 + // Complete the Words
    activeDailyLifeQuestions.length +
    activeTest.academicPassage.questions.length;

  const totalQuestionsCount =
    activeTest.completeWords.passageTextSegments.filter((s) => s.type === 'word').length +
    activeDailyLifeQuestions.length +
    activeTest.academicPassage.questions.length;

  // Start test simulation (Reading)
  const handleStartTest = (testToStart: ToeflTest) => {
    setIsFullExamMode(false);
    setShowSectionTransition(false);
    setTestMode('reading');
    setActiveTest(testToStart);
    setCurrentScreenIndex(0);
    setUserAnswersCW({});
    setUserAnswersMCQ({});
    setMarkedScreens({});
    setTimerSeconds(testToStart.estimatedMinutes * 60);
    setIsTimerRunning(true);
    setTestStartTime(Date.now());
    setView('test');
  };

  // Start test simulation (Listening)
  const handleStartListeningTest = (testToStart: ListeningTest) => {
    setIsFullExamMode(false);
    setShowSectionTransition(false);
    setTestMode('listening');
    setActiveListeningTest(testToStart);
    setListeningScreenIndex(0);
    setUserAnswersListening({});
    setMarkedScreens({});
    setTimerSeconds(testToStart.estimatedMinutes * 60);
    setIsTimerRunning(true);
    setTestStartTime(Date.now());
    setView('test');
  };

  // Start test simulation (Writing)
  const handleStartWritingTest = (testToStart: WritingTest = OFFICIAL_WRITING_TESTS[0]) => {
    setIsFullExamMode(false);
    setShowSectionTransition(false);
    setTestMode('writing');
    setActiveWritingTest(testToStart);
    setWritingScreenIndex(0);
    setUserSentenceSlots({});
    setUserEmailText('');
    setUserDiscussionText('');
    setMarkedScreens({});
    setTimerSeconds(testToStart.estimatedMinutes * 60);
    setIsTimerRunning(true);
    setTestStartTime(Date.now());
    setView('test');
  };

  // Start test simulation (Speaking)
  const handleStartSpeakingTest = (testToStart: SpeakingTest = OFFICIAL_SPEAKING_TESTS[0]) => {
    setIsFullExamMode(false);
    setShowSectionTransition(false);
    setTestMode('speaking');
    setActiveSpeakingTest(testToStart);
    setSpeakingScreenIndex(0);
    setSpeakingRepeatTranscripts({});
    setSpeakingInterviewTranscripts({});
    setSpeakingRepeatAudioUrls({});
    setSpeakingInterviewAudioUrls({});
    setMarkedScreens({});
    setTimerSeconds(testToStart.estimatedMinutes * 60);
    setIsTimerRunning(true);
    setTestStartTime(Date.now());
    setView('test');
    // Open mic check automatically on first speaking launch
    setIsMicCheckModalOpen(true);
  };

  // Start Unified Full-Length TOEFL iBT Exam Simulation (120 pts)
  const handleStartFullExam = () => {
    setIsFullExamMode(true);
    setFullExamCurrentSection('reading');
    setShowSectionTransition(false);
    setFullExamStartTime(Date.now());

    // 1. Reset Reading state
    setActiveTest(OFFICIAL_PREBUILT_TESTS[0]);
    setCurrentScreenIndex(0);
    setUserAnswersCW({});
    setUserAnswersMCQ({});

    // 2. Reset Listening state (Full 28-question test)
    const fullListening = OFFICIAL_LISTENING_TESTS[2] || OFFICIAL_LISTENING_TESTS[0];
    setActiveListeningTest(fullListening);
    setListeningScreenIndex(0);
    setUserAnswersListening({});

    // 3. Reset Writing state (10 Build Sentence + Email + Discussion)
    setActiveWritingTest(OFFICIAL_WRITING_TESTS[0]);
    setWritingScreenIndex(0);
    setUserSentenceSlots({});
    setUserEmailText('');
    setUserDiscussionText('');

    // 4. Reset Speaking state (7 Repeat 10s + 4 Interview 45s)
    setActiveSpeakingTest(OFFICIAL_SPEAKING_TESTS[0]);
    setSpeakingScreenIndex(0);
    setSpeakingRepeatTranscripts({});
    setSpeakingInterviewTranscripts({});
    setSpeakingRepeatAudioUrls({});
    setSpeakingInterviewAudioUrls({});

    setMarkedScreens({});
    setTestMode('reading');
    setTimerSeconds(18 * 60); // 18m Reading timer
    setIsTimerRunning(true);
    setTestStartTime(Date.now());
    setView('test');
  };

  const handleCompleteReadingSectionInFullExam = () => {
    setIsTimerRunning(false);
    setTransitionCompletedSection('reading');
    setShowSectionTransition(true);
  };

  const handleProceedToListeningInFullExam = () => {
    setShowSectionTransition(false);
    setFullExamCurrentSection('listening');
    setTestMode('listening');
    const fullListening = OFFICIAL_LISTENING_TESTS[2] || OFFICIAL_LISTENING_TESTS[0];
    setActiveListeningTest(fullListening);
    setListeningScreenIndex(0);
    setTimerSeconds(fullListening.estimatedMinutes * 60);
    setIsTimerRunning(true);
    setTestStartTime(Date.now());
  };

  const handleCompleteListeningSectionInFullExam = () => {
    setIsTimerRunning(false);
    setTransitionCompletedSection('listening');
    setShowSectionTransition(true);
  };

  const handleProceedToWritingInFullExam = () => {
    setShowSectionTransition(false);
    setFullExamCurrentSection('writing');
    setTestMode('writing');
    setActiveWritingTest(OFFICIAL_WRITING_TESTS[0]);
    setWritingScreenIndex(0);
    setTimerSeconds(OFFICIAL_WRITING_TESTS[0].estimatedMinutes * 60);
    setIsTimerRunning(true);
    setTestStartTime(Date.now());
  };

  const handleCompleteWritingSectionInFullExam = () => {
    setIsTimerRunning(false);
    setTransitionCompletedSection('writing');
    setShowSectionTransition(true);
  };

  const handleProceedToSpeakingInFullExam = () => {
    setShowSectionTransition(false);
    setFullExamCurrentSection('speaking');
    setTestMode('speaking');
    setActiveSpeakingTest(OFFICIAL_SPEAKING_TESTS[0]);
    setSpeakingScreenIndex(0);
    setTimerSeconds(OFFICIAL_SPEAKING_TESTS[0].estimatedMinutes * 60);
    setIsTimerRunning(true);
    setTestStartTime(Date.now());
    setIsMicCheckModalOpen(true);
  };

  const handleSubmitFullExam = () => {
    setIsTimerRunning(false);
    const totalElapsed = Math.max(
      30,
      Math.round((Date.now() - (fullExamStartTime || testStartTime)) / 1000),
    );

    const fullAttempt = evaluateFullExamAttempt(
      activeTest,
      userAnswersCW,
      userAnswersMCQ,
      activeListeningTest,
      userAnswersListening,
      activeWritingTest,
      userSentenceSlots,
      userEmailText,
      userDiscussionText,
      activeSpeakingTest,
      speakingRepeatTranscripts,
      speakingInterviewTranscripts,
      totalElapsed,
      speakingRepeatAudioUrls,
      speakingInterviewAudioUrls,
    );

    saveAttempt(fullAttempt);
    refreshStorageData();
    setActiveAttempt(fullAttempt);
    setIsFullExamMode(false);
    setShowSectionTransition(false);
    setView('report');
  };

  // Start a fresh new attempt with different unrepeated information
  const handleStartDynamicNewTest = () => {
    const pastIds = attempts.map((a) => a.testId);
    const nextDiffTest = getNextUnrepeatedTest(
      activeTest.id,
      allAvailableTests,
      pastIds,
    );
    handleStartTest(nextDiffTest);
  };

  // Change current test info directly if user wants a different topic immediately
  const handleChangeCurrentTestInfo = () => {
    if (
      confirm(
        '¿Deseas cambiar a un nuevo texto e información diferente para este intento? Se reiniciarán las respuestas actuales.',
      )
    ) {
      handleStartDynamicNewTest();
    }
  };

  // Submit listening test
  const handleSubmitListeningTest = () => {
    if (isFullExamMode) {
      handleCompleteListeningSectionInFullExam();
      return;
    }

    setIsTimerRunning(false);
    const elapsedSeconds = Math.max(
      15,
      Math.round((Date.now() - testStartTime) / 1000),
    );

    const calculatedAttempt = evaluateListeningAttempt(
      activeListeningTest,
      userAnswersListening,
      elapsedSeconds,
    );

    saveAttempt(calculatedAttempt);
    refreshStorageData();
    setActiveAttempt(calculatedAttempt);
    setView('report');
  };

  // Submit writing test
  const handleSubmitWritingTest = () => {
    if (isFullExamMode) {
      handleCompleteWritingSectionInFullExam();
      return;
    }

    setIsTimerRunning(false);
    const elapsedSeconds = Math.max(
      15,
      Math.round((Date.now() - testStartTime) / 1000),
    );

    const calculatedAttempt = evaluateWritingAttempt(
      activeWritingTest,
      userSentenceSlots,
      userEmailText,
      userDiscussionText,
      elapsedSeconds,
    );

    saveAttempt(calculatedAttempt);
    refreshStorageData();
    setActiveAttempt(calculatedAttempt);
    setView('report');
  };

  // Submit speaking test
  const handleSubmitSpeakingTest = () => {
    if (isFullExamMode) {
      handleSubmitFullExam();
      return;
    }

    setIsTimerRunning(false);
    const elapsedSeconds = Math.max(
      15,
      Math.round((Date.now() - testStartTime) / 1000),
    );

    const calculatedAttempt = evaluateSpeakingAttempt(
      activeSpeakingTest,
      speakingRepeatTranscripts,
      speakingInterviewTranscripts,
      elapsedSeconds,
      speakingRepeatAudioUrls,
      speakingInterviewAudioUrls,
    );

    saveAttempt(calculatedAttempt);
    refreshStorageData();
    setActiveAttempt(calculatedAttempt);
    setView('report');
  };

  // Submit test and calculate final scores & diagnostic report
  const handleSubmitTest = () => {
    if (isFullExamMode) {
      if (testMode === 'reading') {
        handleCompleteReadingSectionInFullExam();
        return;
      }
      if (testMode === 'listening') {
        handleCompleteListeningSectionInFullExam();
        return;
      }
      if (testMode === 'writing') {
        handleCompleteWritingSectionInFullExam();
        return;
      }
      if (testMode === 'speaking') {
        handleSubmitFullExam();
        return;
      }
    }
    if (testMode === 'listening') {
      handleSubmitListeningTest();
      return;
    }
    if (testMode === 'writing') {
      handleSubmitWritingTest();
      return;
    }
    if (testMode === 'speaking') {
      handleSubmitSpeakingTest();
      return;
    }

    setIsTimerRunning(false);
    const elapsedSeconds = Math.max(
      15,
      Math.round((Date.now() - testStartTime) / 1000),
    );

    const calculatedAttempt = evaluateAttempt(
      activeTest,
      userAnswersCW,
      userAnswersMCQ,
      elapsedSeconds,
    );

    // Persist to local database
    saveAttempt(calculatedAttempt);
    refreshStorageData();

    setActiveAttempt(calculatedAttempt);
    setView('report');
  };

  // Handle letter slot input
  const handleCWChange = (slotId: string, char: string) => {
    setUserAnswersCW((prev) => ({
      ...prev,
      [slotId]: char,
    }));
  };

  // Handle MCQ radio option selection
  const handleMCQSelect = (questionId: string, optionIndex: number) => {
    setUserAnswersMCQ((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Generate new test using server-side Gemini API or intelligent procedural generator
  const handleGenerateTestWithAi = async (topic: string) => {
    setIsGeneratingTest(true);
    try {
      const response = await fetch('/api/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (data.success && data.test) {
        saveCustomTest(data.test);
        refreshStorageData();
        handleStartTest(data.test);
        return;
      }
      throw new Error(data.error || 'Generación no disponible');
    } catch (err: any) {
      console.warn('API error, falling back to smart dynamic generator:', err);
      // Fallback: Pick or adapt one of our curated sets
      const baseIndex = Math.floor(Math.random() * OFFICIAL_PREBUILT_TESTS.length);
      const base = OFFICIAL_PREBUILT_TESTS[baseIndex];
      const newCustom: ToeflTest = {
        ...base,
        id: `ai_test_${Date.now()}`,
        title: `Práctica Especial: ${topic}`,
        category: topic,
        isAiGenerated: true,
      };
      saveCustomTest(newCustom);
      refreshStorageData();
      handleStartTest(newCustom);
    } finally {
      setIsGeneratingTest(false);
    }
  };

  // Prepare review questions list for Review Modal
  const reviewQuestionsList = () => {
    if (testMode === 'writing') {
      const list: Array<{
        screenIndex: number;
        questionNumber: number;
        title: string;
        section: string;
        isAnswered: boolean;
        isMarked: boolean;
      }> = [];

      activeWritingTest.buildSentenceQuestions.forEach((q, idx) => {
        const slots = userSentenceSlots[q.id] || [];
        const isAnswered = slots.length === q.speaker2.totalSlots;
        list.push({
          screenIndex: idx + 1,
          questionNumber: idx + 1,
          title: `Build a Sentence (${slots.length}/${q.speaker2.totalSlots} palabras)`,
          section: 'Build a Sentence',
          isAnswered,
          isMarked: !!markedScreens[idx + 1],
        });
      });

      // Email
      const emailWords = userEmailText.trim() ? userEmailText.trim().split(/\s+/).length : 0;
      list.push({
        screenIndex: 12,
        questionNumber: 11,
        title: `Write an Email (${emailWords} palabras)`,
        section: 'Write an Email',
        isAnswered: emailWords >= 20,
        isMarked: !!markedScreens[12],
      });

      // Academic Discussion
      const discWords = userDiscussionText.trim() ? userDiscussionText.trim().split(/\s+/).length : 0;
      list.push({
        screenIndex: 13,
        questionNumber: 12,
        title: `Academic Discussion (${discWords} palabras)`,
        section: 'Academic Discussion',
        isAnswered: discWords >= 100,
        isMarked: !!markedScreens[13],
      });

      return list;
    }

    if (testMode === 'speaking') {
      const list: Array<{
        screenIndex: number;
        questionNumber: number;
        title: string;
        section: string;
        isAnswered: boolean;
        isMarked: boolean;
      }> = [];

      activeSpeakingTest.repeatQuestions.forEach((q, idx) => {
        const t = speakingRepeatTranscripts[q.id];
        list.push({
          screenIndex: idx + 2,
          questionNumber: idx + 1,
          title: `Listen and Repeat #${idx + 1} (10s)`,
          section: 'Listen and Repeat',
          isAnswered: !!t && t.length > 0,
          isMarked: !!markedScreens[idx + 2],
        });
      });

      activeSpeakingTest.interviewQuestions.forEach((q, idx) => {
        const t = speakingInterviewTranscripts[q.id];
        list.push({
          screenIndex: idx + 11,
          questionNumber: 7 + idx + 1,
          title: `Take an Interview #${idx + 1} (45s)`,
          section: 'Take an Interview',
          isAnswered: !!t && t.length > 0,
          isMarked: !!markedScreens[idx + 11],
        });
      });

      return list;
    }

    if (testMode === 'listening') {
      const list: Array<{
        screenIndex: number;
        questionNumber: number;
        title: string;
        section: string;
        isAnswered: boolean;
        isMarked: boolean;
      }> = [];

      listeningScreens.forEach((scr, scrIdx) => {
        if (scr.type === 'question') {
          list.push({
            screenIndex: scrIdx,
            questionNumber: scr.question.questionNumber || scr.questionIndex + 1,
            title:
              scr.question.questionText ||
              `Pregunta de Audio #${scr.question.questionNumber || scr.questionIndex + 1}`,
            section: scr.question.passageId
              ? 'Conversaciones y Charlas'
              : 'Choose the Best Response',
            isAnswered: userAnswersListening[scr.question.id] !== undefined,
            isMarked: !!markedScreens[scrIdx],
          });
        }
      });
      return list;
    }

    const list: Array<{
      screenIndex: number;
      questionNumber: number;
      title: string;
      section: string;
      isAnswered: boolean;
      isMarked: boolean;
    }> = [];

    let qCounter = 1;

    // 1. Complete the words
    const cwItems = activeTest.completeWords.passageTextSegments.filter(
      (s) => s.type === 'word',
    );
    cwItems.forEach((seg: any) => {
      let isAnswered = true;
      for (let i = 0; i < seg.item.length; i++) {
        if (!userAnswersCW[`${seg.item.id}-${i}`]) {
          isAnswered = false;
          break;
        }
      }
      list.push({
        screenIndex: 1,
        questionNumber: qCounter++,
        title: `Complete: "${seg.item.prefix}..."`,
        section: 'Complete the Words',
        isAnswered,
        isMarked: !!markedScreens[1],
      });
    });

    // 2. Daily Life questions
    let dailyScreenOffset = 2;
    activeDailyLifeNotices.forEach((notice) => {
      notice.questions.forEach((q) => {
        const screenIdx = dailyScreenOffset++;
        list.push({
          screenIndex: screenIdx,
          questionNumber: qCounter++,
          title: q.question,
          section:
            notice.format === 'email'
              ? 'Read an Email'
              : notice.format === 'social_media_post'
              ? 'Social Media Post'
              : 'Read in Daily Life',
          isAnswered: userAnswersMCQ[q.id] !== undefined,
          isMarked: !!markedScreens[screenIdx],
        });
      });
    });

    // 3. Academic questions
    const acadScreenStart = 2 + activeDailyLifeQuestions.length;
    activeTest.academicPassage.questions.forEach((q, idx) => {
      const screenIdx = acadScreenStart + idx;
      list.push({
        screenIndex: screenIdx,
        questionNumber: qCounter++,
        title: q.question,
        section: 'Academic Passage',
        isAnswered: userAnswersMCQ[q.id] !== undefined,
        isMarked: !!markedScreens[screenIdx],
      });
    });

    return list;
  };

  // Determine question indicator in Sub-Nav
  const getQuestionIndicator = () => {
    if (testMode === 'writing') {
      if (writingScreenIndex === 0) return 'Writing Section Intro';
      if (writingScreenIndex >= 1 && writingScreenIndex <= 10) {
        return `Question ${writingScreenIndex} of 12`;
      }
      if (writingScreenIndex === 11) return 'Task 2 Intro (Email)';
      if (writingScreenIndex === 12) return 'Question 11 of 12 (Write an Email)';
      return 'Question 12 of 12 (Academic Discussion)';
    }

    if (testMode === 'speaking') {
      if (speakingScreenIndex === 0) return 'Speaking Section Intro';
      if (speakingScreenIndex === 1) return 'Listen and Repeat Intro';
      if (speakingScreenIndex >= 2 && speakingScreenIndex <= 8) {
        const qNum = speakingScreenIndex - 1; // 1 to 7
        return `Question ${qNum} of 11 (Listen and Repeat - 10s)`;
      }
      if (speakingScreenIndex === 9 || speakingScreenIndex === 10) {
        return 'Take an Interview Intro';
      }
      const qNum = 7 + (speakingScreenIndex - 10); // 8 to 11
      return `Question ${qNum} of 11 (Take an Interview - 45s)`;
    }

    if (testMode === 'listening') {
      const scr = listeningScreens[listeningScreenIndex] || listeningScreens[0];
      if (!scr) return 'Listening Section';
      if (scr.type === 'part2_intro') return 'Listening • Introduction';
      if (scr.type === 'passage') return `Listen (${scr.passageIndex + 1} of ${scr.totalPassages})`;
      return `Question ${scr.question.questionNumber || scr.questionIndex + 1} of ${activeListeningTest.totalQuestions}`;
    }

    if (currentScreenIndex === 0) return 'Reading Section Intro';
    if (currentScreenIndex === 1) {
      const cwCount = activeTest.completeWords.passageTextSegments.filter(
        (s) => s.type === 'word',
      ).length;
      return `Questions 1-${cwCount} of ${totalQuestionsCount}`;
    }

    const dailyStart = 2;
    const dailyEnd = 1 + activeDailyLifeQuestions.length;
    if (currentScreenIndex >= dailyStart && currentScreenIndex <= dailyEnd) {
      const cwCount = activeTest.completeWords.passageTextSegments.filter(
        (s) => s.type === 'word',
      ).length;
      const questionNum = cwCount + (currentScreenIndex - dailyStart) + 1;
      return `Question ${questionNum} of ${totalQuestionsCount}`;
    }

    // Academic questions
    const acadStart = dailyEnd + 1;
    const cwCount = activeTest.completeWords.passageTextSegments.filter(
      (s) => s.type === 'word',
    ).length;
    const dailyCount = activeDailyLifeQuestions.length;
    const questionNum = cwCount + dailyCount + (currentScreenIndex - acadStart) + 1;
    return `Question ${questionNum} of ${totalQuestionsCount}`;
  };

  // Render active screen content
  const renderCurrentScreen = () => {
    // Full Exam Mode: Inter-Section Transition Screen
    if (isFullExamMode && showSectionTransition) {
      if (transitionCompletedSection === 'reading') {
        return (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6 sm:p-14 flex flex-col justify-between min-h-0 select-none">
            <div className="mx-auto max-w-3xl w-full text-left pt-6">
              <div className="mb-6 border-b border-gray-200 pb-4">
                <span className="inline-block rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                  ✅ Sección Completada con Éxito (1 de 4)
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Reading Section Finalizada
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Has completado las 20 preguntas de lectura (Complete the Words, Daily Life Notices y Academic Passage).
                </p>
              </div>

              <div className="rounded-2xl border-2 border-teal-600 bg-white p-6 shadow-md space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-800 text-2xl">
                    🎧
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Siguiente Sección Oficial (2 de 4)
                    </span>
                    <h2 className="text-xl font-black text-gray-900">
                      Listening Section (28 preguntas)
                    </h2>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2 text-xs sm:text-sm text-gray-700">
                  <p>
                    • <strong>Parte 1 (Preguntas 1-18):</strong> Choose the Best Response. Escucharás una frase o pregunta hablada con voz real y deberás seleccionar la respuesta conversacionalmente más adecuada. (La pregunta solo se escucha, no aparece escrita).
                  </p>
                  <p>
                    • <strong>Parte 2 (Preguntas 19-28):</strong> Conversación en campus, anuncio en la sala de estudiantes y conferencia académica sobre restauración psicológica y naturaleza.
                  </p>
                  <p className="text-amber-800 bg-amber-50 rounded-lg p-2.5 font-medium border border-amber-200">
                    ℹ️ <strong>Importante:</strong> Solo escucharás cada audio una sola vez antes de responder a las preguntas correspondientes.
                  </p>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-3xl w-full border-t border-gray-200 pt-6 mt-8 pb-4 flex items-center justify-end">
              <button
                onClick={handleProceedToListeningInFullExam}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f6b64] px-8 py-4 text-sm font-black text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
              >
                <span>Comenzar Sección Listening &gt;</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );
      }

      if (transitionCompletedSection === 'listening') {
        return (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6 sm:p-14 flex flex-col justify-between min-h-0 select-none">
            <div className="mx-auto max-w-3xl w-full text-left pt-6">
              <div className="mb-6 border-b border-gray-200 pb-4">
                <span className="inline-block rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                  ✅ Sección Completada con Éxito (2 de 4)
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Listening Section Finalizada
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Has completado las 28 preguntas de comprensión auditiva oficial.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-orange-500 bg-white p-6 shadow-md space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-800 text-2xl">
                    ✍️
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                      Siguiente Sección Oficial (3 de 4)
                    </span>
                    <h2 className="text-xl font-black text-gray-900">
                      Writing Section (12 tareas)
                    </h2>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2 text-xs sm:text-sm text-gray-700">
                  <p>
                    • <strong>Tarea 1 (Preguntas 1-10):</strong> Build a Sentence. Ordena y coloca las palabras en los espacios vacíos para formar oraciones gramaticalmente correctas en un diálogo.
                  </p>
                  <p>
                    • <strong>Tarea 2 (7 minutos):</strong> Write an Email. Redacta un correo electrónico formal respondiendo a los 3 requerimientos del escenario propuesto.
                  </p>
                  <p>
                    • <strong>Tarea 3 (10 minutos):</strong> Academic Discussion. Escribe una publicación de al menos 100 palabras aportando tu postura y argumentos en el foro del profesor.
                  </p>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-3xl w-full border-t border-gray-200 pt-6 mt-8 pb-4 flex items-center justify-end">
              <button
                onClick={handleProceedToWritingInFullExam}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f6b64] px-8 py-4 text-sm font-black text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
              >
                <span>Comenzar Sección Writing &gt;</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );
      }

      if (transitionCompletedSection === 'writing') {
        return (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6 sm:p-14 flex flex-col justify-between min-h-0 select-none">
            <div className="mx-auto max-w-3xl w-full text-left pt-6">
              <div className="mb-6 border-b border-gray-200 pb-4">
                <span className="inline-block rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                  ✅ Sección Completada con Éxito (3 de 4)
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Writing Section Finalizada
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Has completado las 12 tareas escritas (oraciones, email formal y debate académico).
                </p>
              </div>

              <div className="rounded-2xl border-2 border-purple-500 bg-white p-6 shadow-md space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-800 text-2xl">
                    🗣️
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                      Última Sección Oficial (4 de 4)
                    </span>
                    <h2 className="text-xl font-black text-gray-900">
                      Speaking Section (11 preguntas con Micrófono)
                    </h2>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2 text-xs sm:text-sm text-gray-700">
                  <p>
                    • <strong>Tarea 1 (Preguntas 1-7):</strong> Listen and Repeat. Escucharás una oración sobre el mapa del zoológico y tendrás estrictamente <strong>10 segundos</strong> para repetirla al sonar el tono.
                  </p>
                  <p>
                    • <strong>Tarea 2 (Preguntas 8-11):</strong> Take an Interview. Responderás oralmente a 4 preguntas de la entrevistadora teniendo <strong>45 segundos</strong> para elaborar tu respuesta.
                  </p>
                  <p className="text-purple-900 bg-purple-50 rounded-lg p-2.5 font-medium border border-purple-200">
                    🎙️ <strong>Grabación de Voz Real:</strong> El micrófono se activará automáticamente con un conteo regresivo de 3 segundos y tono audible de inicio.
                  </p>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-3xl w-full border-t border-gray-200 pt-6 mt-8 pb-4 flex items-center justify-between">
              <button
                onClick={() => setIsMicCheckModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-4 py-2.5 text-xs font-bold text-purple-800 hover:bg-purple-100 transition shadow-2xs"
              >
                <span>🎙️ Calibrar Micrófono Ahora</span>
              </button>

              <button
                onClick={handleProceedToSpeakingInFullExam}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f6b64] px-8 py-4 text-sm font-black text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
              >
                <span>Comenzar Sección Speaking &gt;</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );
      }
    }

    // Listening Section Mode
    if (testMode === 'listening') {
      const scr = listeningScreens[listeningScreenIndex] || listeningScreens[0];

      // Screen Type 1: Part 2 Introduction Screen (Exact reproduction of image_297b7661.png)
      if (scr.type === 'part2_intro') {
        return (
          <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-14 flex flex-col justify-between min-h-0 select-none">
            <div className="mx-auto max-w-3xl w-full text-left pt-6">
              <div className="mb-6 border-b border-gray-200 pb-3">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
                  {scr.title}
                </h1>
              </div>

              <h2 className="mb-8 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {scr.subtitle}
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-gray-800 leading-relaxed font-normal">
                <p>{scr.description1}</p>
                <p>{scr.description2}</p>
              </div>
            </div>

            <div className="mx-auto max-w-4xl w-full border-t border-gray-200 pt-6 mt-12 pb-4 flex items-center justify-end">
              <button
                onClick={() => {
                  if (listeningScreenIndex < listeningScreens.length - 1) {
                    setListeningScreenIndex(listeningScreenIndex + 1);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-7 py-3 text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
              >
                <span>Continuar (Next)</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );
      }

      // Screen Type 2: Passage Audio Screen (image_76650074, image_a97afac3, image_06040636, image_f23ea9c4)
      if (scr.type === 'passage') {
        return (
          <ListeningPassageView
            passage={scr.passage}
            passageIndex={scr.passageIndex}
            totalPassages={scr.totalPassages}
            volume={audioVolume}
            onProceedToQuestions={() => {
              if (listeningScreenIndex < listeningScreens.length - 1) {
                setListeningScreenIndex(listeningScreenIndex + 1);
              }
            }}
            onBack={
              listeningScreenIndex > 0
                ? () => setListeningScreenIndex(listeningScreenIndex - 1)
                : undefined
            }
          />
        );
      }

      // Screen Type 3: Question Screen (Part 1 or Part 2 question)
      return (
        <ListeningResponseView
          question={scr.question}
          questionIndex={scr.questionIndex}
          totalQuestions={activeListeningTest.totalQuestions}
          userAnswer={userAnswersListening[scr.question.id]}
          volume={audioVolume}
          onSelectAnswer={(optIdx) => {
            setUserAnswersListening((prev) => ({
              ...prev,
              [scr.question.id]: optIdx,
            }));
          }}
          onNext={() => {
            if (listeningScreenIndex < listeningScreens.length - 1) {
              setListeningScreenIndex(listeningScreenIndex + 1);
            } else {
              handleSubmitListeningTest();
            }
          }}
          onBack={() => {
            if (listeningScreenIndex > 0) {
              setListeningScreenIndex(listeningScreenIndex - 1);
            }
          }}
        />
      );
    }

    // Writing Section Mode
    if (testMode === 'writing') {
      // Screen 0: Writing Section Intro (table of 3 tasks matching image_8a6ac56f.png)
      if (writingScreenIndex === 0) {
        return (
          <WritingIntroView
            type="section_intro"
            onNext={() => setWritingScreenIndex(1)}
          />
        );
      }

      // Screen 1..10: Build a Sentence (10 Questions matching image_3da97e6b.png etc.)
      if (writingScreenIndex >= 1 && writingScreenIndex <= 10) {
        const qIdx = writingScreenIndex - 1;
        const q = activeWritingTest.buildSentenceQuestions[qIdx];
        const currentSlots = userSentenceSlots[q.id] || [];

        return (
          <WritingBuildSentenceView
            key={q.id}
            question={q}
            questionIndex={qIdx}
            totalQuestions={10}
            userSlots={currentSlots}
            onUpdateSlots={(slots: string[]) => {
              setUserSentenceSlots((prev) => ({
                ...prev,
                [q.id]: slots,
              }));
            }}
            onNext={() => {
              setWritingScreenIndex(writingScreenIndex + 1);
            }}
            onBack={() => {
              setWritingScreenIndex(writingScreenIndex - 1);
            }}
          />
        );
      }

      // Screen 11: Task 2 Write an Email Intro (7 minutes matching image_1c165021.png)
      if (writingScreenIndex === 11) {
        return (
          <WritingIntroView
            type="email_intro"
            onNext={() => setWritingScreenIndex(12)}
          />
        );
      }

      // Screen 12: Write an Email (matching image_1647676f.png)
      if (writingScreenIndex === 12) {
        return (
          <WritingEmailView
            task={activeWritingTest.emailTask}
            userResponse={userEmailText}
            onChangeResponse={setUserEmailText}
          />
        );
      }

      // Screen 13: Write for an Academic Discussion (matching image_21be855e.png)
      return (
        <WritingAcademicDiscussionView
          task={activeWritingTest.academicDiscussionTask}
          userResponse={userDiscussionText}
          onChangeResponse={setUserDiscussionText}
        />
      );
    }

    // Speaking Section Mode
    if (testMode === 'speaking') {
      // Screen 0: Speaking Section Intro (matching image_33e325dd.png)
      if (speakingScreenIndex === 0) {
        return (
          <SpeakingIntroView
            type="section_intro"
            onNext={() => setSpeakingScreenIndex(1)}
            onOpenMicrophoneCheck={() => setIsMicCheckModalOpen(true)}
          />
        );
      }

      // Screen 1: Listen and Repeat Task Intro (matching image_9d3cb7fe.png)
      if (speakingScreenIndex === 1) {
        return (
          <SpeakingIntroView
            type="repeat_intro"
            onNext={() => setSpeakingScreenIndex(2)}
          />
        );
      }

      // Screen 2..8: Listen and Repeat (7 Questions, strictly 10s response time matching image_951297cd.png)
      if (speakingScreenIndex >= 2 && speakingScreenIndex <= 8) {
        const repeatIdx = speakingScreenIndex - 2;
        const q = activeSpeakingTest.repeatQuestions[repeatIdx];

        return (
          <SpeakingListenRepeatView
            key={q.id}
            question={q}
            questionIndex={repeatIdx}
            totalRepeatQuestions={7}
            volume={audioVolume}
            onFinishResponse={(t: string, _audioBlob?: Blob, audioUrl?: string) => {
              setSpeakingRepeatTranscripts((prev) => ({
                ...prev,
                [q.id]: t,
              }));
              if (audioUrl) {
                setSpeakingRepeatAudioUrls((prev) => ({
                  ...prev,
                  [q.id]: audioUrl,
                }));
              }
            }}
            onNext={() => {
              setSpeakingScreenIndex(speakingScreenIndex + 1);
            }}
            onBack={
              speakingScreenIndex > 2
                ? () => setSpeakingScreenIndex(speakingScreenIndex - 1)
                : undefined
            }
          />
        );
      }

      // Screen 9: Task 2 Take an Interview Task Intro (matching image_84abadac.png)
      if (speakingScreenIndex === 9) {
        return (
          <SpeakingIntroView
            type="interview_task_intro"
            onNext={() => setSpeakingScreenIndex(10)}
          />
        );
      }

      // Screen 10: Interview Scenario Topic Intro (matching image_d58b64ef.png)
      if (speakingScreenIndex === 10) {
        return (
          <SpeakingIntroView
            type="interview_scenario_intro"
            onNext={() => setSpeakingScreenIndex(11)}
          />
        );
      }

      // Screen 11..14: Take an Interview (4 Questions, strictly 45s response time matching image_36efe0fd.png)
      const interviewIdx = speakingScreenIndex - 11;
      const q = activeSpeakingTest.interviewQuestions[interviewIdx];
      const isLast = speakingScreenIndex === 14;

      return (
        <SpeakingInterviewView
          key={q.id}
          question={q}
          questionIndex={interviewIdx}
          totalInterviewQuestions={4}
          volume={audioVolume}
          onFinishResponse={(t: string, _audioBlob?: Blob, audioUrl?: string) => {
            setSpeakingInterviewTranscripts((prev) => ({
              ...prev,
              [q.id]: t,
            }));
            if (audioUrl) {
              setSpeakingInterviewAudioUrls((prev) => ({
                ...prev,
                [q.id]: audioUrl,
              }));
            }
          }}
          onNext={() => {
            if (!isLast) {
              setSpeakingScreenIndex(speakingScreenIndex + 1);
            } else {
              handleSubmitSpeakingTest();
            }
          }}
        />
      );
    }

    // Screen 0: Section Intro (Reading)
    if (currentScreenIndex === 0) {
      return (
        <div className="flex-1 overflow-y-auto bg-white p-6 sm:p-12 md:p-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 border-b border-gray-300 pb-3 text-2xl font-bold text-gray-700 tracking-tight">
              Reading Section
            </h1>
            <p className="mb-6 text-sm sm:text-base leading-relaxed text-gray-800">
              In an actual test, you will answer 35-48 reading questions to demonstrate how well you understand academic and non-academic texts in English. In this sampler, you will complete only one task per task type. There are three types of tasks in the reading section of the test.
            </p>

            <table className="mb-8 w-full border border-black text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#33d6b0] text-black">
                  <th className="w-1/3 border border-black p-2.5 text-left font-bold">
                    Type of Task
                  </th>
                  <th className="border border-black p-2.5 text-left font-bold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black text-gray-900">
                <tr>
                  <td className="border border-black p-2.5 font-semibold">
                    Complete the Words
                  </td>
                  <td className="border border-black p-2.5">
                    Fill in the missing letters in a paragraph.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2.5 font-semibold">
                    Read in Daily Life
                  </td>
                  <td className="border border-black p-2.5">
                    Answer questions about everyday reading material.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2.5 font-semibold">
                    Read an Academic Passage
                  </td>
                  <td className="border border-black p-2.5">
                    Answer questions about academic passages.
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-4 text-xs text-teal-900 mb-8">
              <strong>Instrucción para el alumno:</strong> Haz clic en el botón <em>Next &gt;</em> en la esquina superior derecha de la barra para iniciar el examen cronometrado.
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentScreenIndex(1)}
                className="rounded-full bg-[#0f6b64] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0c5650] transition"
              >
                Comenzar Sección de Lectura &gt;
              </button>
            </div>
          </div>
        </div>
      );
    }

    const handleNext = () => {
      if (currentScreenIndex < totalScreens - 1) {
        setCurrentScreenIndex(currentScreenIndex + 1);
      } else {
        handleSubmitTest();
      }
    };

    const handleBack = () => {
      if (currentScreenIndex > 0) {
        setCurrentScreenIndex(currentScreenIndex - 1);
      }
    };

    // Screen 1: Complete the Words
    if (currentScreenIndex === 1) {
      return (
        <CompleteTheWordsView
          section={activeTest.completeWords}
          userAnswers={userAnswersCW}
          onChangeAnswer={handleCWChange}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    }

    // Screen 2..N: Daily Life Notice questions
    const dailyStart = 2;
    const dailyEnd = 1 + activeDailyLifeQuestions.length;
    if (currentScreenIndex >= dailyStart && currentScreenIndex <= dailyEnd) {
      const qIndex = currentScreenIndex - dailyStart;
      const { notice, question, questionIndex, totalNoticeQuestions } =
        getDailyLifeNoticeItem(qIndex);

      return (
        <DailyLifeView
          key={question.id}
          notice={notice}
          question={question}
          questionIndex={questionIndex}
          totalNoticeQuestions={totalNoticeQuestions}
          userAnswer={userAnswersMCQ[question.id]}
          onSelectAnswer={(optIdx) => handleMCQSelect(question.id, optIdx)}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    }

    // Academic Passage questions
    const acadStart = dailyEnd + 1;
    const qIndex = currentScreenIndex - acadStart;
    const acadQuestions = activeTest.academicPassage?.questions || [];
    const question = acadQuestions[qIndex];

    if (question) {
      const isLastQuestion = currentScreenIndex === totalScreens - 1;
      return (
        <AcademicPassageView
          key={question.id}
          passage={activeTest.academicPassage}
          question={question}
          questionIndex={qIndex}
          totalAcademicQuestions={acadQuestions.length}
          isLastQuestion={isLastQuestion}
          userAnswer={userAnswersMCQ[question.id]}
          onSelectAnswer={(optIdx) => handleMCQSelect(question.id, optIdx)}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    }

    // Safety fallback: If currentScreenIndex reached the end, allow finishing directly
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Examen de Lectura Completado</h3>
        <p className="text-sm text-gray-600 mb-6">Has llegado al final de las preguntas de esta sección.</p>
        <button
          onClick={handleSubmitTest}
          className="rounded-lg bg-[#0f6b64] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0c5650] transition"
        >
          Finalizar y Enviar Examen
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#bbbbbb] font-sans">
      {/* 1. PROGRESS TRACKING DASHBOARD VIEW */}
      {view === 'dashboard' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Dashboard Header Bar */}
          <header className="toefl-top-nav flex items-center justify-between px-6 py-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex h-6 items-center justify-center rounded bg-white px-2 text-xs font-black text-[#0f6b64]">
                ETS
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-white">
                TOEFL iBT® Official Practice &amp; Analytics
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="toefl-btn text-xs font-bold py-1.5 px-3 shadow-sm bg-indigo-800 text-white hover:bg-indigo-700 flex items-center gap-1.5"
                title="Abrir PDF Oficial ETS Practice Test 1 (35 páginas)"
              >
                📄 PDF Oficial ETS
              </button>
              <button
                onClick={() => handleStartWritingTest(OFFICIAL_WRITING_TESTS[0])}
                className="toefl-btn text-xs font-bold py-1.5 px-3 shadow-sm bg-orange-700 text-white hover:bg-orange-600"
                title="Iniciar Sección Writing: Build a Sentence, Email & Academic Discussion"
              >
                ✍️ Writing &gt;
              </button>
              <button
                onClick={() => handleStartSpeakingTest(OFFICIAL_SPEAKING_TESTS[0])}
                className="toefl-btn text-xs font-bold py-1.5 px-3 shadow-sm bg-amber-700 text-white hover:bg-amber-600"
                title="Iniciar Sección Speaking: Listen & Repeat (10s) y Take an Interview (45s)"
              >
                🗣️ Speaking &gt;
              </button>
              <button
                onClick={() => handleStartListeningTest(OFFICIAL_LISTENING_TESTS[1])}
                className="toefl-btn text-xs font-bold py-1.5 px-3 shadow-sm bg-teal-800 text-white hover:bg-teal-700"
                title="Iniciar Parte 2: Conversaciones, Anuncio y Conferencia Académica (10 preguntas)"
              >
                🎧 Listening &gt;
              </button>
              <button
                onClick={() => setDashboardTab('catalog')}
                className="toefl-btn text-xs font-bold py-1.5 px-3 shadow-sm bg-[#0c5650] text-white hover:bg-[#093f3b]"
                title="Ver catálogo completo de todas las secciones"
              >
                📋 Catálogo &gt;
              </button>
              <button
                onClick={handleStartDynamicNewTest}
                className="toefl-btn text-xs font-bold py-1.5 px-3 shadow-sm"
                title="Iniciar prueba de lectura con textos diferentes"
              >
                🎲 Lectura &gt;
              </button>
            </div>
          </header>

          <ProgressTrackingView
            stats={stats}
            attempts={attempts}
            availableTests={allAvailableTests}
            availableListeningTests={OFFICIAL_LISTENING_TESTS}
            availableWritingTests={OFFICIAL_WRITING_TESTS}
            availableSpeakingTests={OFFICIAL_SPEAKING_TESTS}
            initialTab={dashboardTab}
            onStartTest={handleStartTest}
            onStartListeningTest={handleStartListeningTest}
            onStartWritingTest={handleStartWritingTest}
            onStartSpeakingTest={handleStartSpeakingTest}
            onStartDynamicTest={handleStartDynamicNewTest}
            onViewAttemptReport={(attempt) => {
              setActiveAttempt(attempt);
              setView('report');
            }}
            onGenerateTestWithAi={handleGenerateTestWithAi}
            isGeneratingTest={isGeneratingTest}
            onRefreshData={refreshStorageData}
          />
        </div>
      )}

      {/* 2. TOEFL iBT TEST SIMULATOR VIEW */}
      {view === 'test' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <HeaderNav
            testTitle={
              testMode === 'listening'
                ? activeListeningTest.title
                : testMode === 'writing'
                ? activeWritingTest.title
                : testMode === 'speaking'
                ? activeSpeakingTest.title
                : activeTest.title
            }
            sectionName={
              testMode === 'listening'
                ? 'Listening'
                : testMode === 'writing'
                ? 'Writing'
                : testMode === 'speaking'
                ? 'Speaking'
                : 'Reading'
            }
            questionIndicator={getQuestionIndicator()}
            isFirstScreen={
              testMode === 'listening'
                ? listeningScreenIndex === 0
                : testMode === 'writing'
                ? writingScreenIndex === 0
                : testMode === 'speaking'
                ? speakingScreenIndex === 0
                : currentScreenIndex === 0
            }
            isLastScreen={
              testMode === 'listening'
                ? listeningScreenIndex === listeningScreens.length - 1
                : testMode === 'writing'
                ? writingScreenIndex === 13
                : testMode === 'speaking'
                ? speakingScreenIndex === 14
                : currentScreenIndex === totalScreens - 1
            }
            onBack={() => {
              if (testMode === 'listening') {
                if (listeningScreenIndex > 0) {
                  setListeningScreenIndex(listeningScreenIndex - 1);
                }
              } else if (testMode === 'writing') {
                if (writingScreenIndex > 0) {
                  setWritingScreenIndex(writingScreenIndex - 1);
                }
              } else if (testMode === 'speaking') {
                if (speakingScreenIndex > 0) {
                  setSpeakingScreenIndex(speakingScreenIndex - 1);
                }
              } else {
                if (currentScreenIndex > 0) {
                  setCurrentScreenIndex(currentScreenIndex - 1);
                }
              }
            }}
            onNext={() => {
              if (testMode === 'listening') {
                if (listeningScreenIndex < listeningScreens.length - 1) {
                  setListeningScreenIndex(listeningScreenIndex + 1);
                } else {
                  handleSubmitListeningTest();
                }
              } else if (testMode === 'writing') {
                if (writingScreenIndex < 13) {
                  setWritingScreenIndex(writingScreenIndex + 1);
                } else {
                  handleSubmitWritingTest();
                }
              } else if (testMode === 'speaking') {
                if (speakingScreenIndex < 14) {
                  setSpeakingScreenIndex(speakingScreenIndex + 1);
                } else {
                  handleSubmitSpeakingTest();
                }
              } else {
                if (currentScreenIndex < totalScreens - 1) {
                  setCurrentScreenIndex(currentScreenIndex + 1);
                } else {
                  handleSubmitTest();
                }
              }
            }}
            onOpenReview={() => setIsReviewOpen(true)}
            onExit={() => setShowExitConfirm(true)}
            onChangeTestInfo={testMode === 'reading' ? handleChangeCurrentTestInfo : undefined}
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            isCurrentMarked={
              !!markedScreens[
                testMode === 'listening'
                  ? listeningScreenIndex
                  : testMode === 'writing'
                  ? writingScreenIndex
                  : testMode === 'speaking'
                  ? speakingScreenIndex
                  : currentScreenIndex
              ]
            }
            onToggleMarkCurrent={() => {
              const idx =
                testMode === 'listening'
                  ? listeningScreenIndex
                  : testMode === 'writing'
                  ? writingScreenIndex
                  : testMode === 'speaking'
                  ? speakingScreenIndex
                  : currentScreenIndex;
              setMarkedScreens((prev) => ({
                ...prev,
                [idx]: !prev[idx],
              }));
            }}
            showMarkCheckbox={
              testMode === 'listening' ||
              testMode === 'writing' ||
              testMode === 'speaking' ||
              currentScreenIndex > 0
            }
            volume={audioVolume}
            onVolumeChange={setAudioVolume}
            onOpenMicCheck={testMode === 'speaking' ? () => setIsMicCheckModalOpen(true) : undefined}
          />

          {/* Main Question Body */}
          <main className="main-container flex flex-1 flex-col min-h-0 overflow-hidden bg-white relative">
            {renderCurrentScreen()}
          </main>

          {/* Question Review Modal */}
          <ReviewModal
            isOpen={isReviewOpen}
            onClose={() => setIsReviewOpen(false)}
            questions={reviewQuestionsList()}
            onJumpToQuestion={(screenIdx) => {
              if (testMode === 'listening') {
                setListeningScreenIndex(screenIdx);
              } else if (testMode === 'writing') {
                setWritingScreenIndex(screenIdx);
              } else if (testMode === 'speaking') {
                setSpeakingScreenIndex(screenIdx);
              } else {
                setCurrentScreenIndex(screenIdx);
              }
            }}
            onSubmitTest={
              testMode === 'listening'
                ? handleSubmitListeningTest
                : testMode === 'writing'
                ? handleSubmitWritingTest
                : testMode === 'speaking'
                ? handleSubmitSpeakingTest
                : handleSubmitTest
            }
          />

          {/* Exit Confirmation Dialog */}
          {showExitConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl space-y-4">
                <h3 className="text-base font-bold text-gray-900">
                  ¿Deseas salir de la prueba actual?
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Puedes enviar y calificar tus respuestas dadas hasta ahora para guardar tu progreso, o descartar la sesión y volver al menú.
                </p>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Continuar Examen
                  </button>
                  <button
                    onClick={() => {
                      setShowExitConfirm(false);
                      setIsTimerRunning(false);
                      setView('dashboard');
                    }}
                    className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Salir sin Guardar
                  </button>
                  <button
                    onClick={() => {
                      setShowExitConfirm(false);
                      handleSubmitTest();
                    }}
                    className="rounded-lg bg-[#0f6b64] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#0c5650]"
                  >
                    Finalizar y Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. DETAILED SCORE REPORT & DIAGNOSTIC VIEW */}
      {view === 'report' && activeAttempt && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="toefl-top-nav flex items-center justify-between px-6 py-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex h-6 items-center justify-center rounded bg-white px-2 text-xs font-black text-[#0f6b64]">
                ETS
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-white">
                TOEFL iBT® Resultado &amp; Diagnóstico
              </span>
            </div>

            <button
              onClick={() => {
                refreshStorageData();
                setDashboardTab('overview');
                setView('dashboard');
              }}
              className="toefl-btn text-xs font-bold py-1.5 px-4"
            >
              Ir a Mi Progreso &gt;
            </button>
          </header>

          {(() => {
            const pastAttemptIds = attempts.map((a) => a.testId);
            const nextTest = getNextUnrepeatedTest(
              activeAttempt.testId,
              allAvailableTests,
              pastAttemptIds,
            );

            return (
              <ScoreReportView
                attempt={activeAttempt}
                nextTestTitle={nextTest?.title}
                onStartNextTest={() => {
                  if (nextTest) {
                    handleStartTest(nextTest);
                  }
                }}
                onRetake={() => {
                  if (activeAttempt.testType === 'writing') {
                    const wt =
                      OFFICIAL_WRITING_TESTS.find((t) => t.id === activeAttempt.testId) ||
                      OFFICIAL_WRITING_TESTS[0];
                    handleStartWritingTest(wt);
                  } else if (activeAttempt.testType === 'speaking') {
                    const st =
                      OFFICIAL_SPEAKING_TESTS.find((t) => t.id === activeAttempt.testId) ||
                      OFFICIAL_SPEAKING_TESTS[0];
                    handleStartSpeakingTest(st);
                  } else if (activeAttempt.testType === 'listening') {
                    const lt =
                      OFFICIAL_LISTENING_TESTS.find((t) => t.id === activeAttempt.testId) ||
                      OFFICIAL_LISTENING_TESTS[0];
                    handleStartListeningTest(lt);
                  } else {
                    const testToRetake =
                      allAvailableTests.find((t) => t.id === activeAttempt.testId) ||
                      allAvailableTests[0];
                    handleStartTest(testToRetake);
                  }
                }}
                onNewTest={() => {
                  refreshStorageData();
                  setDashboardTab('catalog');
                  setView('dashboard');
                }}
                onGoToDashboard={() => {
                  refreshStorageData();
                  setDashboardTab('overview');
                  setView('dashboard');
                }}
              />
            );
          })()}
        </div>
      )}

      {/* 4. OFFICIAL ETS PRACTICE TEST 1 PDF VIEWER MODAL */}
      <OfficialPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onSelectPracticeModule={(sec) => {
          if (sec === 'reading_mod1') handleStartTest(OFFICIAL_PREBUILT_TESTS[0]);
          else if (sec === 'reading_mod2') handleStartTest(OFFICIAL_PREBUILT_TESTS[1]);
          else if (sec === 'listening_mod1') handleStartListeningTest(OFFICIAL_LISTENING_TESTS[0]);
          else if (sec === 'listening_mod2') handleStartListeningTest(OFFICIAL_LISTENING_TESTS[1]);
          else if (sec === 'writing') handleStartWritingTest(OFFICIAL_WRITING_TESTS[0]);
          else if (sec === 'speaking') handleStartSpeakingTest(OFFICIAL_SPEAKING_TESTS[0]);
        }}
      />

      {/* 5. MICROPHONE PERMISSION & LIVE CALIBRATION MODAL */}
      <MicrophoneCheckModal
        isOpen={isMicCheckModalOpen}
        onClose={() => setIsMicCheckModalOpen(false)}
        onConfirmed={() => setIsMicCheckModalOpen(false)}
      />
    </div>
  );
}
