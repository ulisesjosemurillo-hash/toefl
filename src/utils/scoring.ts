/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  QuestionResultItem,
  ReadingSkillType,
  TestAttempt,
  ToeflTest,
  ListeningTest,
  WritingTest,
  SpeakingTest,
} from '../types/toefl.ts';
import {
  GeminiSpeakingEvaluation,
  GeminiWritingEvaluation,
} from './audioRecording.ts';

export const SKILL_LABELS: Record<ReadingSkillType, string> = {
  complete_words: 'Completar Palabras (Morfología & Vocabulario)',
  daily_life_scanning: 'Lectura Cotidiana & Escaneo de Datos',
  academic_main_idea: 'Idea Principal & Síntesis Global',
  academic_vocabulary: 'Vocabulario Académico en Contexto',
  academic_factual: 'Información Factual & Evidencia Textual',
  academic_negative_factual: 'Preguntas Negativas (EXCEPT / NOT)',
  academic_inference: 'Inferencia & Propósito del Autor',
};

// Official ETS TOEFL iBT Reading conversion curve (Scaled 0-30)
export function calculateScaledScore(rawScore: number, maxScore: number): number {
  if (maxScore === 0) return 0;
  const ratio = rawScore / maxScore;
  if (ratio >= 0.99) return 30;
  if (ratio >= 0.92) return 29;
  if (ratio >= 0.85) return 27;
  if (ratio >= 0.78) return 25;
  if (ratio >= 0.71) return 23;
  if (ratio >= 0.64) return 21;
  if (ratio >= 0.57) return 19;
  if (ratio >= 0.5) return 17;
  if (ratio >= 0.42) return 15;
  if (ratio >= 0.35) return 12;
  if (ratio >= 0.28) return 9;
  if (ratio >= 0.2) return 6;
  if (ratio > 0) return 3;
  return 0;
}

// Official ETS 2026 Band Score conversion (1.0 to 6.0 in 0.5 increments)
export function scaled30ToEtsBand2026(scaled30: number): number {
  if (scaled30 >= 29) return 6.0;
  if (scaled30 >= 27) return 5.5;
  if (scaled30 >= 24) return 5.0;
  if (scaled30 >= 21) return 4.5;
  if (scaled30 >= 18) return 4.0;
  if (scaled30 >= 15) return 3.5;
  if (scaled30 >= 12) return 3.0;
  if (scaled30 >= 9) return 2.5;
  if (scaled30 >= 6) return 2.0;
  if (scaled30 >= 3) return 1.5;
  return 1.0;
}

export function total120ToEtsBand2026(
  readingBand: number,
  listeningBand: number,
  writingBand: number,
  speakingBand: number,
): number {
  const avg = (readingBand + listeningBand + writingBand + speakingBand) / 4;
  return Math.round(avg * 2) / 2;
}

export function getCefrDetails(scaledScore: number): {
  level: 'C1/C2' | 'B2' | 'B1' | 'Below B1';
  descriptor: string;
} {
  if (scaledScore >= 24) {
    return {
      level: 'C1/C2',
      descriptor: 'Avanzado (Advanced) - Nivel Universitario Competitivo',
    };
  }
  if (scaledScore >= 18) {
    return {
      level: 'B2',
      descriptor: 'Intermedio Alto (High-Intermediate) - Admisiones de Grado y Posgrado',
    };
  }
  if (scaledScore >= 10) {
    return {
      level: 'B1',
      descriptor: 'Intermedio Bajo (Low-Intermediate) - Requiere Refuerzo Académico',
    };
  }
  return {
    level: 'Below B1',
    descriptor: 'Básico (Below Low-Intermediate) - Nivel Inicial de Preparación',
  };
}

export function getFullExamCefrDetails(totalScore: number): {
  level: 'C1/C2' | 'B2' | 'B1' | 'Below B1';
  descriptor: string;
} {
  if (totalScore >= 110) {
    return {
      level: 'C1/C2',
      descriptor: 'Avanzado Superior (C2) - Puntuación de Élite (110-120), aceptado en Harvard, Oxford y MIT',
    };
  }
  if (totalScore >= 95) {
    return {
      level: 'C1/C2',
      descriptor: 'Avanzado (C1) - Cumple los estándares más exigentes de admisiones universitarias internacionales (95-109)',
    };
  }
  if (totalScore >= 72) {
    return {
      level: 'B2',
      descriptor: 'Intermedio Alto (B2) - Rango estándar para programas de grado y posgrado internacional (72-94)',
    };
  }
  if (totalScore >= 42) {
    return {
      level: 'B1',
      descriptor: 'Intermedio Bajo (B1) - Nivel funcional en desarrollo, requiere refuerzo académico (42-71)',
    };
  }
  return {
    level: 'Below B1',
    descriptor: 'Básico (Below B1) - Nivel inicial de preparación TOEFL iBT (< 42)',
  };
}

