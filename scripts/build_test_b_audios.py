import os
import urllib.parse
import urllib.request
import subprocess

AUDIO_ITEMS = [
    # Listening B - 18 Questions
    {"dir": "listening", "id": "lisB_q1", "text": "Could you tell me where the reserve books are located in the library?"},
    {"dir": "listening", "id": "lisB_q2", "text": "Are you attending the guest speaker's presentation on renewable energy this afternoon?"},
    {"dir": "listening", "id": "lisB_q3", "text": "Excuse me, does this campus shuttle stop at the student health center?"},
    {"dir": "listening", "id": "lisB_q4", "text": "I'm having trouble connecting my laptop to the university Wi-Fi network."},
    {"dir": "listening", "id": "lisB_q5", "text": "Do you know if Professor Collins has posted the syllabus for the seminar yet?"},
    {"dir": "listening", "id": "lisB_q6", "text": "Would you mind holding the elevator door for a moment?"},
    {"dir": "listening", "id": "lisB_q7", "text": "I didn't expect the midterm exam to have so many essay questions."},
    {"dir": "listening", "id": "lisB_q8", "text": "Has the deadline for applying for graduation housing been extended?"},
    {"dir": "listening", "id": "lisB_q9", "text": "I was wondering if there are any student discounts available for the museum exhibit."},
    {"dir": "listening", "id": "lisB_q10", "text": "Should we meet at the cafeteria before the group presentation?"},
    {"dir": "listening", "id": "lisB_q11", "text": "Did you get an email about the change in classroom location for tomorrow's chemistry lecture?"},
    {"dir": "listening", "id": "lisB_q12", "text": "Can I renew these two research books online, or do I need to bring them in person?"},
    {"dir": "listening", "id": "lisB_q13", "text": "How long did it take you to complete the lab report on cellular respiration?"},
    {"dir": "listening", "id": "lisB_q14", "text": "I heard the campus bookstore is offering buybacks on used textbooks this week."},
    {"dir": "listening", "id": "lisB_q15", "text": "What time does the career counseling office close on Fridays?"},
    {"dir": "listening", "id": "lisB_q16", "text": "I'm not sure whether I should take statistics or calculus next semester."},
    {"dir": "listening", "id": "lisB_q17", "text": "Have you had a chance to look over the peer review feedback on your essay draft?"},
    {"dir": "listening", "id": "lisB_q18", "text": "Is parking permitted in the university north lot without a visitor permit?"},

    # Listening B - 4 Passages
    {
        "dir": "listening",
        "id": "lisB_passage1",
        "text": "Hi Professor Ramirez, thanks for meeting with me. I'm trying to decide between doing an off-campus corporate internship this semester or joining Doctor Lee's on-campus undergraduate research project in cognitive neuroscience. Both sound exciting, but I'm worried about balancing twenty hours of off-campus commuting with my three upper-division seminar classes."
    },
    {
        "dir": "listening",
        "id": "lisB_passage2",
        "text": "Attention students and library patrons. Beginning next Monday, the third floor of the university library will be designated as a completely silent study zone with newly installed acoustic study pods. These pods can be reserved up to forty-eight hours in advance through the campus mobile portal for blocks of up to two hours. Please remember that food and open drink containers are strictly prohibited on the third floor."
    },
    {
        "dir": "listening",
        "id": "lisB_passage3",
        "text": "In today's marine biology lecture, we will examine bioluminescence in deep-sea organisms. Below approximately two hundred meters in the ocean, sunlight rapidly diminishes, and over seventy-five percent of marine animals produce their own biochemical light. This light is generated through a reaction involving the enzyme luciferase and the substrate luciferin. Specialized light-emitting organs called photophores allow organisms like the lanternfish and vampire squid to accomplish counterillumination, effectively matching the faint downwelling ambient light to camouflage themselves from predators swimming beneath them."
    },
    {
        "dir": "listening",
        "id": "lisB_passage4",
        "text": "Psychologists have long investigated the neurological mechanism behind memory consolidation. Recent electroencephalogram studies show that during slow-wave non-REM sleep, the hippocampus repeatedly replays recently acquired behavioral sequences and transfers synaptic representations to the neocortex for permanent long-term storage. Disruption of this slow-wave phase substantially degrades declarative memory retention."
    },

    # Speaking B - 7 Repeat items
    {"dir": "speaking", "id": "spkB_repeat_1", "text": "The science museum showcases interactive exhibits on planetary astronomy and physics."},
    {"dir": "speaking", "id": "spkB_repeat_2", "text": "Turn left past the planetarium entrance to reach the main observatory dome."},
    {"dir": "speaking", "id": "spkB_repeat_3", "text": "Visitors can observe distant celestial galaxies through the high-powered telescope tonight."},
    {"dir": "speaking", "id": "spkB_repeat_4", "text": "Please turn off your camera flash before entering the digital space theater."},
    {"dir": "speaking", "id": "spkB_repeat_5", "text": "A tour guide is demonstrating how magnetic levitation trains operate on the track."},
    {"dir": "speaking", "id": "spkB_repeat_6", "text": "Several students are taking notes in front of the solar system model."},
    {"dir": "speaking", "id": "spkB_repeat_7", "text": "You can collect an audio headset and museum guide at the information desk."},

    # Speaking B - 4 Interview items
    {
        "dir": "speaking",
        "id": "spkB_interview_1",
        "text": "Welcome, and thank you for taking part in our research on campus sustainability. To begin, could you describe how your school or university promotes environmental awareness among students?"
    },
    {
        "dir": "speaking",
        "id": "spkB_interview_2",
        "text": "Many institutions are replacing printed course textbooks with digital tablets and e-readers. In your view, does this shift significantly benefit student learning and the environment?"
    },
    {
        "dir": "speaking",
        "id": "spkB_interview_3",
        "text": "Some universities require all first-year students to live on campus in dormitories, while others permit students to live off campus in private apartments. Which policy do you think is better for students?"
    },
    {
        "dir": "speaking",
        "id": "spkB_interview_4",
        "text": "Finally, when university administrations receive alumni donations, should they prioritize upgrading sports facilities or funding student academic research scholarships? Please explain your perspective."
    }
]

