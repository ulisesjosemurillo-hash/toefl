/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const PORT = 3000;

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey || undefined,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint to generate a brand new TOEFL iBT Reading Practice Set
app.post('/api/generate-test', async (req: Request, res: Response) => {
  try {
    const { topic = 'Ciencia general o historia' } = req.body;

    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY no configurada. Puedes utilizar los exámenes preconstruidos.',
      });
    }

    const prompt = `You are an expert official ETS TOEFL iBT Reading test designer.
Create an authentic, high-quality TOEFL iBT Reading Practice Module on the topic: "${topic}".
Follow this EXACT 3-part structure strictly:

1. COMPLETE THE WORDS (STRICT OFFICIAL ETS TOEFL RULES):
- A coherent paragraph (approx 70-90 words).
- Exactly 7 target words.
- CRITICAL LENGTH CONSTRAINT: In the official TOEFL test, the missing letters ("answer") MUST BE STRICTLY 1, 2, OR AT MOST 3 LETTERS LONG (Maximum 3 spaces). NEVER 4 OR MORE!
- The "prefix" must contain the main body/stem of the word, leaving ONLY the final 1 to 3 letters as the missing blank "answer" (for example: word endings/suffixes like -ING, -ED, -ER, -SIC, -PLE, -M, -RD, -LY, -ES, -AL, -ON, -ND).
- The missing lengths must alternate between 1, 2, and 3 letters (e.g., 3, 2, 3, 1, 2, 3, 2).
- Example from ETS official exam:
  * mi[GHT] (prefix: "mi", answer: "GHT", length: 3)
  * peo[PLE] (prefix: "peo", answer: "PLE", length: 3)
  * ba[SIC] (prefix: "ba", answer: "SIC", length: 3)
  * Howev[ER] (prefix: "Howev", answer: "ER", length: 2)
  * fro[M] (prefix: "fro", answer: "M", length: 1)
  * reco[RD] (prefix: "reco", answer: "RD", length: 2)
  * danc[ING] (prefix: "danc", answer: "ING", length: 3)

2. READ IN DAILY LIFE (Notice):
- An authentic campus notice, municipal update, library policy, public transit bulletin, or workplace memo (approx 50-80 words).
- Title and optional subtitle.
- Exactly 2 multiple-choice questions (4 options each, one clear correct answer with 0-based index, and explanation).

3. READ AN ACADEMIC PASSAGE:
- An academic passage of 3 well-written paragraphs (approx 250-320 words) suitable for first-year university reading level (natural sciences, history, psychology, archaeology, or sociology).
- Passage title.
- Exactly 5 multiple-choice questions:
  Question 1: Main Idea of passage ('academic_main_idea')
  Question 2: Vocabulary in Context ('academic_vocabulary') - provide the highlighted word that appears in paragraph 1 or 2.
  Question 3: Factual Information ('academic_factual')
  Question 4: Negative Factual / EXCEPT question ('academic_negative_factual') - format: "According to the passage, all of the following are true EXCEPT:"
  Question 5: Inference or Author's Purpose ('academic_inference') - format e.g. "Why does the author mention..." or "What can be inferred..."
- Each question must have 4 options, a correct 0-based answer index, skill tag, and clear explanation.

Return ONLY valid JSON matching the requested structure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: {
              type: Type.STRING,
              enum: ['Standard', 'Challenging', 'Diagnostic'],
            },
            estimatedMinutes: { type: Type.INTEGER },
            completeWords: {
              type: Type.OBJECT,
              properties: {
                instruction: { type: Type.STRING },
                fullTextWithBlanks: { type: Type.STRING },
                passageSegments: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, enum: ['text', 'word'] },
                      text: { type: Type.STRING },
                      prefix: { type: Type.STRING },
                      answer: { type: Type.STRING },
                      length: { type: Type.INTEGER },
                    },
                    required: ['type'],
                  },
                },
              },
              required: [
                'instruction',
                'fullTextWithBlanks',
                'passageSegments',
              ],
            },
            dailyLifeNotice: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                contentHtml: { type: Type.STRING },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctAnswer: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                      skill: { type: Type.STRING },
                    },
                    required: [
                      'question',
                      'options',
                      'correctAnswer',
                      'explanation',
                    ],
                  },
                },
              },
              required: ['title', 'contentHtml', 'questions'],
            },
            academicPassage: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                paragraphs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      highlightedWord: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctAnswer: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                      skill: { type: Type.STRING },
                    },
                    required: [
                      'question',
                      'options',
                      'correctAnswer',
                      'explanation',
                      'skill',
                    ],
                  },
                },
              },
              required: ['title', 'paragraphs', 'questions'],
            },
          },
          required: [
            'title',
            'category',
            'difficulty',
            'completeWords',
            'dailyLifeNotice',
            'academicPassage',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const testId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Format into standard ToeflTest object
    let wordCounter = 1;
    const passageTextSegments = parsed.completeWords.passageSegments.map(
      (seg: any) => {
        if (seg.type === 'word') {
          let ans = (seg.answer || '').toUpperCase().trim();
          let prefix = seg.prefix || '';

          // If answer is longer than 3 letters, push the excess into the prefix!
          if (ans.length > 3) {
            const excess = ans.slice(0, ans.length - 3);
            prefix = prefix + excess.toLowerCase();
            ans = ans.slice(-3);
          } else if (ans.length === 0) {
            ans = 'ED';
          }

          const item = {
            id: `cw-gen-${wordCounter++}`,
            prefix,
            answer: ans,
            length: ans.length,
          };
          return { type: 'word' as const, item };
        }
        return { type: 'text' as const, text: seg.text || '' };
      },
    );

    const formattedTest = {
      id: testId,
      title: parsed.title || `Examen Generado: ${topic}`,
      category: parsed.category || 'Lectura Académica & General',
      difficulty: parsed.difficulty || 'Standard',
      estimatedMinutes: parsed.estimatedMinutes || 18,
      isAiGenerated: true,
      completeWords: {
        id: `cw_${testId}`,
        instruction:
          parsed.completeWords.instruction ||
          'Fill in the missing letters in the paragraph.',
        fullTextWithBlanks: parsed.completeWords.fullTextWithBlanks || '',
        passageTextSegments,
      },
      dailyLifeNotice: {
        id: `notice_${testId}`,
        title: parsed.dailyLifeNotice?.title || 'Official Campus Bulletin',
        subtitle: parsed.dailyLifeNotice?.subtitle || '',
        format: parsed.dailyLifeNotice?.format === 'social_media_post' ? 'social_media_post' : 'notice',
        author: parsed.dailyLifeNotice?.author || 'Sofia Baker',
        contentHtml: parsed.dailyLifeNotice?.contentHtml || '',
        questions: (parsed.dailyLifeNotice?.questions || []).map(
          (q: any, idx: number) => ({
            id: `gen_notice_q${idx + 1}`,
            question: q.question || 'What is the main purpose of this announcement?',
            options:
              Array.isArray(q.options) && q.options.length >= 4
                ? q.options.slice(0, 4)
                : [
                    'To inform students about campus facility updates',
                    'To schedule an in-person meeting with an advisor',
                    'To introduce a new institutional policy',
                    'To cancel upcoming academic services',
                  ],
            correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 ? q.correctAnswer : 0,
            explanation: q.explanation || 'The notice provides essential details about administrative changes.',
            skill: 'daily_life_scanning',
          }),
        ),
      },
      academicPassage: {
        id: `acad_${testId}`,
        title: parsed.academicPassage?.title || 'Academic Reading Passage',
        paragraphs:
          Array.isArray(parsed.academicPassage?.paragraphs) && parsed.academicPassage.paragraphs.length > 0
            ? parsed.academicPassage.paragraphs
            : [
                'In the natural sciences and history, phenomena develop through complex interdependent factors that researchers observe through rigorous empirical methodology.',
                'Further examination demonstrates that specialized adaptations enable organisms and historical institutions to endure changing selective pressures over time.',
                'Modern analytical discoveries continue to challenge prevailing theoretical frameworks, expanding our scientific understanding of global ecological and cultural dynamics.',
              ],
        questions: (() => {
          const rawQs = Array.isArray(parsed.academicPassage?.questions)
            ? parsed.academicPassage.questions
            : [];
          
          const defaultSkills = [
            'academic_main_idea',
            'academic_vocabulary',
            'academic_factual',
            'academic_negative_factual',
            'academic_inference',
          ];

          const defaultPrompts = [
            'What is the passage mainly about?',
            'The word highlighted in the text is closest in meaning to',
            'According to the passage, which of the following is true?',
            'According to the passage, all of the following are true EXCEPT:',
            'What can be inferred from the author\'s analysis in the final paragraph?',
          ];

          const formatted = rawQs.map((q: any, idx: number) => ({
            id: `gen_acad_q${idx + 1}`,
            question: q.question || defaultPrompts[idx] || `Academic Question ${idx + 1}`,
            highlightedWord: q.highlightedWord,
            options:
              Array.isArray(q.options) && q.options.length >= 4
                ? q.options.slice(0, 4)
                : [
                    'It demonstrates the primary evolutionary adaptation described.',
                    'It represents a secondary theoretical contradiction in recent research.',
                    'It illustrates the fundamental mechanism underlying the phenomenon.',
                    'It highlights an exceptional case that disproves earlier assumptions.',
                  ],
            correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 ? q.correctAnswer : 1,
            explanation: q.explanation || 'The passage provides textual evidence supporting this conclusion.',
            skill: q.skill || defaultSkills[idx] || 'academic_factual',
          }));

          // Ensure exactly at least 5 questions
          while (formatted.length < 5) {
            const nextIdx = formatted.length;
            formatted.push({
              id: `gen_acad_q${nextIdx + 1}`,
              question: defaultPrompts[nextIdx] || `Academic Question ${nextIdx + 1}`,
              highlightedWord: undefined,
              options: [
                'It demonstrates the primary scientific pattern described in the text.',
                'It contradicts traditional hypotheses held by previous investigators.',
                'It provides verifiable evidence supporting the author\'s central thesis.',
                'It emphasizes the practical challenges associated with experimental research.',
              ],
              correctAnswer: 2,
              explanation: 'The passage directly supports this assertion through detailed textual evidence.',
              skill: defaultSkills[nextIdx] || 'academic_factual',
            });
          }

          return formatted;
        })(),
      },
    };

    res.json({ success: true, test: formattedTest });
  } catch (error: any) {
    console.error('Error generating TOEFL test:', error);
    res.status(500).json({
      error: 'Error al generar el examen con IA. Puedes usar los exámenes preinstalados.',
      details: error.message,
    });
  }
});

// Endpoint for Personalized AI Tutor Diagnostic
app.post('/api/analyze-diagnostic', async (req: Request, res: Response) => {
  try {
    const { attempt } = req.body;
    if (!apiKey || !attempt) {
      return res.status(200).json({
        feedback:
          'Para maximizar tu puntaje en el TOEFL iBT, enfócate en descartar distractores que usen palabras idénticas al texto con significado distorsionado, y practica la búsqueda activa de oraciones de apoyo.',
      });
    }

    const mistakes = (attempt.questionResults || [])
      .filter((q: any) => !q.isCorrect)
      .map((q: any) => ({
        section: q.sectionLabel,
        prompt: q.prompt,
        userAnswer: q.userAnswerText,
        correctAnswer: q.correctAnswerText,
        skill: q.skillLabel,
      }));

    const sectionLabel = attempt.testType === 'full' ? 'Full TOEFL iBT Simulation (Reading, Listening, Writing, Speaking)' : attempt.testType || 'Reading';
    const band2026 = attempt.etsBandScore2026 ? `${attempt.etsBandScore2026}/6.0 (ETS 2026)` : '';
    const prompt = `You are a certified senior TOEFL iBT tutor.
