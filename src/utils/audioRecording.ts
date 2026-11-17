/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const MIC_DEVICE_STORAGE_KEY = 'toefl_selected_mic_device_id';

export function getSavedMicDeviceId(): string {
  try {
    return localStorage.getItem(MIC_DEVICE_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setSavedMicDeviceId(deviceId: string): void {
  try {
    if (deviceId) {
      localStorage.setItem(MIC_DEVICE_STORAGE_KEY, deviceId);
    } else {
      localStorage.removeItem(MIC_DEVICE_STORAGE_KEY);
    }
  } catch {}
}

export function getSupportedAudioMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  for (const mime of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(mime)) return mime;
    } catch {}
  }
  return '';
}

// Helper to request microphone permission and test stream
export async function requestMicrophoneAccess(deviceId?: string): Promise<{
  granted: boolean;
  stream?: MediaStream;
  error?: string;
}> {
  if (typeof window !== 'undefined' && !window.isSecureContext) {
    return {
      granted: false,
      error:
        'El acceso al micrófono requiere un entorno seguro (HTTPS o localhost). Abre la aplicación en HTTPS o localhost para grabar audio.',
    };
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      granted: false,
      error:
        'Tu navegador o el contenedor iframe actual no permite MediaDevices/getUserMedia. Verifica que los permisos de micrófono no estén bloqueados.',
    };
  }

  const targetDevice = deviceId || getSavedMicDeviceId();

  try {
    const audioConstraints: MediaTrackConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    };
    if (targetDevice) {
      audioConstraints.deviceId = { ideal: targetDevice };
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: audioConstraints,
    });
    return { granted: true, stream };
  } catch (err: any) {
    const errName = err?.name || '';
    let message = `Error al acceder al micrófono: ${err?.message || errName}`;
    if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
      message =
        'Permiso de micrófono denegado (NotAllowedError). Haz clic en el ícono de candado/configuración en la barra de direcciones del navegador, cambia Micrófono a "Permitir" y recarga si es necesario.';
    } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
      message =
        'No se detectó ningún micrófono conectado (NotFoundError). Conecta un micrófono o auricular con entrada de voz y vuelve a intentarlo.';
    } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
      message =
        'El micrófono está siendo utilizado por otra aplicación o no se puede leer (NotReadableError). Cierra otras apps de videollamada e intenta de nuevo.';
    }
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
    return {
      accuracyPercentage: 0,
      grade: 'needs_improvement',
      gradeLabel: 'No evaluado / Sin voz detectada',
      isCorrect: false,
      matchingCount: 0,
      totalTargetWords: targetWords.length,
      wordsDetails: targetWords.map((w) => ({ word: w, status: 'missing' })),
      feedback:
        'No se detectó audio comprensible en la grabación (No evaluado). Asegúrate de conceder acceso al micrófono y comenzar a hablar con volumen claro inmediatamente después de la cuenta regresiva de 3 segundos.',
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

  if (wordCount === 0) {
    return {
      wordCount: 0,
      wordsPerMinute: 0,
      rubricScore: 0,
      gradeLabel: 'No evaluado / Sin respuesta oral',
      isPassing: false,
      feedback:
        'No se detectó voz ni audio comprensible en tu grabación (No evaluado). Para recibir puntaje en el TOEFL iBT Speaking, debes responder oralmente durante los 45 segundos utilizando tu micrófono.',
      suggestions: [
        'Asegúrate de permitir el acceso al micrófono en el navegador.',
        'Comienza a hablar inmediatamente al terminar los 3 segundos de preparación.',
        'Habla con voz clara y constante frente al micrófono.',
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

export interface MispronouncedWordItem {
  word: string;
  detectedAs: string;
  advice: string;
}

export interface GrammarErrorItem {
  mistake: string;
  correction: string;
  explanation: string;
}

export interface GeminiSpeakingEvaluation {
  evaluated: boolean;
  hasSpeech?: boolean;
  status?: 'evaluated' | 'unrecorded';
  overallScore: number; // 1.0 - 6.0 ETS scale (0 if not evaluated)
  scaledScore30: number; // 0 - 30 scale
  cefrLevel?: string;
  transcript?: string;
  pronunciationScore?: number;
  fluencyScore?: number;
  grammarScore?: number;
  vocabularyScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  feedback: string;
  mispronouncedWords?: Array<MispronouncedWordItem | string>;
  grammarErrors?: Array<GrammarErrorItem | string>;
  recommendations?: string[];
  modelResponse?: string;
}

export async function evaluateSpeakingWithGemini(
  audioBlob: Blob | undefined,
  userTranscript: string,
  expectedPrompt: string,
  sectionType: 'repeat' | 'interview',
  topic?: string,
  durationSeconds?: number,
  sampleAnswer?: string,
): Promise<GeminiSpeakingEvaluation> {
  // If no audio blob and no transcript
  if (
    (!audioBlob || audioBlob.size < 1500) &&
    (!userTranscript || userTranscript.trim().length < 3)
  ) {
    return {
      evaluated: false,
      hasSpeech: false,
      status: 'unrecorded',
      overallScore: 0,
      scaledScore30: 0,
      feedback:
        'No evaluado: No se detectó audio en la grabación. Se requiere grabación de voz real para evaluar.',
      recommendations: [
        'Asegúrate de conceder permisos de micrófono en el navegador.',
        'Comienza a hablar inmediatamente después de la cuenta regresiva de 3 segundos.',
      ],
    };
  }

  try {
    let audioBase64 = '';
    let mimeType = 'audio/webm';
    if (audioBlob && audioBlob.size > 1500) {
      mimeType = audioBlob.type || 'audio/webm';
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = (reader.result as string) || '';
          const commaIdx = res.indexOf(',');
          resolve(commaIdx !== -1 ? res.substring(commaIdx + 1) : res);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);
      audioBase64 = await base64Promise;
    }

    const resp = await fetch('/api/evaluate-speaking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64,
        mimeType,
        expectedPrompt,
        userTranscript,
        sectionType,
        taskType: sectionType,
        targetSentence: sectionType === 'repeat' ? expectedPrompt : '',
        questionPrompt: sectionType === 'interview' ? expectedPrompt : '',
        sampleAnswer: sampleAnswer || '',
        topic,
        durationSeconds,
      }),
    });

    if (!resp.ok) {
      throw new Error(`Server returned ${resp.status}`);
    }

    const data: GeminiSpeakingEvaluation = await resp.json();
    return data;
  } catch (err) {
    console.warn('Gemini speaking evaluation error:', err);
    const words = cleanTextForComparison(userTranscript || '');
    if (words.length === 0) {
      return {
        evaluated: false,
        hasSpeech: false,
        status: 'unrecorded',
        overallScore: 0,
        scaledScore30: 0,
        feedback:
          'No evaluado: No fue posible analizar el audio en el servidor y el navegador no capturó transcripción.',
      };
    }

    if (sectionType === 'repeat') {
      const repeatRes = evaluateListenRepeatSpoken(userTranscript, expectedPrompt, false);
      const band = Math.max(1.0, Math.min(6.0, Math.round((1.0 + (repeatRes.accuracyPercentage / 100) * 5.0) * 2) / 2));
      return {
        evaluated: true,
        hasSpeech: true,
        status: 'evaluated',
        overallScore: band,
        scaledScore30: Math.round((band / 6) * 30),
        transcript: userTranscript,
        feedback: `Estimación local basada en coincidencia léxica (${repeatRes.accuracyPercentage}%). No se pudo contactar al servicio de evaluación acústica IA.`,
      };
    } else {
      const ivRes = evaluateInterviewSpoken(userTranscript, sampleAnswer || expectedPrompt, durationSeconds || 45, true);
      const band = Math.max(1.0, Math.min(6.0, Math.round(((ivRes.rubricScore / 4) * 5.0 + 1.0) * 2) / 2));
      return {
        evaluated: true,
        hasSpeech: true,
        status: 'evaluated',
        overallScore: band,
        scaledScore30: Math.round((band / 6) * 30),
        transcript: userTranscript,
        feedback: `Estimación local basada en fluidez textual (${words.length} palabras). Conecta el servidor IA para evaluación fonética completa.`,
      };
    }
  }
}