base_dir = "/app/applet/public/assets/audio"

for item in AUDIO_ITEMS:
    out_dir = os.path.join(base_dir, item["dir"])
    os.makedirs(out_dir, exist_ok=True)
    wav_path = os.path.join(out_dir, f"{item['id']}.wav")

    if os.path.exists(wav_path) and os.path.getsize(wav_path) > 5000:
        print(f"Skipping {item['id']}.wav (already exists)")
        continue

    print(f"Generating {item['id']}.wav...")
    
    # Split text into chunks under 150 chars if needed for translate_tts
    words = item["text"].split()
    chunks = []
    curr = []
    curr_len = 0
    for w in words:
        if curr_len + len(w) + 1 > 120:
            chunks.append(" ".join(curr))
            curr = [w]
            curr_len = len(w)
        else:
            curr.append(w)
            curr_len += len(w) + 1
    if curr:
        chunks.append(" ".join(curr))

    part_files = []
    for idx, c in enumerate(chunks):
        encoded = urllib.parse.quote(c)
        url = f"https://translate.google.com/translate_tts?ie=UTF-8&q={encoded}&tl=en&client=tw-ob"
        tmp_mp3 = f"/tmp/{item['id']}_part{idx}.mp3"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        )
        with urllib.request.urlopen(req) as resp, open(tmp_mp3, "wb") as f:
            f.write(resp.read())
        part_files.append(tmp_mp3)

    # Concat part files and convert to 24000Hz mono PCM WAV
    if len(part_files) == 1:
        cmd = ["ffmpeg", "-y", "-i", part_files[0], "-ar", "24000", "-ac", "1", wav_path]
    else:
        # Create concat demuxer list
        list_txt = f"/tmp/{item['id']}_list.txt"
        with open(list_txt, "w") as f:
            for pf in part_files:
                f.write(f"file '{pf}'\n")
        cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", list_txt, "-ar", "24000", "-ac", "1", wav_path]

    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    for pf in part_files:
        if os.path.exists(pf):
            os.remove(pf)
    if os.path.exists(f"/tmp/{item['id']}_list.txt"):
        os.remove(f"/tmp/{item['id']}_list.txt")

    print(f"Saved {wav_path} ({os.path.getsize(wav_path)} bytes)")

print("All Test B audio files created successfully!")
