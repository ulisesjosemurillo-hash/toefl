/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToeflTest } from '../types/toefl.ts';

export const OFFICIAL_PREBUILT_TESTS: ToeflTest[] = [
  {
    id: 'test-1',
    title: 'Examen Oficial 1 - Módulo 1 (Danza Prehistórica, Municipal Charter, Farmer\'s Market & The Mirror Test)',
    category: 'Práctica Oficial ETS PDF • Reading Módulo 1 (20 Preguntas)',
    difficulty: 'Standard',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-1',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'We know from drawings that have been preserved in caves for over 10,000 years that early humans performed dances as a group activity. We mi_ _ _ think th_ _ prehistoric peo_ _ _ concentrated on_ _ on ba_ _ _ survival. How_ _ _ _, it i_ clear fr_ _ the rec_ _ _ that dan_ _ _ _ was important to them. They recorded more drawings of dances than of any other group activity. Dances served various purposes, including ritualistic communication with the divine, storytelling, and social cohesion.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'We know from drawings that have been preserved in caves for over 10,000 years that early humans performed dances as a group activity. We ',
        },
        {
          type: 'word',
          item: { id: 'cw-1', prefix: 'mi', answer: 'GHT', length: 3 },
        },
        {
          type: 'text',
          text: ' think ',
        },
        {
          type: 'word',
          item: { id: 'cw-2', prefix: 'th', answer: 'AT', length: 2 },
        },
        {
          type: 'text',
          text: ' prehistoric ',
        },
        {
          type: 'word',
          item: { id: 'cw-3', prefix: 'peo', answer: 'PLE', length: 3 },
        },
        {
          type: 'text',
          text: ' concentrated ',
        },
        {
          type: 'word',
          item: { id: 'cw-4', prefix: 'on', answer: 'LY', length: 2 },
        },
        {
          type: 'text',
          text: ' on ',
        },
        {
          type: 'word',
          item: { id: 'cw-5', prefix: 'ba', answer: 'SIC', length: 3 },
        },
        {
          type: 'text',
          text: ' survival. ',
        },
        {
          type: 'word',
          item: { id: 'cw-6', prefix: 'How', answer: 'EVER', length: 4 },
        },
        {
          type: 'text',
          text: ', it ',
        },
        {
          type: 'word',
          item: { id: 'cw-7', prefix: 'i', answer: 'S', length: 1 },
        },
        {
          type: 'text',
          text: ' clear ',
        },
        {
          type: 'word',
          item: { id: 'cw-8', prefix: 'fr', answer: 'OM', length: 2 },
        },
        {
          type: 'text',
          text: ' the ',
        },
        {
          type: 'word',
          item: { id: 'cw-9', prefix: 'rec', answer: 'ORD', length: 3 },
        },
        {
          type: 'text',
          text: ' that ',
        },
        {
          type: 'word',
          item: { id: 'cw-10', prefix: 'dan', answer: 'CING', length: 4 },
        },
        {
          type: 'text',
          text: ' was important to them. They recorded more drawings of dances than of any other group activity. Dances served various purposes, including ritualistic communication with the divine, storytelling, and social cohesion.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'notice-1',
      title: 'Municipal Charter',
      subtitle: 'Sign up for paperless billing statements today.',
      contentHtml:
        'Safe, convenient, easy. Enroll in paperless billing to receive monthly savings account statements in an electronic PDF document. Access your Municipal Charter account through the mobile app and select account preferences in the upper right-hand corner to enroll.',
      questions: [
        {
          id: 'notice_q1',
          question: 'What type of business issued the notice?',
          options: [
            'An Internet provider',
            'A computer company',
            'A paper company',
            'A bank',
          ],
          correctAnswer: 3,
          skill: 'daily_life_scanning',
          explanation:
            'The notice mentions "monthly savings account statements in an electronic PDF document" and refers to "Municipal Charter" financial services, which corresponds to a bank.',
        },
        {
          id: 'notice_q2',
          question: 'How can customers enroll in paperless billing?',
          options: [
            'By visiting a Municipal Charter office',
            'By accessing the Municipal Charter website',
            'By using the Municipal Charter app',
            'By calling a Municipal Charter customer service representative',
          ],
          correctAnswer: 2,
          skill: 'daily_life_scanning',
          explanation:
            'The passage states directly: "Access your Municipal Charter account through the mobile app and select account preferences in the upper right-hand corner to enroll."',
        },
      ],
    },
    dailyLifeNotices: [
      {
        id: 'notice-1',
        title: 'Municipal Charter',
        subtitle: 'Sign up for paperless billing statements today.',
        contentHtml:
          'Safe, convenient, easy. Enroll in paperless billing to receive monthly savings account statements in an electronic PDF document. Access your Municipal Charter account through the mobile app and select account preferences in the upper right-hand corner to enroll.',
        questions: [
          {
            id: 'notice_q1',
            question: 'What type of business issued the notice?',
            options: [
              'An Internet provider',
              'A computer company',
              'A paper company',
              'A bank',
            ],
            correctAnswer: 3,
            skill: 'daily_life_scanning',
            explanation:
              'The notice mentions "monthly savings account statements in an electronic PDF document" and refers to "Municipal Charter" financial services, which corresponds to a bank.',
          },
          {
            id: 'notice_q2',
            question: 'How can customers enroll in paperless billing?',
            options: [
              'By visiting a Municipal Charter office',
              'By accessing the Municipal Charter website',
              'By using the Municipal Charter app',
              'By calling a Municipal Charter customer service representative',
            ],
            correctAnswer: 2,
            skill: 'daily_life_scanning',
            explanation:
              'The passage states directly: "Access your Municipal Charter account through the mobile app and select account preferences in the upper right-hand corner to enroll."',
          },
        ],
      },
      {
        id: 'notice-2-social',
        title: 'Read a social media post.',
        format: 'social_media_post',
        author: 'Sofia Baker',
        contentHtml:
          'Every Saturday, our local farmer\'s market is the place to be! Fresh fruits, veggies, homemade goodies, and unique crafts await you. The Thompson family\'s organic produce is a must-try, known for its quality and cordial service. Their stall is always bustling with customers eager to buy fresh, pesticide-free vegetables from the welcoming staff.\n\nDon\'t miss the bakery stall—get there early for the best bread and pastries, including gluten-free and vegan options. The smell of freshly baked goods fills the air, and these treats sell out fast!\n\nIn addition to food, the market sells handmade crafts like jewelry, pottery, and textiles. These unique items make perfect gifts and support local artisans. Plus, enjoy live music while you shop. Talented local musicians help create a vibrant atmosphere, and the community spirit makes it a delightful experience for all. See you there!',
        questions: [
          {
            id: 'notice_q3',
            question: 'What is the main purpose of the post?',
            options: [
              'To explain the benefits of organic farming',
              'To describe the variety of products available at the farmer\'s market',
              'To compare different farmer\'s markets in the area',
              'To offer advice on starting a stall at the farmer\'s market',
            ],
            correctAnswer: 1,
            skill: 'daily_life_scanning',
            explanation:
              'The post highlights the wide variety of items offered at the market (fruits, veggies, bakery items, handmade crafts, and live music).',
          },
          {
            id: 'notice_q4',
            question: 'What reason is given for the popularity of the Thompson family\'s stall?',
            options: [
              'They offer cooking tips and recipes.',
              'They offer the lowest prices at the market.',
              'They provide friendly service and excellent products.',
              'They have a beautiful and well-decorated stall.',
            ],
            correctAnswer: 2,
            skill: 'daily_life_scanning',
            explanation:
              'The author states that their organic produce is "known for its quality and cordial service" and praised for "welcoming staff."',
          },
          {
            id: 'notice_q5',
            question: 'Why do customers go to the bakery stall early?',
            options: [
              'To get the free samples given in mornings',
              'To get freshly baked bread and pastries before they are gone',
              'To meet the famous baker',
              'To take advantage of early morning discounts',
            ],
            correctAnswer: 1,
            skill: 'daily_life_scanning',
            explanation:
              'The author advises: "get there early for the best bread and pastries... these treats sell out fast!"',
          },
        ],
      },
    ],
    academicPassage: {
      id: 'acad-1',
      title: 'The Mirror Test',
      paragraphs: [
        'Very young children cannot recognize themselves in a mirror; they usually achieve this milestone around 18 months of age. The ability to recognize oneself in the mirror is considered to be a key component of self-awareness and consciousness for humans. But what about animals?',
        'For many years, scientists have known that members of the great ape family could recognize themselves in mirrors. They measured this by the "mirror test," which involved putting a colored mark on an ape\'s body, and then showing the ape its reflection in a mirror. If the ape tried to remove the mark on its own body, the scientists knew that the ape was recognizing its reflection.',
        'Apes are close relatives of humans, but in recent years, scientists have discovered that other animals also pass the "mirror test." Elephants and dolphins have shown signs of self-recognition. These, like apes, are highly intelligent animals. But in a more recent experiment, a type of fish called the cleaner fish tried to scrape a mark off its body when it saw itself in the mirror. This suggests that even less intelligent animals may possess more self-awareness than previously suspected.',
      ],
      questions: [
        {
          id: 'acad_q1',
          question: 'What is the passage mainly about?',
          options: [
            'Stages of early childhood development',
            'Research on animal cognition',
            'Differences between apes, elephants, and dolphins',
            'Recent experiments on fish',
          ],
          correctAnswer: 1,
          skill: 'academic_main_idea',
          explanation:
            'The passage discusses whether animals possess self-awareness and self-recognition through the mirror test, examining apes, elephants, dolphins, and fish—all aspects of animal cognition.',
        },
        {
          id: 'acad_q2',
          question:
            'The word "milestone" in the first sentence is closest in meaning to',
          highlightedWord: 'milestone',
          options: ['accomplishment', 'distance', 'weight', 'discovery'],
          correctAnswer: 0,
          skill: 'academic_vocabulary',
          explanation:
            'In developmental psychology, a "milestone" is a significant stage or achievement (accomplishment) in a child\'s development.',
        },
        {
          id: 'acad_q3',
          question: "Why did scientists put colored marks on animals' bodies?",
          options: [
            "It made it possible to track the animals' movements.",
            'It helped them determine whether the animals recognized themselves.',
            'It made it easier to tell the animals apart.',
            'It showed whether some animals can detect color differences.',
          ],
          correctAnswer: 1,
          skill: 'academic_factual',
          explanation:
            'Paragraph 2 explains: "If the ape tried to remove the mark on its own body, the scientists knew that the ape was recognizing its reflection."',
        },
        {
          id: 'acad_q4',
          question:
            'According to the passage, all of the following are true about elephants EXCEPT:',
          options: [
            'They can recognize themselves in mirrors.',
            'They are highly intelligent animals.',
            'They possess qualities in common with apes.',
            'They understand certain signs from other animals.',
          ],
          correctAnswer: 3,
          skill: 'academic_negative_factual',
          explanation:
            'The passage notes elephants pass the test (recognize themselves), are highly intelligent, and share self-recognition with apes, but it never mentions understanding signs from other animals.',
        },
        {
          id: 'acad_q5',
          question: 'Why does the author mention cleaner fish?',
          options: [
            'To suggest that a wide range of animals may possess self-awareness',
            'To imply that ocean animals are highly intelligent',
            'To demonstrate a flaw in a recent experiment',
            'To provide an example of an animal that does not recognize itself',
          ],
          correctAnswer: 0,
          skill: 'academic_inference',
          explanation:
            'The author states that because cleaner fish tried to scrape off marks, "even less intelligent animals may possess more self-awareness than previously suspected," broadening the scope of animals with self-awareness.',
        },
      ],
    },
  },
  {
    id: 'test-official-mod2',
    title: 'Examen Oficial 1 - Módulo 2 (El Cerebro Humano, Talleres Artísticos, Fitness Center & The Paradox of Choice)',
    category: 'Práctica Oficial ETS PDF • Reading Módulo 2 (20 Preguntas)',
    difficulty: 'Standard',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-mod2',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'The human brain is a complex organ responsible for controlling all bodily functions and enabling thought, emotion, and memory. It is divided into several regions, each with specific roles. The cerebrum, its largest part, is involved in higher cognitive functions such as reasoning, planning, and language. The cerebellum coordinates movement and balance, while the brainstem controls vital bodily functions like breathing and heart rate. Together, they enable the brain to perform its various tasks.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'The human brain is a complex organ responsible for controlling all bodily functions and enabling thought, emotion, and memory. It ',
        },
        {
          type: 'word',
          item: { id: 'cw2m-1', prefix: 'i', answer: 'S', length: 1 },
        },
        {
          type: 'text',
          text: ' divided ',
        },
        {
          type: 'word',
          item: { id: 'cw2m-2', prefix: 'in', answer: 'TO', length: 2 },
        },
        {
          type: 'text',
          text: ' several ',
        },
        {
          type: 'word',
          item: { id: 'cw2m-3', prefix: 'regi', answer: 'ONS', length: 3 },
        },
        {
          type: 'text',
          text: ', each ',
        },
        {
          type: 'word',
          item: { id: 'cw2m-4', prefix: 'wi', answer: 'TH', length: 2 },
        },
        {
          type: 'text',
          text: ' specific ',
        },
        {
          type: 'word',
          item: { id: 'cw2m-5', prefix: 'ro', answer: 'LES', length: 3 },
        },
        {
          type: 'text',
          text: '. The cerebrum, ',
        },
        {
          type: 'word',
          item: { id: 'cw2m-6', prefix: 'i', answer: 'TS', length: 2 },
        },
        {
          type: 'text',
          text: ' largest ',
        },
        {
          type: 'word',
          item: { id: 'cw2m-7', prefix: 'pa', answer: 'RT', length: 2 },
        },
        {
          type: 'text',
          text: ', is ',
        },
        {
          type: 'word',
          item: { id: 'cw2m-8', prefix: 'invo', answer: 'LVED', length: 4 },
        },
        {
          type: 'text',
          text: ' in higher ',
        },
        {
          type: 'word',
          item: { id: 'cw2m-9', prefix: 'cogni', answer: 'TIVE', length: 4 },
        },
        {
          type: 'text',
          text: ' functions ',
        },
        {
          type: 'word',
          item: { id: 'cw2m-10', prefix: 'su', answer: 'CH', length: 2 },
        },
        {
          type: 'text',
          text: ' as reasoning, planning, and language. The cerebellum coordinates movement and balance, while the brainstem controls vital bodily functions like breathing and heart rate. Together, they enable the brain to perform its various tasks.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'notice-mod2-1',
      title: 'Art Workshop Reservation Confirmation',
      format: 'email',
      emailDetails: {
        to: 'ms.edwards@creativestudios.org',
        from: 'reservations@cityartscouncil.org',
        date: 'Thursday, October 14',
        subject: 'Art Workshop Reservation Confirmation - Studio Room B',
        borderColor: '#0f6b64',
      },
      contentHtml:
        'Dear Ms. Edwards,\n\nWe are pleased to confirm your reservation for the Ceramics & Clay Modeling Workshop scheduled for Saturday, November 6th, from 10:00 AM to 1:00 PM in Studio Room B.\n\nAll basic sculpting tools and kiln firing services are included in your registration fee. However, participants are requested to bring their own work aprons. Please arrive 15 minutes prior to start time for check-in at the front desk.\n\nShould you need to reschedule or cancel, you must notify us at least 48 hours in advance to receive a full refund.',
      questions: [
        {
          id: 'mod2_notice_q1',
          question: 'What is the purpose of the email?',
          options: [
            'To notify Ms. Edwards of a workshop cancellation',
            'To confirm Ms. Edwards\'s registration for an art class',
            'To invite Ms. Edwards to teach a sculpting workshop',
            'To bill Ms. Edwards for sculpting materials and tools',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            'The subject and opening sentence clearly state: "We are pleased to confirm your reservation for the Ceramics & Clay Modeling Workshop scheduled for Saturday, November 6th."',
        },
        {
          id: 'mod2_notice_q2',
          question: 'What are participants instructed to bring to the workshop?',
          options: [
            'Their own sculpting tools',
            'Their own work aprons',
            'Receipts from the front desk',
            'A completed cancellation form',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            'The email explicitly states: "All basic sculpting tools and kiln firing services are included in your registration fee. However, participants are requested to bring their own work aprons."',
        },
      ],
    },
    dailyLifeNotices: [
      {
        id: 'notice-mod2-1',
        title: 'Art Workshop Reservation Confirmation',
        format: 'email',
        emailDetails: {
          to: 'ms.edwards@creativestudios.org',
          from: 'reservations@cityartscouncil.org',
          date: 'Thursday, October 14',
          subject: 'Art Workshop Reservation Confirmation - Studio Room B',
          borderColor: '#0f6b64',
        },
        contentHtml:
          'Dear Ms. Edwards,\n\nWe are pleased to confirm your reservation for the Ceramics & Clay Modeling Workshop scheduled for Saturday, November 6th, from 10:00 AM to 1:00 PM in Studio Room B.\n\nAll basic sculpting tools and kiln firing services are included in your registration fee. However, participants are requested to bring their own work aprons. Please arrive 15 minutes prior to start time for check-in at the front desk.\n\nShould you need to reschedule or cancel, you must notify us at least 48 hours in advance to receive a full refund.',
        questions: [
          {
            id: 'mod2_notice_q1',
            question: 'What is the purpose of the email?',
            options: [
              'To notify Ms. Edwards of a workshop cancellation',
              'To confirm Ms. Edwards\'s registration for an art class',
              'To invite Ms. Edwards to teach a sculpting workshop',
              'To bill Ms. Edwards for sculpting materials and tools',
            ],
            correctAnswer: 1,
            skill: 'daily_life_scanning',
            explanation:
              'The subject and opening sentence clearly state: "We are pleased to confirm your reservation for the Ceramics & Clay Modeling Workshop scheduled for Saturday, November 6th."',
          },
          {
            id: 'mod2_notice_q2',
            question: 'What are participants instructed to bring to the workshop?',
            options: [
              'Their own sculpting tools',
              'Their own work aprons',
              'Receipts from the front desk',
              'A completed cancellation form',
            ],
            correctAnswer: 1,
            skill: 'daily_life_scanning',
            explanation:
              'The email explicitly states: "All basic sculpting tools and kiln firing services are included in your registration fee. However, participants are requested to bring their own work aprons."',
          },
        ],
      },
      {
        id: 'notice-mod2-2',
        title: 'Grand Opening Community Fitness Center',
        format: 'email',
        emailDetails: {
          to: 'community-members@westgrove.gov',
          from: 'm.nguyen@westgrove-fitness.org',
          date: 'Monday, November 1',
          subject: 'Grand Opening & Complimentary Trial Pass: Westgrove Fitness Center',
          borderColor: '#1d4ed8',
        },
        contentHtml:
          'Dear Westgrove Resident,\n\nWe are thrilled to announce the official opening of the newly renovated Westgrove Community Fitness Center on Monday, November 15th! Our state-of-the-art facility features an Olympic-size heated pool, brand new strength training equipment, and two group exercise studios.\n\nAs part of our opening celebration, all neighborhood residents are entitled to a complimentary 7-day trial pass. To activate your pass, present a valid photo ID and proof of residency at our welcome desk before December 1st.\n\nIn addition, certified personal trainers will offer complimentary fitness assessments throughout the opening week. Sign-up sheets for group fitness classes (including yoga, spin, and aquatic aerobics) will go live on our website this Friday at 9:00 AM.',
        questions: [
          {
            id: 'mod2_notice_q3',
            question: 'What is the main purpose of Ms. Nguyen\'s email?',
            options: [
              'To announce the opening of a renovated recreational facility and free trial',
              'To recruit certified fitness instructors and lifeguards',
              'To raise municipal funds for constructing a heated swimming pool',
              'To remind residents about annual membership renewal dues',
            ],
            correctAnswer: 0,
            skill: 'daily_life_scanning',
            explanation:
              'The email announces the official opening of the renovated fitness center and invites residents to enjoy a complimentary 7-day pass and free assessments.',
          },
          {
            id: 'mod2_notice_q4',
            question: 'What must residents do to claim their free 7-day pass?',
            options: [
              'Register online before Friday morning',
              'Show personal identification and evidence of local address in person',
              'Sign up for at least one group aerobic class',
              'Complete a mandatory physical examination with a doctor',
            ],
            correctAnswer: 1,
            skill: 'daily_life_scanning',
            explanation:
              'The text states: "To activate your pass, present a valid photo ID and proof of residency at our welcome desk before December 1st."',
          },
          {
            id: 'mod2_notice_q5',
            question: 'When will online registration for group exercise classes begin?',
            options: [
              'Monday, November 1st',
              'This Friday at 9:00 AM',
              'Monday, November 15th',
              'December 1st',
            ],
            correctAnswer: 1,
            skill: 'daily_life_scanning',
            explanation:
              'The email states directly: "Sign-up sheets for group fitness classes (including yoga, spin, and aquatic aerobics) will go live on our website this Friday at 9:00 AM."',
          },
        ],
      },
    ],
    academicPassage: {
      id: 'acad-mod2',
      title: 'The Paradox of Choice',
      paragraphs: [
        'In mainstream economic theory, consumer autonomy is assumed to be maximized when individuals have access to the widest possible array of options. The underlying premise is straightforward: greater choice allows individuals to select items that match their preferences more precisely, theoretically increasing overall satisfaction. However, in recent decades, behavioral psychologists and decision researchers have challenged this assumption, arguing that an abundance of choices often produces negative cognitive and emotional consequences—a phenomenon known as the "paradox of choice."',
        'A seminal experiment conducted by psychologists Sheena Iyengar and Mark Lepper illustrated this effect. Researchers set up a tasting booth at an upscale grocery store featuring high-end gourmet jams. In one condition, the display showcased an extensive selection of 24 distinct varieties, while in the other condition, only a limited set of six options was displayed. While the extensive 24-jam display attracted significantly more foot traffic—60 percent of passing shoppers stopped compared to 40 percent for the limited display—the purchasing behavior was radically different. Approximately 30 percent of shoppers who viewed the small display made an actual purchase, whereas only three percent of those facing the large assortment bought any jam. The sheer volume of alternatives appeared to induce choice paralysis.',
        'Psychologist Barry Schwartz posits that excessive options increase the cognitive burden of decision-making. Consumers must invest disproportionate time evaluating marginal distinctions between similar goods, which elevates the risk of post-decision regret. Even when individuals successfully make a selection, they frequently wonder whether an unchosen alternative would have been superior. Consequently, despite having theoretically optimal goods, consumers frequently experience diminished contentment.',
      ],
      questions: [
        {
          id: 'acad_mod2_q1',
          question: 'What is the main topic of the passage?',
          options: [
            'How gourmet grocery stores market niche food products',
            'How excessive options can hinder decision-making and reduce satisfaction',
            'The historical development of classical economic theories',
            'Strategies for conducting psychological experiments on consumer behavior',
          ],
          correctAnswer: 1,
          skill: 'academic_main_idea',
          explanation:
            'The passage investigates the "paradox of choice," explaining how having too many options causes cognitive overload, choice paralysis, and lower satisfaction.',
        },
        {
          id: 'acad_mod2_q2',
          question: 'The word "seminal" in paragraph 2 is closest in meaning to',
          highlightedWord: 'seminal',
          options: ['expensive', 'influential', 'unusual', 'incomplete'],
          correctAnswer: 1,
          skill: 'academic_vocabulary',
          explanation:
            'In academic writing, a "seminal" experiment or paper is one that is highly influential and serves as a foundational milestone for subsequent research.',
        },
        {
          id: 'acad_mod2_q3',
          question: 'According to paragraph 2, what occurred when the tasting booth displayed 24 varieties of jam?',
          options: [
            'More customers paused to inspect the table, but fewer actually bought jam.',
            'Fewer customers noticed the display than when six varieties were shown.',
            'Customers expressed higher satisfaction with their chosen flavor.',
            'Nearly thirty percent of onlookers purchased multiple jars of jam.',
          ],
          correctAnswer: 0,
          skill: 'academic_factual',
          explanation:
            'The text states that 60% of passing shoppers stopped (attracting more foot traffic), but only 3% bought any jam compared to 30% for the smaller display.',
        },
        {
          id: 'acad_mod2_q4',
          question: 'According to the passage, all of the following are consequences of choice overload EXCEPT:',
          options: [
            'Heightened risk of post-decision regret',
            'Prolonged time spent analyzing slight differences between products',
            'Guaranteed financial losses for consumers',
            'Diminished overall satisfaction with selected items',
          ],
          correctAnswer: 2,
          skill: 'academic_negative_factual',
          explanation:
            'The passage details regret, extra cognitive time evaluating marginal differences, and diminished satisfaction, but never asserts that consumers experience guaranteed financial losses.',
        },
        {
          id: 'acad_mod2_q5',
          question: 'What does the author suggest about consumers who make choices in environments with many options?',
          options: [
            'They consistently find products that perfectly satisfy their needs.',
            'They tend to question whether they made the right choice even after purchasing.',
            'They avoid buying brand-name products altogether.',
            'They prefer shopping in large discount outlets over boutique stores.',
          ],
          correctAnswer: 1,
          skill: 'academic_inference',
          explanation:
            'Paragraph 3 explains that even when individuals make a purchase, "they frequently wonder whether an unchosen alternative would have been superior."',
        },
      ],
    },
  },
  {
    id: 'test-2',
    title: 'Práctica 2: La Revolución Agrícola & Inteligencia de Cefalópodos',
    category: 'Historia Antigua & Zoología Marina',
    difficulty: 'Standard',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-2',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'Around 10,000 years ago, human societies underwent a profound transformation known as the Neolithic Revolution. Rather than relying solely on hunting wild game and gathering seasonal fruits, human communities began to cultivate cereal crops and domesticate animal species. This shift allowed permanent villages to emerge and food surpluses to accumulate, supporting specialization of labor.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'Around 10,000 years ago, human societies underwent a profound ',
        },
        {
          type: 'word',
          item: { id: 'cw2-1', prefix: 'transformat', answer: 'ION', length: 3 },
        },
        {
          type: 'text',
          text: ' known as the Neolithic Revolution. Rather than relying ',
        },
        {
          type: 'word',
          item: { id: 'cw2-2', prefix: 'sole', answer: 'LY', length: 2 },
        },
        {
          type: 'text',
          text: ' on hunting wild ',
        },
        {
          type: 'word',
          item: { id: 'cw2-3', prefix: 'anim', answer: 'ALS', length: 3 },
        },
        {
          type: 'text',
          text: ' and gathering plants, human communities ',
        },
        {
          type: 'word',
          item: { id: 'cw2-4', prefix: 'beg', answer: 'AN', length: 2 },
        },
        {
          type: 'text',
          text: ' to ',
        },
        {
          type: 'word',
          item: { id: 'cw2-5', prefix: 'cultiv', answer: 'ATE', length: 3 },
        },
        {
          type: 'text',
          text: ' cereal crops and domesticate sheep. This shift allowed permanent ',
        },
        {
          type: 'word',
          item: { id: 'cw2-6', prefix: 'settlement', answer: 'S', length: 1 },
        },
        {
          type: 'text',
          text: ' to emerge and food surpluses to ',
        },
        {
          type: 'word',
          item: { id: 'cw2-7', prefix: 'accumula', answer: 'TE', length: 2 },
        },
        {
          type: 'text',
          text: ', ultimately fostering complex urban civilizations.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'notice-2',
      title: 'University Library System',
      subtitle: 'New Automated Interlibrary Loan & Digital Retrieval Services',
      contentHtml:
        'Beginning October 1st, all faculty and enrolled students may request up to five interlibrary loan monographs per calendar week at no cost. Digital scans of journal articles will be delivered directly to your student email inbox within 48 business hours. To place a hold or document delivery request, log in to the Central Library Portal using your Campus ID credentials and navigate to "Research Services > Document Express". Items held for physical pickup must be retrieved within seven calendar days of notification.',
      questions: [
        {
          id: 'notice2_q1',
          question: 'What is the primary purpose of this announcement?',
          options: [
            'To alert students to increased library fines for overdue books',
            'To inform library users about interlibrary loan and scan services',
            'To announce the temporary closure of the Central Library Portal',
            'To hire student workers for the Research Services department',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            'The notice informs students and faculty about borrowing limits (up to five monographs) and the procedure for receiving digital journal scans within 48 hours.',
        },
        {
          id: 'notice2_q2',
          question: 'How long do patrons have to collect requested physical items?',
          options: [
            '48 hours',
            'Five business days',
            'One calendar week',
            'Thirty days',
          ],
          correctAnswer: 2,
          skill: 'daily_life_scanning',
          explanation:
            'The document states: "Items held for physical pickup must be retrieved within seven calendar days of notification," which equals one calendar week.',
        },
      ],
    },
    academicPassage: {
      id: 'acad-2',
      title: 'Cognitive Sophistication in Cephalopods',
      paragraphs: [
        'Unlike vertebrates, whose complex central nervous systems are concentrated entirely within the brain and spinal column, octopuses and other cephalopods possess a decentralized nervous architecture. Approximately two-thirds of an octopus\'s 500 million neurons reside in its flexible arms. Remarkably, these limbs can taste, touch, and even execute autonomous searching movements without continuous instruction from the central brain.',
        'Despite this alien neural configuration, octopuses exhibit behaviors that biologists traditionally associated only with mammals and birds. In controlled laboratory environments, veined octopuses have been observed assembling discarded coconut shell halves to construct portable defensive shelters—one of the few confirmed examples of genuine tool use among marine invertebrates. Furthermore, individual octopuses demonstrate remarkable spatial memory, solving complex multi-latch acrylic puzzles to obtain food rewards and retaining these solutions for months.',
        'The evolution of such intellect in short-lived solitary creatures poses an intriguing evolutionary paradox. Most cephalopods live only one to two years and never interact with their parents or offspring, ruling out cultural transmission of skills. Evolutionary theorists suggest that intense predatory pressure in complex reef ecosystems favored rapid observational learning, camouflage versatility, and opportunistic problem-solving.',
      ],
      questions: [
        {
          id: 'acad2_q1',
          question: 'What is the main topic of the passage?',
          options: [
            'The physical differences between octopuses and other mollusks',
            'Advanced problem-solving and neural structure in cephalopods',
            'How marine vertebrates evolved centralized nervous systems',
            'The cultural traditions passed between parent and juvenile octopuses',
          ],
          correctAnswer: 1,
          skill: 'academic_main_idea',
          explanation:
            'The text highlights the decentralized neural architecture of cephalopods and their remarkable problem-solving and tool-using capabilities.',
        },
        {
          id: 'acad2_q2',
          question:
            'The word "autonomous" in paragraph 1 is closest in meaning to',
          highlightedWord: 'autonomous',
          options: ['independent', 'vigorous', 'hesitant', 'defensive'],
          correctAnswer: 0,
          skill: 'academic_vocabulary',
          explanation:
            '"Autonomous" here describes actions executed without direct continuous central commands—meaning self-governing or independent.',
        },
        {
          id: 'acad2_q3',
          question:
            'According to the passage, why is octopus tool use with coconut shells especially notable?',
          options: [
            'It proves that octopuses can speak with one another.',
            'It represents a rare confirmed case of tool use in an invertebrate.',
            'It indicates octopuses prefer terrestrial food sources.',
            'It is the only known behavior common to all ocean dwellers.',
          ],
          correctAnswer: 1,
          skill: 'academic_factual',
          explanation:
            'Paragraph 2 explicitly states it is "one of the few confirmed examples of genuine tool use among marine invertebrates."',
        },
        {
          id: 'acad2_q4',
          question:
            'All of the following are mentioned as factors driving cephalopod intelligence EXCEPT:',
          options: [
            'Intense predation in reef environments',
            'Observational learning opportunities',
            'The need to camouflage and adapt rapidly',
            'Careful instruction from parent cephalopods',
          ],
          correctAnswer: 3,
          skill: 'academic_negative_factual',
          explanation:
            'Paragraph 3 emphasizes that octopuses are solitary and "never interact with their parents or offspring, ruling out cultural transmission of skills."',
        },
        {
          id: 'acad2_q5',
          question:
            'Why does the author mention that octopuses have a lifespan of only one to two years?',
          options: [
            'To emphasize why the development of such high intelligence is unexpected',
            'To explain why octopuses are prone to neurological diseases',
            'To argue that laboratory experiments on octopuses are inhumane',
            'To prove that vertebrates live significantly longer than invertebrates',
          ],
          correctAnswer: 0,
          skill: 'academic_inference',
          explanation:
            'The author calls it an "intriguing evolutionary paradox" because complex intelligence usually evolves in long-lived social animals, making it surprising in short-lived solitary creatures.',
        },
      ],
    },
  },
  {
    id: 'test-3',
    title: 'Práctica 3: Adquisición Lingüística & Fuentes Hidrotermales',
    category: 'Psicología Cognitiva & Geofísica Oceánica',
    difficulty: 'Challenging',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-3',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'Infants acquire human speech with astonishing speed despite receiving fragmented auditory input. By six months of age, infants can distinguish phonemic contrasts across all human languages, though this universal sensitivity narrows as they become attuned to their native tongue.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'Infants acquire human speech with astonishing speed despite receiving ',
        },
        {
          type: 'word',
          item: { id: 'cw3-1', prefix: 'fragmen', answer: 'TED', length: 3 },
        },
        {
          type: 'text',
          text: ' auditory input. By six months of age, infants can ',
        },
        {
          type: 'word',
          item: { id: 'cw3-2', prefix: 'distingu', answer: 'ISH', length: 3 },
        },
        {
          type: 'text',
          text: ' phonemic contrasts across all ',
        },
        {
          type: 'word',
          item: { id: 'cw3-3', prefix: 'hum', answer: 'AN', length: 2 },
        },
        {
          type: 'text',
          text: ' languages, though this universal ',
        },
        {
          type: 'word',
          item: { id: 'cw3-4', prefix: 'sensitivi', answer: 'TY', length: 2 },
        },
        {
          type: 'text',
          text: ' narrows as they become ',
        },
        {
          type: 'word',
          item: { id: 'cw3-5', prefix: 'attu', answer: 'NED', length: 3 },
        },
        {
          type: 'text',
          text: ' to their native tongue. Experimental evidence demonstrates that toddlers extract underlying grammar ',
        },
        {
          type: 'word',
          item: { id: 'cw3-6', prefix: 'rul', answer: 'ES', length: 2 },
        },
        {
          type: 'text',
          text: ' rather than merely repeating memorized ',
        },
        {
          type: 'word',
          item: { id: 'cw3-7', prefix: 'phrase', answer: 'S', length: 1 },
        },
        {
          type: 'text',
          text: ' heard from adult caregivers.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'notice-3',
      title: 'Metropolitan Transit Authority (MTA)',
      subtitle: 'Contactless Fare Payment Migration & Cardholder Notice',
      contentHtml:
        'Effective November 15th, traditional magnetic stripe MetroPasses will no longer be dispensed at automated station kiosks. Commuters are encouraged to transition to the MetroTap smart card or utilize NFC-enabled mobile wallets directly at turnstiles. Existing magnetic stripe balances may be transferred to a new MetroTap account online or at any staffed customer service center until December 31st. Unused balances not converted prior to January 1st will be forfeited.',
      questions: [
        {
          id: 'notice3_q1',
          question: 'What change will occur on November 15th?',
          options: [
            'Turnstiles will be locked across all stations.',
            'Kiosks will stop issuing magnetic stripe passes.',
            'Fares for smart card users will double.',
            'Customer service centers will permanently close.',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            'The notice explicitly states: "traditional magnetic stripe MetroPasses will no longer be dispensed at automated station kiosks."',
        },
        {
          id: 'notice3_q2',
          question: 'What will happen to balances that are not transferred before January 1st?',
          options: [
            'They will automatically be mailed as paper checks.',
            'They will be lost completely.',
            'They will automatically renew for one more year.',
            'They will be donated to public schools.',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            '"Unused balances not converted prior to January 1st will be forfeited," meaning they will be lost.',
        },
      ],
    },
    academicPassage: {
      id: 'acad-3',
      title: 'Deep-Sea Hydrothermal Vent Ecosystems',
      paragraphs: [
        'Prior to the 1977 discovery of hydrothermal vents along the Galápagos Rift, biologists believed that all multicellular life on Earth was fundamentally dependent upon solar energy captured through photosynthetic plants. In the abyss thousands of meters beneath the sunlit surface, where sunlight cannot penetrate and hydrostatic pressures are crushing, scientists were stunned to encounter flourishing communities of giant tube worms, blind shrimp, and white crabs clustered around scorching underwater geysers.',
        'Subsequent investigation revealed that these idiosyncratic ecosystems rely on chemosynthesis rather than photosynthesis. Magma chambers beneath the seafloor heat circulating seawater up to 400 degrees Celsius, dissolving mineral sulfides from the basaltic bedrock. Specialized chemotrophic bacteria oxidize these toxic hydrogen sulfide compounds, converting chemical bond energy into organic matter. In a remarkable symbiotic relationship, the giant tube worm Riftia pachyptila harbors billions of these bacteria within an internal organ called a trophosome, possessing neither mouth nor digestive tract.',
        'These extreme environments also illuminate the origins of terrestrial life and astrobiology. The geochemical stability, abundant catalysts like iron-sulfur minerals, and thermal gradients found at alkaline hydrothermal vents closely mirror conditions hypothesized for the primordial Earth. Consequently, planetary scientists consider subterranean oceans on icy moons such as Europa and Enceladus prime candidates for harboring analogous chemosynthetic life.',
      ],
      questions: [
        {
          id: 'acad3_q1',
          question: 'What is the primary focus of the passage?',
          options: [
            'The commercial exploitation of deep-sea mineral reserves',
            'How photosynthetic plants adapt to low-light marine zones',
            'The discovery, biology, and broader implications of vent ecosystems',
            'Technological advances in deep-sea submersible vessels',
          ],
          correctAnswer: 2,
          skill: 'academic_main_idea',
          explanation:
            'The passage explores the discovery of hydrothermal vents, how their chemosynthetic ecosystems thrive without sunlight, and their implications for origin of life and extraterrestrial biology.',
        },
        {
          id: 'acad3_q2',
          question:
            'The word "idiosyncratic" in paragraph 2 is closest in meaning to',
          highlightedWord: 'idiosyncratic',
          options: ['distinctive', 'dangerous', 'temporary', 'ancient'],
          correctAnswer: 0,
          skill: 'academic_vocabulary',
          explanation:
            '"Idiosyncratic" refers to features that are unique, highly distinctive, or peculiar to a specific phenomenon.',
        },
        {
          id: 'acad3_q3',
          question:
            'How do giant tube worms (Riftia pachyptila) acquire nutrition?',
          options: [
            'By catching drifting plankton with tiny oral tentacles',
            'Through symbiotic bacteria that oxidize sulfide compounds inside them',
            'By filtering sunlight filtering down from upper ocean layers',
            'By consuming smaller crabs and blind shrimp',
          ],
          correctAnswer: 1,
          skill: 'academic_factual',
          explanation:
            'Paragraph 2 explains that tube worms harbor bacteria inside a trophosome that oxidize hydrogen sulfide, as they have "neither mouth nor digestive tract."',
        },
        {
          id: 'acad3_q4',
          question:
            'According to the passage, all of the following describe hydrothermal vent conditions EXCEPT:',
          options: [
            'Extreme hydrostatic pressure',
            'Complete absence of natural sunlight',
            'Water heated by magma to hundreds of degrees',
            'Abundance of photosynthetic algae',
          ],
          correctAnswer: 3,
          skill: 'academic_negative_factual',
          explanation:
            'The text states sunlight cannot penetrate and life relies on chemosynthesis, so photosynthetic algae cannot exist there.',
        },
        {
          id: 'acad3_q5',
          question:
            'Why does the author mention Europa and Enceladus in the final paragraph?',
          options: [
            'To show that space exploration has surpassed oceanographic research',
            'To indicate places in our solar system where similar life might exist',
            'To explain why Earth\'s deep ocean vents are cooling down',
            'To propose mining rare elements from planetary bodies',
          ],
          correctAnswer: 1,
          skill: 'academic_inference',
          explanation:
            'The author states that because these icy moons have subterranean oceans, planetary scientists consider them "prime candidates for harboring analogous chemosynthetic life."',
        },
      ],
    },
  },
  {
    id: 'test-4',
    title: 'Práctica 4: La Imprenta de Gutenberg & Migración de las Aves',
    category: 'Historia Cultural & Ornitología',
    difficulty: 'Standard',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-4',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'Johannes Gutenberg\'s invention of movable metal type around 1440 revolutionized the dissemination of knowledge across Europe. Previously, manuscripts had to be painstakingly copied by hand by scribes, rendering books prohibitively expensive and accessible only to royalty and monastic libraries.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'Johannes Gutenberg\'s invention of movable metal type around 1440 ',
        },
        {
          type: 'word',
          item: { id: 'cw4-1', prefix: 'revolutioni', answer: 'ZED', length: 3 },
        },
        {
          type: 'text',
          text: ' the dissemination of knowledge across Europe. Previously, ',
        },
        {
          type: 'word',
          item: { id: 'cw4-2', prefix: 'manuscri', answer: 'PTS', length: 3 },
        },
        {
          type: 'text',
          text: ' had to be painstakingly copied by ',
        },
        {
          type: 'word',
          item: { id: 'cw4-3', prefix: 'han', answer: 'D', length: 1 },
        },
        {
          type: 'text',
          text: ' by scribes, rendering books ',
        },
        {
          type: 'word',
          item: { id: 'cw4-4', prefix: 'prohibitive', answer: 'LY', length: 2 },
        },
        {
          type: 'text',
          text: ' expensive. The rapid ',
        },
        {
          type: 'word',
          item: { id: 'cw4-5', prefix: 'spre', answer: 'AD', length: 2 },
        },
        {
          type: 'text',
          text: ' of printed material democratized literacy and ignited the Scientific ',
        },
        {
          type: 'word',
          item: { id: 'cw4-6', prefix: 'Revoluti', answer: 'ON', length: 2 },
        },
        {
          type: 'text',
          text: ', permanently altering the course of ',
        },
        {
          type: 'word',
          item: { id: 'cw4-7', prefix: 'humank', answer: 'IND', length: 3 },
        },
        {
          type: 'text',
          text: '.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'notice-4',
      title: 'Community Health Partners',
      subtitle: 'Mandatory Patient Electronic Health Record Transition',
      contentHtml:
        'Effective January 1st, Community Health Partners is transitioning all patient scheduling, lab results, and medication renewal requests to our encrypted MyHealth portal. Phone appointments will remain available exclusively for urgent same-day consultations. Patients must register their email address at myhealth.chp.org before December 15th to prevent delays in prescription authorizations.',
      questions: [
        {
          id: 'notice4_q1',
          question: 'What will phone service be restricted to starting January 1st?',
          options: [
            'All billing and insurance questions',
            'Only urgent same-day consultations',
            'Routine appointment requests for new patients',
            'International medical inquiries',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            'The notice clarifies: "Phone appointments will remain available exclusively for urgent same-day consultations."',
        },
        {
          id: 'notice4_q2',
          question: 'What must patients do before December 15th?',
          options: [
            'Visit the clinic in person for a physical exam',
            'Register their email address on the online portal',
            'Switch their health insurance policy',
            'Pay outstanding account balances',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            '"Patients must register their email address at myhealth.chp.org before December 15th to prevent delays in prescription authorizations."',
        },
      ],
    },
    academicPassage: {
      id: 'acad-4',
      title: 'Avian Magnetoreception and Navigation',
      paragraphs: [
        'Every autumn, millions of migratory songbirds journey thousands of miles from high-latitude breeding territories to tropical wintering grounds, navigating across trackless oceans and unfamiliar terrain with breathtaking precision. While early naturalists assumed birds relied solely on landmark memory or celestial cues like the position of the sun and stars, modern biophysicists have confirmed that birds possess an internal biological compass capable of detecting Earth\'s geomagnetic field.',
        'Current research points to two distinct yet complementary mechanisms underlying avian magnetoreception. The first is a light-dependent quantum phenomenon occurring in specialized retinal proteins called cryptochromes. When blue photons strike these pigments in a bird\'s eye, radical chemical pairs are created whose quantum states are influenced by the alignment of the ambient magnetic field, effectively allowing birds to perceive magnetic field lines as patterns of visual shading overlaid on their field of view.',
        'In addition to this visual inclination compass, birds possess magnetite-based sensory cells concentrated in the upper beak. Connected via the ophthalmic branch of the trigeminal nerve, these iron-mineral crystals act as a magnetic map, registering minute variations in magnetic intensity and inclination to provide birds with pinpoint latitude coordinates wherever they travel.',
      ],
      questions: [
        {
          id: 'acad4_q1',
          question: 'What is the main topic of the passage?',
          options: [
            'The threats posed by urban lights to migratory songbirds',
            'The biological mechanisms behind avian magnetic navigation',
            'How birds use celestial star patterns during winter journeys',
            'The chemical extraction of iron minerals from bird beaks',
          ],
          correctAnswer: 1,
          skill: 'academic_main_idea',
          explanation:
            'The passage discusses how birds navigate using Earth\'s magnetic field through cryptochrome visual systems and magnetite sensory cells in the beak.',
        },
        {
          id: 'acad4_q2',
          question:
            'The word "breathtaking" in paragraph 1 is closest in meaning to',
          highlightedWord: 'breathtaking',
          options: ['astonishing', 'dangerous', 'intermittent', 'exhausting'],
          correctAnswer: 0,
          skill: 'academic_vocabulary',
          explanation:
            '"Breathtaking" in this context expresses great wonder or admiration at the remarkable precision of avian navigation; synonymous with "astonishing" or "extraordinary".',
        },
        {
          id: 'acad4_q3',
          question:
            'According to paragraph 2, how do cryptochromes help birds sense direction?',
          options: [
            'By generating acoustic vibrations inside the inner ear',
            'By producing visual shading patterns in response to magnetic field lines',
            'By heating the bird\'s blood when flying toward the equator',
            'By allowing birds to detect thermal updrafts over water',
          ],
          correctAnswer: 1,
          skill: 'academic_factual',
          explanation:
            'Paragraph 2 describes how quantum radical pairs allow birds to "perceive magnetic field lines as patterns of visual shading overlaid on their field of view."',
        },
        {
          id: 'acad4_q4',
          question:
            'According to the passage, all of the following contribute to avian navigation EXCEPT:',
          options: [
            'Cryptochrome proteins in the eye',
            'Magnetite crystals in the upper beak',
            'Earth\'s geomagnetic field',
            'Echolocation pulses from the vocal tract',
          ],
          correctAnswer: 3,
          skill: 'academic_negative_factual',
          explanation:
            'Echolocation is used by bats and some marine mammals, but is not mentioned in the text for migratory birds.',
        },
        {
          id: 'acad4_q5',
          question:
            'What can be inferred about the magnetite-based cells in the beak?',
          options: [
            'They replace the need for eyes entirely when birds migrate at night.',
            'They help birds calculate where they are geographically, not just direction.',
            'They were discovered centuries before quantum cryptochromes.',
            'They make birds vulnerable to electrical shocks during thunderstorms.',
          ],
          correctAnswer: 1,
          skill: 'academic_inference',
          explanation:
            'Paragraph 3 explains that the magnetite cells act as a "magnetic map, registering minute variations in magnetic intensity and inclination to provide birds with pinpoint latitude coordinates," which provides geographical position.',
        },
      ],
    },
  },
  {
    id: 'test-5',
    title: 'Práctica 5: Arqueoastronomía Maya & El Telescopio James Webb',
    category: 'Arqueología & Astrofísica',
    difficulty: 'Standard',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-5',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'Centuries before the invention of the optical telescope, ancient Maya astronomers built sophisticated stone observatories to track celestial movements. Through careful mathematical calculations, they tracked the cyclical movements of visible planets like Venus and recorded eclipse cycles with astonishing precision. Their architecture was meticulously aligned with solstices and equinoxes to guide agricultural schedules and religious rituals.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'Centuries before the invention of the optical telescope, ancient Maya astronomers built sophisticated stone ',
        },
        {
          type: 'word',
          item: { id: 'cw5-1', prefix: 'observator', answer: 'IES', length: 3 },
        },
        {
          type: 'text',
          text: ' to track celestial phenomena. Through meticulous mathematical ',
        },
        {
          type: 'word',
          item: { id: 'cw5-2', prefix: 'calculati', answer: 'ONS', length: 3 },
        },
        {
          type: 'text',
          text: ', Maya scribes charted the orbits of ',
        },
        {
          type: 'word',
          item: { id: 'cw5-3', prefix: 'plane', answer: 'TS', length: 2 },
        },
        {
          type: 'text',
          text: ' such as Venus and Mars. They ',
        },
        {
          type: 'word',
          item: { id: 'cw5-4', prefix: 'record', answer: 'ED', length: 2 },
        },
        {
          type: 'text',
          text: ' lunar cycles with ',
        },
        {
          type: 'word',
          item: { id: 'cw5-5', prefix: 'prec', answer: 'ISE', length: 3 },
        },
        {
          type: 'text',
          text: ' mathematical tables. Their monumental pyramids were carefully ',
        },
        {
          type: 'word',
          item: { id: 'cw5-6', prefix: 'alig', answer: 'NED', length: 3 },
        },
        {
          type: 'text',
          text: ' with seasonal solstices, dictating agricultural cycles and ',
        },
        {
          type: 'word',
          item: { id: 'cw5-7', prefix: 'ritual', answer: 'S', length: 1 },
        },
        {
          type: 'text',
          text: ' across Mesoamerica.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'notice-5',
      title: 'City Parks and Recreation Department',
      subtitle: 'Public Stargazing & Observatory Night at Highland Ridge',
      contentHtml:
        'Join amateur astronomers this Friday from 8:00 PM to 11:30 PM at the Highland Ridge Overlook for a guided view of Saturn\'s rings and deep-sky nebulae. High-powered digital telescopes will be provided at no admission charge. Parking permits must be reserved online prior to 5:00 PM on the day of the event, as vehicle capacity is restricted to 150 cars. In the event of dense cloud cover or precipitation, the session will be postponed to Saturday evening.',
      questions: [
        {
          id: 'notice5_q1',
          question: 'What is required for visitors who plan to arrive by car?',
          options: [
            'Paying a cash parking fee upon arrival at the gate',
            'Reserving a parking permit on the website before 5:00 PM',
            'Bringing their own personal telescope equipment',
            'Showing a city resident proof of identification',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            'The notice specifies: "Parking permits must be reserved online prior to 5:00 PM on the day of the event, as vehicle capacity is restricted."',
        },
        {
          id: 'notice5_q2',
          question: 'What will happen if the weather is rainy on Friday?',
          options: [
            'The event will move into an indoor gymnasium.',
            'Refunds will automatically be issued to all ticket holders.',
            'The session will be rescheduled for Saturday evening.',
            'The event will be cancelled until the following month.',
          ],
          correctAnswer: 2,
          skill: 'daily_life_scanning',
          explanation:
            '"In the event of dense cloud cover or precipitation, the session will be postponed to Saturday evening."',
        },
      ],
    },
    academicPassage: {
      id: 'acad-5',
      title: 'Infrared Astronomy and the James Webb Space Telescope',
      paragraphs: [
        'For more than three decades, the Hubble Space Telescope transformed human understanding of the cosmos by capturing breathtaking images primarily in ultraviolet and visible wavelengths. However, because light waves from the earliest cosmic structures have traveled across billions of light-years of expanding spacetime, their wavelengths have been stretched into the infrared spectrum—a phenomenon known as cosmological redshift. Consequently, observing the universe\'s first luminous stars and primordial galaxies required an observatory engineered specifically for infrared detection.',
        'Launched on Christmas Day 2021, the James Webb Space Telescope (JWST) represents a groundbreaking leap in optical engineering. Positioned at the second Sun-Earth Lagrange point (L2), nearly 1.5 million kilometers from Earth, JWST operates in perpetual cold and darkness. Its massive 6.5-meter primary mirror, assembled from 18 gold-plated beryllium hexagonal segments, collects infrared photons with extraordinary sensitivity, while a five-layer tennis-court-sized sunshield blocks ambient heat from the Sun, Earth, and Moon.',
        'JWST\'s spectral instruments have already dismantled several prevailing astrophysical models. It has detected unexpectedly massive, mature galaxies that formed barely 350 million years after the Big Bang, challenging theorists to explain how cosmic structure assembled so rapidly. Furthermore, by measuring the filtered starlight passing through the upper atmospheres of transiting exoplanets, JWST has identified carbon dioxide, water vapor, and sulfur compounds, opening a new frontier in the search for habitable worlds beyond our solar system.',
      ],
      questions: [
        {
          id: 'acad5_q1',
          question: 'What is the primary topic of the passage?',
          options: [
            'The commercial manufacturing of gold-plated mirrors',
            'Why the Hubble Telescope was retired from active service',
            'How the James Webb Space Telescope operates and advances cosmology',
            'The discovery of habitable alien life on nearby exoplanets',
          ],
          correctAnswer: 2,
          skill: 'academic_main_idea',
          explanation:
            'The passage explains why infrared astronomy is necessary, the mechanical design of JWST, and how its discoveries have challenged cosmological theories and aided exoplanet atmospheric analysis.',
        },
        {
          id: 'acad5_q2',
          question:
            'The word "groundbreaking" in paragraph 2 is closest in meaning to',
          highlightedWord: 'groundbreaking',
          options: ['revolutionary', 'fragile', 'theoretical', 'costly'],
          correctAnswer: 0,
          skill: 'academic_vocabulary',
          explanation:
            '"Groundbreaking" denotes innovative, unprecedented, or revolutionary advances in technology and science.',
        },
        {
          id: 'acad5_q3',
          question:
            'According to paragraph 1, why was an infrared telescope necessary to study the earliest galaxies?',
          options: [
            'Early stars produced only radio frequencies rather than light.',
            'Light from distant cosmic structures was stretched into infrared wavelengths by cosmic expansion.',
            'Interstellar dust clouds absorb all infrared light waves entirely.',
            'Visible light telescopes can only be operated from Earth\'s surface.',
          ],
          correctAnswer: 1,
          skill: 'academic_factual',
          explanation:
            'Paragraph 1 explains that because light traveled across expanding space, "their wavelengths have been stretched into the infrared spectrum—a phenomenon known as cosmological redshift."',
        },
        {
          id: 'acad5_q4',
          question:
            'According to the passage, all of the following are components or features of JWST EXCEPT:',
          options: [
            'Gold-plated beryllium mirror segments',
            'Orbit location at the L2 Lagrange point',
            'A five-layer thermal sunshield',
            'An onboard nuclear propulsion engine',
          ],
          correctAnswer: 3,
          skill: 'academic_negative_factual',
          explanation:
            'The text describes the mirrors, L2 orbit, and sunshield, but never mentions a nuclear propulsion engine.',
        },
        {
          id: 'acad5_q5',
          question:
            'Why does the author mention that JWST detected massive galaxies 350 million years after the Big Bang?',
          options: [
            'To argue that the Big Bang never occurred',
            'To demonstrate that early galaxy formation happened faster than previously thought',
            'To show that JWST\'s instruments suffered a calibration malfunction',
            'To prove that our Milky Way galaxy is much younger than estimated',
          ],
          correctAnswer: 1,
          skill: 'academic_inference',
          explanation:
            'Paragraph 3 explains that these mature early galaxies "challenged theorists to explain how cosmic structure assembled so rapidly," showing development occurred much earlier than old models predicted.',
        },
      ],
    },
  },
  {
    id: 'test-6',
    title: 'Práctica 6: Redes Fúngicas del Bosque & Arquitectura Biomimética',
    category: 'Ecología Vegetal & Ingeniería Sostenible',
    difficulty: 'Standard',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-6',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'Beneath the forest floor lies an immense underground fungal network known as mycorrhizal mycelium. Rather than competing blindly for resources, forest trees are physically connected by these microscopic filaments. Through this underground biological internet, mature trees transfer vital nutrients such as carbon, phosphorus, and nitrogen to struggling younger saplings growing in dense shade.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'Beneath the forest floor lies an immense ',
        },
        {
          type: 'word',
          item: { id: 'cw6-1', prefix: 'undergro', answer: 'UND', length: 3 },
        },
        {
          type: 'text',
          text: ' fungal network known as mycorrhizae. Rather than competing, trees are physically ',
        },
        {
          type: 'word',
          item: { id: 'cw6-2', prefix: 'connec', answer: 'TED', length: 3 },
        },
        {
          type: 'text',
          text: ' through microscopic threads. Through these conduits, mature trees ',
        },
        {
          type: 'word',
          item: { id: 'cw6-3', prefix: 'transf', answer: 'ER', length: 2 },
        },
        {
          type: 'text',
          text: ' essential minerals and ',
        },
        {
          type: 'word',
          item: { id: 'cw6-4', prefix: 'nutrie', answer: 'NTS', length: 3 },
        },
        {
          type: 'text',
          text: ' to shaded seedlings. When attacked by invasive pests, trees also transmit ',
        },
        {
          type: 'word',
          item: { id: 'cw6-5', prefix: 'warn', answer: 'ING', length: 3 },
        },
        {
          type: 'text',
          text: ' signals, prompting neighbors to produce chemical ',
        },
        {
          type: 'word',
          item: { id: 'cw6-6', prefix: 'defense', answer: 'S', length: 1 },
        },
        {
          type: 'text',
          text: ', revealing a cooperative woodland ',
        },
        {
          type: 'word',
          item: { id: 'cw6-7', prefix: 'ecosys', answer: 'TEM', length: 3 },
        },
        {
          type: 'text',
          text: '.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'notice-6',
      title: 'University Facilities and Campus Operations',
      subtitle: 'Campus Electric Vehicle (EV) Charging Station Guidelines',
      contentHtml:
        'Effective May 1st, university parking lots B, F, and K have been outfitted with Level-2 electric vehicle charging kiosks. Charging sessions are restricted to a maximum duration of four continuous hours to ensure turnover for all commuting staff and students. Once an EV reaches a full battery charge, drivers have a 30-minute grace window to vacate the charging stall before an automated idle surcharge of $0.10 per minute is billed to their CampusPermit account.',
      questions: [
        {
          id: 'notice6_q1',
          question: 'What is the maximum allowed continuous charging session?',
          options: [
            'Thirty minutes',
            'Two continuous hours',
            'Four continuous hours',
            'Eight working hours',
          ],
          correctAnswer: 2,
          skill: 'daily_life_scanning',
          explanation:
            'The policy clearly states: "Charging sessions are restricted to a maximum duration of four continuous hours to ensure turnover."',
        },
        {
          id: 'notice6_q2',
          question: 'When will an idle fee begin to accumulate?',
          options: [
            'Immediately upon plugging in the charging cable',
            '30 minutes after the vehicle battery reaches full charge',
            'Only if the vehicle remains parked overnight',
            'If the student has an outstanding tuition balance',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            '"Once an EV reaches a full battery charge, drivers have a 30-minute grace window to vacate the charging stall before an automated idle surcharge... is billed."',
        },
      ],
    },
    academicPassage: {
      id: 'acad-6',
      title: 'Biomimetic Architecture: Learning from Termite Mounds',
      paragraphs: [
        'Modern commercial skyscrapers consume colossal amounts of electricity, with mechanical heating, ventilation, and air conditioning (HVAC) systems accounting for more than 40 percent of total energy expenditures. Seeking sustainable alternatives to fossil-fueled climate control, environmental architects are increasingly embracing biomimicry—the practice of emulating biological designs perfected by millions of years of natural evolution.',
        'One of the most celebrated examples of biomimetic engineering is the Eastgate Centre, a multi-story shopping and commercial complex constructed in Harare, Zimbabwe. Designed by visionary architect Mick Pearce in collaboration with Arup engineers, the building possesses no conventional refrigeration or air conditioning machinery. Instead, Pearce drew inspiration from the colossal soil mounds constructed by Macrotermes bellicosus termites across the African savanna. Despite extreme outdoor temperature fluctuations ranging from near-freezing at night to scorching 40-degree-Celsius heat at midday, termites maintain the interior of their fungal brood chambers at an unyielding 31 degrees Celsius.',
        'The building replicates this passive thermoregulation through a sophisticated system of vertical flues, porous masonry, and nocturnal thermal mass. During cool African nights, fans draw cold outdoor air into the structure, chilling the dense concrete floor slabs. Throughout the hot day, heat generated by occupants and computers rises via natural convection into exhaust chimneys, pulling the cool air stored within the concrete mass up into office suites. By eliminating mechanical chillers, the Eastgate Centre consumes 90 percent less energy than comparable conventional office buildings in Harare.',
      ],
      questions: [
        {
          id: 'acad6_q1',
          question: 'What is the main idea of the passage?',
          options: [
            'Termites pose a dangerous architectural threat to commercial buildings.',
            'Harare, Zimbabwe suffers from severe municipal electrical shortages.',
            'Architects can replicate natural termite ventilation to drastically reduce building energy use.',
            'Concrete floor slabs are more economical than lightweight timber frames.',
          ],
          correctAnswer: 2,
          skill: 'academic_main_idea',
          explanation:
            'The passage discusses how the Eastgate Centre emulated termite mound passive thermoregulation to eliminate conventional air conditioning and cut energy consumption by 90 percent.',
        },
        {
          id: 'acad6_q2',
          question:
            'The word "unyielding" in paragraph 2 is closest in meaning to',
          highlightedWord: 'unyielding',
          options: ['constant', 'flexible', 'elevated', 'hazardous'],
          correctAnswer: 0,
          skill: 'academic_vocabulary',
          explanation:
            'In this context, an "unyielding" 31 degrees Celsius temperature means rigid, steadfast, unchanging, or constant despite outside temperature swings.',
        },
        {
          id: 'acad6_q3',
          question:
            'According to paragraph 3, how does the Eastgate Centre cool its interior during hot days?',
          options: [
            'Large refrigerated ice tanks are wheeled into the hallways.',
            'Rising warm air expels through chimneys, drawing air chilled by nocturnal concrete into rooms.',
            'Subterranean water wells are pumped through plastic wall conduits.',
            'Automated reflective solar panels shade all outer glass windows.',
          ],
          correctAnswer: 1,
          skill: 'academic_factual',
          explanation:
            'Paragraph 3 explains that rising heat flows through exhaust chimneys by natural convection, pulling up cool air stored inside the concrete floor slabs from the previous night.',
        },
        {
          id: 'acad6_q4',
          question:
            'According to the passage, all of the following are true about the Eastgate Centre EXCEPT:',
          options: [
            'It was built in Harare, Zimbabwe.',
            'It was modeled after termite mounds.',
            'It consumes 90 percent less energy than typical local office buildings.',
            'It relies on large mechanical chillers installed on the roof.',
          ],
          correctAnswer: 3,
          skill: 'academic_negative_factual',
          explanation:
            'Paragraph 2 explicitly states the building "possesses no conventional refrigeration or air conditioning machinery" and eliminated mechanical chillers.',
        },
        {
          id: 'acad6_q5',
          question:
            'Why does the author cite the temperature swing from near-freezing to 40 degrees Celsius on the African savanna?',
          options: [
            'To argue that human construction in Zimbabwe is impossible without heating',
            'To emphasize the impressive precision of the termites\' passive thermal control',
            'To prove that termites prefer cold environments over hot climates',
            'To demonstrate that global warming is accelerating in southern Africa',
          ],
          correctAnswer: 1,
          skill: 'academic_inference',
          explanation:
            'The author contrasts the dramatic outdoor temperature range (near-freezing to 40°C) with the termites\' ability to keep their internal chambers at an exact 31°C, highlighting their remarkable thermal regulation.',
        },
      ],
    },
  },
  {
    id: 'test-7',
    title: 'Práctica 7: El Sistema Glinfático del Sueño & Bilingüismo',
    category: 'Neurobiología & Lingüística Cognitiva',
    difficulty: 'Challenging',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-7',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'Young children who grow up in multilingual households acquire two languages simultaneously without cognitive confusion. Neuroimaging studies demonstrate that bilingual children develop stronger executive function and attentional control than their monolingual peers, because their brains continuously suppress competing grammatical structures while processing spoken sentences.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'Young children who grow up in multilingual households acquire two languages ',
        },
        {
          type: 'word',
          item: { id: 'cw7-1', prefix: 'simultaneous', answer: 'LY', length: 2 },
        },
        {
          type: 'text',
          text: ' without cognitive delay. Neuroimaging studies confirm that bilingual youths ',
        },
        {
          type: 'word',
          item: { id: 'cw7-2', prefix: 'devel', answer: 'OP', length: 2 },
        },
        {
          type: 'text',
          text: ' heightened neural plasticity and ',
        },
        {
          type: 'word',
          item: { id: 'cw7-3', prefix: 'stron', answer: 'GER', length: 3 },
        },
        {
          type: 'text',
          text: ' executive brain functions. Because they must constantly ',
        },
        {
          type: 'word',
          item: { id: 'cw7-4', prefix: 'suppr', answer: 'ESS', length: 3 },
        },
        {
          type: 'text',
          text: ' the inactive language, their prefrontal cortex exhibits superior ',
        },
        {
          type: 'word',
          item: { id: 'cw7-5', prefix: 'attent', answer: 'ION', length: 3 },
        },
        {
          type: 'text',
          text: ' and cognitive flexibility during complex problem ',
        },
        {
          type: 'word',
          item: { id: 'cw7-6', prefix: 'solv', answer: 'ING', length: 3 },
        },
        {
          type: 'text',
          text: ' tasks throughout adult ',
        },
        {
          type: 'word',
          item: { id: 'cw7-7', prefix: 'lif', answer: 'E', length: 1 },
        },
        {
          type: 'text',
          text: '.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'notice-7',
      title: 'Department of Public Water Works',
      subtitle: 'Annual High-Pressure Water Main Flushing Program',
      contentHtml:
        'Between June 5th and June 12th, municipal utility crews will perform scheduled high-velocity hydrant flushing across districts 3 and 4 to remove natural sediment accumulation from primary distribution pipelines. During flushing hours (8:30 AM to 3:30 PM), residents may experience temporary reductions in water pressure and slight reddish discoloration caused by harmless iron mineral deposits. Running cold water faucets for three to five minutes will quickly clear household lines before laundry or dishwashing.',
      questions: [
        {
          id: 'notice7_q1',
          question: 'What is the purpose of the scheduled water main work?',
          options: [
            'To install smart digital water meters in homes',
            'To clear natural sediment buildup from the pipe distribution system',
            'To repair burst water mains caused by sub-zero winter temperatures',
            'To increase residential water consumption rates',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            'The notice explains the flushing is done "to remove natural sediment accumulation from primary distribution pipelines."',
        },
        {
          id: 'notice7_q2',
          question: 'What are residents advised to do if their tap water looks discolored?',
          options: [
            'Immediately boil all water for fifteen minutes',
            'Contact an emergency plumber to replace home pipes',
            'Run cold water taps for three to five minutes until clear',
            'Evacuate their home until the following morning',
          ],
          correctAnswer: 2,
          skill: 'daily_life_scanning',
          explanation:
            'The notice explicitly recommends: "Running cold water faucets for three to five minutes will quickly clear household lines."',
        },
      ],
    },
    academicPassage: {
      id: 'acad-7',
      title: 'The Glymphatic System: Waste Clearance During Sleep',
      paragraphs: [
        'Throughout the animal kingdom, biological organisms spend roughly one-third of their lives in sleep—a vulnerable behavioral state during which animals cannot forage, reproduce, or defend against predators. For decades, evolutionary neuroscientists struggled to identify the core survival function that justified such profound vulnerability. While psychologists emphasized memory consolidation, recent breakthroughs in neurophysiology have identified a vital metabolic mechanism: the glymphatic system.',
        'Unlike peripheral bodily tissues, which rely on the lymphatic circulatory system to transport cellular debris and metabolic toxins to lymph nodes for filtration, the central nervous system lacks traditional lymphatic vessels. In 2012, researchers led by Dr. Maiken Nedergaard discovered that the brain compensates through an intricate network of glial channels. Cerebrospinal fluid (CSF) is pumped along the perivascular spaces surrounding cerebral arteries, washing across interstitial brain tissue to cleanse toxic metabolic byproducts, including amyloid-beta and tau proteins associated with neurodegenerative disorders.',
        'Crucially, this cleansing process is largely dormant during wakefulness. During non-rapid eye movement (NREM) deep sleep, glial cells contract, expanding the interstitial space between neurons by up to 60 percent. This dramatic surge in extracellular volume allows cerebrospinal fluid to flush through cerebral tissue ten times more vigorously than during waking hours. These findings demonstrate that chronic sleep deprivation directly impairs the brain\'s restorative self-cleaning mechanism, providing a biological link between chronic insomnia and accelerated cognitive decline.',
      ],
      questions: [
        {
          id: 'acad7_q1',
          question: 'What is the primary subject of the passage?',
          options: [
            'Pharmaceutical cures for chronic adult insomnia',
            'The structure of the peripheral lymphatic system',
            'How the glymphatic system clears metabolic waste from the brain during sleep',
            'The evolutionary reasons why animals hunt predators at night',
          ],
          correctAnswer: 2,
          skill: 'academic_main_idea',
          explanation:
            'The passage focuses on the discovery and operation of the glymphatic system, which flushes metabolic toxins and proteins from the brain specifically during deep sleep.',
        },
        {
          id: 'acad7_q2',
          question:
            'The word "dormant" in paragraph 3 is closest in meaning to',
          highlightedWord: 'dormant',
          options: ['inactive', 'destructive', 'permanent', 'irregular'],
          correctAnswer: 0,
          skill: 'academic_vocabulary',
          explanation:
            '"Dormant" means resting, suspended, or inactive during waking hours, becoming active during deep sleep.',
        },
        {
          id: 'acad7_q3',
          question:
            'According to paragraph 3, what structural change occurs in the brain during NREM deep sleep?',
          options: [
            'Blood flow to the brain is completely terminated.',
            'Glial cells contract, increasing interstitial space between neurons by up to 60 percent.',
            'The skull bones expand to accommodate increased CSF volume.',
            'Neurons cease firing electrical action potentials entirely.',
          ],
          correctAnswer: 1,
          skill: 'academic_factual',
          explanation:
            'Paragraph 3 explains: "glial cells contract, expanding the interstitial space between neurons by up to 60 percent," allowing fluid to flush through.',
        },
        {
          id: 'acad7_q4',
          question:
            'All of the following are mentioned in the passage EXCEPT:',
          options: [
            'Amyloid-beta and tau proteins',
            'Cerebrospinal fluid flowing along perivascular channels',
            'Artificial chemical cleansers injected during hospital surgery',
            'Glial cells regulating fluid passage',
          ],
          correctAnswer: 2,
          skill: 'academic_negative_factual',
          explanation:
            'Artificial chemical cleaners are never mentioned; the passage discusses the body\'s natural cerebrospinal fluid and glial channels.',
        },
        {
          id: 'acad7_q5',
          question:
            'What can be inferred about individuals suffering from prolonged, chronic sleep deprivation?',
          options: [
            'Their peripheral lymphatic system will take over brain cleansing.',
            'Toxic waste products like amyloid-beta are more likely to accumulate in their brain tissue.',
            'They will require less calorie intake during the daytime.',
            'Their brains will permanently lose all glial cells.',
          ],
          correctAnswer: 1,
          skill: 'academic_inference',
          explanation:
            'The final sentence links sleep deprivation to impaired self-cleaning and cognitive decline; without NREM sleep, the glymphatic system cannot flush out amyloid-beta, leading to accumulation.',
        },
      ],
    },
  },
  {
    id: 'test-8',
    title: 'Práctica 8: Navegación Polinesia & Vulcanismo Subglacial',
    category: 'Historia Marítima & Geología Glaciar',
    difficulty: 'Standard',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-8',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'Long before European explorers ventured across open oceans with compasses and sextants, ancient Polynesian navigators crossed thousands of miles of the Pacific in double-hulled voyaging canoes. Without navigational instruments, wayfinders relied on intimate knowledge of celestial star paths, cloud formations, ocean swell patterns, and the flight directions of migratory seabirds.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'Long before the invention of magnetic compasses, ancient Polynesian navigators crossed vast ',
        },
        {
          type: 'word',
          item: { id: 'cw8-1', prefix: 'distan', answer: 'CES', length: 3 },
        },
        {
          type: 'text',
          text: ' across the Pacific Ocean in double-hulled ',
        },
        {
          type: 'word',
          item: { id: 'cw8-2', prefix: 'can', answer: 'OES', length: 3 },
        },
        {
          type: 'text',
          text: '. Without written charts, master wayfinders ',
        },
        {
          type: 'word',
          item: { id: 'cw8-3', prefix: 'naviga', answer: 'TED', length: 3 },
        },
        {
          type: 'text',
          text: ' by memorizing the positions of rising ',
        },
        {
          type: 'word',
          item: { id: 'cw8-4', prefix: 'sta', answer: 'RS', length: 2 },
        },
        {
          type: 'text',
          text: ' and tracking subtle ocean ',
        },
        {
          type: 'word',
          item: { id: 'cw8-5', prefix: 'swe', answer: 'LLS', length: 3 },
        },
        {
          type: 'text',
          text: '. By observing the nesting flight of coastal ',
        },
        {
          type: 'word',
          item: { id: 'cw8-6', prefix: 'bird', answer: 'S', length: 1 },
        },
        {
          type: 'text',
          text: ', they successfully located remote island ',
        },
        {
          type: 'word',
          item: { id: 'cw8-7', prefix: 'archipela', answer: 'GOS', length: 3 },
        },
        {
          type: 'text',
          text: '.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'notice-8',
      title: 'West Valley Community College Career Center',
      subtitle: 'Annual Spring STEM Career Fair & Resume Speed Coaching',
      contentHtml:
        'The Annual Spring STEM Career Fair will take place on Wednesday, March 20th, from 10:00 AM to 3:00 PM in the Student Commons Ballroom. Over 60 regional biotechnology, software engineering, and clean energy employers will be recruiting for paid summer internships. Attendees must dress in professional business attire and bring at least ten printed copies of their resume. Rapid 15-minute resume critique sessions will be offered on a first-come, first-served walk-in basis starting at 9:30 AM in Room 204.',
      questions: [
        {
          id: 'notice8_q1',
          question: 'What must students bring to the STEM Career Fair?',
          options: [
            'Their high school diploma transcripts',
            'At least ten printed copies of their resume',
            'A written letter of recommendation from an advisor',
            'An active LinkedIn mobile application verification',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            'The notice explicitly states: "Attendees must dress in professional business attire and bring at least ten printed copies of their resume."',
        },
        {
          id: 'notice8_q2',
          question: 'How can students participate in the 15-minute resume coaching?',
          options: [
            'By booking an appointment two weeks in advance online',
            'By walking in without an appointment starting at 9:30 AM',
            'By submitting an email request to the department chair',
            'By paying a registration fee at the commons desk',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            '"Rapid 15-minute resume critique sessions will be offered on a first-come, first-served walk-in basis starting at 9:30 AM in Room 204."',
        },
      ],
    },
    academicPassage: {
      id: 'acad-8',
      title: 'Subglacial Volcanoes and Ice Sheet Dynamics',
      paragraphs: [
        'Volcanism is commonly envisioned as towering basaltic cones erupting fiery magma plumes into the open atmosphere. However, beneath the massive ice sheets of Antarctica and Iceland lies a hidden volcanic frontier: subglacial volcanoes, or glaciovolcanoes. Trapped beneath kilometers of glacial overburden, these subterranean geothermal conduits exert a profound influence on global sea levels and cryosphere stability.',
        'When a volcano erupts beneath a glacier, the immense weight of overlying ice generates tremendous hydrostatic pressure that prevents explosive gaseous expansion. Instead, the intense volcanic thermal energy melts the base of the ice sheet, forming massive subglacial cauldrons and vast sub-ice lakes. If meltwater continues to pool beneath the ice cap, it can lubricate the interface between the glacial ice and bedrock, causing glaciers to surge toward the ocean at accelerated speeds. Occasionally, the water breaks through retaining ice dams, triggering catastrophic glacial outburst floods known internationally by the Icelandic term jökulhlaup.',
        'Furthermore, glaciovolcanism involves a potent feedback loop with climate change. When atmospheric temperatures rise and glaciers thin, the reduction in overburden weight relieves lithospheric pressure on the underlying magma chambers. This decompression promotes mantle melting and triggers heightened volcanic activity. Consequently, scientists warn that melting ice sheets in polar regions could awaken dormant volcanic systems, releasing trapped volcanic carbon dioxide and further destabilizing continental ice reserves.',
      ],
      questions: [
        {
          id: 'acad8_q1',
          question: 'What is the primary topic of the passage?',
          options: [
            'How ancient seafloor explorers mapped undersea trenches',
            'The mechanisms and environmental consequences of subglacial volcanic eruptions',
            'The commercial extraction of geothermal steam in Iceland',
            'Why atmospheric volcanic ash clouds disrupt international air travel',
          ],
          correctAnswer: 1,
          skill: 'academic_main_idea',
          explanation:
            'The passage explains how subglacial volcanoes form and erupt, how they generate meltwater lakes and jökulhlaups, and how melting glaciers can trigger increased volcanic eruptions.',
        },
        {
          id: 'acad8_q2',
          question:
            'The word "potent" in paragraph 3 is closest in meaning to',
          highlightedWord: 'potent',
          options: ['powerful', 'temporary', 'gradual', 'expensive'],
          correctAnswer: 0,
          skill: 'academic_vocabulary',
          explanation:
            'A "potent feedback loop" refers to a strong, highly effective, or powerful causal mechanism.',
        },
        {
          id: 'acad8_q3',
          question:
            'According to paragraph 2, what is a "jökulhlaup"?',
          options: [
            'A frozen pyramid of hardened volcanic ash',
            'A catastrophic glacial outburst flood caused by pooled meltwater breaking through ice',
            'A deep seismic earthquake occurring inside an ice canyon',
            'A type of geothermal hot spring used by bathers',
          ],
          correctAnswer: 1,
          skill: 'academic_factual',
          explanation:
            'Paragraph 2 describes meltwater breaking through retaining ice dams, "triggering catastrophic glacial outburst floods known internationally by the Icelandic term jökulhlaup."',
        },
        {
          id: 'acad8_q4',
          question:
            'According to the passage, all of the following occur during subglacial eruptions EXCEPT:',
          options: [
            'Tremendous hydrostatic pressure prevents explosive gaseous plumes.',
            'Meltwater lubricates the boundary between glacier ice and bedrock.',
            'Atmospheric winds immediately blow volcanic ash across the entire globe.',
            'Subglacial lakes form beneath the overlying ice sheet.',
          ],
          correctAnswer: 2,
          skill: 'academic_negative_factual',
          explanation:
            'Because the eruption occurs beneath kilometers of thick ice, explosive atmospheric ash plumes are prevented by hydrostatic pressure, so ash does not blow across the globe immediately.',
        },
        {
          id: 'acad8_q5',
          question:
            'Why does thinning ice cause magma chambers to erupt more frequently?',
          options: [
            'Cold rainwater penetrates directly into the magma core.',
            'Reduced ice weight relieves lithospheric pressure, encouraging decompression melting of magma.',
            'Glaciers freeze the upper mantle, forcing magma upward.',
            'Seismic waves from ocean tides shake the bedrock.',
          ],
          correctAnswer: 1,
          skill: 'academic_inference',
          explanation:
            'Paragraph 3 explains: "the reduction in overburden weight relieves lithospheric pressure on the underlying magma chambers. This decompression promotes mantle melting and triggers heightened volcanic activity."',
        },
      ],
    },
  },
  {
    id: 'test-9',
    title: 'Práctica 9: Mercado de Agricultores (Social Media Post) & Microclimas Urbanos',
    category: 'Lectura Social Media (ETS Oficial) & Climatología',
    difficulty: 'Standard',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-9',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'Urban communal gardens offer profound environmental and social benefits to local neighborhoods. Beyond providing fresh vegetables and promoting communal health, these green spaces allow urbanites to cultivate native plants, meet their neighbors, and harvest healthy produce.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'Urban ',
        },
        {
          type: 'word',
          item: { id: 'cw9-1', prefix: 'commu', answer: 'NAL', length: 3 },
        },
        {
          type: 'text',
          text: ' community ',
        },
        {
          type: 'word',
          item: { id: 'cw9-2', prefix: 'garde', answer: 'NS', length: 2 },
        },
        {
          type: 'text',
          text: ' offer profound environmental benefits. In addition to improving public ',
        },
        {
          type: 'word',
          item: { id: 'cw9-3', prefix: 'hea', answer: 'LTH', length: 3 },
        },
        {
          type: 'text',
          text: ', these open green spaces allow families to grow flowering ',
        },
        {
          type: 'word',
          item: { id: 'cw9-4', prefix: 'pla', answer: 'NTS', length: 3 },
        },
        {
          type: 'text',
          text: ' and learn how to ',
        },
        {
          type: 'word',
          item: { id: 'cw9-5', prefix: 'cultiva', answer: 'TE', length: 2 },
        },
        {
          type: 'text',
          text: ' organic vegetables. Residents frequently connect with friendly ',
        },
        {
          type: 'word',
          item: { id: 'cw9-6', prefix: 'neighbo', answer: 'RS', length: 2 },
        },
        {
          type: 'text',
          text: ' while gathering seasonal ',
        },
        {
          type: 'word',
          item: { id: 'cw9-7', prefix: 'harves', answer: 'T', length: 1 },
        },
        {
          type: 'text',
          text: ' crops.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'social-media-1',
      title: 'Sofia Baker • Local Farmer\'s Market',
      format: 'social_media_post',
      author: 'Sofia Baker',
      contentHtml:
        'Every Saturday, our local farmer\'s market is the place to be! Fresh fruits, veggies, homemade goodies, and unique crafts await you. The Thompson family\'s organic produce is a must-try, known for its quality and cordial service. Their stall is always bustling with customers eager to buy fresh, pesticide-free vegetables from the welcoming staff.\n\nDon\'t miss the bakery stall—get there early for the best bread and pastries, including gluten-free and vegan options. The smell of freshly baked goods fills the air, and these treats sell out fast!\n\nIn addition to food, the market sells handmade crafts like jewelry, pottery, and textiles. These unique items make perfect gifts and support local artisans. Plus, enjoy live music while you shop. Talented local musicians help create a vibrant atmosphere, and the community spirit makes it a delightful experience for all. See you there!',
      questions: [
        {
          id: 'sm_q1',
          question: 'What is the main purpose of the post?',
          options: [
            'To explain the benefits of organic farming',
            'To describe the variety of products available at the farmer\'s market',
            'To compare different farmer\'s markets in the area',
            'To offer advice on starting a stall at the farmer\'s market',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            'The post describes organic produce from the Thompson family, baked treats from the bakery stall, handmade artisan crafts (jewelry, pottery, textiles), and live music, summarizing the wide variety of items and activities at the market.',
        },
        {
          id: 'sm_q2',
          question: 'What reason is given for the popularity of the Thompson family\'s stall?',
          options: [
            'They offer cooking tips and recipes.',
            'They offer the lowest prices at the market.',
            'They provide friendly service and excellent products.',
            'They have a beautiful and well-decorated stall.',
          ],
          correctAnswer: 2,
          skill: 'daily_life_scanning',
          explanation:
            'Paragraph 1 explicitly notes that the Thompson family\'s stall is "known for its quality and cordial service" and praised for its "fresh, pesticide-free vegetables from the welcoming staff", directly matching friendly service and excellent products.',
        },
        {
          id: 'sm_q3',
          question: 'Why do customers go to the bakery stall early?',
          options: [
            'To get the free samples given in mornings',
            'To get freshly baked bread and pastries before they are gone',
            'To meet the famous baker',
            'To take advantage of early morning discounts',
          ],
          correctAnswer: 1,
          skill: 'daily_life_scanning',
          explanation:
            'Paragraph 2 tells readers: "get there early for the best bread and pastries... these treats sell out fast!", indicating that customers arrive early to buy items before they sell out.',
        },
      ],
    },
    academicPassage: {
      id: 'acad-9',
      title: 'Urban Microclimates and the Heat Island Effect',
      paragraphs: [
        'Over the past century, urban expansion has dramatically transformed natural landscapes into dense clusters of asphalt, concrete, and towering commercial structures. These manufactured surfaces possess vastly different thermal characteristics than vegetated ecosystems. Impervious materials such as dark pavement and rooftop bitumen absorb high amounts of shortwave solar radiation during daylight hours and slowly radiate this stored heat during nocturnal hours. Consequently, metropolitan centers frequently experience significantly higher ambient temperatures than surrounding rural hinterlands—a phenomenon known climatologically as the Urban Heat Island (UHI) effect.',
        'Beyond surface radiation properties, the geometric configuration of modern cities intensifies localized warming through the "urban canyon" effect. Narrow streets flanked by tall skyscrapers impede natural wind circulation, trapping stagnant air and industrial emissions close to street level. Furthermore, anthropogenic heat emissions generated by vehicular exhaust, internal building cooling systems, and electrical machinery directly inject thermal energy into the metropolitan boundary layer. During intense summer heatwaves, this synergistic warming increases air pollution concentrations, exacerbating respiratory ailments among vulnerable urban populations.',
        'To counteract the escalating thermal stress of urban heat islands, environmental architects and urban planners are implementing innovative mitigation strategies. Widespread installation of "cool roofs"—coated with highly reflective white pigments or reflective membranes—reflects incoming sunlight back into space before it can be converted into thermal radiation. Similarly, expanding urban forestry canopy cover and establishing green rooftop gardens cools city air via evapotranspiration, while simultaneously intercepting stormwater runoff and sequestering atmospheric carbon dioxide.',
      ],
      questions: [
        {
          id: 'acad9_q1',
          question: 'What is the primary topic of the passage?',
          options: [
            'How agricultural pesticide runoff alters rural river ecosystems',
            'The causes, consequences, and mitigation of urban heat islands',
            'Technological advances in high-speed electric commuting trains',
            'The history of skyscraper architecture in North America',
          ],
          correctAnswer: 1,
          skill: 'academic_main_idea',
          explanation:
            'The passage analyzes how urban materials and street geometry create urban heat islands, their environmental impacts, and strategies used to mitigate them.',
        },
        {
          id: 'acad9_q2',
          question:
            'The word "synergistic" in paragraph 2 is closest in meaning to',
          highlightedWord: 'synergistic',
          options: ['combined', 'accidental', 'temporary', 'expensive'],
          correctAnswer: 0,
          skill: 'academic_vocabulary',
          explanation:
            '"Synergistic" refers to elements working together to create an enhanced collective effect; here, combined warming factors.',
        },
        {
          id: 'acad9_q3',
          question:
            'According to paragraph 1, why do asphalt and concrete contribute to higher nighttime temperatures?',
          options: [
            'They reflect all incoming solar energy into the clouds.',
            'They release stored solar heat slowly throughout the night.',
            'They prevent ground rainwater from evaporating into steam.',
            'They generate spontaneous chemical reactions in darkness.',
          ],
          correctAnswer: 1,
          skill: 'academic_factual',
          explanation:
            'Paragraph 1 explains that impervious dark materials absorb solar radiation during the day and "slowly radiate this stored heat during nocturnal hours."',
        },
        {
          id: 'acad9_q4',
          question:
            'According to the passage, all of the following are mentioned as urban heat mitigation strategies EXCEPT:',
          options: [
            'Applying reflective white coatings to rooftops',
            'Planting extensive urban tree canopy cover',
            'Constructing green rooftop vegetative gardens',
            'Spraying aerosol coolant gases directly into the upper atmosphere',
          ],
          correctAnswer: 3,
          skill: 'academic_negative_factual',
          explanation:
            'The passage mentions cool roofs, urban tree canopies, and green rooftop gardens, but never mentions spraying chemical coolant aerosols into the air.',
        },
        {
          id: 'acad9_q5',
          question:
            'What can be inferred about vegetated rural areas compared to city centers?',
          options: [
            'They experience faster daytime solar absorption than concrete pavements.',
            'They stay cooler because plant evapotranspiration naturally lowers temperatures.',
            'They trap higher concentrations of ground-level air pollutants.',
            'They possess deeper urban canyons than commercial downtowns.',
          ],
          correctAnswer: 1,
          skill: 'academic_inference',
          explanation:
            'Paragraph 3 notes that vegetative cover cools air via evapotranspiration, in contrast to the heat-absorbing dark surfaces in city centers.',
        },
      ],
    },
  },
  {
    id: 'test-10',
    title: 'Práctica 10: El Cerebro Humano, Taller de Arte (Email Oficial ETS) & La Paradoja de la Elección',
    category: 'Email Oficial ETS, Neurociencia & Psicología del Consumidor',
    difficulty: 'Standard',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-10',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'The human brain is a complex organ responsible for controlling all bodily functions and enabling thought, emotion, and memory. It is divided into several regions, each with specific roles. The cerebrum, its largest part, is involved in higher cognitive functions such as reasoning, planning, and language. The cerebellum coordinates movement and balance, while the brainstem controls vital bodily functions like breathing and heart rate. Together, they enable the brain to perform its various tasks.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'The human brain is a complex organ responsible for controlling all bodily functions and enabling thought, emotion, and memory. It ',
        },
        {
          type: 'word',
          item: { id: 'cw10-1', prefix: 'i', answer: 'S', length: 1 },
        },
        {
          type: 'text',
          text: ' divided into several ',
        },
        {
          type: 'word',
          item: { id: 'cw10-2', prefix: 'regio', answer: 'NS', length: 2 },
        },
        {
          type: 'text',
          text: ', each ',
        },
        {
          type: 'word',
          item: { id: 'cw10-3', prefix: 'wi', answer: 'TH', length: 2 },
        },
        {
          type: 'text',
          text: ' specific ',
        },
        {
          type: 'word',
          item: { id: 'cw10-4', prefix: 'ro', answer: 'LES', length: 3 },
        },
        {
          type: 'text',
          text: '. The cerebrum, its largest ',
        },
        {
          type: 'word',
          item: { id: 'cw10-5', prefix: 'pa', answer: 'RT', length: 2 },
        },
        {
          type: 'text',
          text: ', is ',
        },
        {
          type: 'word',
          item: { id: 'cw10-6', prefix: 'involv', answer: 'ED', length: 2 },
        },
        {
          type: 'text',
          text: ' in higher ',
        },
        {
          type: 'word',
          item: { id: 'cw10-7', prefix: 'cognit', answer: 'IVE', length: 3 },
        },
        {
          type: 'text',
          text: ' functions ',
        },
        {
          type: 'word',
          item: { id: 'cw10-8', prefix: 'suc', answer: 'H', length: 1 },
        },
        {
          type: 'text',
          text: ' as reasoning, planning, and language. The cerebellum coordinates movement and balance, while the brainstem controls vital bodily functions like ',
        },
        {
          type: 'word',
          item: { id: 'cw10-9', prefix: 'breathi', answer: 'NG', length: 2 },
        },
        {
          type: 'text',
          text: ' and heart rate. Together, they enable the brain to perform its various ',
        },
        {
          type: 'word',
          item: { id: 'cw10-10', prefix: 'tas', answer: 'KS', length: 2 },
        },
        {
          type: 'text',
          text: '.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'email-art-1',
      title: 'Art Workshop Reservation Confirmation',
      format: 'email',
      emailDetails: {
        to: 'edward56L@dmail.com',
        from: 'artforeveryone@dmail.com',
        date: '10/09/2025',
        subject: 'Art Workshop Reservation Confirmation',
        borderColor: '#006d63',
      },
      contentHtml:
        'Dear Ms. Edwards,\n\nThe reservation for the art workshop that you made on September 10th has been confirmed. The workshop will take place on September 20th at 3:00 PM. All necessary arts supplies will be provided, but please bring your own apron or smock.\n\nBest regards,\nLaura Bennett',
      questions: [
        {
          id: 'email10_q1',
          question: 'When is the date of the art workshop?',
          options: [
            'September 10th',
            'September 12th',
            'September 20th',
            'September 30th',
          ],
          correctAnswer: 2,
          skill: 'daily_life_scanning',
          explanation:
            'The email explicitly states: "The workshop will take place on September 20th at 3:00 PM." (September 10th was only the date the reservation was made).',
        },
        {
          id: 'email10_q2',
          question: 'What should Ms. Edwards bring to the workshop?',
          options: [
            'A payment method',
            'Extra paint',
            'A protective garment',
            'Proof of reservation',
          ],
          correctAnswer: 2,
          skill: 'daily_life_scanning',
          explanation:
            'The email specifies: "All necessary arts supplies will be provided, but please bring your own apron or smock." An apron or smock is a protective garment worn over clothing.',
        },
      ],
    },
    academicPassage: {
      id: 'acad-paradox-choice',
      title: 'The Paradox of Choice',
      paragraphs: [
        'The paradox of choice, a concept popularized by psychologist Barry Schwartz, suggests that more options can lead to less satisfaction. While the freedom to choose is fundamental to consumer culture, an overabundance of choices—from groceries to electronics—can overwhelm individuals, causing anxiety and decision fatigue. This paradox implies that the vast array of possibilities available today might actually diminish consumer contentment, as the fear of making the wrong choice looms large.',
        "Research supports this notion. In an experiment, psychologist Sheena Iyengar found that shoppers were more likely to purchase jam when offered 6 varieties instead of 24. The limited selection eased the decision process, reducing the pressure to find the 'perfect' option and making the experience more enjoyable. This phenomenon reveals that fewer choices can sometimes make consumers happier, which is a valuable insight for marketers and retailers aiming to boost satisfaction by curating their offerings.",
        'The paradox also has broader implications. In individualistic cultures, where personal choice is highly valued, the burden of decision-making can be significant. Conversely, collectivist cultures, which often provide fewer choices, report higher levels of contentment. This dynamic suggests that understanding cultural differences in consumer psychology can help businesses optimize their product strategies and enhance overall well-being.',
      ],
      questions: [
        {
          id: 'acad10_q1',
          question: 'Which of the following best states a main idea of the passage?',
          options: [
            'Effective marketing strategies focus on increasing product options.',
            'Modern consumer culture is driven by a demand for fewer products.',
            'Individualism enhances consumer contentment.',
            'Limiting consumer choices can lead to higher satisfaction.',
          ],
          correctAnswer: 3,
          skill: 'academic_main_idea',
          explanation:
            'The core thesis of the passage is that having fewer, carefully limited options eases psychological anxiety and leads to higher satisfaction.',
        },
        {
          id: 'acad10_q2',
          question: 'What is one effect of decision fatigue as mentioned in the passage?',
          options: [
            'Desire to make the same choices as other consumers',
            'Anxiety about making the wrong choice',
            'Preference for consumer cultures',
            'Enhanced freedom to choose',
          ],
          correctAnswer: 1,
          skill: 'academic_factual',
          explanation:
            'Paragraph 1 points out that an overabundance of choices causes anxiety and decision fatigue, diminishing consumer contentment as "the fear of making the wrong choice looms large."',
        },
        {
          id: 'acad10_q3',
          question: 'The word "curating" in the passage is closest in meaning to',
          highlightedWord: 'curating',
          options: ['eliminating', 'organizing', 'increasing', 'changing'],
          correctAnswer: 1,
          skill: 'academic_vocabulary',
          explanation:
            'In paragraph 2, "curating their offerings" refers to thoughtfully selecting, organizing, and presenting a limited array of products.',
        },
        {
          id: 'acad10_q4',
          question: 'What can be inferred about consumers in collectivist cultures?',
          options: [
            'They tend to report lower levels of satisfaction.',
            'They are more affected by the paradox of choice.',
            'They generally have fewer choices available.',
            'They prefer individual decision-making.',
          ],
          correctAnswer: 2,
          skill: 'academic_inference',
          explanation:
            'Paragraph 3 notes: "Conversely, collectivist cultures, which often provide fewer choices, report higher levels of contentment." This indicates that consumers in collectivist cultures generally face fewer options.',
        },
        {
          id: 'acad10_q5',
          question:
            'According to the jam experiment in paragraph 2, what occurred when shoppers were offered 6 varieties instead of 24?',
          options: [
            'Shoppers were more likely to make a purchase because the choice was simpler.',
            'Shoppers complained that the store lacked adequate selection.',
            'Shoppers spent considerably more time deliberating over every jar.',
            'Shoppers decided not to purchase any jam at all.',
          ],
          correctAnswer: 0,
          skill: 'academic_factual',
          explanation:
            'Paragraph 2 states that shoppers "were more likely to purchase jam when offered 6 varieties instead of 24", because the limited selection simplified the decision process.',
        },
      ],
    },
  },
  {
    id: 'test-11',
    title: 'Práctica 11: Gran Inauguración del Gimnasio (Email Oficial ETS) & Psicología y Hábitos',
    category: 'Email Oficial ETS, Salud Comunitaria & Neuroplasticidad',
    difficulty: 'Standard',
    estimatedMinutes: 18,
    completeWords: {
      id: 'cw-set-11',
      instruction: 'Fill in the missing letters in the paragraph.',
      fullTextWithBlanks:
        'Regular physical exercise triggers profound neurochemical adaptations within the human central nervous system. When individuals engage in sustained aerobic workouts, their muscles stimulate the synthesis of essential protein. This molecule accelerates growth, strengthens memory retention, and shields neurons against cellular oxidative stress. In addition, routine physical training helps lower stress hormones and elevate mood. Over time, consistent workouts reorganize neural circuits, creating lasting healthy habits.',
      passageTextSegments: [
        {
          type: 'text',
          text: 'Regular physical exercise triggers profound neurochemical adaptations within the human central nervous ',
        },
        {
          type: 'word',
          item: { id: 'cw11-1', prefix: 'sys', answer: 'TEM', length: 3 },
        },
        {
          type: 'text',
          text: '. When individuals engage ',
        },
        {
          type: 'word',
          item: { id: 'cw11-2', prefix: 'i', answer: 'N', length: 1 },
        },
        {
          type: 'text',
          text: ' sustained aerobic workouts, their ',
        },
        {
          type: 'word',
          item: { id: 'cw11-3', prefix: 'musc', answer: 'LES', length: 3 },
        },
        {
          type: 'text',
          text: ' stimulate the synthesis of essential ',
        },
        {
          type: 'word',
          item: { id: 'cw11-4', prefix: 'prote', answer: 'IN', length: 2 },
        },
        {
          type: 'text',
          text: '. This molecule accelerates cell ',
        },
        {
          type: 'word',
          item: { id: 'cw11-5', prefix: 'gro', answer: 'WTH', length: 3 },
        },
        {
          type: 'text',
          text: ', strengthens memory ',
        },
        {
          type: 'word',
          item: { id: 'cw11-6', prefix: 'retent', answer: 'ION', length: 3 },
        },
        {
          type: 'text',
          text: ', and shields neurons ',
        },
        {
          type: 'word',
          item: { id: 'cw11-7', prefix: 'agai', answer: 'NST', length: 3 },
        },
        {
          type: 'text',
          text: ' cellular stress. In addition, routine physical training ',
        },
        {
          type: 'word',
          item: { id: 'cw11-8', prefix: 'hel', answer: 'PS', length: 2 },
        },
        {
          type: 'text',
          text: ' lower cortisol and elevate mood. Over ',
        },
        {
          type: 'word',
          item: { id: 'cw11-9', prefix: 'ti', answer: 'ME', length: 2 },
        },
        {
          type: 'text',
          text: ', consistent workouts reorganize neural circuits, creating lasting healthy ',
        },
        {
          type: 'word',
          item: { id: 'cw11-10', prefix: 'habi', answer: 'TS', length: 2 },
        },
        {
          type: 'text',
          text: '.',
        },
      ],
    },
    dailyLifeNotice: {
      id: 'email-gym-1',
      title: "You're Invited – Bring Friends & Family to Our Grand Opening!",
      format: 'email',
      emailDetails: {
        to: 'nguyenbooklover@dmail.com',
        from: 'part.gymworkers@dmail.com',
        subject: "You're Invited – Bring Friends & Family to Our Grand Opening!",
        borderColor: '#99582a',
      },
      contentHtml:
        "Dear Ms. Nguyen,\n\nWe're excited to invite you—and your friends and family—to the grand opening of our new branch at 25 Orchid Street, happening next Monday. This event is a great opportunity to explore our state-of-the-art facility, featuring top-tier equipment, energizing group classes, and expert personal training.\n\nThis celebration, exclusively for our valued members and their guests, will include guided tours, live fitness demonstrations, and complimentary refreshments. It's the perfect chance to experience our community-focused approach to wellness and introduce others to a space designed for all fitness levels.\n\nBring your friends and family! We're offering a special one-day-only discount on memberships for all attendees.\n\nFor questions or to RSVP, contact our customer service team at 555-1234.\n\nWarm regards,\nJohn Parker",
      questions: [
        {
          id: 'email11_q1',
          question: 'What is the main purpose of the email?',
          options: [
            'To attract customers to a new fitness center',
            'To provide Ms. Nguyen with an opportunity to provide expert personal training',
            'To celebrate Ms. Nguyen\'s achievements in wellness',
            'To announce a discount available to fitness-center members',
          ],
          correctAnswer: 0,
          skill: 'daily_life_scanning',
          explanation:
            'The primary goal of the invitation email is to bring current members and their friends/family to the new branch and offer membership discounts to attract new customers.',
        },
        {
          id: 'email11_q2',
          question: "What can be inferred about Ms. Nguyen's relationship with the fitness center?",
          options: [
            'She helps the fitness center to organize activities.',
            'She has already explored the new facility.',
            'She is a member at one of the fitness center\'s other locations.',
            'She is new to using fitness centers and exercise equipment.',
          ],
          correctAnswer: 2,
          skill: 'daily_life_scanning',
          explanation:
            'The email mentions celebrating "the grand opening of our new branch" and states that attendance is "exclusively for our valued members and their guests", confirming that Ms. Nguyen is already a member at an existing branch.',
        },
        {
          id: 'email11_q3',
          question:
            'The new fitness center is intended for use by which of the following groups of people?',
          options: [
            'Expert personal trainers',
            'Top-tier athletes',
            'Existing fitness-center members',
            'Community members of all fitness levels',
          ],
          correctAnswer: 3,
          skill: 'daily_life_scanning',
          explanation:
            'The text emphasizes their "community-focused approach to wellness" and creating "a space designed for all fitness levels."',
        },
      ],
    },
    academicPassage: {
      id: 'acad-habit-psychology',
      title: 'Behavioral Architecture and the Science of Habit Formation',
      paragraphs: [
        'Habits constitute approximately forty percent of daily human behaviors, operating largely beneath conscious deliberative control. In cognitive psychology, habit formation is conceptualized as a neurological loop composed of three interrelated components: a contextual cue, a behavioral routine, and an intrinsic reward. When an individual repeatedly encounters an environmental trigger—such as entering a specific room or hearing a designated chime—the brain encodes this cue into automatic basal ganglia pathways, bypassing the energy-intensive prefrontal cortex.',
        'Modern behavioral architects exploit this neurological mechanism through "choice architecture" and deliberate environmental design. By structuring physical and digital environments so that beneficial actions require minimal friction, designers can nudge individuals toward constructive routines. For example, placing nutritious snacks at eye level while concealing processed alternatives substantially increases voluntary fruit consumption. Similarly, designating visible, accessible staircases rather than concealed elevators stimulates spontaneous physical movement throughout commercial office buildings.',
        'However, dismantling maladaptive habits presents significant cognitive challenges. Because existing neurological pathways remain structurally intact even after extended periods of inactivity, former habits can easily resurface when familiar stressors reoccur. Behavioral scientists emphasize that attempts at total suppression are generally ineffective; instead, sustainable behavioral transformation requires habit substitution—preserving the preexisting cue and reward while intentionally inserting a constructive intermediary routine.',
      ],
      questions: [
        {
          id: 'acad11_q1',
          question: 'What is the main topic of the passage?',
          options: [
            'The history of psychological experiments on laboratory primates',
            'The neurological mechanisms of habits and how environment influences them',
            'The economic advantages of corporate gym subscriptions',
            'Methods for improving long-term musical memory',
          ],
          correctAnswer: 1,
          skill: 'academic_main_idea',
          explanation:
            'The passage discusses how habits are formed in the brain, how behavioral architecture uses environmental cues to shape them, and strategies for habit substitution.',
        },
        {
          id: 'acad11_q2',
          question:
            'The word "friction" in paragraph 2 is closest in meaning to',
          highlightedWord: 'friction',
          options: ['effort', 'heat', 'excitement', 'speed'],
          correctAnswer: 0,
          skill: 'academic_vocabulary',
          explanation:
            'In behavioral design, "friction" refers to psychological or physical resistance and effort required to initiate a task.',
        },
        {
          id: 'acad11_q3',
          question:
            'According to paragraph 2, which of the following is an example of environmental choice architecture?',
          options: [
            'Mandating strict monetary penalties for missed gym workouts',
            'Placing healthy snacks at eye level to encourage healthy eating',
            'Requiring employees to memorize nutritional calorie tables',
            'Conducting daily lectures on self-discipline in workplaces',
          ],
          correctAnswer: 1,
          skill: 'academic_factual',
          explanation:
            'Paragraph 2 explicitly illustrates choice architecture by citing how "placing nutritious snacks at eye level... substantially increases voluntary fruit consumption."',
        },
        {
          id: 'acad11_q4',
          question:
            'According to paragraph 3, all of the following are true regarding dismantling habits EXCEPT:',
          options: [
            'Old neurological pathways remain intact in the brain.',
            'Stressors can trigger the recurrence of dormant routines.',
            'Attempting complete suppression of a habit is usually effective.',
            'Successful transformation usually involves replacing the routine.',
          ],
          correctAnswer: 2,
          skill: 'academic_negative_factual',
          explanation:
            'Paragraph 3 clearly states that "attempts at total suppression are generally ineffective", making the claim that suppression is effective false and thus the correct EXCEPT answer.',
        },
        {
          id: 'acad11_q5',
          question:
            'What can be inferred about the basal ganglia compared to the prefrontal cortex?',
          options: [
            'It operates with lower conscious cognitive effort when executing automated behaviors.',
            'It is exclusively responsible for processing linguistic vocabulary.',
            'It deteriorates completely whenever an individual stops exercising.',
            'It requires higher caloric energy than the prefrontal cortex.',
          ],
          correctAnswer: 0,
          skill: 'academic_inference',
          explanation:
            'Paragraph 1 explains that the brain encodes automatic routines into the basal ganglia, "bypassing the energy-intensive prefrontal cortex", implying the basal ganglia carries out automated behaviors with less deliberate effort.',
        },
      ],
    },
  },
];

