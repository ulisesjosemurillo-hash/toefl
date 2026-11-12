/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TestAttempt, ToeflTest, UserStats } from '../types/toefl.ts';
import { SKILL_LABELS } from './scoring.ts';

const ATTEMPTS_KEY = 'toefl_ibt_attempts_v1';
const CUSTOM_TESTS_KEY = 'toefl_ibt_custom_tests_v1';
const SETTINGS_KEY = 'toefl_ibt_settings_v1';

export interface UserSettings {
  targetScore: number;
  soundEnabled: boolean;
  defaultTimerMinutes: number;
}

const DEFAULT_SETTINGS: UserSettings = {
  targetScore: 26,
  soundEnabled: true,
  defaultTimerMinutes: 18,
};

export function getAttempts(): TestAttempt[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading attempts from local database:', err);
    return [];
  }
}

export function saveAttempt(attempt: TestAttempt): void {
  try {
    const current = getAttempts();
    const updated = [attempt, ...current];
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving attempt to local database:', err);
  }
}

export function getAttemptById(id: string): TestAttempt | null {
  const attempts = getAttempts();
  return attempts.find((a) => a.id === id) || null;
}

export function deleteAttempt(id: string): void {
  try {
    const current = getAttempts();
    const updated = current.filter((a) => a.id !== id);
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error deleting attempt from local database:', err);
  }
}

export function clearAllAttempts(): void {
  try {
    localStorage.removeItem(ATTEMPTS_KEY);
  } catch (err) {
    console.error('Error clearing attempts:', err);
  }
}

function sanitizeTest(test: any): ToeflTest {
  if (!test) return test;
  
  // Ensure dailyLifeNotice questions
  if (!test.dailyLifeNotice) test.dailyLifeNotice = {};
  if (!Array.isArray(test.dailyLifeNotice.questions) || test.dailyLifeNotice.questions.length === 0) {
    test.dailyLifeNotice.questions = [
      {
        id: `notice_q1_${test.id}`,
        question: 'What is the primary topic of the notice?',
        options: ['An administrative service change', 'A student event cancellation', 'A tuition fee update', 'A library closure schedule'],
        correctAnswer: 0,
        explanation: 'The notice explains key procedures regarding the institutional announcement.',
        skill: 'daily_life_scanning',
      },
      {
        id: `notice_q2_${test.id}`,
        question: 'What action are individuals required to take?',
        options: ['Follow the specified portal instructions', 'Visit an off-campus office in person', 'Submit a formal written petition', 'Wait until the following academic term'],
        correctAnswer: 0,
        explanation: 'The announcement details the mandatory procedure patrons must follow.',
        skill: 'daily_life_scanning',
      },
    ];
  }

  // Ensure academicPassage questions (at least 5 questions)
  if (!test.academicPassage) test.academicPassage = {};
  if (!Array.isArray(test.academicPassage.paragraphs) || test.academicPassage.paragraphs.length === 0) {
    test.academicPassage.paragraphs = [
      'In academic research, foundational theories undergo rigorous experimental validation over generations of empirical analysis.',
      'Recent breakthroughs demonstrate that morphological and environmental variations significantly influence behavioral adaptation in living systems.',
      'Consequently, interdisciplinary scholars synthesize multiple lines of evidence to formulate comprehensive scientific models.',
    ];
  }

  const defaultPrompts = [
    'What is the passage mainly about?',
    'The highlighted concept in the passage is closest in meaning to',
    'According to the passage, which of the following is true?',
    'According to the passage, all of the following are true EXCEPT:',
    'What can be inferred from the author\'s analysis in the final paragraph?',
  ];
  const defaultSkills = [
    'academic_main_idea',
    'academic_vocabulary',
    'academic_factual',
    'academic_negative_factual',
    'academic_inference',
  ];

  if (!Array.isArray(test.academicPassage.questions)) {
    test.academicPassage.questions = [];
  }

  test.academicPassage.questions = test.academicPassage.questions.map((q: any, i: number) => ({
    id: q.id || `acad_q${i + 1}_${test.id}`,
    question: q.question || defaultPrompts[i] || `Academic Question ${i + 1}`,
    highlightedWord: q.highlightedWord,
    options: Array.isArray(q.options) && q.options.length >= 4
      ? q.options.slice(0, 4)
      : [
          'It represents the primary mechanism described in the passage.',
          'It contradicts previous hypotheses formulated by earlier investigators.',
          'It provides empirical data supporting the broader theoretical framework.',
          'It illustrates an isolated anomaly in observational findings.',
        ],
    correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 ? q.correctAnswer : 1,
    explanation: q.explanation || 'The passage provides explicit textual evidence supporting this conclusion.',
    skill: q.skill || defaultSkills[i] || 'academic_factual',
  }));

  while (test.academicPassage.questions.length < 5) {
    const idx = test.academicPassage.questions.length;
    test.academicPassage.questions.push({
      id: `acad_q${idx + 1}_${test.id}`,
      question: defaultPrompts[idx] || `Academic Question ${idx + 1}`,
      options: [
        'It represents the primary mechanism described in the passage.',
        'It contradicts previous hypotheses formulated by earlier investigators.',
        'It provides empirical data supporting the broader theoretical framework.',
        'It illustrates an isolated anomaly in observational findings.',
      ],
      correctAnswer: 2,
      explanation: 'The passage provides textual support for this answer choice.',
      skill: defaultSkills[idx] || 'academic_factual',
    });
  }

  return test;
}

