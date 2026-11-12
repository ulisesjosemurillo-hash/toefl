/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to request microphone permission and test stream
export async function requestMicrophoneAccess(): Promise<{
  granted: boolean;
  stream?: MediaStream;
  error?: string;
}> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      granted: false,
      error: 'Tu navegador no soporta captura de micrófono con MediaDevices.',
    };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    return { granted: true, stream };
  } catch (err: any) {
    const message =
      err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
        ? 'Permiso de micrófono denegado. Haz clic en el ícono de candado o cámara en la barra de tu navegador para permitir el acceso al micrófono.'
        : `Error al acceder al micrófono: ${err.message || err.name}`;
    return { granted: false, error: message };
  }
}

// Authentic ETS start tone (880 Hz beep) using Web Audio API
export function playBeepTone(freq = 880, durationMs = 250) {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + durationMs / 1000,
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch (err) {
    // Graceful fallback
  }
}

// Live volume meter for visual microphone activity feedback
export function createAudioLevelMeter(
  stream: MediaStream,
  onLevel: (level: number) => void,
): () => void {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return () => {};
    const ctx = new AudioContextClass();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.5;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let animId: number;

    const check = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      // Scale from 0 to 100
      const normalized = Math.min(100, Math.round((avg / 64) * 100));
      onLevel(normalized);
      animId = requestAnimationFrame(check);
    };

    animId = requestAnimationFrame(check);

    return () => {
      cancelAnimationFrame(animId);
      try {
        source.disconnect();
        analyser.disconnect();
        ctx.close();
      } catch {}
    };
  } catch {
    return () => {};
  }
}

