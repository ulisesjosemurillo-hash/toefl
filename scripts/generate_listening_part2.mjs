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

const passages = [
  {
    id: 'lis2_passage1',
    voice: 'Puck',
    text: "Woman: Hey Mark, aren't you supposed to be at the grocery store by now? I was just about to head upstairs to change my clothes for dinner. Man: Wait, dinner tonight? Oh no, I thought our dinner was scheduled for tomorrow night! I'd forget my head if it wasn't screwed on! I haven't even picked up the fresh salmon and salad at the supermarket yet. Woman: Well, we agreed on seven o'clock tonight so we'd have plenty of time. If you leave right now, we can still make it! Man: On my way right now! I'll be back in twenty minutes.",
  },
  {
    id: 'lis2_passage2',
    voice: 'Zephyr',
    text: "Man: Whew, is it just me, or is this seminar room unbearably warm this afternoon? Woman: No, it's definitely not just you. The thermostat is set to cool, but the room is too hot because the air conditioner stopped circulating air completely. I actually just called a technician from campus facilities maintenance to come inspect it. Man: Good call. It's really difficult to concentrate on preparing these research summaries in this heat. Woman: The facilities office said the maintenance crew is already on their way, but it will probably take them about twenty minutes to diagnose the issue. Why don't you take a break early and grab a cold drink in the lobby? By the time you come back, it should be cooling down. Man: That sounds like a great idea. I'll do that.",
  },
  {
    id: 'lis2_passage3',
    voice: 'Fenrir',
    text: "Before we dismiss today's class on evolutionary biology, I have an important academic announcement regarding next Tuesday's guest lecture. We will be hosting Dr. Palmer, who will be speaking on recent breakthroughs in marine biodiversity. Because Dr. Palmer is an internationally renowned scientist, her talks are extremely popular across campus, attracting students and faculty from multiple departments. Since seating in the main campus hall is strictly first-come, first-served, I strongly advise all of you to arrive early if you want to secure a seat. Doors will open at five thirty.",
  },
  {
    id: 'lis2_passage4',
    voice: 'Aoede',
    text: "Welcome back to Mind and Behavior. Today, we're exploring how psychologists study attention and the psychological theories explaining how our minds recover from mental fatigue. To understand this, let's consider what happens when you watch an engrossing movie. During a gripping film, your attention is completely captured by the dramatic plot and vivid imagery—a state psychologists call hard fascination. In hard fascination, there is practically no mental room for reflection or thoughts outside the movie. By contrast, when you take a leisurely walk in a nature park, you experience soft fascination. The gentle breeze and swaying trees capture your interest, yet your mind still has space for thoughts unrelated to nature, allowing restorative wandering. While cognitive scientists link such quiet reflection to the brain's Default Mode Network, its precise restorative effect is still unknown to psychologists and remains under active investigation.",
  },
];

const outputDir = path.resolve(__dirname, '../public/assets/audio/listening');
fs.mkdirSync(outputDir, { recursive: true });

async function generatePassages() {
  console.log(`Starting generation of ${passages.length} passage audio files...`);

  for (let i = 0; i < passages.length; i++) {
    const p = passages[i];
    const targetFile = path.join(outputDir, `${p.id}.wav`);

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 1000) {
      console.log(`[${i + 1}/${passages.length}] ${p.id}.wav already exists, skipping.`);
      continue;
    }

    console.log(`[${i + 1}/${passages.length}] Generating ${p.id} with voice ${p.voice}...`);

    let attempts = 0;
    let done = false;
    while (!done && attempts < 3) {
      attempts++;
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: p.text,
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: p.voice,
                },
              },
            },
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const base64Data = part?.inlineData?.data;

        if (!base64Data) {
          throw new Error(`No audio data received for ${p.id}`);
        }

        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(targetFile, buffer);
        console.log(`  ✓ Successfully saved ${targetFile} (${buffer.length} bytes)`);
        done = true;

        // Rate limit pause
        await new Promise((r) => setTimeout(r, 22000));
      } catch (err) {
        console.error(`  ✗ Attempt ${attempts} error for ${p.id}:`, err?.message || err);
        const waitTime = 25000;
        console.log(`  Waiting ${waitTime / 1000}s before retry...`);
        await new Promise((r) => setTimeout(r, waitTime));
      }
    }
  }

  console.log('Passage audio generation completed!');
}

generatePassages();
