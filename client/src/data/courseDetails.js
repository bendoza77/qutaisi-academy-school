export const COURSE_DETAILS = {
  foundation: {
    slug: 'foundation',
    title: 'Foundation English',
    level: 'A1 – A2',
    badge: 'Beginner',
    tagline: 'Build a solid foundation from zero',
    duration: '3 months',
    sessionsPerWeek: '3× per week',
    groupSize: 'Up to 8 students',
    price: '₾180',
    priceNote: 'per month',
    accent: '#10b981',
    accentBg: '#d1fae5',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    description:
      'Start your English journey with confidence. Foundation English is designed for absolute beginners and those who want to strengthen core skills from the ground up — pronunciation, grammar, vocabulary, and everyday conversation.',
    whoIsItFor: [
      'Complete beginners with no prior English experience',
      'Students who studied English years ago and need a fresh start',
      'Anyone wanting a strong grammatical foundation before advancing',
      'Young adults preparing for travel, study, or work abroad',
    ],
    features: [
      'Alphabet, phonics & pronunciation training',
      'Core vocabulary — 1,000+ essential words',
      'Simple grammar structures & sentence patterns',
      'Everyday conversations & guided role-play',
    ],
    curriculum: [
      {
        module: 'Module 1', title: 'First Steps', weeks: 'Weeks 1–2',
        topics: ['Alphabet & phonics', 'Greetings & introductions', 'Numbers, dates & colors', 'Basic sentence patterns'],
      },
      {
        module: 'Module 2', title: 'Daily Life', weeks: 'Weeks 3–5',
        topics: ['Family & relationships', 'Food, shopping & money', 'Daily routines & time', 'Present simple tense'],
      },
      {
        module: 'Module 3', title: 'Around Town', weeks: 'Weeks 6–8',
        topics: ['Directions & transport', 'Jobs & workplace basics', 'Past simple tense', 'Short written texts'],
      },
      {
        module: 'Module 4', title: 'Moving Forward', weeks: 'Weeks 9–12',
        topics: ['Future plans & intentions', 'Travel & tourism', 'Health & body vocabulary', 'Final project & assessment'],
      },
    ],
    schedule: [
      { label: 'Morning', time: '09:00–11:00', days: 'Mon / Wed / Fri' },
      { label: 'Evening', time: '18:00–20:00', days: 'Mon / Wed / Fri' },
      { label: 'Weekend', time: '10:00–13:00', days: 'Sat / Sun' },
    ],
    faq: [
      { q: 'Do I need any prior English knowledge?', a: 'No — this course starts from zero. We welcome complete beginners.' },
      { q: 'What materials are included?', a: 'Textbooks, workbooks, and digital resources are all included in the monthly fee.' },
      { q: 'What happens after Foundation English?', a: 'Students typically move on to Progressive English (B1–B2) after completing this course.' },
    ],
  },

  progressive: {
    slug: 'progressive',
    title: 'Progressive English',
    level: 'B1 – B2',
    badge: 'Intermediate',
    tagline: 'Take your English to the next level',
    duration: '4 months',
    sessionsPerWeek: '3× per week',
    groupSize: 'Up to 8 students',
    price: '₾200',
    priceNote: 'per month',
    accent: '#2563eb',
    accentBg: '#dbeafe',
    badgeClass: 'bg-blue-100 text-blue-700',
    description:
      'Bridge the gap between basic and advanced. Progressive English focuses on fluency, grammar accuracy, and professional communication skills used in real-world situations — from the workplace to everyday conversation.',
    whoIsItFor: [
      'Learners who completed Foundation English or equivalent (A2 level)',
      'Professionals who need English for work communications',
      'Students preparing for higher-level English certification',
      'Anyone who can have basic conversations but wants more fluency',
    ],
    features: [
      'Advanced grammar & complex sentence structures',
      'Business & professional vocabulary sets',
      'Reading comprehension & academic writing',
      'Listening to native speakers & authentic media',
    ],
    curriculum: [
      {
        module: 'Module 1', title: 'Communication Skills', weeks: 'Weeks 1–3',
        topics: ['Complex tenses review', 'Professional introductions', 'Email writing basics', 'Listening strategies'],
      },
      {
        module: 'Module 2', title: 'Real-World English', weeks: 'Weeks 4–7',
        topics: ['Conditional sentences', 'Work & career vocabulary', 'Report writing', 'Discussions & debates'],
      },
      {
        module: 'Module 3', title: 'Fluency Focus', weeks: 'Weeks 8–11',
        topics: ['Idioms & expressions', 'Media & current events', 'Presentation skills', 'Advanced reading'],
      },
      {
        module: 'Module 4', title: 'Mastery Prep', weeks: 'Weeks 12–16',
        topics: ['Passive & reported speech', 'Academic vocabulary', 'Mock assessments', 'Portfolio review'],
      },
    ],
    schedule: [
      { label: 'Morning',   time: '09:00–11:00', days: 'Mon / Wed / Fri' },
      { label: 'Afternoon', time: '14:00–16:00', days: 'Tue / Thu'       },
      { label: 'Evening',   time: '18:00–20:00', days: 'Mon / Wed / Fri' },
    ],
    faq: [
      { q: 'What level should I be at to join?', a: 'You should be able to form basic sentences and understand simple spoken English. Take our free placement test to confirm.' },
      { q: 'Is this suitable for professionals?', a: 'Yes — the curriculum includes workplace vocabulary and professional communication skills throughout.' },
      { q: 'Can I join this course directly without Foundation?', a: 'Yes, provided your placement assessment confirms B1 level or above.' },
    ],
  },

  mastery: {
    slug: 'mastery',
    title: 'Mastery English',
    level: 'C1 – C2',
    badge: 'Advanced',
    tagline: 'Achieve near-native proficiency',
    duration: '4 months',
    sessionsPerWeek: '3× per week',
    groupSize: 'Up to 6 students',
    price: '₾240',
    priceNote: 'per month',
    accent: '#7c3aed',
    accentBg: '#ede9fe',
    badgeClass: 'bg-purple-100 text-purple-700',
    description:
      'Reach the pinnacle of English proficiency. Mastery English is designed for confident speakers targeting academic excellence, IELTS/TOEFL certification, or international career advancement.',
    whoIsItFor: [
      'Advanced speakers (B2+) aiming for C1 or C2 fluency',
      'Students preparing for IELTS (band 6.5+) or TOEFL',
      'Professionals targeting international careers or postgraduate programs',
      'Anyone who wants near-native command and precision in English',
    ],
    features: [
      'Academic writing & critical argumentation',
      'Full IELTS / TOEFL examination preparation',
      'Debate, negotiation & advanced presentation',
      'Literature, nuance & advanced comprehension',
    ],
    curriculum: [
      {
        module: 'Module 1', title: 'Advanced Grammar & Style', weeks: 'Weeks 1–3',
        topics: ['Complex structures & inversion', 'Discourse markers', 'Register & stylistic range', 'Critical reading'],
      },
      {
        module: 'Module 2', title: 'Academic Skills', weeks: 'Weeks 4–7',
        topics: ['Essay structure & argumentation', 'Research & citation skills', 'IELTS Writing Tasks 1 & 2', 'Academic vocabulary depth'],
      },
      {
        module: 'Module 3', title: 'Oral Proficiency', weeks: 'Weeks 8–11',
        topics: ['IELTS / TOEFL speaking prep', 'Debate & critical thinking', 'Presentation techniques', 'Pronunciation refinement'],
      },
      {
        module: 'Module 4', title: 'Certification Preparation', weeks: 'Weeks 12–16',
        topics: ['Full mock exams with scoring', 'Personalized feedback sessions', 'Individual study plan', 'Certificate preparation'],
      },
    ],
    schedule: [
      { label: 'Morning', time: '09:00–11:00', days: 'Mon / Wed / Fri'   },
      { label: 'Evening', time: '18:00–20:00', days: 'Tue / Thu / Sat'   },
    ],
    faq: [
      { q: 'What IELTS band can I expect?', a: 'Most students achieve 6.5–8.0 depending on starting level and commitment. Our class average is 7.2.' },
      { q: 'Why is the class size limited to 6?', a: 'Advanced courses need more individual attention. Smaller classes ensure you get personalized feedback every session.' },
      { q: 'Do I need to register for IELTS separately?', a: 'Yes — we prepare you for the exam but registration is done through the British Council or IDP independently.' },
    ],
  },

  business: {
    slug: 'business',
    title: 'Business English',
    level: 'All levels',
    badge: 'Professional',
    tagline: 'Master the language of global business',
    duration: '3 months',
    sessionsPerWeek: '2× per week',
    groupSize: 'Up to 6 students',
    price: '₾220',
    priceNote: 'per month',
    accent: '#f59e0b',
    accentBg: '#fef3c7',
    badgeClass: 'bg-amber-100 text-amber-700',
    description:
      'Tailored for professionals and entrepreneurs. Master the language of global business — from high-stakes meetings and negotiations to polished emails, compelling presentations, and cross-cultural communication.',
    whoIsItFor: [
      'Professionals working with international clients or partners',
      'Entrepreneurs expanding into global markets',
      'Managers and team leads in multinational companies',
      'Anyone preparing for an international business career',
    ],
    features: [
      'Corporate vocabulary & professional register',
      'Business email & formal report writing',
      'Presentations, pitching & public speaking',
      'Cross-cultural business communication',
    ],
    curriculum: [
      {
        module: 'Module 1', title: 'Professional Communication', weeks: 'Weeks 1–3',
        topics: ['Business introductions & networking', 'Professional email writing', 'Phone & video call etiquette', 'Corporate vocabulary foundations'],
      },
      {
        module: 'Module 2', title: 'Business Operations', weeks: 'Weeks 4–6',
        topics: ['Meeting facilitation & language', 'Negotiation strategies', 'Report & proposal writing', 'Data presentation & charts'],
      },
      {
        module: 'Module 3', title: 'Advanced Business Skills', weeks: 'Weeks 7–9',
        topics: ['Presentations & pitch decks', 'Cross-cultural communication', 'Business idioms & expressions', 'Case study analysis'],
      },
      {
        module: 'Module 4', title: 'Mastery & Application', weeks: 'Weeks 10–12',
        topics: ['Mock business scenarios', 'LinkedIn & professional writing', 'Interview preparation', 'Personal business portfolio'],
      },
    ],
    schedule: [
      { label: 'Morning', time: '08:00–10:00', days: 'Tue / Thu' },
      { label: 'Lunch',   time: '12:00–14:00', days: 'Tue / Thu' },
      { label: 'Evening', time: '19:00–21:00', days: 'Mon / Wed' },
    ],
    faq: [
      { q: 'What English level do I need?', a: 'We recommend at least B1 level. A free placement test will confirm your suitability.' },
      { q: 'Is this useful for Georgian companies with international clients?', a: 'Absolutely — many of our students work for Georgian companies with international partners or clients.' },
      { q: 'Will this help with job interviews conducted in English?', a: 'Yes — Module 4 specifically covers interview preparation and professional self-presentation in English.' },
    ],
  },
}
