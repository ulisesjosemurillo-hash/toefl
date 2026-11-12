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

const audioList = [
  // Missing Part 1 items
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
    id: 'lis1_q11',
    voice: 'Fenrir',
    text: "I noticed you missed Wednesday's lecture. Do you need a copy of the syllabus update?",
  },

  // Part 2 passages
  {
    id: 'lis2_passage2',
    voice: 'Zephyr',
    text: "Man: Whew, is it just me, or is this seminar room unbearably warm this afternoon? Woman: No, it's definitely not just you. The thermostat is set to cool, but the room is too hot because the air conditioner stopped circulating air completely. I actually just called a technician from campus facilities maintenance to come inspect it. Man: Good call. It's really difficult to concentrate on preparing these research summaries in this heat. Woman: The facilities office said the maintenance crew is already on their way, but it will probably take them about twenty minutes to diagnose the issue. Why don't you take a break early and grab a cold drink in the lobby? By the time you come back, it should be cooling down. Man: That sounds like a great idea. I'll do that.",
  },
  {
    id: 'lis2_passage3',
    voice: 'Fenrir',
    text: "Before we dismiss today's lecture on evolutionary biology, I have an important academic announcement regarding next Tuesday's guest lecture. We will be hosting Dr. Palmer, who will be speaking on recent breakthroughs in marine biodiversity. Because Dr. Palmer is an internationally renowned scientist, her talks are extremely popular across campus, attracting students and faculty from multiple departments. Since seating in the main campus hall is strictly first-come, first-served, I strongly advise all of you to arrive early if you want to secure a seat. Doors will open at five thirty.",
  },
  {
    id: 'lis2_passage4',
    voice: 'Aoede',
    text: "Welcome back to Mind and Behavior. Today, we're exploring how psychologists study attention and the psychological theories explaining how our minds recover from mental fatigue. To understand this, let's consider what happens when you watch an engrossing movie. During a gripping film, your attention is completely captured by the dramatic plot and vivid imagery—a state psychologists call hard fascination. In hard fascination, there is practically no mental room for reflection or thoughts outside the movie. By contrast, when you take a leisurely walk in a nature park, you experience soft fascination. The gentle breeze and swaying trees capture your interest, yet your mind still has space for thoughts unrelated to nature, allowing restorative wandering. While cognitive scientists link such quiet reflection to the brain's Default Mode Network, its precise restorative effect is still unknown to psychologists and remains under active investigation.",
  },
];

const outputDir = path.resolve(__dirname, '../public/assets/audio/listening');
fs.mkdirSync(outputDir, { recursive: true });

async function run() {
  for (const item of audioList) {
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
  console.log('Done!');
}

run();