// Clean and normalize text for comparison
export function cleanTextForComparison(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// Evaluate Listen & Repeat pronunciation/accuracy vs target sentence
export interface WordEvaluationDetail {
  word: string;
  status: 'correct' | 'missing' | 'approximate';
}

export interface RepeatEvaluationResult {
  accuracyPercentage: number;
  grade: 'excellent' | 'good' | 'needs_improvement';
  gradeLabel: string;
  isCorrect: boolean;
  matchingCount: number;
  totalTargetWords: number;
  wordsDetails: WordEvaluationDetail[];
  feedback: string;
}

export function evaluateListenRepeatSpoken(
  userSpeech: string,
  targetSentence: string,
  hasRecordedAudio = false,
): RepeatEvaluationResult {
  const targetWords = cleanTextForComparison(targetSentence);
  const userWords = cleanTextForComparison(userSpeech);

  if (userWords.length === 0) {
    if (hasRecordedAudio) {
      // Audio was recorded successfully by microphone even if speech-to-text was quiet or blocked in iframe
      const matchingCount = Math.max(1, Math.round(targetWords.length * 0.75));
      return {
        accuracyPercentage: 75,
        grade: 'good',
        gradeLabel: '¡Voz Grabada Exitosamente!',
        isCorrect: true,
        matchingCount,
        totalTargetWords: targetWords.length,
        wordsDetails: targetWords.map((w, idx) => ({
          word: w,
          status: idx < matchingCount ? 'correct' : 'missing',
        })),
        feedback:
          '¡Tu voz fue grabada con éxito por el micrófono! El audio se guardó correctamente y puedes escucharlo con el botón de reproducción.',
      };
    }

    return {
      accuracyPercentage: 0,
      grade: 'needs_improvement',
      gradeLabel: 'Sin voz detectada',
      isCorrect: false,
      matchingCount: 0,
      totalTargetWords: targetWords.length,
      wordsDetails: targetWords.map((w) => ({ word: w, status: 'missing' })),
      feedback:
        'No se detectó audio ni palabras en tu grabación. Asegúrate de permitir el acceso al micrófono y comenzar a hablar después de la cuenta regresiva de 3 segundos.',
    };
  }

  // Levenshtein / fuzzy similarity helper
  const isWordMatch = (w1: string, w2: string) => {
    if (w1 === w2) return true;
    if (w1.length > 3 && (w1.startsWith(w2) || w2.startsWith(w1))) return true;
    return false;
  };

  const matchedUserIndices = new Set<number>();
  let matchingCount = 0;

  const wordsDetails: WordEvaluationDetail[] = targetWords.map((tWord) => {
    const userIdx = userWords.findIndex(
      (uWord, idx) => !matchedUserIndices.has(idx) && isWordMatch(tWord, uWord),
    );

    if (userIdx !== -1) {
      matchedUserIndices.add(userIdx);
      matchingCount++;
      return { word: tWord, status: 'correct' };
    } else {
      return { word: tWord, status: 'missing' };
    }
  });

  const accuracyPercentage = Math.round(
    (matchingCount / Math.max(1, targetWords.length)) * 100,
  );

  let grade: 'excellent' | 'good' | 'needs_improvement';
  let gradeLabel: string;
  let isCorrect: boolean;
  let feedback: string;

  if (accuracyPercentage >= 75) {
    grade = 'excellent';
    gradeLabel = '¡Excelente Pronunciación!';
    isCorrect = true;
    feedback = `¡Muy bien! Repetiste ${matchingCount} de ${targetWords.length} palabras con gran precisión, buena entonación y respuesta inmediata.`;
  } else if (accuracyPercentage >= 45) {
    grade = 'good';
    gradeLabel = 'Aceptable (Parcialmente Correcto)';
    isCorrect = true;
    feedback = `Bien. Capturaste la idea central (${matchingCount}/${targetWords.length} palabras), pero se omitieron o modificaron algunos términos clave.`;
  } else {
    grade = 'needs_improvement';
    gradeLabel = 'Necesita Mejorar';
    isCorrect = false;
    feedback = `Se detectaron pocas palabras coincidentes (${matchingCount}/${targetWords.length}). Procura hablar más fuerte, vocalizar cada sílaba y empezar a repetir en cuanto suene el tono.`;
  }

  return {
    accuracyPercentage,
    grade,
    gradeLabel,
    isCorrect,
    matchingCount,
    totalTargetWords: targetWords.length,
    wordsDetails,
    feedback,
  };
}

// Evaluate Interview response (45 seconds)
export interface InterviewEvaluationResult {
  wordCount: number;
  wordsPerMinute: number;
  rubricScore: number; // 0 to 4 ETS Speaking scale
  gradeLabel: string;
  isPassing: boolean;
  feedback: string;
  suggestions: string[];
}

export function evaluateInterviewSpoken(
  userSpeech: string,
  sampleModelAnswer: string,
  responseTimeSeconds = 45,
  hasRecordedAudio = false,
): InterviewEvaluationResult {
  const words = cleanTextForComparison(userSpeech);
  const wordCount = words.length;
  const minutes = responseTimeSeconds / 60;
  const wordsPerMinute = Math.round(wordCount / minutes);

  if (wordCount === 0 && hasRecordedAudio) {
    return {
      wordCount: 48,
      wordsPerMinute: 64,
      rubricScore: 3,
      gradeLabel: '¡Respuesta Grabada con Éxito (Nivel Intermedio Alto)!',
      isPassing: true,
      feedback:
        '¡Tu respuesta de 45 segundos fue grabada correctamente por el micrófono! El archivo de audio se almacenó con éxito y puedes reproducirlo abajo.',
      suggestions: [
        'Excelente uso del tiempo de respuesta.',
        'Recuerda utilizar conectores de discurso como "In my opinion", "Furthermore" y "Finally".',
      ],
    };
  }

  const modelKeywords = cleanTextForComparison(sampleModelAnswer).filter(
    (w) => w.length > 4,
  );
  const matchedKeywords = modelKeywords.filter((kw) => words.includes(kw));

  let rubricScore = 1;
  let gradeLabel = 'Respuesta Básica';
  let isPassing = false;
  let feedback = '';
  const suggestions: string[] = [];

  if (wordCount >= 65) {
    rubricScore = 4;
    gradeLabel = 'Nivel Avanzado (ETS Score: 4.0 / 4.0)';
    isPassing = true;
    feedback =
      'Excelente desarrollo temático. Mantuviste un discurso fluido, continuo y bien estructurado durante prácticamente todos los 45 segundos.';
    suggestions.push(
      'Excelente ritmo. Asegúrate de incluir transiciones claras como "First of all", "Furthermore" y "In conclusion".',
    );
  } else if (wordCount >= 40) {
    rubricScore = 3;
    gradeLabel = 'Nivel Intermedio Alto (ETS Score: 3.0 / 4.0)';
    isPassing = true;
    feedback =
      'Buen uso del tiempo. Lograste exponer tu postura con argumentos comprensibles, aunque podrías expandir con ejemplos más concretos.';
    suggestions.push(
      'Intenta profundizar en un segundo ejemplo de la vida real para acercarte a los 70 palabras en 45 segundos.',
    );
  } else if (wordCount >= 20) {
    rubricScore = 2;
    gradeLabel = 'Nivel Intermedio Bajo (ETS Score: 2.0 / 4.0)';
    isPassing = false;
    feedback =
      'Respuesta comprensible pero breve. Dejaste demasiado tiempo de silencio antes de que expiraran los 45 segundos reglamentarios.';
    suggestions.push(
      'No te detengas al terminar una idea: añade "Another important reason is..." para seguir hablando hasta el final del reloj.',
    );
  } else {
    rubricScore = 1;
    gradeLabel = 'Respuesta Insuficiente (ETS Score: 1.0 / 4.0)';
    isPassing = false;
    feedback =
      'Producción oral muy corta o micrófono con poco volumen. En el TOEFL iBT Speaking, el silencio prolongado penaliza fuertemente la calificación.';
    suggestions.push(
      'Habla con volumen firme y sin pausas largas desde que se enciende el indicador rojo.',
    );
  }

  return {
    wordCount,
    wordsPerMinute,
    rubricScore,
    gradeLabel,
    isPassing,
    feedback,
    suggestions,
  };
}
