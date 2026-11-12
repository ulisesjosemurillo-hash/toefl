/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ReadingSkillType =
  | 'complete_words'
  | 'daily_life_scanning'
  | 'academic_main_idea'
  | 'academic_vocabulary'
  | 'academic_factual'
  | 'academic_negative_factual'
  | 'academic_inference';

export type ListeningSkillType =
  | 'listening_conversational_response'
  | 'listening_campus_pragmatics'
  | 'listening_detail'
  | 'listening_inference';

export interface ListeningQuestion {
  id: string;
  questionNumber: number;
  promptSpoken?: string; // Spoken prompt (hidden in Part 1)
  questionText?: string; // Visible question text (shown on screen in Part 2)
  speakerImage: string;
  speakerName?: string;
  speakerGender?: 'female' | 'male';
  voiceName?: string;
  audioUrl?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  skill?: ListeningSkillType;
  passageId?: string;
}

export interface ListeningPassage {
  id: string;
  type: 'conversation' | 'announcement' | 'academic_talk';
  headerText: string; // e.g. "Listen to a conversation."
  sceneImage: string; // large image shown during audio listening
  audioUrl?: string;
  transcript: string;
  questions: ListeningQuestion[];
}

export interface ListeningTest {
  id: string;
  title: string;
  category: string;
  partType?: 'part1_responses' | 'part2_passages' | 'full_exam';
  difficulty: 'Standard' | 'Challenging' | 'Diagnostic';
  estimatedMinutes: number;
  totalQuestions: number;
  questions: ListeningQuestion[];
  passages?: ListeningPassage[];
}

export interface CompleteWordItem {
  id: string; // e.g. "cw-1"
  prefix: string; // e.g. "mi"
  answer: string; // e.g. "GHT"
  length: number; // e.g. 3
}

export interface CompleteTheWordsSection {
  id: string;
  instruction: string;
  passageTextSegments: Array<
    | { type: 'text'; text: string }
    | { type: 'word'; item: CompleteWordItem }
  >;
  fullTextWithBlanks: string;
}

export interface DailyLifeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  skill: ReadingSkillType;
}

export interface DailyLifeNotice {
  id: string;
  title: string;
  subtitle?: string;
  contentHtml: string;
  questions: DailyLifeQuestion[];
  format?: 'notice' | 'social_media_post' | 'email';
  author?: string;
  emailDetails?: {
    to: string;
    from: string;
    date?: string;
    subject: string;
    borderColor?: string;
  };
}

export interface AcademicQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  highlightedWord?: string;
  explanation: string;
  skill: ReadingSkillType;
}

export interface AcademicPassage {
  id: string;
  title: string;
  paragraphs: string[];
  questions: AcademicQuestion[];
}

export interface ToeflTest {
  id: string;
  title: string;
  category: string;
  difficulty: 'Standard' | 'Challenging' | 'Diagnostic';
  estimatedMinutes: number;
  completeWords: CompleteTheWordsSection;
  dailyLifeNotice: DailyLifeNotice;
  dailyLifeNotices?: DailyLifeNotice[];
  academicPassage: AcademicPassage;
  isAiGenerated?: boolean;
}

export type WritingSkillType =
  | 'sentence_syntax_grammar'
  | 'email_communicative_intent'
  | 'academic_discussion_argumentation';

export interface BuildSentenceQuestion {
  id: string;
  questionNumber: number; // 1 to 10
  speaker1: {
    avatar: string;
    name?: string;
    speech: string;
  };
  speaker2: {
    avatar: string;
    name?: string;
    prefixText?: string;
    middleText?: string;
    suffixText?: string;
    prefixSlotsCount?: number;
    suffixSlotsCount?: number;
    totalSlots: number;
  };
  wordBank: string[]; // Options to choose from (may include distractor)
  correctSequence: string[]; // Correct sequence of chosen words in order
  correctSentence: string;
  explanation: string;
  skill?: WritingSkillType;
}

export interface WriteEmailTask {
  id: string;
  title: string;
  scenario: string;
  instructions: string[];
  toAddress: string;
  subject: string;
  timeLimitMinutes: number; // 7 minutes
  sampleModelAnswer?: string;
}

