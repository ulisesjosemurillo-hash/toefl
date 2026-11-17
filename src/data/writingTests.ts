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

export const OFFICIAL_WRITING_TEST_2: WritingTest = {
  id: 'writing-test-official-2',
  title: 'Prueba Nueva TOEFL iBT Writing (12 Preguntas)',
  category: 'Writing Oficial ETS • Build a Sentence, Email & Academic Discussion',
  difficulty: 'Standard',
  estimatedMinutes: 25,
  totalQuestions: 12,
  buildSentenceQuestions: [
    {
      id: 'wB_q1',
      questionNumber: 1,
      speaker1: {
        avatar: '/assets/writing/avatar_woman_peach.png',
        name: 'Speaker 1',
        speech: 'Did you attend the university career fair yesterday?',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_man_blue.png',
        name: 'Speaker 2',
        prefixText: 'The',
        suffixText: 'very informative.',
        totalSlots: 6,
      },
      wordBank: [
        'were',
        'was',
        'representatives',
        'company',
        'spoke',
        'to',
        'who I',
      ],
      correctSequence: [
        'company',
        'representatives',
        'who I',
        'spoke',
        'to',
        'were',
      ],
      correctSentence:
        'The company representatives who I spoke to were very informative.',
      explanation:
        'Subject noun phrase "The company representatives" followed by defining relative clause "who I spoke to" and plural verb "were". ("was" is a singular distractor).',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'wB_q2',
      questionNumber: 2,
      speaker1: {
        avatar: '/assets/writing/avatar_man_navy.png',
        name: 'Speaker 1',
        speech: 'I cannot find Professor Henderson’s office anywhere.',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_woman_red.png',
        name: 'Speaker 2',
        middleText: 'his office is',
        suffixText: '?',
        prefixSlotsCount: 4,
        suffixSlotsCount: 1,
        totalSlots: 5,
      },
      wordBank: ['do', 'located', 'where', 'you', 'know'],
      correctSequence: ['do', 'you', 'know', 'where', 'located'],
      correctSentence: 'Do you know where his office is located?',
      explanation:
        'Polite indirect question formula: "Do you know where" + subject "his office is" + participle "located?".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'wB_q3',
      questionNumber: 3,
      speaker1: {
        avatar: '/assets/writing/avatar_woman_curly.png',
        name: 'Speaker 1',
        speech: 'Our environmental science field trip starts early tomorrow morning.',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_man_orange.png',
        name: 'Speaker 2',
        middleText: 'tell me',
        suffixText: '?',
        prefixSlotsCount: 2,
        suffixSlotsCount: 4,
        totalSlots: 6,
      },
      wordBank: [
        'bus',
        'the',
        'can',
        'departs',
        'what time',
        'you',
      ],
      correctSequence: [
        'can',
        'you',
        'what time',
        'the',
        'bus',
        'departs',
      ],
      correctSentence: 'Can you tell me what time the bus departs?',
      explanation:
        'Polite indirect question: "Can you tell me" + embedded wh-clause "what time the bus departs?".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'wB_q4',
      questionNumber: 4,
      speaker1: {
        avatar: '/assets/writing/avatar_man_yellow.png',
        name: 'Speaker 1',
        speech: 'I need to check the lab schedule for this afternoon.',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_woman_redhead.png',
        name: 'Speaker 2',
        suffixText: '?',
        totalSlots: 6,
      },
      wordBank: ['the', 'is', 'biology lab', 'open', 'today', 'when'],
      correctSequence: ['when', 'is', 'the', 'biology lab', 'open', 'today'],
      correctSentence: 'When is the biology lab open today?',
      explanation:
        'Direct question with interrogative "When" + copular verb "is" + subject "the biology lab" + adjective "open" + adverb "today?".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'wB_q5',
      questionNumber: 5,
      speaker1: {
        avatar: '/assets/writing/avatar_woman_peach.png',
        name: 'Speaker 1',
        speech: 'The study lounge was packed during midterm week.',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_man_blue.png',
        name: 'Speaker 2',
        suffixText: '?',
        totalSlots: 6,
      },
      wordBank: ['find', 'could', 'a quiet table', 'you', 'where', 'to study'],
      correctSequence: [
        'where',
        'could',
        'you',
        'find',
        'a quiet table',
        'to study',
      ],
      correctSentence: 'Where could you find a quiet table to study?',
      explanation:
        'Wh-question structure: "Where" + modal "could" + subject "you" + verb "find" + object noun phrase "a quiet table to study?".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'wB_q6',
      questionNumber: 6,
      speaker1: {
        avatar: '/assets/writing/avatar_man_navy.png',
        name: 'Speaker 1',
        speech: 'I haven’t received my student ID card yet.',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_woman_red.png',
        name: 'Speaker 2',
        suffixText: '?',
        totalSlots: 6,
      },
      wordBank: [
        'did',
        'submit',
        'online application',
        'your',
        'you',
        'when',
        'the',
      ],
      correctSequence: [
        'when',
        'did',
        'you',
        'submit',
        'your',
        'online application',
      ],
      correctSentence: 'When did you submit your online application?',
      explanation:
        'Past simple wh-question: "When" + auxiliary "did" + subject "you" + base verb "submit" + noun phrase "your online application?". ("the" is a distractor).',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'wB_q7',
      questionNumber: 7,
      speaker1: {
        avatar: '/assets/writing/avatar_woman_curly.png',
        name: 'Speaker 1',
        speech: 'The registrar office posted the spring course catalog.',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_man_orange.png',
        name: 'Speaker 2',
        suffixText: '?',
        totalSlots: 6,
      },
      wordBank: [
        'have',
        'which',
        'classes',
        'chosen',
        'you',
        'to take',
      ],
      correctSequence: [
        'which',
        'classes',
        'have',
        'you',
        'chosen',
        'to take',
      ],
      correctSentence: 'Which classes have you chosen to take?',
      explanation:
        'Present perfect question with interrogative phrase "Which classes" + auxiliary "have" + subject "you" + past participle "chosen" + infinitive "to take?".',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'wB_q8',
      questionNumber: 8,
      speaker1: {
        avatar: '/assets/writing/avatar_man_yellow.png',
        name: 'Speaker 1',
        speech: 'Our team needs to prepare slides for the symposium.',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_woman_redhead.png',
        name: 'Speaker 2',
        suffixText: '?',
        totalSlots: 5,
      },
      wordBank: [
        'who',
        'responsible for',
        'will be',
        'the introduction',
        'presenting',
        'is',
      ],
      correctSequence: [
        'who',
        'will be',
        'responsible for',
        'presenting',
        'the introduction',
      ],
      correctSentence: 'Who will be responsible for presenting the introduction?',
      explanation:
        'Subject question with future continuous auxiliary: "Who will be responsible for" + gerund complement "presenting the introduction?". ("is" is a distractor).',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'wB_q9',
      questionNumber: 9,
      speaker1: {
        avatar: '/assets/writing/avatar_woman_peach.png',
        name: 'Speaker 1',
        speech: 'What did the academic advisor recommend about your research project?',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_man_blue.png',
        name: 'Speaker 2',
        prefixText: 'He',
        suffixText: '.',
        totalSlots: 6,
      },
      wordBank: [
        'suggested',
        'that',
        'I',
        'focus',
        'more primary sources',
        'on',
        'it',
      ],
      correctSequence: [
        'suggested',
        'that',
        'I',
        'focus',
        'on',
        'more primary sources',
      ],
      correctSentence:
        'He suggested that I focus on more primary sources.',
      explanation:
        'Mandative subjunctive structure: "He suggested that I focus on more primary sources." ("it" is an unnecessary distractor).',
      skill: 'sentence_syntax_grammar',
    },
    {
      id: 'wB_q10',
      questionNumber: 10,
      speaker1: {
        avatar: '/assets/writing/avatar_man_navy.png',
        name: 'Speaker 1',
        speech: 'How did you solve the complex data analysis problem?',
      },
      speaker2: {
        avatar: '/assets/writing/avatar_woman_red.png',
        name: 'Speaker 2',
        prefixText: 'We used',
        suffixText: '.',
        totalSlots: 5,
      },
      wordBank: [
        'the statistical software',
        'recommended',
        'that was',
        'by',
        'our department',
        'them',
      ],
      correctSequence: [
        'the statistical software',
        'that was',
        'recommended',
        'by',
        'our department',
      ],
      correctSentence:
        'We used the statistical software that was recommended by our department.',
      explanation:
        'Direct object "the statistical software" modified by passive relative clause "that was recommended by our department". ("them" is a distractor).',
      skill: 'sentence_syntax_grammar',
    },
  ],
  emailTask: {
    id: 'w_email_task_2',
    title: 'Write an Email',
    timeLimitMinutes: 7,
    toAddress: 'housing@university.edu',
    subject: 'Request for Dormitory Room Transfer',
    scenario:
      'You are currently living in a university residence hall, but your current room assignment has persistent issues that interfere with your academic studies and sleep. You need to request a room transfer for the upcoming semester.',
    instructions: [
      'Explain your current living situation and what you appreciate about the campus residence community.',
      'Describe the specific issue in your current room that is disrupting your academic performance.',
      'Politely request a transfer to a quiet study wing and inquire about the deadlines or required paperwork.',
    ],
    sampleModelAnswer: `Dear University Housing Services,

I am writing to formally request a room transfer for the upcoming spring semester. I currently reside in Room 314 of Maple Hall. I truly appreciate the welcoming atmosphere and the outstanding facilities our residence hall provides, especially the collaborative study lounges and convenient proximity to the academic quad.

Unfortunately, my current room directly overlooks the 24-hour service delivery dock and recycling compactor. The loud hydraulic machinery operating early in the morning and late at night has caused severe sleep disruption, which is now negatively impacting my focus during morning lectures and laboratory sessions.

Therefore, I would be extremely grateful if I could be reassigned to a room in a designated quiet study wing or on an upper floor facing the courtyard. Could you please inform me of the application deadlines and any documentation needed to complete this transfer request?

Thank you very much for your understanding and assistance.

Sincerely,
Jordan Martinez
Student ID: 8492015`,
  },
  academicDiscussionTask: {
    id: 'w_academic_task_2',
    title: 'Write for an Academic Discussion',
    timeLimitMinutes: 10,
    minimumWords: 100,
    scenario:
      'Your professor is teaching an economics and public policy course. Write a post responding to the professor’s question.',
    instructions: [
      'Express and support your opinion.',
      'Make a contribution to the discussion in your own words.',
      'An effective response will contain at least 100 words.',
    ],
    professor: {
      avatar: '/assets/writing/avatar_professor.png',
      name: 'Professor Harrison',
      prompt:
        'Modern economies are experiencing a dramatic transformation in workplace norms, notably through remote work arrangements and proposed four-day workweeks. While advocates argue these policies boost employee well-being and productivity, critics contend they reduce collaboration and hurt economic output. In your view, should governments incentivize companies to adopt flexible four-day workweeks? Why or why not?',
    },
    classmates: [
      {
        avatar: '/assets/writing/avatar_student_female.png',
        name: 'Elena',
        opinion:
          'I strongly support incentivizing four-day workweeks. Evidence from nationwide trials in Iceland and the UK shows that workers maintain or even exceed previous productivity levels when well-rested. Furthermore, an extra day off significantly diminishes worker burnout and lowers commuter carbon emissions.',
      },
      {
        avatar: '/assets/writing/avatar_student_male.png',
        name: 'Tyler',
        opinion:
          'I have serious reservations about government incentives for a shorter workweek. Many critical sectors, such as healthcare, logistics, and manufacturing, require continuous daily coverage. Mandating or heavily subsidizing four-day schedules could lead to severe labor shortages and inflated operating costs for small businesses.',
      },
    ],
    sampleModelAnswer: `While Elena rightly emphasizes enhanced productivity and Tyler raises legitimate concerns regarding continuous-coverage industries, I believe governments should provide targeted fiscal incentives for companies that transition to four-day workweeks, provided implementation remains sector-specific.

A compressed four-day schedule addresses the modern crisis of psychological burnout. When professionals have three full days to recharge, pursue continuing education, and attend to family care, their on-the-job cognitive efficiency and job satisfaction rise dramatically, directly reducing costly employee turnover. 

However, to address Tyler's valid warning regarding essential industries like emergency medicine and supply chain logistics, policies should not be a blunt, universal mandate. Instead, governments should offer tax credits to knowledge-sector and administrative firms that voluntarily demonstrate sustained productivity with reduced working hours, while funding workforce recruitment grants for 24/7 public service sectors. In this manner, society captures the substantial public health and environmental gains of flexible scheduling without jeopardizing vital economic operations.`,
  },
};

export const OFFICIAL_WRITING_TESTS: WritingTest[] = [
  OFFICIAL_WRITING_TEST_1,
  OFFICIAL_WRITING_TEST_2,
];

