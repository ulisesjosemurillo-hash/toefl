/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SpeakingTest } from '../types/toefl.ts';

export const OFFICIAL_SPEAKING_TEST_1: SpeakingTest = {
  id: 'speaking-test-official-1',
  title: 'Examen Oficial TOEFL iBT Speaking (11 Preguntas)',
  category: 'Speaking Oficial ETS • Listen and Repeat & Interview',
  difficulty: 'Standard',
  estimatedMinutes: 17,
  totalQuestions: 11,
  repeatQuestions: [
    {
      id: 'spk_repeat_1',
      questionNumber: 1,
      sceneImage: '/assets/aistudio/image_951297cd.png',
      spokenSentence:
        'The zoo has giraffes, rhinos, and large predators in spacious enclosures.',
      audioUrl: '/assets/audio/speaking/spk_repeat_1.wav',
      responseTimeSeconds: 10,
      explanation:
        'Pronounce clear consonant clusters in "giraffes", "rhinos", "predators", and "spacious enclosures".',
    },
    {
      id: 'spk_repeat_2',
      questionNumber: 2,
      sceneImage: '/assets/aistudio/image_0431e5e4.png',
      spokenSentence:
        'Follow the paved pathway from the rhino exhibit to see the bears.',
      audioUrl: '/assets/audio/speaking/spk_repeat_2.wav',
      responseTimeSeconds: 10,
      explanation:
        'Smooth linking in "paved pathway" and clear articulation of the noun "exhibit".',
    },
    {
      id: 'spk_repeat_3',
      questionNumber: 3,
      sceneImage: '/assets/aistudio/image_8026e335.png',
      spokenSentence:
        'Walk straight ahead along the central path toward the back of the park.',
      audioUrl: '/assets/audio/speaking/spk_repeat_3.wav',
      responseTimeSeconds: 10,
      explanation:
        'Natural stress and rhythm on directional prepositions "straight ahead along the central path".',
    },
    {
      id: 'spk_repeat_4',
      questionNumber: 4,
      sceneImage: '/assets/aistudio/image_e74f82e2.png',
      spokenSentence:
        'Visitors are not allowed to bring outside food and drinks into the zoo.',
      audioUrl: '/assets/audio/speaking/spk_repeat_4.wav',
      responseTimeSeconds: 10,
      explanation:
        'Emphatic stress on "not allowed" and clear vowel quality in "outside food and drinks".',
    },
    {
      id: 'spk_repeat_5',
      questionNumber: 5,
      sceneImage: '/assets/aistudio/image_d3041351.png',
      spokenSentence:
        'Families with young children are gathered near the fences watching the animals.',
      audioUrl: '/assets/audio/speaking/spk_repeat_5.wav',
      responseTimeSeconds: 10,
      explanation:
        'Fluent phrasing in "families with young children" and accurate ending "-ing" on "watching".',
    },
    {
      id: 'spk_repeat_6',
      questionNumber: 6,
      sceneImage: '/assets/aistudio/image_a59f9c2d.png',
      spokenSentence:
        'A group of cheerful children are jumping and having fun together.',
      audioUrl: '/assets/audio/speaking/spk_repeat_6.wav',
      responseTimeSeconds: 10,
      explanation:
        'Expressive intonation with accurate articulation of "cheerful" and "jumping together".',
    },
    {
      id: 'spk_repeat_7',
      questionNumber: 7,
      sceneImage: '/assets/aistudio/image_b911e662.png',
      spokenSentence:
        'You can purchase souvenirs and maps at the small shop by the entrance.',
      audioUrl: '/assets/audio/speaking/spk_repeat_7.wav',
      responseTimeSeconds: 10,
      explanation:
        'Correct word stress on "souvenirs" (sou-ve-NIRS) and clean final consonant in "entrance".',
    },
  ],
  interviewQuestions: [
    {
      id: 'spk_interview_1',
      questionNumber: 8,
      interviewerImage: '/assets/aistudio/image_36efe0fd.png',
      interviewerName: 'Dr. Sarah Adams',
      topic: 'Neighborhood & Community Living',
      questionSpoken:
        'Hello, and thank you for taking part in our research study about urban life. To begin, could you tell me about the neighborhood where you currently live, and what you enjoy most about it?',
      audioUrl: '/assets/audio/speaking/spk_interview_1.wav',
      responseTimeSeconds: 45,
      sampleModelAnswer:
        'I currently live in a quiet residential district located about twenty minutes from the downtown core. What I enjoy most about my neighborhood is its walkability and sense of community. Within a few blocks of my home, there are grocery stores, cozy cafes, and a beautiful tree-lined park where residents gather in the evenings. It strikes a great balance between urban convenience and a peaceful suburban atmosphere.',
      explanation:
        'Directly describe location, amenities, and personal reasons for enjoying the neighborhood within 45 seconds.',
    },
    {
      id: 'spk_interview_2',
      questionNumber: 9,
      interviewerImage: '/assets/aistudio/image_36efe0fd.png',
      interviewerName: 'Dr. Sarah Adams',
      topic: 'Public Transit & Urban Mobility',
      questionSpoken:
        'Public transportation is a central topic in urban planning. How do you usually get around your city, and what improvements do you think could be made to make commuting more convenient?',
      audioUrl: '/assets/audio/speaking/spk_interview_2.wav',
      responseTimeSeconds: 45,
      sampleModelAnswer:
        'I primarily rely on the municipal subway system and public buses to travel to campus and work. While the train network covers the main financial and commercial districts efficiently, the peripheral neighborhoods often suffer from long wait times during off-peak hours. In my opinion, the most impactful improvements would be increasing train frequency during morning and evening rush hours and introducing integrated contactless digital payments across all transit lines.',
      explanation:
        'Address both prompt components: how you commute, and specific concrete suggestions for improvement.',
    },
    {
      id: 'spk_interview_3',
      questionNumber: 10,
      interviewerImage: '/assets/aistudio/image_36efe0fd.png',
      interviewerName: 'Dr. Sarah Adams',
      topic: 'City Center vs. Suburban Lifestyle',
      questionSpoken:
        'Some residents prefer living in vibrant, high-density city centers, while others prefer quieter suburban communities. Which of these living environments do you personally prefer, and why?',
      audioUrl: '/assets/audio/speaking/spk_interview_3.wav',
      responseTimeSeconds: 45,
      sampleModelAnswer:
        'I personally prefer living in a city center because of the unmatched accessibility to cultural activities, dining, and professional opportunities. In a central location, almost everything you need is just steps away, reducing the dependency on owning a private vehicle. Even though city centers can be noisier and living spaces tend to be more compact, the vibrant lifestyle and diverse social environment make it worthwhile for me at this stage in my life.',
      explanation:
        'State a clear preference, balance pros and cons, and elaborate on lifestyle justification.',
    },
    {
      id: 'spk_interview_4',
      questionNumber: 11,
      interviewerImage: '/assets/aistudio/image_36efe0fd.png',
      interviewerName: 'Dr. Sarah Adams',
      topic: 'Public Investment: Green Parks vs. Commercial Districts',
      questionSpoken:
        'Finally, city officials often have to decide whether to invest public funds into expanding green parks or revitalizing commercial business districts. Which do you believe provides greater long-term benefits to city residents?',
      audioUrl: '/assets/audio/speaking/spk_interview_4.wav',
      responseTimeSeconds: 45,
      sampleModelAnswer:
        'I believe investing in green parks yields greater long-term benefits for urban residents. While commercial development certainly generates short-term revenue, public parks are indispensable for public health, stress reduction, and recreational exercise. Green spaces also mitigate urban heat islands and improve local air quality. When cities prioritize clean public parks, they cultivate healthier, happier communities, which ultimately makes the city more attractive for families and businesses alike.',
      explanation:
        'Defend your position with multiple compelling arguments (health, environment, community longevity).',
    },
  ],
};