export interface AcademicDiscussionTask {
  id: string;
  title: string;
  scenario: string;
  instructions: string[];
  minimumWords: number; // 100 words
  timeLimitMinutes: number; // 10 minutes
  professor: {
    avatar: string;
    name: string;
    prompt: string;
  };
  classmates: Array<{
    avatar: string;
    name: string;
    opinion: string;
  }>;
  sampleModelAnswer?: string;
}

export interface WritingTest {
  id: string;
  title: string;
  category: string;
  difficulty: 'Standard' | 'Challenging' | 'Diagnostic';
  estimatedMinutes: number;
  totalQuestions: number; // 12
  buildSentenceQuestions: BuildSentenceQuestion[];
  emailTask: WriteEmailTask;
  academicDiscussionTask: AcademicDiscussionTask;
}

export type SpeakingSkillType =
  | 'listen_and_repeat_pronunciation'
  | 'interview_fluency_coherence';

export interface SpeakingRepeatQuestion {
  id: string;
  questionNumber: number; // 1 to 7
  sceneImage: string; // Zoo highlighting image
  spokenSentence: string;
  audioUrl?: string;
  responseTimeSeconds: number; // 10 seconds per user requirement
  explanation: string;
}

export interface SpeakingInterviewQuestion {
  id: string;
  questionNumber: number; // 8 to 11
  interviewerImage: string;
  interviewerName: string;
  topic: string;
  questionSpoken: string;
  audioUrl?: string;
  responseTimeSeconds: number; // 45 seconds per user requirement
  sampleModelAnswer: string;
  explanation: string;
}

export interface SpeakingTest {
  id: string;
  title: string;
  category: string;
  difficulty: 'Standard' | 'Challenging' | 'Diagnostic';
  estimatedMinutes: number;
  totalQuestions: number; // 11
  repeatQuestions: SpeakingRepeatQuestion[];
  interviewQuestions: SpeakingInterviewQuestion[];
}

export interface QuestionResultItem {
  questionId: string;
  questionNumber: number;
  section:
    | 'complete_words'
    | 'daily_life'
    | 'academic'
    | 'listening'
    | 'writing_sentence'
    | 'writing_email'
    | 'writing_discussion'
    | 'speaking_repeat'
    | 'speaking_interview';
  sectionLabel: string;
  prompt: string;
  userAnswerText: string;
  correctAnswerText: string;
  isCorrect: boolean;
  skill:
    | ReadingSkillType
    | ListeningSkillType
    | WritingSkillType
    | SpeakingSkillType
    | string;
  skillLabel: string;
  explanation: string;
  promptSpokenTranscript?: string;
  wordCount?: number;
  audioRecordingUrl?: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  timestamp: number;
  durationSeconds: number;
  rawScore: number;
  maxScore: number;
  scaledScore: number; // 0 - 30 scale
  percentage: number;
  cefrLevel: 'C1/C2' | 'B2' | 'B1' | 'Below B1';
  proficiencyDescriptor: string;
  testType?: 'reading' | 'listening' | 'writing' | 'speaking' | 'full';
  breakdown: {
    completeWords?: { score: number; total: number; percentage: number };
    dailyLife?: { score: number; total: number; percentage: number };
    academic?: { score: number; total: number; percentage: number };
    listening?: { score: number; total: number; percentage: number };
    buildSentence?: { score: number; total: number; percentage: number };
    writeEmail?: { score: number; total: number; percentage: number; wordCount: number };
    academicDiscussion?: { score: number; total: number; percentage: number; wordCount: number };
    speakingRepeat?: { score: number; total: number; percentage: number };
    speakingInterview?: { score: number; total: number; percentage: number };
    fullExam?: {
      readingScaled: number;
      listeningScaled: number;
      writingScaled: number;
      speakingScaled: number;
      totalScaled: number; // 0 - 120
    };
  };
  skillBreakdown: Record<string, { correct: number; total: number; name: string }>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  aiFeedback?: string;
  questionResults: QuestionResultItem[];
}

export interface UserStats {
  totalAttempts: number;
  averageScaledScore: number;
  highestScaledScore: number;
  lowestScaledScore: number;
  totalPracticeTimeSeconds: number;
  targetScore: number;
  skillAccuracies: Record<string, { correct: number; total: number; percentage: number; name: string }>;
  recentScores: Array<{ date: string; scaledScore: number; testTitle: string }>;
}