Analyze this student's TOEFL ${sectionLabel} performance:
- Score: ${attempt.scaledScore}/${attempt.testType === 'full' ? 120 : 30} ${band2026 ? `• ${band2026}` : ''} (Raw: ${attempt.rawScore}/${attempt.maxScore})
- CEFR Level: ${attempt.cefrLevel} (${attempt.proficiencyDescriptor})
- Time spent: ${Math.round(attempt.durationSeconds / 60)} minutes
- Sample mistakes / missed items (${mistakes.length}):
${JSON.stringify(mistakes.slice(0, 20), null, 2)}

Provide a warm, highly professional diagnostic in Spanish that includes:
1. "Diagnóstico de Rendimiento": Clear assessment of their current level and section balance.
2. "Patrones de Error Identificados": Exactly why they missed these specific questions or tasks.
3. "Plan de Acción Inmediato": 3 concrete, high-leverage drill exercises to raise their ETS 2026 band score on their next test.

Keep the tone encouraging, concise, actionable, and formatted in clean markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
    });

    res.json({
      success: true,
      feedback: response.text,
    });
  } catch (error: any) {
    console.error('Error analyzing performance:', error);
    res.json({
      success: false,
      feedback:
        'Excelente esfuerzo. Revisa el análisis detallado por categoría abajo para identificar tus oportunidades de mejora clave.',
    });
  }
});