export function getCustomTests(): ToeflTest[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TESTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeTest);
  } catch (err) {
    console.error('Error loading custom tests from local database:', err);
    return [];
  }
}

export function saveCustomTest(test: ToeflTest): void {
  try {
    const current = getCustomTests();
    const filtered = current.filter((t) => t.id !== test.id);
    const updated = [test, ...filtered];
    localStorage.setItem(CUSTOM_TESTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving custom test to local database:', err);
  }
}

export function deleteCustomTest(id: string): void {
  try {
    const current = getCustomTests();
    const updated = current.filter((t) => t.id !== id);
    localStorage.setItem(CUSTOM_TESTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error deleting custom test:', err);
  }
}

export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<UserSettings>): void {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

export function getUserStats(): UserStats {
  const attempts = getAttempts();
  const settings = getSettings();

  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScaledScore: 0,
      highestScaledScore: 0,
      lowestScaledScore: 0,
      totalPracticeTimeSeconds: 0,
      targetScore: settings.targetScore,
      skillAccuracies: {},
      recentScores: [],
    };
  }

  let totalScore = 0;
  let highestScore = 0;
  let lowestScore = 30;
  let totalPracticeTime = 0;

  const skillTotals: Record<
    string,
    { correct: number; total: number; name: string }
  > = {};

  attempts.forEach((a) => {
    totalScore += a.scaledScore;
    if (a.scaledScore > highestScore) highestScore = a.scaledScore;
    if (a.scaledScore < lowestScore) lowestScore = a.scaledScore;
    totalPracticeTime += a.durationSeconds;

    // Aggregate skill breakdown
    if (a.skillBreakdown) {
      Object.entries(a.skillBreakdown).forEach(([skillKey, data]) => {
        if (!skillTotals[skillKey]) {
          skillTotals[skillKey] = {
            correct: 0,
            total: 0,
            name: data.name || (SKILL_LABELS as any)[skillKey] || skillKey,
          };
        }
        skillTotals[skillKey].correct += data.correct;
        skillTotals[skillKey].total += data.total;
      });
    }
  });

  const skillAccuracies: Record<
    string,
    { correct: number; total: number; percentage: number; name: string }
  > = {};

  Object.entries(skillTotals).forEach(([skill, val]) => {
    skillAccuracies[skill] = {
      correct: val.correct,
      total: val.total,
      percentage: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0,
      name: val.name,
    };
  });

  const recentScores = [...attempts]
    .reverse()
    .slice(-10)
    .map((a) => ({
      date: new Date(a.timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      scaledScore: a.scaledScore,
      testTitle: a.testTitle,
    }));

  return {
    totalAttempts: attempts.length,
    averageScaledScore: Math.round((totalScore / attempts.length) * 10) / 10,
    highestScaledScore: highestScore,
    lowestScaledScore: lowestScore === 30 && attempts.length === 0 ? 0 : lowestScore,
    totalPracticeTimeSeconds: totalPracticeTime,
    targetScore: settings.targetScore,
    skillAccuracies,
    recentScores,
  };
}

export function exportLocalDatabase(): string {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    attempts: getAttempts(),
    customTests: getCustomTests(),
    settings: getSettings(),
  };
  return JSON.stringify(data, null, 2);
}

export function importLocalDatabase(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.attempts && Array.isArray(data.attempts)) {
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data.attempts));
    }
    if (data.customTests && Array.isArray(data.customTests)) {
      localStorage.setItem(CUSTOM_TESTS_KEY, JSON.stringify(data.customTests));
    }
    if (data.settings && typeof data.settings === 'object') {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
    }
    return true;
  } catch (err) {
    console.error('Failed to import database:', err);
    return false;
  }
}