export interface GeminiWritingEvaluation {
  success?: boolean;
  status: 'evaluated' | 'insufficient';
  wordCount: number;
  overallScore: number; // 1.0 - 6.0 (or 0 if insufficient)
  scaledScore30: number;
  cefrLevel: string;
  taskFulfillmentScore?: number;
  organizationScore?: number;
  grammarScore?: number;
  vocabularyScore?: number;
  grammarErrors?: GrammarErrorItem[];
  vocabularyImprovements?: Array<{
    original: string;
    advancedAlternative: string;
    context: string;
  }>;
  strengths?: string[];
  weaknesses?: string[];
  feedback: string;
  recommendations: string[];
  improvedSample?: string;
}

export async function evaluateWritingWithGemini(
  taskType: 'email' | 'academic_discussion',
  scenario: string,
  instructions: string[],
  userResponse: string,
  minimumWords = 100,
): Promise<GeminiWritingEvaluation | null> {
  const trimmed = (userResponse || '').trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  if (words.length < 5) {
    return {
      status: 'insufficient',
      wordCount: words.length,
      overallScore: 0,
      scaledScore30: 0,
      cefrLevel: 'Below B1',
      feedback: 'No evaluado / Insuficiente: La respuesta escrita tiene menos de 5 palabras.',
      recommendations: [
        'Escribe párrafos completos respondiendo a todas las instrucciones de la tarea.',
      ],
    };
  }

  try {
    const resp = await fetch('/api/evaluate-writing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskType,
        scenario,
        instructions,
        userResponse: trimmed,
        minimumWords,
      }),
    });
    if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
    return (await resp.json()) as GeminiWritingEvaluation;
  } catch (err) {
    console.warn('Writing AI evaluation failed, using deterministic fallback:', err);
    return null;
  }
}