export function evaluateAttempt(
  test: ToeflTest,
  cwInputs: Record<string, string>, // cw-1-0: 'G', cw-1-1: 'H', etc. OR cw-1: 'GHT'
  mcqAnswers: Record<string, number>,
  durationSeconds: number,
): TestAttempt {
  const questionResults: QuestionResultItem[] = [];
  let questionCounter = 1;

  // 1. Evaluate Complete the Words items
  let cwScore = 0;
  const cwTotal = test.completeWords.passageTextSegments.filter(
    (s) => s.type === 'word',
  ).length;

  test.completeWords.passageTextSegments.forEach((segment) => {
    if (segment.type !== 'word') return;
    const item = segment.item;
    // Reconstruct user's typed letters for this word
    let userWord = '';
    // Look for slot-based keys cw-1-0, cw-1-1... or whole string
    if (cwInputs[item.id] !== undefined) {
      userWord = cwInputs[item.id].trim().toUpperCase();
    } else {
      for (let i = 0; i < item.length; i++) {
        const char = cwInputs[`${item.id}-${i}`] || '';
        userWord += char.trim().toUpperCase();
      }
    }

    const expected = item.answer.trim().toUpperCase();
    const isCorrect = userWord === expected;
    if (isCorrect) cwScore++;

    questionResults.push({
      questionId: item.id,
      questionNumber: questionCounter++,
      section: 'complete_words',
      sectionLabel: 'Completar Palabras',
      prompt: `Completar palabra con prefijo "${item.prefix}" (${item.length} letras)`,
      userAnswerText: userWord ? `${item.prefix}${userWord}` : '(En blanco)',
      correctAnswerText: `${item.prefix}${expected}`,
      isCorrect,
      skill: 'complete_words',
      skillLabel: SKILL_LABELS.complete_words,
      explanation: `La palabra correcta en este contexto es "${item.prefix}${expected}". En la tarea "Complete the Words", revisa la raíz de la palabra y su función gramatical (sustantivo, verbo, adjetivo).`,
    });
  });

  // 2. Evaluate Daily Life Notice questions
  let dailyLifeScore = 0;
  const allNotices =
    test.dailyLifeNotices && test.dailyLifeNotices.length > 0
      ? test.dailyLifeNotices
      : [test.dailyLifeNotice];

  const dailyLifeTotal = allNotices.reduce((sum, n) => sum + n.questions.length, 0);

  allNotices.forEach((notice) => {
    notice.questions.forEach((q) => {
      const userSelected = mcqAnswers[q.id];
      const isCorrect = userSelected === q.correctAnswer;
      if (isCorrect) dailyLifeScore++;

      questionResults.push({
        questionId: q.id,
        questionNumber: questionCounter++,
        section: 'daily_life',
        sectionLabel:
          notice.format === 'social_media_post'
            ? 'Social Media Post'
            : notice.format === 'email'
            ? 'Read an Email'
            : 'Lectura Cotidiana (Notice)',
        prompt: q.question,
        userAnswerText:
          userSelected !== undefined
            ? q.options[userSelected] || '(Opción no válida)'
            : '(Sin responder)',
        correctAnswerText: q.options[q.correctAnswer],
        isCorrect,
        skill: q.skill,
        skillLabel: SKILL_LABELS[q.skill] || 'Lectura Cotidiana',
        explanation: q.explanation,
      });
    });
  });

  // 3. Evaluate Academic Passage questions
  let academicScore = 0;
  const academicTotal = test.academicPassage.questions.length;

  test.academicPassage.questions.forEach((q) => {
    const userSelected = mcqAnswers[q.id];
    const isCorrect = userSelected === q.correctAnswer;
    if (isCorrect) academicScore++;

    questionResults.push({
      questionId: q.id,
      questionNumber: questionCounter++,
      section: 'academic',
      sectionLabel: 'Pasaje Académico',
      prompt: q.question,
      userAnswerText:
        userSelected !== undefined
          ? q.options[userSelected] || '(Opción no válida)'
          : '(Sin responder)',
      correctAnswerText: q.options[q.correctAnswer],
      isCorrect,
      skill: q.skill,
      skillLabel: SKILL_LABELS[q.skill] || 'Comprensión Académica',
      explanation: q.explanation,
    });
  });

  const rawScore = cwScore + dailyLifeScore + academicScore;
  const maxScore = cwTotal + dailyLifeTotal + academicTotal;
  const percentage = Math.round((rawScore / maxScore) * 100);
  const scaledScore = calculateScaledScore(rawScore, maxScore);
  const { level, descriptor } = getCefrDetails(scaledScore);

  // Group by skill
  const skillBreakdown: Record<
    string,
    { correct: number; total: number; name: string }
  > = {};

  questionResults.forEach((q) => {
    if (!skillBreakdown[q.skill]) {
      skillBreakdown[q.skill] = {
        correct: 0,
        total: 0,
        name: q.skillLabel,
      };
    }
    skillBreakdown[q.skill].total++;
    if (q.isCorrect) skillBreakdown[q.skill].correct++;
  });

  // Strengths & Weaknesses analysis
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  const cwPct = cwTotal > 0 ? (cwScore / cwTotal) * 100 : 0;
  const dailyPct = dailyLifeTotal > 0 ? (dailyLifeScore / dailyLifeTotal) * 100 : 0;
  const acadPct = academicTotal > 0 ? (academicScore / academicTotal) * 100 : 0;

  if (cwPct >= 85) {
    strengths.push(
      'Excelente dominio ortográfico y deducción léxica rápida en "Complete the Words".',
    );
  } else if (cwPct < 60) {
    weaknesses.push(
      'Dificultad para completar raíces morfológicas y prefijos en textos continuos.',
    );
    recommendations.push(
      'Práctica de raíces griegas y latinas y sufijos frecuentes (ej. -tion, -ment, -ive, -ous). Lee el párrafo completo antes de llenar las letras para entender la categoría gramatical.',
    );
  }

  if (dailyPct >= 80) {
    strengths.push(
      'Gran agilidad para escanear información factual específica en avisos cotidianos.',
    );
  } else {
    weaknesses.push(
      'Lectura superficial o apresurada en textos de la vida diaria (notices/policies).',
    );
    recommendations.push(
      'En "Read in Daily Life", localiza las palabras clave de la pregunta (fechas, condiciones, requisitos) en el recuadro antes de mirar las 4 opciones para evitar distractores.',
    );
  }

  // Check specific academic skills
  const negativeFactual = skillBreakdown['academic_negative_factual'];
  if (negativeFactual && negativeFactual.correct < negativeFactual.total) {
    weaknesses.push(
      'Fallas en preguntas negativas tipo "EXCEPT / NOT" en pasajes académicos.',
    );
    recommendations.push(
      'Estrategia para preguntas EXCEPT: Lee las 4 opciones y busca confirmar las 3 verdaderas en el texto. La opción que no aparezca o contradiga el texto es la respuesta correcta.',
    );
  }

  const vocabSkill = skillBreakdown['academic_vocabulary'];
  if (vocabSkill && vocabSkill.correct < vocabSkill.total) {
    weaknesses.push(
      'Preguntas de vocabulario en contexto: selección de sinónimos literales sin evaluar el contexto.',
    );
    recommendations.push(
      'Para preguntas de vocabulario, sustituye mentalmente las 4 opciones en la oración original. No elijas la definición de diccionario más común, sino la que preserve el significado exacto del párrafo.',
    );
  }

  const inferenceSkill = skillBreakdown['academic_inference'];
  if (inferenceSkill && inferenceSkill.correct < inferenceSkill.total) {
    weaknesses.push(
      'Inferencia y propósito retórico: conclusiones demasiado amplias o no sustentadas.',
    );
    recommendations.push(
      'En preguntas de inferencia ("Why does the author mention...", "It can be inferred"), la respuesta correcta siempre debe poder probarse lógicamente a partir de una o dos oraciones previas.',
    );
  }

  if (acadPct >= 80) {
    strengths.push(
      'Fuerte comprensión lectora en textos académicos densos de ciencias y humanidades.',
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Mantén tu ritmo cronometrado constante (menos de 1 minuto por pregunta) para consolidar tu banda 28-30 en el examen oficial.',
    );
  }

  return {
    id: `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    testId: test.id,
    testTitle: test.title,
    timestamp: Date.now(),
    durationSeconds,
    rawScore,
    maxScore,
    scaledScore,
    percentage,
    cefrLevel: level,
    proficiencyDescriptor: descriptor,
    etsBandScore2026: scaled30ToEtsBand2026(scaledScore),
    breakdown: {
      completeWords: {
        score: cwScore,
        total: cwTotal,
        percentage: Math.round(cwPct),
      },
      dailyLife: {
        score: dailyLifeScore,
        total: dailyLifeTotal,
        percentage: Math.round(dailyPct),
      },
      academic: {
        score: academicScore,
        total: academicTotal,
        percentage: Math.round(acadPct),
      },
    },
    skillBreakdown,
    strengths,
    weaknesses,
    recommendations,
    questionResults,
  };
}

export function evaluateListeningAttempt(
  test: import('../types/toefl.ts').ListeningTest,
  answers: Record<string, number>,
  durationSeconds: number,
): TestAttempt {
  const questionResults: QuestionResultItem[] = [];
  let score = 0;
  const total = test.questions.length;

  test.questions.forEach((q) => {
    const selected = answers[q.id];
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) score++;

    questionResults.push({
      questionId: q.id,
      questionNumber: q.questionNumber,
      section: 'listening',
      sectionLabel: q.questionText
        ? 'Listening • Conversation, Announcement & Talk'
        : 'Listening • Choose the Best Response',
      prompt: q.questionText || `Pregunta de Audio #${q.questionNumber}`,
      promptSpokenTranscript: q.promptSpoken || q.questionText,
      userAnswerText:
        selected !== undefined
          ? q.options[selected] || '(Opción no válida)'
          : '(Sin responder)',
      correctAnswerText: q.options[q.correctAnswer],
      isCorrect,
      skill: q.skill || 'listening_conversational_response',
      skillLabel: q.questionText ? 'Comprensión de Pasaje Auditivo' : 'Comprensión Auditiva Conversacional',
      explanation: q.explanation,
    });
  });

  const rawScore = score;
  const maxScore = total;
  const scaledScore = calculateScaledScore(rawScore, maxScore);
  const percentage = Math.round((rawScore / maxScore) * 100);
  const { level, descriptor } = getCefrDetails(scaledScore);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (percentage >= 85) {
    strengths.push('Excelente comprensión de la pragmática y turnos de habla en inglés coloquial y de campus.');
    recommendations.push('Mantén la práctica de audios con acentos diversos para asegurar tu puntuación de 28-30.');
  } else if (percentage >= 65) {
    strengths.push('Buena identificación del tema central de las conversaciones.');
    weaknesses.push('Respuestas distractoras con palabras repetidas del audio.');
    recommendations.push('Cuidado con las "trampas de sonido": en TOEFL Listening, las respuestas que repiten la misma palabra exacta del audio suelen ser incorrectas.');
  } else {
    weaknesses.push('Dificultad para inferir la intención o actitud del hablante.');
    recommendations.push('Presta atención al tono y la función conversacional (disculparse, proponer alternativas, confirmar datos) en lugar de traducir palabra por palabra.');
  }

  return {
    id: `listening_attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    testId: test.id,
    testTitle: test.title,
    timestamp: Date.now(),
    durationSeconds,
    rawScore,
    maxScore,
    scaledScore,
    percentage,
    cefrLevel: level,
    proficiencyDescriptor: descriptor,
    etsBandScore2026: scaled30ToEtsBand2026(scaledScore),
    testType: 'listening',
    breakdown: {
      listening: {
        score,
        total,
        percentage,
      },
    },
    skillBreakdown: {
      listening: {
        correct: score,
        total,
        name: 'Comprensión Auditiva Conversacional (Pragmatics)',
      },
    },
    strengths,
    weaknesses,
    recommendations,
    questionResults,
  };
}

export function evaluateWritingAttempt(
  test: WritingTest,
  sentenceAnswers: Record<string, string[]>,
  emailText: string,
  discussionText: string,
  durationSeconds: number,
  geminiWritingEvals: {
    email?: GeminiWritingEvaluation;
    discussion?: GeminiWritingEvaluation;
  } = {},
): TestAttempt {
  const questionResults: QuestionResultItem[] = [];
  let sentenceScore = 0;

  // 1. Evaluate 10 Build a Sentence questions
  test.buildSentenceQuestions.forEach((q) => {
    const userPlaced = sentenceAnswers[q.id] || [];
    const isCorrect =
      userPlaced.length === q.correctSequence.length &&
      userPlaced.every(
        (word, idx) =>
          (word || '').trim().toLowerCase() ===
          (q.correctSequence[idx] || '').trim().toLowerCase(),
      );

    if (isCorrect) sentenceScore++;

    const assembledUserSentence = (() => {
      if (userPlaced.every((w) => !w)) return '(Sin responder)';
      let s = '';
      if (q.speaker2.prefixText) s += q.speaker2.prefixText + ' ';
      const prefCount = q.speaker2.prefixSlotsCount ?? q.speaker2.totalSlots;
      s += userPlaced.slice(0, prefCount).filter(Boolean).join(' ');
      if (q.speaker2.middleText) s += ' ' + q.speaker2.middleText + ' ';
      if (q.speaker2.suffixSlotsCount) {
        s += ' ' + userPlaced.slice(prefCount).filter(Boolean).join(' ');
      }
      if (q.speaker2.suffixText) s += ' ' + q.speaker2.suffixText;
      return s.trim();
    })();

    questionResults.push({
      questionId: q.id,
      questionNumber: q.questionNumber,
      section: 'writing_sentence',
      sectionLabel: 'Writing • Build a Sentence',
      prompt: `${q.speaker1.speech} ➔ ${assembledUserSentence}`,
      userAnswerText: assembledUserSentence,
      correctAnswerText: q.correctSentence,
      isCorrect,
      skill: 'sentence_syntax_grammar',
      skillLabel: 'Sintaxis y Estructura Gramatical',
      explanation: q.explanation,
    });
  });

  // 2. Evaluate Email Task (Rubric 0 - 5 points)
  const emailWords = (emailText || '').trim().split(/\s+/).filter(Boolean);
  const emailWordCount = emailWords.length;
  const aiEmail = geminiWritingEvals.email;

  let emailScore = 0;
  if (aiEmail && aiEmail.status === 'evaluated' && aiEmail.overallScore > 0) {
    emailScore = Math.max(1, Math.min(5, Math.round((aiEmail.overallScore / 6) * 5)));
  } else if (emailWordCount < 5 || aiEmail?.status === 'insufficient') {
    emailScore = 0;
  } else if (emailWordCount >= 70) {
    emailScore = 5;
  } else if (emailWordCount >= 50) {
    emailScore = 4;
  } else if (emailWordCount >= 30) {
    emailScore = 3;
  } else if (emailWordCount >= 10) {
    emailScore = 2;
  } else {
    emailScore = 1;
  }

  const emailExplanationParts = [
    `Tu email contiene ${emailWordCount} palabras.`,
    aiEmail?.feedback
      ? `Evaluación IA (Banda Est. ${aiEmail.overallScore.toFixed(1)}/6.0): ${aiEmail.feedback}`
      : 'Para un puntaje óptimo (Band 4-5), aborda los 3 requerimientos del escenario con saludo y despedida formal.',
  ];
  if (aiEmail?.grammarErrors && aiEmail.grammarErrors.length > 0) {
    emailExplanationParts.push(
      'Correcciones: ' +
        aiEmail.grammarErrors
          .slice(0, 3)
          .map((e) => `"${e.mistake}" ➔ "${e.correction}"`)
          .join(' | '),
    );
  }

  questionResults.push({
    questionId: test.emailTask.id,
    questionNumber: 11,
    section: 'writing_email',
    sectionLabel: 'Writing • Write an Email (7 min)',
    prompt: test.emailTask.title,
    userAnswerText: emailText?.trim() ? emailText : '(Sin respuesta escrita)',
    correctAnswerText: test.emailTask.sampleModelAnswer || '',
    isCorrect: emailScore >= 4,
    skill: 'email_communicative_intent',
    skillLabel: 'Comunicación Escrita & Cumplimiento de Puntos',
    explanation: emailExplanationParts.join(' '),
    wordCount: emailWordCount,
  });

  // 3. Evaluate Academic Discussion Task (Rubric 0 - 5 points)
  const discWords = (discussionText || '').trim().split(/\s+/).filter(Boolean);
  const discWordCount = discWords.length;
  const aiDisc = geminiWritingEvals.discussion;

  let discScore = 0;
  if (aiDisc && aiDisc.status === 'evaluated' && aiDisc.overallScore > 0) {
    discScore = Math.max(1, Math.min(5, Math.round((aiDisc.overallScore / 6) * 5)));
  } else if (discWordCount < 5 || aiDisc?.status === 'insufficient') {
    discScore = 0;
  } else if (discWordCount >= 110) {
    discScore = 5;
  } else if (discWordCount >= 100) {
    discScore = 4;
  } else if (discWordCount >= 70) {
    discScore = 3;
  } else if (discWordCount >= 30) {
    discScore = 2;
  } else {
    discScore = 1;
  }

  const discExplanationParts = [
    `Tu publicación contiene ${discWordCount} palabras (mínimo recomendado: 100).`,
    aiDisc?.feedback
      ? `Evaluación IA (Banda Est. ${aiDisc.overallScore.toFixed(1)}/6.0): ${aiDisc.feedback}`
      : 'En TOEFL iBT Academic Discussion, expresa una postura clara, apóyala con argumentos propios y dialoga con las ideas de tus compañeros.',
  ];
  if (aiDisc?.grammarErrors && aiDisc.grammarErrors.length > 0) {
    discExplanationParts.push(
      'Correcciones: ' +
        aiDisc.grammarErrors
          .slice(0, 3)
          .map((e) => `"${e.mistake}" ➔ "${e.correction}"`)
          .join(' | '),
    );
  }

  questionResults.push({
    questionId: test.academicDiscussionTask.id,
    questionNumber: 12,
    section: 'writing_discussion',
    sectionLabel: 'Writing • Academic Discussion (10 min)',
    prompt: test.academicDiscussionTask.title,
    userAnswerText: discussionText?.trim() ? discussionText : '(Sin respuesta escrita)',
    correctAnswerText: test.academicDiscussionTask.sampleModelAnswer || '',
    isCorrect: discScore >= 4,
    skill: 'academic_discussion_argumentation',
    skillLabel: 'Argumentación Académica & Cohesión',
    explanation: discExplanationParts.join(' '),
    wordCount: discWordCount,
  });

  const rawScore = sentenceScore + emailScore + discScore;
  const maxScore = 10 + 5 + 5; // 20 raw points
  const scaledScore = calculateScaledScore(rawScore, maxScore);
  const percentage = Math.round((rawScore / maxScore) * 100);
  const { level, descriptor } = getCefrDetails(scaledScore);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (sentenceScore >= 8) {
    strengths.push('Gran dominio del orden sintáctico y cláusulas relativas en Build a Sentence.');
  } else {
    weaknesses.push('Dificultades con el orden de preguntas indirectas e inversión auxiliar.');
    recommendations.push('Repasa la estructura de preguntas indirectas ("Do you know if + S + V" sin invertir sujeto y verbo).');
  }

  if (aiEmail?.strengths?.length) strengths.push(...aiEmail.strengths.slice(0, 2));
  if (aiDisc?.strengths?.length) strengths.push(...aiDisc.strengths.slice(0, 2));
  if (aiEmail?.weaknesses?.length) weaknesses.push(...aiEmail.weaknesses.slice(0, 2));
  if (aiDisc?.weaknesses?.length) weaknesses.push(...aiDisc.weaknesses.slice(0, 2));

  if (discWordCount >= 100) {
    strengths.push('Desarrollo amplio de ideas superando el umbral de 100 palabras en la discusión académica.');
  } else {
    weaknesses.push('Longitud insuficiente en la discusión académica (menos de 100 palabras).');
    recommendations.push('Practica escribir al menos 2 párrafos concisos con conectores (Furthermore, However, Instead of).');
  }

  if (aiEmail?.recommendations?.length) recommendations.push(...aiEmail.recommendations.slice(0, 2));
  if (aiDisc?.recommendations?.length) recommendations.push(...aiDisc.recommendations.slice(0, 2));

  return {
    id: `writing_attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    testId: test.id,
    testTitle: test.title,
    timestamp: Date.now(),
    durationSeconds,
    rawScore,
    maxScore,
    scaledScore,
    percentage,
    cefrLevel: level,
    proficiencyDescriptor: descriptor,
    etsBandScore2026: scaled30ToEtsBand2026(scaledScore),
    testType: 'writing',
    aiDetailedEvaluations:
      aiEmail || aiDisc ? { writing: geminiWritingEvals } : undefined,
    breakdown: {
      buildSentence: {
        score: sentenceScore,
        total: 10,
        percentage: Math.round((sentenceScore / 10) * 100),
      },
      writeEmail: {
        score: emailScore,
        total: 5,
        percentage: Math.round((emailScore / 5) * 100),
        wordCount: emailWordCount,
      },
      academicDiscussion: {
        score: discScore,
        total: 5,
        percentage: Math.round((discScore / 5) * 100),
        wordCount: discWordCount,
      },
    },
    skillBreakdown: {
      sentence_syntax_grammar: {
        correct: sentenceScore,
        total: 10,
        name: 'Sintaxis y Estructura Gramatical',
      },
      email_communicative_intent: {
        correct: emailScore,
        total: 5,
        name: 'Email: Comunicación y Propósito',
      },
      academic_discussion_argumentation: {
        correct: discScore,
        total: 5,
        name: 'Discusión Académica: Argumentación y Cohesión',
      },
    },
    strengths: Array.from(new Set(strengths)),
    weaknesses: Array.from(new Set(weaknesses)),
    recommendations: Array.from(new Set(recommendations)),
    questionResults,
  };
}