// Endpoint for real native English voice synthesis (Gemini TTS)
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName, speakerGender } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    // Select natural voice based on speaker gender if voiceName is not specified
    let selectedVoice = voiceName;
    if (!selectedVoice) {
      if (speakerGender === 'male') {
        const maleVoices = ['Puck', 'Fenrir', 'Charon'];
        selectedVoice = maleVoices[Math.floor(Math.random() * maleVoices.length)];
      } else {
        const femaleVoices = ['Kore', 'Zephyr', 'Aoede'];
        selectedVoice = femaleVoices[Math.floor(Math.random() * femaleVoices.length)];
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: text,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: selectedVoice,
            },
          },
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    const base64Data = part?.inlineData?.data;

    if (!base64Data) {
      return res.status(502).json({ error: 'No audio data received from Gemini TTS.' });
    }

    res.json({
      audioBase64: base64Data,
      mimeType: part?.inlineData?.mimeType || 'audio/wav',
      voiceName: selectedVoice,
    });
  } catch (error: any) {
    console.error('TTS generation error:', error?.message || error);
    res.status(500).json({ error: 'Failed to generate speech audio.' });
  }
});

// Endpoint for AI-powered evaluation of user speaking responses (Audio + Real Gemini Analysis)
app.post('/api/evaluate-speaking', async (req: Request, res: Response) => {
  try {
    const {
      audioBase64 = '',
      mimeType = 'audio/webm',
      taskType,
      sectionType,
      targetSentence = '',
      questionPrompt = '',
      expectedPrompt = '',
      userTranscript = '',
      topic = '',
      sampleAnswer = '',
      durationSeconds = 10,
    } = req.body;

    const resolvedTaskType: 'repeat' | 'interview' =
      (taskType || sectionType) === 'interview' ? 'interview' : 'repeat';
    const resolvedPrompt = expectedPrompt || targetSentence || questionPrompt || '';
    const trimmedTranscript = (userTranscript || '').trim();
    const hasValidAudio = typeof audioBase64 === 'string' && audioBase64.length >= 1200;

    if (!hasValidAudio && trimmedTranscript.length < 3) {
      return res.json({
        success: true,
        evaluated: false,
        status: 'unrecorded',
        hasSpeech: false,
        overallScore: 0,
        scaledScore30: 0,
        cefrLevel: 'Below B1',
        transcript: '',
        pronunciationScore: 0,
        fluencyScore: 0,
        grammarScore: 0,
        vocabularyScore: 0,
        mispronouncedWords: [],
        grammarErrors: [],
        strengths: [],
        weaknesses: ['No se detectó señal de audio suficiente o la grabación está vacía.'],
        feedback:
          'No evaluado: No se detectó audio válido ni habla comprensible en la grabación. Verifica que tu micrófono esté habilitado, con volumen audible y habla claramente después de la cuenta regresiva.',
        recommendations: [
          'Revisa la selección del dispositivo de entrada en el botón de micrófono.',
          'Realiza la grabación de prueba de 3 segundos para confirmar que escuchas tu voz.',
          'Comienza a hablar inmediatamente después del tono de inicio.',
        ],
        modelResponse: sampleAnswer || resolvedPrompt,
      });
    }

    if (!apiKey) {
      // Without API key: do NOT invent acoustic/phonetic scores if there is no speech recognition transcript
      const words = trimmedTranscript.split(/\s+/).filter(Boolean);
      if (words.length === 0) {
        return res.json({
          success: true,
          evaluated: false,
          status: 'unrecorded',
          hasSpeech: false,
          overallScore: 0,
          scaledScore30: 0,
          cefrLevel: 'Below B1',
          transcript: '',
          pronunciationScore: 0,
          fluencyScore: 0,
          grammarScore: 0,
          vocabularyScore: 0,
          mispronouncedWords: [],
          grammarErrors: [],
          strengths: [],
          weaknesses: ['Servicio de evaluación IA no configurado y sin transcripción del navegador.'],
          feedback:
            'No evaluado: Audio capturado localmente, pero se requiere configurar GEMINI_API_KEY en el servidor para analizar audio real sin transcripción del navegador.',
          recommendations: ['Configura GEMINI_API_KEY para habilitar la evaluación acústica real con Gemini.'],
          modelResponse: sampleAnswer || resolvedPrompt,
        });
      }

      const wordMatchRatio =
        resolvedTaskType === 'repeat' && resolvedPrompt
          ? (() => {
              const target = resolvedPrompt.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
              const spoken = words.map((w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
              const matched = target.filter((w: string) => spoken.includes(w)).length;
              return target.length > 0 ? matched / target.length : 0;
            })()
          : Math.min(1, words.length / 55);

      const estBand = Math.max(1.0, Math.min(6.0, Math.round((1.0 + wordMatchRatio * 4.5) * 2) / 2));
      return res.json({
        success: true,
        evaluated: true,
        status: 'evaluated',
        hasSpeech: true,
        overallScore: estBand,
        scaledScore30: Math.round((estBand / 6) * 30),
        cefrLevel: estBand >= 4.5 ? 'C1/C2' : estBand >= 3.5 ? 'B2' : 'B1',
        transcript: trimmedTranscript,
        pronunciationScore: estBand,
        fluencyScore: estBand,
        grammarScore: estBand,
        vocabularyScore: estBand,
        mispronouncedWords: [],
        grammarErrors: [],
        strengths: ['Transcripción capturada correctamente durante la respuesta.'],
        weaknesses: ['Para análisis fonético detallado del audio, configura GEMINI_API_KEY en el entorno.'],
        feedback: `Estimación de práctica basada en transcripción (${words.length} palabras detectadas). Nota: La evaluación detallada de pronunciación requiere GEMINI_API_KEY.`,
        recommendations: ['Habla con ritmo constante y pronuncia las terminaciones consonánticas con claridad.'],
        modelResponse: sampleAnswer || resolvedPrompt,
      });
    }

    let cleanMime = mimeType.split(';')[0].trim();
    if (!['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/mp4', 'audio/aac'].includes(cleanMime)) {
      cleanMime = 'audio/webm';
    }

    const parts: any[] = [];
    if (hasValidAudio) {
      parts.push({
        inlineData: {
          mimeType: cleanMime,
          data: audioBase64,
        },
      });
    }

    const taskDescription =
      resolvedTaskType === 'repeat'
        ? `Task: Official ETS TOEFL iBT Speaking "Listen and Repeat" (${durationSeconds} seconds response).
Target sentence the student had to accurately repeat:
"${resolvedPrompt}"`
        : `Task: Official ETS TOEFL iBT Speaking "Take an Interview" (${durationSeconds} seconds response).
Topic: ${topic || 'Academic / Campus Research'}
Interviewer Question:
"${resolvedPrompt}"
${sampleAnswer ? `Sample C1 Reference Answer:\n"${sampleAnswer}"` : ''}`;

    const promptText = `You are a certified senior ETS TOEFL iBT Speaking rater evaluating a practice student response using the 2026 scoring standards (1.0 to 6.0 band scale in 0.5 increments).

${taskDescription}
${trimmedTranscript ? `Browser Speech-to-Text Hint (may be incomplete or inaccurate compared to the real audio): "${trimmedTranscript}"` : ''}

CRITICAL INSTRUCTIONS:
1. Listen directly to the student's audio recording (if provided). If the audio is silent, contains only background static/noise, is too short (<0.5s of speech), or has NO intelligible human English speech, you MUST set:
   - "hasSpeech": false
   - "status": "unrecorded"
   - "overallScore": 0
   - "scaledScore30": 0
   - "transcript": ""
   - "feedback": Explain clearly in Spanish that no intelligible speech was detected (No evaluado).
   Do NOT hallucinate speech or invent positive scores for silent/empty audio!
2. Distinguish between speech recognition gaps and genuine pronunciation issues. Only list mispronouncedWords if you can genuinely hear mispronunciations or omitted target words in the audio.
3. Transcribe verbatim what the student actually spoke in English (do not clean up their grammar errors in the transcript).
4. For Listen and Repeat: compare the student's spoken audio/transcript word-for-word with the target sentence, evaluating accuracy, omissions, stress, and fluency.
5. For Take an Interview: evaluate comprehension of the question, fluency, clarity, grammar, vocabulary, and coherence.
6. Provide an honest practice estimate on the 1.0 - 6.0 ETS 2026 scale (0.5 increments: 1.0, 1.5, 2.0, ..., 6.0) and equivalent 0 - 30 scaled score.
7. Write "feedback", "strengths", "weaknesses", "recommendations", and explanations in Spanish, and provide an improved "modelResponse" in natural English.`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['evaluated', 'unrecorded'] },
            hasSpeech: { type: Type.BOOLEAN },
            transcript: { type: Type.STRING },
            overallScore: { type: Type.NUMBER },
            scaledScore30: { type: Type.INTEGER },
            cefrLevel: { type: Type.STRING, enum: ['C1/C2', 'B2', 'B1', 'Below B1'] },
            pronunciationScore: { type: Type.NUMBER },
            fluencyScore: { type: Type.NUMBER },
            grammarScore: { type: Type.NUMBER },
            vocabularyScore: { type: Type.NUMBER },
            mispronouncedWords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  detectedAs: { type: Type.STRING },
                  advice: { type: Type.STRING },
                },
                required: ['word', 'detectedAs', 'advice'],
              },
            },
            grammarErrors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mistake: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['mistake', 'correction', 'explanation'],
              },
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            feedback: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            modelResponse: { type: Type.STRING },
          },
          required: [
            'status',
            'hasSpeech',
            'transcript',
            'overallScore',
            'scaledScore30',
            'cefrLevel',
            'feedback',
            'recommendations',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const isEvaluated = Boolean(parsed.hasSpeech) && parsed.status !== 'unrecorded';
    return res.json({
      success: true,
      evaluated: isEvaluated,
      ...parsed,
      overallScore: isEvaluated ? parsed.overallScore : 0,
      scaledScore30: isEvaluated ? parsed.scaledScore30 : 0,
    });
  } catch (err: any) {
    console.error('Speaking evaluation error:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Error al evaluar speaking con IA',
      details: err?.message,
    });
  }
});

