import os
import urllib.parse
import urllib.request
import subprocess

SPEAKING_ITEMS = [
    {
        "id": "spk_repeat_1",
        "text": "The zoo has giraffes, rhinos, and large predators in spacious enclosures."
    },
    {
        "id": "spk_repeat_2",
        "text": "Follow the paved pathway from the rhino exhibit to see the bears."
    },
    {
        "id": "spk_repeat_3",
        "text": "Walk straight ahead along the central path toward the back of the park."
    },
    {
        "id": "spk_repeat_4",
        "text": "Visitors are not allowed to bring outside food and drinks into the zoo."
    },
    {
        "id": "spk_repeat_5",
        "text": "Families with young children are gathered near the fences watching the animals."
    },
    {
        "id": "spk_repeat_6",
        "text": "A group of cheerful children are jumping and having fun together."
    },
    {
        "id": "spk_repeat_7",
        "text": "You can purchase souvenirs and maps at the small shop by the entrance."
    },
    {
        "id": "spk_interview_1",
        "text": "Hello, and thank you for taking part in our research study about urban life. To begin, could you tell me about the neighborhood where you currently live, and what you enjoy most about it?"
    },
    {
        "id": "spk_interview_2",
        "text": "Public transportation is a central topic in urban planning. How do you usually get around your city, and what improvements do you think could be made to make commuting more convenient?"
    },
    {
        "id": "spk_interview_3",
        "text": "Some residents prefer living in vibrant, high-density city centers, while others prefer quieter suburban communities. Which of these living environments do you personally prefer, and why?"
    },
    {
        "id": "spk_interview_4",
        "text": "Finally, city officials often have to decide whether to invest public funds into expanding green parks or revitalizing commercial business districts. Which do you believe provides greater long-term benefits to city residents?"
    }
]

out_dir = "/app/applet/public/assets/audio/speaking"
os.makedirs(out_dir, exist_ok=True)

for item in SPEAKING_ITEMS:
    wav_path = os.path.join(out_dir, f"{item['id']}.wav")
    if os.path.exists(wav_path) and os.path.getsize(wav_path) > 10000:
        print(f"Skipping {item['id']}.wav (already exists)")
        continue

    print(f"Generating {item['id']}.wav...")
    encoded = urllib.parse.quote(item["text"])
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&q={encoded}&tl=en&client=tw-ob"
    
    mp3_tmp = f"/tmp/{item['id']}.mp3"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    with urllib.request.urlopen(req) as resp, open(mp3_tmp, "wb") as f:
        f.write(resp.read())

    # Convert to 24000Hz 16-bit PCM mono WAV
    cmd = ["ffmpeg", "-y", "-i", mp3_tmp, "-ar", "24000", "-ac", "1", wav_path]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(mp3_tmp):
        os.remove(mp3_tmp)
    print(f"Saved {wav_path} ({os.path.getsize(wav_path)} bytes)")

print("All speaking audios generated successfully!")