export function evaluateSpeakingAttempt(
  test: SpeakingTest,
  repeatTranscripts: Record<string, string>,
  interviewTranscripts: Record<string, string>,
  durationSeconds: number,
  repeatAudioUrls: Record<string, string> = {},
  interviewAudioUrls: Record<string, string> = {},
  geminiSpeakingEvals: Record<string, GeminiSpeakingEvaluation> = {},
): TestAttempt {
  const questionResults: QuestionResultItem[] = [];
  let repeatScoreSum = 0;
  let interviewScore = 0;
  const aiStrengths: string[] = [];
  const aiWeaknesses: string[] = [];
  const aiRecommendations: string[] = [];

  // 1. Evaluate 7 Listen and Repeat questions (10s timer)
  test.repeatQuestions.forEach((q) => {
    const aiEval = geminiSpeakingEvals[q.id];
    const rawTranscript = (aiEval?.transcript || repeatTranscripts[q.id] || '').trim();
    let isCorrect = false;
    let explanationText = q.explanation;
    let displayUserAnswer = rawTranscript || '(Sin respuesta oral detectada - No evaluado)';

    if (aiEval) {
      if (!aiEval.evaluated || aiEval.overallScore <= 0) {
        isCorrect = false;
        explanationText = `No evaluado: ${aiEval.feedback}`;
        displayUserAnswer = rawTranscript || '(Sin voz comprensible detectada)';
      } else {
        const fraction = Math.max(0, Math.min(1, aiEval.overallScore / 6));
        repeatScoreSum += fraction;
        isCorrect = aiEval.overallScore >= 3.5;
        explanationText = `Evaluación IA (Banda ${aiEval.overallScore.toFixed(1)}/6.0): ${aiEval.feedback}`;
        if (aiEval.weaknesses?.length) aiWeaknesses.push(...aiEval.weaknesses);
        if (aiEval.recommendations?.length) aiRecommendations.push(...aiEval.recommendations);
      }
    } else if (rawTranscript.length > 0) {
      const targetWords = q.spokenSentence.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
      const userWords = rawTranscript.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
      const matches = targetWords.filter((tw) => userWords.includes(tw)).length;
      const matchRatio = targetWords.length > 0 ? matches / targetWords.length : 0;
      isCorrect = matchRatio >= 0.6;
      if (isCorrect) repeatScoreSum += 1;
      else if (matchRatio >= 0.35) repeatScoreSum += 0.5;
    } else {
      explanationText = 'No evaluado: No se registró voz ni transcripción en esta pregunta.';
    }

    questionResults.push({
      questionId: q.id,
      questionNumber: q.questionNumber,
      section: 'speaking_repeat',
      sectionLabel: 'Speaking • Listen and Repeat (10s)',
      prompt: q.spokenSentence,
      promptSpokenTranscript: q.spokenSentence,
      userAnswerText: displayUserAnswer,
      correctAnswerText: q.spokenSentence,
      isCorrect,
      skill: 'listen_and_repeat_pronunciation',
      skillLabel: 'Pronunciación y Precisión Fonética',
      explanation: explanationText,
      audioRecordingUrl: repeatAudioUrls[q.id],
    });
  });

  const repeatScore = Math.round(repeatScoreSum);

  // 2. Evaluate 4 Interview questions (45s timer)
  test.interviewQuestions.forEach((q) => {
    const aiEval = geminiSpeakingEvals[q.id];
    const userSpeech = (aiEval?.transcript || interviewTranscripts[q.id] || '').trim();
    const words = userSpeech.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    let qScore = 0;
    let explanationText = q.explanation;
    let displayUserAnswer = userSpeech || '(Sin respuesta oral detectada - No evaluado)';

    if (aiEval) {
      if (!aiEval.evaluated || aiEval.overallScore <= 0) {
        qScore = 0;
        explanationText = `No evaluado: ${aiEval.feedback}`;
        displayUserAnswer = userSpeech || '(Sin voz comprensible detectada)';
      } else {
        qScore = Math.max(1, Math.min(3, Math.round((aiEval.overallScore / 6) * 3)));
        explanationText = `Evaluación IA (Banda ${aiEval.overallScore.toFixed(1)}/6.0): ${aiEval.feedback}`;
        if (aiEval.strengths?.length) aiStrengths.push(...aiEval.strengths);
        if (aiEval.weaknesses?.length) aiWeaknesses.push(...aiEval.weaknesses);
        if (aiEval.recommendations?.length) aiRecommendations.push(...aiEval.recommendations);
      }
    } else {
      if (wordCount >= 50) qScore = 3;
      else if (wordCount >= 25) qScore = 2;
      else if (wordCount >= 5) qScore = 1;
      else {
        qScore = 0;
        explanationText = 'No evaluado: No se registró voz ni transcripción suficiente en esta entrevista.';
      }
    }

    interviewScore += qScore;

    questionResults.push({
      questionId: q.id,
      questionNumber: q.questionNumber,
      section: 'speaking_interview',
      sectionLabel: `Speaking • Interview: ${q.topic} (45s)`,
      prompt: q.questionSpoken,
      promptSpokenTranscript: q.questionSpoken,
      userAnswerText: displayUserAnswer,
      correctAnswerText: q.sampleModelAnswer,
      isCorrect: aiEval ? aiEval.evaluated && aiEval.overallScore >= 3.5 : qScore >= 2,
      skill: 'interview_fluency_coherence',
      skillLabel: 'Fluidez y Coherencia en Entrevista',
      explanation: explanationText,
      wordCount,
      audioRecordingUrl: interviewAudioUrls[q.id],
    });
  });

  const rawScore = repeatScore + interviewScore;
  const maxScore = 7 + 12; // 19 raw points
  const scaledScore = calculateScaledScore(rawScore, maxScore);
  const percentage = Math.round((rawScore / maxScore) * 100);
  const { level, descriptor } = getCefrDetails(scaledScore);

  const strengths: string[] = [...aiStrengths];
  const weaknesses: string[] = [...aiWeaknesses];
  const recommendations: string[] = [...aiRecommendations];

  if (repeatScore >= 5) {
    strengths.push('Gran precisión auditiva y respuesta inmediata en Listen and Repeat (10 segundos).');
  } else {
    weaknesses.push('Pérdida de palabras clave o ausencia de respuesta en Listen and Repeat.');
    recommendations.push('Recuerda que no hay tiempo de preparación: comienza a repetir inmediatamente al sonar el tono.');
  }

  if (interviewScore >= 8) {
    strengths.push('Fluidez y desarrollo completo de ideas durante los 45 segundos de entrevista.');
  } else {
    weaknesses.push('Respuestas breves o sin audio detectado en las preguntas de entrevista.');
    recommendations.push('Aprovecha los 45 segundos estructurando tu respuesta con opinión inicial, dos razones y ejemplos.');
  }

  return {
    id: `speaking_attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    testId: test.id,
    testTitle: test.title,
    timestamp: Date.now(),
    durationSeconds,
    rawScore,
    maxScore,
    scaledScore,
    percentage,
    cefrLevel: level,
    proficiencyDescriptor: descriptor,
    etsBandScore2026: scaled30ToEtsBand2026(scaledScore),
    testType: 'speaking',
    aiDetailedEvaluations:
      Object.keys(geminiSpeakingEvals).length > 0
        ? { speaking: geminiSpeakingEvals }
        : undefined,
    breakdown: {
      speakingRepeat: {
        score: repeatScore,
        total: 7,
        percentage: Math.round((repeatScore / 7) * 100),
      },
      speakingInterview: {
        score: interviewScore,
        total: 12,
        percentage: Math.round((interviewScore / 12) * 100),
      },
    },
    skillBreakdown: {
      listen_and_repeat_pronunciation: {
        correct: repeatScore,
        total: 7,
        name: 'Pronunciación y Retención Auditiva',
      },
      interview_fluency_coherence: {
        correct: interviewScore,
        total: 12,
        name: 'Fluidez y Coherencia en Entrevista',
      },
    },
    strengths: Array.from(new Set(strengths)).slice(0, 4),
    weaknesses: Array.from(new Set(weaknesses)).slice(0, 4),
    recommendations: Array.from(new Set(recommendations)).slice(0, 4),
    questionResults,
  };
}

export function evaluateFullExamAttempt(
  readingTest: ToeflTest,
  cwInputs: Record<string, string>,
  mcqAnswers: Record<string, number>,
  listeningTest: ListeningTest,
  listeningAnswers: Record<string, number>,
  writingTest: WritingTest,
  sentenceAnswers: Record<string, string[]>,
  emailText: string,
  discussionText: string,
  speakingTest: SpeakingTest,
  repeatTranscripts: Record<string, string>,
  interviewTranscripts: Record<string, string>,
  durationSeconds: number,
  repeatAudioUrls: Record<string, string> = {},
  interviewAudioUrls: Record<string, string> = {},
  examVariant: 'A' | 'B' = 'A',
  geminiSpeakingEvals: Record<string, GeminiSpeakingEvaluation> = {},
  geminiWritingEvals: {
    email?: GeminiWritingEvaluation;
    discussion?: GeminiWritingEvaluation;
  } = {},
): TestAttempt {
  // 1. Evaluate all 4 sections independently
  const evalReading = evaluateAttempt(readingTest, cwInputs, mcqAnswers, durationSeconds);
  const evalListening = evaluateListeningAttempt(listeningTest, listeningAnswers, durationSeconds);
  const evalWriting = evaluateWritingAttempt(
    writingTest,
    sentenceAnswers,
    emailText,
    discussionText,
    durationSeconds,
    geminiWritingEvals,
  );
  const evalSpeaking = evaluateSpeakingAttempt(
    speakingTest,
    repeatTranscripts,
    interviewTranscripts,
    durationSeconds,
    repeatAudioUrls,
    interviewAudioUrls,
    geminiSpeakingEvals,
  );

  const readingScaled = evalReading.scaledScore; // 0 - 30
  const listeningScaled = evalListening.scaledScore; // 0 - 30
  const writingScaled = evalWriting.scaledScore; // 0 - 30
  const speakingScaled = evalSpeaking.scaledScore; // 0 - 30
  const totalScaled = readingScaled + listeningScaled + writingScaled + speakingScaled; // 0 - 120

  const rBand = scaled30ToEtsBand2026(readingScaled);
  const lBand = scaled30ToEtsBand2026(listeningScaled);
  const wBand = scaled30ToEtsBand2026(writingScaled);
  const sBand = scaled30ToEtsBand2026(speakingScaled);
  const totalBand = total120ToEtsBand2026(rBand, lBand, wBand, sBand);

  const rawScore =
    evalReading.rawScore +
    evalListening.rawScore +
    evalWriting.rawScore +
    evalSpeaking.rawScore;
  const maxScore =
    evalReading.maxScore +
    evalListening.maxScore +
    evalWriting.maxScore +
    evalSpeaking.maxScore;
  const percentage = Math.round((totalScaled / 120) * 100);
  const { level, descriptor } = getFullExamCefrDetails(totalScaled);

  // Renumber question results sequentially from 1 to 71
  const questionResults: QuestionResultItem[] = [];
  let qNum = 1;

  evalReading.questionResults.forEach((q) => {
    questionResults.push({
      ...q,
      questionNumber: qNum++,
    });
  });

  evalListening.questionResults.forEach((q) => {
    questionResults.push({
      ...q,
      questionNumber: qNum++,
    });
  });

  evalWriting.questionResults.forEach((q) => {
    questionResults.push({
      ...q,
      questionNumber: qNum++,
    });
  });

  evalSpeaking.questionResults.forEach((q) => {
    questionResults.push({
      ...q,
      questionNumber: qNum++,
    });
  });

  // Aggregate skill breakdown
  const skillBreakdown = {
    ...evalReading.skillBreakdown,
    ...evalListening.skillBreakdown,
    ...evalWriting.skillBreakdown,
    ...evalSpeaking.skillBreakdown,
  };

  // Compile strengths, weaknesses, recommendations across all 4 sections
  const strengths = Array.from(
    new Set([
      ...evalReading.strengths,
      ...evalListening.strengths,
      ...evalWriting.strengths,
      ...evalSpeaking.strengths,
    ]),
  );

  const weaknesses = Array.from(
    new Set([
      ...evalReading.weaknesses,
      ...evalListening.weaknesses,
      ...evalWriting.weaknesses,
      ...evalSpeaking.weaknesses,
    ]),
  );

  const recommendations = Array.from(
    new Set([
      ...evalReading.recommendations,
      ...evalListening.recommendations,
      ...evalWriting.recommendations,
      ...evalSpeaking.recommendations,
    ]),
  );

  return {
    id: `full_exam_attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    testId:
      examVariant === 'B'
        ? 'toefl_ibt_full_simulation_b'
        : 'toefl_ibt_full_simulation_a',
    testTitle:
      examVariant === 'B'
        ? 'Opción B: Prueba Nueva Completa TOEFL iBT® (Reading, Listening, Writing & Speaking)'
        : 'Opción A: Prueba del TOEFL Completa (Reading, Listening, Writing & Speaking)',
    timestamp: Date.now(),
    durationSeconds,
    rawScore,
    maxScore,
    scaledScore: totalScaled, // 0 - 120 orientative equivalence
    percentage,
    cefrLevel: level,
    proficiencyDescriptor: descriptor,
    etsBandScore2026: totalBand,
    etsBandBreakdown2026: {
      reading: rBand,
      listening: lBand,
      writing: wBand,
      speaking: sBand,
      total: totalBand,
    },
    aiDetailedEvaluations: {
      speaking: geminiSpeakingEvals,
      writing: geminiWritingEvals,
    },
    testType: 'full',
    breakdown: {
      ...evalReading.breakdown,
      ...evalListening.breakdown,
      ...evalWriting.breakdown,
      ...evalSpeaking.breakdown,
      fullExam: {
        readingScaled,
        listeningScaled,
        writingScaled,
        speakingScaled,
        totalScaled,
      },
    },
    skillBreakdown,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    recommendations: recommendations.slice(0, 6),
    questionResults,
  };
}