export const OFFICIAL_SPEAKING_TEST_2: SpeakingTest = {
  id: 'speaking-test-official-2',
  title: 'Prueba Nueva TOEFL iBT Speaking (11 Preguntas)',
  category: 'Speaking Oficial ETS • Science Museum & Academic Sustainability',
  difficulty: 'Standard',
  estimatedMinutes: 17,
  totalQuestions: 11,
  repeatQuestions: [
    {
      id: 'spkB_repeat_1',
      questionNumber: 1,
      sceneImage: '/assets/aistudio/image_0431e5e4.png',
      spokenSentence:
        'The science museum showcases interactive exhibits on planetary astronomy and physics.',
      audioUrl: '/assets/audio/speaking/spkB_repeat_1.wav',
      responseTimeSeconds: 10,
      explanation:
        'Clear pronunciation of multi-syllable terms "interactive exhibits", "astronomy", and "physics".',
    },
    {
      id: 'spkB_repeat_2',
      questionNumber: 2,
      sceneImage: '/assets/aistudio/image_8026e335.png',
      spokenSentence:
        'Turn left past the planetarium entrance to reach the main observatory dome.',
      audioUrl: '/assets/audio/speaking/spkB_repeat_2.wav',
      responseTimeSeconds: 10,
      explanation:
        'Natural directional phrasing: "turn left past", "planetarium entrance", "observatory dome".',
    },
    {
      id: 'spkB_repeat_3',
      questionNumber: 3,
      sceneImage: '/assets/aistudio/image_951297cd.png',
      spokenSentence:
        'Visitors can observe distant celestial galaxies through the high-powered telescope tonight.',
      audioUrl: '/assets/audio/speaking/spkB_repeat_3.wav',
      responseTimeSeconds: 10,
      explanation:
        'Rhythmic cadence and accurate stress on "distant celestial galaxies" and "high-powered telescope".',
    },
    {
      id: 'spkB_repeat_4',
      questionNumber: 4,
      sceneImage: '/assets/aistudio/image_e74f82e2.png',
      spokenSentence:
        'Please turn off your camera flash before entering the digital space theater.',
      audioUrl: '/assets/audio/speaking/spkB_repeat_4.wav',
      responseTimeSeconds: 10,
      explanation:
        'Polite imperative intonation with clean articulation of "camera flash" and "digital space theater".',
    },
    {
      id: 'spkB_repeat_5',
      questionNumber: 5,
      sceneImage: '/assets/aistudio/image_d3041351.png',
      spokenSentence:
        'A tour guide is demonstrating how magnetic levitation trains operate on the track.',
      audioUrl: '/assets/audio/speaking/spkB_repeat_5.wav',
      responseTimeSeconds: 10,
      explanation:
        'Smooth linking in "demonstrating how" and crisp pronunciation of "magnetic levitation".',
    },
    {
      id: 'spkB_repeat_6',
      questionNumber: 6,
      sceneImage: '/assets/aistudio/image_a59f9c2d.png',
      spokenSentence:
        'Several students are taking notes in front of the solar system model.',
      audioUrl: '/assets/audio/speaking/spkB_repeat_6.wav',
      responseTimeSeconds: 10,
      explanation:
        'Natural connected speech: "taking notes in front of the solar system model".',
    },
    {
      id: 'spkB_repeat_7',
      questionNumber: 7,
      sceneImage: '/assets/aistudio/image_b911e662.png',
      spokenSentence:
        'You can collect an audio headset and museum guide at the information desk.',
      audioUrl: '/assets/audio/speaking/spkB_repeat_7.wav',
      responseTimeSeconds: 10,
      explanation:
        'Accurate compound stress in "audio headset" and clear consonants in "information desk".',
    },
  ],
  interviewQuestions: [
    {
      id: 'spkB_interview_1',
      questionNumber: 8,
      interviewerImage: '/assets/aistudio/speaker_man_glasses.png',
      interviewerName: 'Dr. David Chen',
      topic: 'Campus Sustainability & Environmental Awareness',
      questionSpoken:
        'Welcome, and thank you for taking part in our research on campus sustainability. To begin, could you describe how your school or university promotes environmental awareness among students?',
      audioUrl: '/assets/audio/speaking/spkB_interview_1.wav',
      responseTimeSeconds: 45,
      sampleModelAnswer:
        'My university actively encourages environmental consciousness through several campus initiatives. For example, there are clearly labeled recycling and composting stations located throughout academic halls, dining facilities, and student dorms. Additionally, the university organizes an annual "Green Campus Week," which features student workshops on energy conservation, zero-waste living, and tree-planting events around the campus grounds. These hands-on activities effectively educate students on making sustainable everyday choices.',
      explanation:
        'Begin with a direct opening sentence, provide two specific institutional examples, and conclude with the impact on student behavior.',
    },
    {
      id: 'spkB_interview_2',
      questionNumber: 9,
      interviewerImage: '/assets/aistudio/speaker_man_glasses.png',
      interviewerName: 'Dr. David Chen',
      topic: 'Digital E-Readers vs Printed Course Books',
      questionSpoken:
        'Many institutions are replacing printed course textbooks with digital tablets and e-readers. In your view, does this shift significantly benefit student learning and the environment?',
      audioUrl: '/assets/audio/speaking/spkB_interview_2.wav',
      responseTimeSeconds: 45,
      sampleModelAnswer:
        'Yes, I believe transitioning to digital e-readers offers substantial advantages for both learners and the environment. Environmentally, eliminating physical textbook print runs saves millions of trees, reduces chemical paper bleaching, and cuts shipping carbon emissions. Academically, e-readers provide interactive features such as keyword searches, instant dictionary lookups, and cloud annotation sync. They also make heavy backpacks obsolete, allowing students to access entire academic libraries from a single lightweight device.',
      explanation:
        'Provide a balanced analysis addressing both student learning advantages and ecological benefits.',
    },
    {
      id: 'spkB_interview_3',
      questionNumber: 10,
      interviewerImage: '/assets/aistudio/speaker_man_glasses.png',
      interviewerName: 'Dr. David Chen',
      topic: 'First-Year Dormitory vs Off-Campus Housing',
      questionSpoken:
        'Some universities require all first-year students to live on campus in dormitories, while others permit students to live off campus in private apartments. Which policy do you think is better for students?',
      audioUrl: '/assets/audio/speaking/spkB_interview_3.wav',
      responseTimeSeconds: 45,
      sampleModelAnswer:
        'I think requiring first-year students to live in campus dormitories is far more beneficial. The transition from high school to university life can be socially and academically overwhelming. Living in residence halls ensures freshmen are surrounded by peers facing identical challenges, fostering fast friendships and collaborative study habits. Moreover, campus living provides easy walking access to academic libraries, professor office hours, and student dining halls without the extra stress of negotiating off-campus leases, paying utility bills, or managing daily commutes.',
      explanation:
        'State your stance clearly, elaborate on social integration and academic convenience, and contrast with off-campus burdens.',
    },
    {
      id: 'spkB_interview_4',
      questionNumber: 11,
      interviewerImage: '/assets/aistudio/speaker_man_glasses.png',
      interviewerName: 'Dr. David Chen',
      topic: 'Athletics Facilities vs Academic Research Grants',
      questionSpoken:
        'Finally, when university administrations receive alumni donations, should they prioritize upgrading sports facilities or funding student academic research scholarships? Please explain your perspective.',
      audioUrl: '/assets/audio/speaking/spkB_interview_4.wav',
      responseTimeSeconds: 45,
      sampleModelAnswer:
        'In my opinion, universities should prioritize funding student academic research scholarships when allocating philanthropic donations. The core mission of higher education is scholarly advancement, critical inquiry, and knowledge creation. By awarding research grants to undergraduate and graduate scholars, the institution directly removes financial barriers for brilliant students and encourages discoveries in medical, technological, and humanitarian fields. While athletic facilities contribute to campus spirit, research grants leave a lasting intellectual legacy that benefits society as a whole.',
      explanation:
        'Defend your position with convincing arguments about the core mission of higher education and long-term societal impact.',
    },
  ],
};

export const OFFICIAL_SPEAKING_TESTS: SpeakingTest[] = [
  OFFICIAL_SPEAKING_TEST_1,
  OFFICIAL_SPEAKING_TEST_2,
];