// Endpoint for AI-powered evaluation of user writing responses (Email & Academic Discussion)
app.post('/api/evaluate-writing', async (req: Request, res: Response) => {
  try {
    const {
      taskType = 'email', // 'email' | 'academic_discussion'
      scenario = '',
      instructions = [],
      userResponse = '',
      minimumWords = 100,
    } = req.body;

    const trimmed = (userResponse || '').trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];

    if (words.length < 5) {
      return res.json({
        success: true,
        status: 'insufficient',
        wordCount: words.length,
        overallScore: 0,
        scaledScore30: 0,
        cefrLevel: 'Below B1',
        taskFulfillmentScore: 0,
        organizationScore: 0,
        grammarScore: 0,
        vocabularyScore: 0,
        feedback:
          'No evaluado / Insuficiente: La respuesta escrita contiene menos de 5 palabras o está en blanco. En el TOEFL iBT Writing oficial, debes escribir oraciones completas y desarrollar tus ideas.',
        grammarErrors: [],
        vocabularyImprovements: [],
        strengths: [],
        weaknesses: ['Longitud insuficiente o respuesta en blanco (sin evaluación).'],
        recommendations: [
          'Escribe párrafos estructurados respondiendo a cada instrucción.',
          taskType === 'academic_discussion'
            ? 'Apunta a un mínimo de 100 palabras bien fundamentadas.'
            : 'Responde claramente a los requerimientos del correo.',
        ],
        improvedSample: '',
      });
    }

    if (!apiKey) {
      const estScore = words.length >= (taskType === 'academic_discussion' ? 100 : 60) ? 4.5 : 3.0;
      return res.json({
        success: true,
        status: 'evaluated',
        wordCount: words.length,
        overallScore: estScore,
        scaledScore30: Math.round(estScore * 5),
        cefrLevel: estScore >= 4.0 ? 'B2' : 'B1',
        taskFulfillmentScore: estScore,
        organizationScore: estScore,
        grammarScore: estScore,
        vocabularyScore: estScore,
        feedback: 'Respuesta redactada con estructura coherente. (Evaluación en modo de práctica local).',
        grammarErrors: [],
        vocabularyImprovements: [],
        strengths: ['Buena comprensión del escenario propuesto.'],
        weaknesses: ['Continúa ampliando conectores y vocabulario formal.'],
        recommendations: ['Desarrolla ejemplos adicionales para enriquecer tus argumentos.'],
        improvedSample: '',
      });
    }

    const promptText = `You are an expert official ETS TOEFL iBT Writing rater evaluating a student's submission according to the 2026 official rubric (1.0 to 6.0 scale in 0.5 increments).

Task Type: ${taskType === 'email' ? 'Write an Email (7 minutes)' : 'Write for an Academic Discussion (10 minutes, >= 100 words)'}
Scenario:
${scenario}

Instructions given to student:
${Array.isArray(instructions) ? instructions.join('\n- ') : instructions}

Student's Written Response:
"""
${userResponse}
"""

Evaluate the response rigorously based on:
1. Task fulfillment (Did they address all required points / professor's question?)
2. Organization and coherence (Paragraph transitions, logical flow)
3. Grammatical accuracy and syntactic complexity
4. Lexical variety and appropriateness
Provide estimated score on 1.0 to 6.0 ETS scale, 0 to 30 scaled score, detailed grammar error corrections, advanced vocabulary upgrades, strengths, weaknesses, and a refined exemplar version in English.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['evaluated', 'insufficient'] },
            wordCount: { type: Type.INTEGER },
            overallScore: { type: Type.NUMBER },
            scaledScore30: { type: Type.INTEGER },
            cefrLevel: { type: Type.STRING, enum: ['C1/C2', 'B2', 'B1', 'Below B1'] },
            taskFulfillmentScore: { type: Type.NUMBER },
            organizationScore: { type: Type.NUMBER },
            grammarScore: { type: Type.NUMBER },
            vocabularyScore: { type: Type.NUMBER },
            grammarErrors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mistake: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['mistake', 'correction', 'explanation'],
              },
            },
            vocabularyImprovements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  advancedAlternative: { type: Type.STRING },
                  context: { type: Type.STRING },
                },
                required: ['original', 'advancedAlternative', 'context'],
              },
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            feedback: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvedSample: { type: Type.STRING },
          },
          required: [
            'status',
            'wordCount',
            'overallScore',
            'scaledScore30',
            'cefrLevel',
            'feedback',
            'recommendations',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (err: any) {
    console.error('Writing evaluation error:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Error al evaluar writing con IA',
      details: err?.message,
    });
  }
});

// Mount Vite or serve static dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
