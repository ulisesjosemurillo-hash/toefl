import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
});

const listeningQuestions = [
  {
    id: 'lis1_q1',
    voice: 'Zephyr',
    text: 'Excuse me, could you tell me where the admissions office is located?',
  },
  {
    id: 'lis1_q2',
    voice: 'Puck',
    text: 'Did you manage to find the required textbook at the campus bookstore?',
  },
  {
    id: 'lis1_q3',
    voice: 'Zephyr',
    text: 'Remember that the laboratory report deadline has been pushed back to Friday at noon.',
  },
  {
    id: 'lis1_q4',
    voice: 'Kore',
    text: "I'm really sorry, but I won't be able to make it to dinner tonight.",
  },
  {
    id: 'lis1_q5',
    voice: 'Puck',
    text: 'Do you happen to know what time the library closes on weekends?',
  },
  {
    id: 'lis1_q6',
    voice: 'Kore',
    text: 'Should we print out copies of our presentation slides for the audience?',
  },
  {
    id: 'lis1_q7',
    voice: 'Fenrir',
    text: 'Make sure everyone wears safety goggles before handling the chemical solvents.',
  },
  {
    id: 'lis1_q8',
    voice: 'Aoede',
    text: 'Have you seen the notice about the hot water shutoff tomorrow morning?',
  },
  {
    id: 'lis1_q9',
    voice: 'Charon',
    text: 'Would you like some feedback on your resume before you submit it to the internship program?',
  },
  {
    id: 'lis1_q10',
    voice: 'Zephyr',
    text: 'Are you dining in today, or would you like this packaged to go?',
  },
  {
    id: 'lis1_q11',
    voice: 'Fenrir',
    text: "I noticed you missed Wednesday's lecture. Do you need a copy of the syllabus update?",
  },
  {
    id: 'lis1_q12',
    voice: 'Aoede',
    text: 'The study rooms upstairs must be reserved at least twenty-four hours in advance.',
  },
  {
    id: 'lis1_q13',
    voice: 'Puck',
    text: 'Are you planning to volunteer at the campus sustainability festival this weekend?',
  },
  {
    id: 'lis1_q14',
    voice: 'Kore',
    text: 'Could you pick up some printer paper when you stop by the university supply store?',
  },
  {
    id: 'lis1_q15',
    voice: 'Charon',
    text: 'If you restart your laptop, the campus Wi-Fi authentication certificate should update automatically.',
  },
  {
    id: 'lis1_q16',
    voice: 'Aoede',
    text: 'Do you want to split the microscope slides so we can finish examining the specimens faster?',
  },
  {
    id: 'lis1_q17',
    voice: 'Fenrir',
    text: 'Please have your student transit pass tapped against the blue scanner before boarding.',
  },
  {
    id: 'lis1_q18',
    voice: 'Zephyr',
    text: 'Congratulations on completing all required prerequisite credits for your degree!',
  },
];

const outputDir = path.resolve(__dirname, '../public/assets/audio/listening');
fs.mkdirSync(outputDir, { recursive: true });

async function generateAll() {
  console.log(`Starting generation of remaining audio files...`);

  for (let i = 0; i < listeningQuestions.length; i++) {
    const q = listeningQuestions[i];
    const targetFile = path.join(outputDir, `${q.id}.wav`);

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 1000) {
      console.log(`[${i + 1}/${listeningQuestions.length}] ${q.id}.wav already exists, skipping.`);
      continue;
    }

    console.log(`[${i + 1}/${listeningQuestions.length}] Generating ${q.id} with voice ${q.voice}...`);

    let attempts = 0;
    let done = false;
    while (!done && attempts < 4) {
      attempts++;
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: q.text,
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: q.voice,
                },
              },
            },
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const base64Data = part?.inlineData?.data;

        if (!base64Data) {
          throw new Error(`No audio data received for ${q.id}`);
        }

        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(targetFile, buffer);
        console.log(`  ✓ Successfully saved ${targetFile} (${buffer.length} bytes)`);
        done = true;

        // Brief pause between requests
        await new Promise((r) => setTimeout(r, 1500));
      } catch (err) {
        console.error(`  ✗ Attempt ${attempts} error for ${q.id}:`, err?.message || err);
        const waitTime = 20000;
        console.log(`  Waiting ${waitTime / 1000}s before retry...`);
        await new Promise((r) => setTimeout(r, waitTime));
      }
    }
  }

  console.log('Audio generation completed!');
}

generateAll();
