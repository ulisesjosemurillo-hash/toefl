import os
import urllib.parse
import urllib.request
import subprocess

QUESTIONS_B_PART1 = [
    {"id": "lis_b_q1", "text": "Excuse me, where can I return this interlibrary loan book?"},
    {"id": "lis_b_q2", "text": "Remember that all safety goggles must be sanitized before you leave the lab today."},
    {"id": "lis_b_q3", "text": "Are you free to meet with our study group at the campus cafe around three?"},
    {"id": "lis_b_q4", "text": "Do you happen to know if color printing is available in the basement computer lab?"},
    {"id": "lis_b_q5", "text": "Professor Evans, could I stop by your office this afternoon to ask about the exam format?"},
    {"id": "lis_b_q6", "text": "Would you like to grab some lunch at the university dining hall before the physics seminar?"},
    {"id": "lis_b_q7", "text": "Did you print out several updated copies of your resume for the engineering career fair?"},
    {"id": "lis_b_q8", "text": "Has anyone from building maintenance come to inspect the heating unit in your dorm room?"},
    {"id": "lis_b_q9", "text": "I noticed the internship application requires two academic letters of recommendation."},
    {"id": "lis_b_q10", "text": "Do you know if the student recreation center offers weekend yoga classes?"},
    {"id": "lis_b_q11", "text": "The introductory statistics section is completely full. What should I do?"},
    {"id": "lis_b_q12", "text": "Could you tell me how long students can check out books placed on course reserve?"},
    {"id": "lis_b_q13", "text": "Are you planning to volunteer at the international cultural festival this Friday?"},
    {"id": "lis_b_q14", "text": "Have you scheduled an appointment with the campus writing center for your history paper?"},
    {"id": "lis_b_q15", "text": "Excuse me, which campus shuttle bus stops closest to the science and engineering complex?"},
    {"id": "lis_b_q16", "text": "How did your presentation on renewable energy technologies go this morning?"},
    {"id": "lis_b_q17", "text": "Do you want to review the practice questions for tomorrow's chemistry midterm tonight?"},
    {"id": "lis_b_q18", "text": "Could you show me how to schedule an appointment with the university health center online?"}
]

output_dir = "/app/applet/public/assets/audio/listening_b"
os.makedirs(output_dir, exist_ok=True)

for item in QUESTIONS_B_PART1:
    wav_path = os.path.join(output_dir, f"{item['id']}.wav")
    print(f"Building {item['id']}.wav...")
    encoded = urllib.parse.quote(item["text"])
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&q={encoded}&tl=en&client=tw-ob"
    chunk_mp3 = f"/tmp/{item['id']}.mp3"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    with urllib.request.urlopen(req) as resp, open(chunk_mp3, "wb") as f:
        f.write(resp.read())
    
    cmd = [
        "ffmpeg", "-y", "-i", chunk_mp3,
        "-ar", "24000", "-ac", "1", wav_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(chunk_mp3):
        os.remove(chunk_mp3)
    print(f"Generated {wav_path} ({os.path.getsize(wav_path)} bytes)")

print("All 18 Part 1 audios for Test B generated successfully!")
