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

const speakingAudioList = [
  // 7 Listen and Repeat items (Zoo scene)
  {
    id: 'spk_repeat_1',
    voice: 'Aoede',
    text: 'The zoo has giraffes, rhinos, and large predators in spacious enclosures.',
  },
  {
    id: 'spk_repeat_2',
    voice: 'Fenrir',
    text: 'Follow the paved pathway from the rhino exhibit to see the bears.',
  },
  {
    id: 'spk_repeat_3',
    voice: 'Kore',
    text: 'Walk straight ahead along the central path toward the back of the park.',
  },
  {
    id: 'spk_repeat_4',
    voice: 'Charon',
    text: 'Visitors are not allowed to bring outside food and drinks into the zoo.',
  },
  {
    id: 'spk_repeat_5',
    voice: 'Aoede',
    text: 'Families with young children are gathered near the fences watching the animals.',
  },
  {
    id: 'spk_repeat_6',
    voice: 'Zephyr',
    text: 'A group of cheerful children are jumping and having fun together.',
  },
  {
    id: 'spk_repeat_7',
    voice: 'Kore',
    text: 'You can purchase souvenirs and maps at the small shop by the entrance.',
  },

  // 4 Take an Interview questions (Female researcher in blue backdrop)
  {
    id: 'spk_interview_1',
    voice: 'Aoede',
    text: 'Hello, and thank you for taking part in our research study about urban life. To begin, could you tell me about the neighborhood where you currently live, and what you enjoy most about it?',
  },
  {
    id: 'spk_interview_2',
    voice: 'Aoede',
    text: 'Public transportation is a central topic in urban planning. How do you usually get around your city, and what improvements do you think could be made to make commuting more convenient?',
  },
  {
    id: 'spk_interview_3',
    voice: 'Aoede',
    text: 'Some residents prefer living in vibrant, high-density city centers, while others prefer quieter suburban communities. Which of these living environments do you personally prefer, and why?',
  },
  {
    id: 'spk_interview_4',
    voice: 'Aoede',
    text: 'Finally, city officials often have to decide whether to invest public funds into expanding green parks or revitalizing commercial business districts. Which do you believe provides greater long-term benefits to city residents?',
  },
];

const outputDir = path.resolve(__dirname, '../public/assets/audio/speaking');
fs.mkdirSync(outputDir, { recursive: true });

async function run() {
  for (const item of speakingAudioList) {
    const dest = path.join(outputDir, `${item.id}.wav`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`${item.id}.wav already exists, skipping.`);
      continue;
    }

    console.log(`Generating ${item.id} with voice ${item.voice}...`);
    try {
      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: item.text,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: item.voice },
            },
          },
        },
      });

      const b64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (b64) {
        fs.writeFileSync(dest, Buffer.from(b64, 'base64'));
        console.log(`Saved ${dest} (${fs.statSync(dest).size} bytes)`);
      }
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      console.error(`Error for ${item.id}:`, err?.message || err);
    }
  }
  console.log('All speaking audio files generated!');
}

run();
