/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WritingTest } from '../types/toefl.ts';

export const OFFICIAL_WRITING_TEST_1: WritingTest = {
  id: 'writing-test-official-1',
  title: 'Examen Oficial TOEFL iBT Writing (12 Preguntas)',
  category: 'Writing Oficial ETS • Build a Sentence, Email & Academic Discussion',
  difficulty: 'Standard',
  estimatedMinutes: 25,
  totalQuestions: 12,
  buildSentenceQuestions: [
    {
      id: 'w_q1',
      questionNumber: 1,
      speaker1: {
        avatar: '/assets/writing/avatar_woman_peach.png',
        name: 'Speaker 1',
        speech: 'What was the highlight of your trip?',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_man_blue.png',
        name: 'Speaker 2',
        prefixText: 'The',
        suffixText: 'fantastic.',
        totalSlots: 6,
      },
      wordBank: [
        'were',
        'the',
        'was',
        'old city',
        'showed us around',
        'who',
        'tour guides',
      ],
      correctSequence: [
        'tour guides',
        'who',
        'showed us around',
        'the',
        'old city',
        'were',
      ],
      correctSentence:
        'The tour guides who showed us around the old city were fantastic.',
      explanation:
        'The subject "The tour guides" takes the defining relative clause "who showed us around the old city", followed by the plural past tense verb "were". ("was" is a singular distractor).',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'w_q2',
      questionNumber: 2,
      speaker1: {
        avatar: '/assets/writing/avatar_man_blue.png',
        name: 'Speaker 1',
        speech: 'I heard Anna got a promotion.',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_woman_peach.png',
        name: 'Speaker 2',
        middleText: 'she will be',
        suffixText: '?',
        prefixSlotsCount: 4,
        suffixSlotsCount: 2,
        totalSlots: 6,
      },
      wordBank: [
        'a different department',
        'if',
        'moving to',
        'know',
        'do',
        'you',
      ],
      correctSequence: [
        'do',
        'you',
        'know',
        'if',
        'moving to',
        'a different department',
      ],
      correctSentence:
        'Do you know if she will be moving to a different department?',
      explanation:
        'An indirect question starts with the question formula "Do you know if", followed by the subject-auxiliary clause "she will be", and completed by the continuous verb complement "moving to a different department?".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'w_q3',
      questionNumber: 3,
      speaker1: {
        avatar: '/assets/writing/avatar_woman_red.png',
        name: 'Speaker 1',
        speech: "We're planning a trip to the mountains next weekend.",
      },
      speaker2: {
        avatar: '/assets/writing/avatar_man_navy.png',
        name: 'Speaker 2',
        middleText: 'tell me',
        suffixText: '?',
        prefixSlotsCount: 2,
        suffixSlotsCount: 4,
        totalSlots: 6,
      },
      wordBank: [
        'the cabins',
        'available',
        'whether',
        'can',
        'will be',
        'you',
      ],
      correctSequence: [
        'can',
        'you',
        'whether',
        'the cabins',
        'will be',
        'available',
      ],
      correctSentence: 'Can you tell me whether the cabins will be available?',
      explanation:
        'A polite indirect request begins with modal inversion "Can you tell me", followed by the embedded conjunction "whether" and clause "the cabins will be available?".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'w_q4',
      questionNumber: 4,
      speaker1: {
        avatar: '/assets/writing/avatar_woman_curly.png',
        name: 'Speaker 1',
        speech: "I'm looking forward to the concert this weekend.",
      },
      speaker2: {
        avatar: '/assets/writing/avatar_man_orange.png',
        name: 'Speaker 2',
        suffixText: '?',
        totalSlots: 5,
      },
      wordBank: ['does', 'what', 'time', 'it', 'start'],
      correctSequence: ['what', 'time', 'does', 'it', 'start'],
      correctSentence: 'What time does it start?',
      explanation:
        'Direct information question with wh-phrase "What time" + auxiliary "does" + subject "it" + bare infinitive "start".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'w_q5',
      questionNumber: 5,
      speaker1: {
        avatar: '/assets/writing/avatar_man_yellow.png',
        name: 'Speaker 1',
        speech: 'The museum exhibition opens next month.',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_woman_redhead.png',
        name: 'Speaker 2',
        suffixText: '?',
        totalSlots: 7,
      },
      wordBank: [
        'do',
        'you',
        'how',
        'know',
        'tickets',
        'will cost',
        'much',
      ],
      correctSequence: [
        'do',
        'you',
        'know',
        'how',
        'much',
        'tickets',
        'will cost',
      ],
      correctSentence: 'Do you know how much tickets will cost?',
      explanation:
        'Indirect question ordering: introductory question "Do you know" + embedded interrogative "how much" + subject "tickets" + verb phrase "will cost".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'w_q6',
      questionNumber: 6,
      speaker1: {
        avatar: '/assets/writing/avatar_woman_curly.png',
        name: 'Speaker 1',
        speech: "I'm planning to go to the beach tomorrow.",
      },
      speaker2: {
        avatar: '/assets/writing/avatar_man_orange.png',
        name: 'Speaker 2',
        suffixText: '?',
        totalSlots: 7,
      },
      wordBank: [
        'is',
        'time of year',
        'what',
        'the water',
        'this',
        'like',
        'temperature',
      ],
      correctSequence: [
        'what',
        'is',
        'the water',
        'temperature',
        'like',
        'this',
        'time of year',
      ],
      correctSentence:
        'What is the water temperature like this time of year?',
      explanation:
        'Descriptive question structure "What is [noun phrase: the water temperature] like [adverbial phrase: this time of year]?".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'w_q7',
      questionNumber: 7,
      speaker1: {
        avatar: '/assets/writing/avatar_man_navy.png',
        name: 'Speaker 1',
        speech: 'I need to buy groceries today.',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_woman_red.png',
        name: 'Speaker 2',
        suffixText: '?',
        totalSlots: 6,
      },
      wordBank: ['list', 'do', 'a', 'have', 'shopping', 'you'],
      correctSequence: ['do', 'you', 'have', 'a', 'shopping', 'list'],
      correctSentence: 'Do you have a shopping list?',
      explanation:
        'Standard yes/no question in the simple present: auxiliary "Do" + subject "you" + verb "have" + direct object "a shopping list".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'w_q8',
      questionNumber: 8,
      speaker1: {
        avatar: '/assets/writing/avatar_woman_redhead.png',
        name: 'Speaker 1',
        speech: "I'll be taking a cooking class this weekend.",
      },
      speaker2: {
        avatar: '/assets/writing/avatar_man_yellow.png',
        name: 'Speaker 2',
        suffixText: '?',
        totalSlots: 5,
      },
      wordBank: ['learn', 'what', 'will', 'you', 'recipes'],
      correctSequence: ['what', 'recipes', 'will', 'you', 'learn'],
      correctSentence: 'What recipes will you learn?',
      explanation:
        'Interrogative specifier "What recipes" followed by future auxiliary inversion "will you learn?".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'w_q9',
      questionNumber: 9,
      speaker1: {
        avatar: '/assets/writing/avatar_woman_peach.png',
        name: 'Speaker 1',
        speech: "What did Maria ask you about the book you're reading?",
      },
      speaker2: {
        avatar: '/assets/writing/avatar_man_blue.png',
        name: 'Speaker 2',
        prefixText: 'She',
        suffixText: '.',
        totalSlots: 7,
      },
      wordBank: [
        'she',
        'wanted',
        'a copy',
        'buy',
        'to know',
        'could',
        'where',
      ],
      correctSequence: [
        'wanted',
        'to know',
        'where',
        'she',
        'could',
        'buy',
        'a copy',
      ],
      correctSentence: 'She wanted to know where she could buy a copy.',
      explanation:
        'Reported inquiry: main clause "She wanted to know" + embedded interrogative "where she could buy a copy". Note that word order in the embedded clause is subject-verb (not inverted).',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'w_q10',
      questionNumber: 10,
      speaker1: {
        avatar: '/assets/writing/avatar_man_yellow.png',
        name: 'Speaker 1',
        speech: 'How did you prepare for the exam?',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_woman_peach.png',
        name: 'Speaker 2',
        prefixText: 'I used',
        suffixText: '.',
        totalSlots: 5,
      },
      wordBank: [
        'by',
        'the professor',
        'that',
        'the study guide',
        'was provided',
        'it',
      ],
      correctSequence: [
        'the study guide',
        'that',
        'was provided',
        'by',
        'the professor',
      ],
      correctSentence:
        'I used the study guide that was provided by the professor.',
      explanation:
        'The main clause "I used" takes direct object "the study guide", post-modified by a passive relative clause "that was provided by the professor". ("it" is an ungrammatical redundant distractor pronoun).',
      skill: 'sentence_syntax_grammar',
    },
  ],
  emailTask: {
    id: 'w_email_task_1',
    title: 'Write an Email',
    timeLimitMinutes: 7,
    toAddress: 'editor@sunshinepoetrymagazine.com',
    subject: 'Problem using submission form',
    scenario:
      'A new poetry magazine has asked its readers for submissions, and you decided to submit two of your poems. However, you had a problem using the online submission form, and you are not certain that your submissions were received.',
    instructions: [
      'Tell the editor what you like about the new magazine.',
      'Describe the problem you experienced.',
      'Ask about the status of your submissions.',
    ],
    sampleModelAnswer: `Dear Editor,

I am writing to share how much I have enjoyed reading the inaugural issue of Sunshine Poetry Magazine. The diverse selection of contemporary voices and the captivating illustrations alongside each poem make your publication truly exceptional.

Yesterday, I attempted to submit two original poems for your upcoming volume using the online submission portal. However, after clicking "Submit," the webpage froze on a blank loading screen, and I never received a confirmation message or email receipt. 

Could you please verify whether my submissions—titled "Echoes at Dusk" and "Morning Frost"—successfully reached your editorial system? If necessary, I would be delighted to resend the manuscripts directly via email attachment.

Thank you very much for your time and assistance.

Best regards,
Alex Rivera`,
  },
  academicDiscussionTask: {
    id: 'w_academic_task_1',
    title: 'Write for an Academic Discussion',
    timeLimitMinutes: 10,
    minimumWords: 100,
    scenario:
      'Your professor is teaching a class on social studies. Write a post responding to the professor’s question.',
    instructions: [
      'Express and support your opinion.',
      'Make a contribution to the discussion in your own words.',
      'An effective response will contain at least 100 words.',
    ],
    professor: {
      avatar: '/assets/writing/avatar_professor.png',
      name: 'Professor Miller',
      prompt:
        'Volunteerism refers to the act of offering your time and service without financial compensation to benefit a community, organization, or cause. While many people volunteer mainly to help others, some institutions have mandatory volunteer programs. High schools are one example, where students may be required to complete a certain number of volunteer hours to graduate. What do you think? Should high school students be required to do volunteer work? Why or why not?',
    },
    classmates: [
      {
        avatar: '/assets/writing/avatar_student_female.png',
        name: 'Claire',
        opinion:
          "Yes, I think high schools should require volunteer hours because it helps students build a sense of civic responsibility. Many teenagers don't naturally think about helping others, and this requirement can introduce them to the idea that their time and effort can make a real difference in the lives of others.",
      },
      {
        avatar: '/assets/writing/avatar_student_male.png',
        name: 'Marcus',
        opinion:
          "I don’t think volunteer hours should be required because many students already have limited free time. Some have part-time jobs or take care of younger siblings after school. Adding a mandatory volunteer requirement could create extra stress and make it harder for those students to balance their existing responsibilities.",
      },
    ],
    sampleModelAnswer: `While Claire and Marcus raise compelling perspectives on civic engagement and student time constraints, I firmly believe that high school volunteer programs should be encouraged but strictly optional rather than mandatory for graduation.

Mandating service fundamentally contradicts the altruistic spirit of genuine volunteerism; when students participate merely to fulfill a bureaucratic graduation requirement, they often view community service as an unwelcome burden rather than an inspiring opportunity to connect with their neighborhood. Furthermore, as Marcus pointed out, socioeconomically disadvantaged students frequently need their non-school hours to work paying jobs that support their households or to care for younger relatives. Imposing mandatory unpaid hours disproportionately penalizes these hardworking teenagers. 

Instead of enforcing blanket requirements, schools could provide meaningful incentives—such as academic honors or elective credits—for students who choose to engage in community initiatives. This voluntary approach cultivates authentic empathy without overburdening vulnerable students.`,
  },
};

export const OFFICIAL_WRITING_TESTS: WritingTest[] = [OFFICIAL_WRITING_TEST_1];
