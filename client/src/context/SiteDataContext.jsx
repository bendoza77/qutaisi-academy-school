import { createContext, useContext, useState, useCallback, useEffect } from 'react'

export const DEFAULT_SITE_DATA = {
  hero: {
    badge: "Now Enrolling — Summer 2025 Cohort",
    title: "Learn English",
    titleHighlight: "with Confidence",
    subtitle: "Kutaisi English Academy offers internationally-aligned courses taught by certified educators. Whether you're a beginner or preparing for IELTS — we'll get you there.",
    trustBadges: ["1200+ Students", "CEFR Aligned", "8 Years of Excellence", "96% Success Rate"],
  },
  about: {
    title: "Trusted English Education in the Heart of ",
    titleHighlight: "Kutaisi",
    description: "For over eight years, Kutaisi English Academy has been the city's leading destination for professional English language education — from complete beginners to advanced speakers.",
    highlights: [
      "Founded in 2017 with a mission to make quality English education accessible",
      "Curriculum fully aligned with the Common European Framework of Reference (CEFR)",
      "Small group sizes ensure personalized attention for every learner",
      "Modern, communicative teaching methodology backed by research",
    ],
    quote: "Our mission is simple: give every student in Kutaisi the tools to communicate confidently in English — and unlock the world.",
    founder: "Davit Gorgodze",
    founderTitle: "Founder & Academic Director",
  },
  stats: [
    { id: 1, value: 1200, suffix: "+", label: "Students Enrolled" },
    { id: 2, value: 15, suffix: "+", label: "Expert Teachers" },
    { id: 3, value: 8, suffix: "", label: "Years of Excellence" },
    { id: 4, value: 96, suffix: "%", label: "Success Rate" },
  ],
  courses: [
    {
      id: 1, slug: "foundation", icon: "BookOpen", accent: "#10b981",
      badgeColor: "bg-emerald-100 text-emerald-700", popular: false,
      level: "A1 – A2", badge: "Beginner", title: "Foundation English",
      description: "Build a solid foundation from scratch. Perfect for absolute beginners or those looking to strengthen the basics of reading, writing, and speaking.",
      duration: "3 months", sessionsPerWeek: "3× per week", groupSize: "Up to 8 students",
      price: "₾180", priceNote: "per month",
      features: ["Alphabet, phonics & pronunciation", "Basic vocabulary (1000+ words)", "Simple grammar structures", "Everyday conversations"],
    },
    {
      id: 2, slug: "progressive", icon: "TrendingUp", accent: "#2563eb",
      badgeColor: "bg-blue-100 text-blue-700", popular: true,
      level: "B1 – B2", badge: "Intermediate", title: "Progressive English",
      description: "Take your English to the next level. Focus on fluency, grammar accuracy, and professional communication skills used in real-world situations.",
      duration: "4 months", sessionsPerWeek: "3× per week", groupSize: "Up to 8 students",
      price: "₾200", priceNote: "per month",
      features: ["Advanced grammar & sentence structures", "Business & professional vocabulary", "Reading comprehension & writing", "Listening to native speakers"],
    },
    {
      id: 3, slug: "mastery", icon: "Award", accent: "#7c3aed",
      badgeColor: "bg-purple-100 text-purple-700", popular: false,
      level: "C1 – C2", badge: "Advanced", title: "Mastery English",
      description: "Achieve near-native proficiency. Designed for confident speakers aiming for academic excellence, IELTS/TOEFL certification, or international careers.",
      duration: "4 months", sessionsPerWeek: "3× per week", groupSize: "Up to 6 students",
      price: "₾240", priceNote: "per month",
      features: ["Academic writing & research skills", "IELTS / TOEFL exam preparation", "Debate, presentation & negotiation", "Literature & advanced comprehension"],
    },
    {
      id: 4, slug: "business", icon: "Briefcase", accent: "#f59e0b",
      badgeColor: "bg-amber-100 text-amber-700", popular: false,
      level: "All levels", badge: "Professional", title: "Business English",
      description: "Tailored for professionals and entrepreneurs. Master the language of global business — from meetings and negotiations to emails and reports.",
      duration: "3 months", sessionsPerWeek: "2× per week", groupSize: "Up to 6 students",
      price: "₾220", priceNote: "per month",
      features: ["Corporate vocabulary & tone", "Email writing & formal reports", "Presentations & public speaking", "Cross-cultural communication"],
    },
  ],
  teachers: [
    {
      id: 1, name: 'Davit Gorgodze', title: 'Founder & Academic Director',
      avatar: 'DG', color: 'bg-blue-700',
      credentials: ['DELTA', 'MA Applied Linguistics'], experience: '15+ years',
      specialties: ['Academic English', 'IELTS Preparation', 'Teacher Training'],
      bio: 'Davit founded Kutaisi English Academy in 2017 with a vision to bring world-class English education to Georgia. Holder of the prestigious DELTA qualification, he has guided hundreds of students to achieve their language goals.',
      languages: ['Georgian', 'English', 'Russian'],
    },
    {
      id: 2, name: 'Nino Chikvanaia', title: 'Senior English Teacher',
      avatar: 'NC', color: 'bg-purple-600',
      credentials: ['CELTA', 'MA TESOL'], experience: '10 years',
      specialties: ['Progressive English', 'Business Communication', 'Cambridge Exams'],
      bio: "Nino specialises in helping intermediate students break through to advanced fluency. Her communicative approach and passion for authentic language use have made her one of the academy's most popular teachers.",
      languages: ['Georgian', 'English'],
    },
    {
      id: 3, name: 'Giorgi Maisuradze', title: 'Business English Specialist',
      avatar: 'GM', color: 'bg-emerald-600',
      credentials: ['CELTA', 'MBA'], experience: '7 years',
      specialties: ['Business English', 'Presentations', 'Professional Writing'],
      bio: 'With a background in both business and language teaching, Giorgi brings real-world commercial experience to every lesson. His students consistently land international roles.',
      languages: ['Georgian', 'English', 'German'],
    },
    {
      id: 4, name: 'Ana Lomidze', title: 'IELTS & Exam Preparation Tutor',
      avatar: 'AL', color: 'bg-rose-600',
      credentials: ['CELTA', 'IELTS Examiner Training'], experience: '6 years',
      specialties: ['IELTS Prep', 'TOEFL', 'Mastery English'],
      bio: "Ana's exam-focused methodology has helped over 200 students achieve their target IELTS scores. Having trained as an IELTS examiner, she brings unique insight into what assessors look for.",
      languages: ['Georgian', 'English'],
    },
    {
      id: 5, name: 'Tamar Kvaratskhelia', title: 'Foundation & Young Adult Teacher',
      avatar: 'TK', color: 'bg-amber-600',
      credentials: ['CELTA', 'B.Ed. Education'], experience: '8 years',
      specialties: ['Foundation English', 'Young Adults', 'Phonics & Pronunciation'],
      bio: 'Tamar has a gift for making absolute beginners feel confident from day one. Her patient, structured approach to building from the ground up has been transformative for students of all ages.',
      languages: ['Georgian', 'English', 'Russian'],
    },
    {
      id: 6, name: 'Levan Beridze', title: 'English Teacher & Methodology Coach',
      avatar: 'LB', color: 'bg-cyan-600',
      credentials: ['CELTA', 'MA Education'], experience: '5 years',
      specialties: ['Progressive English', 'Task-Based Learning', 'Grammar'],
      bio: 'Levan combines modern task-based methodology with a deep love of linguistics. He keeps classes dynamic and student-centred, ensuring every learner actively participates.',
      languages: ['Georgian', 'English'],
    },
  ],
  testimonials: [
    { id: 1, avatar: "MK", color: "bg-blue-600", rating: 5, name: "Mariam Kvaratskhelia", role: "University Student", location: "Kutaisi", text: "After just 6 months at Kutaisi English Academy, I passed my IELTS with a 7.5 score. The teachers are incredibly patient and the small class sizes meant I could ask questions freely. I honestly couldn't have done it without them." },
    { id: 2, avatar: "GT", color: "bg-purple-600", rating: 5, name: "Giorgi Tsikarishvili", role: "Software Engineer", location: "Kutaisi", text: "I needed Business English for my remote job with a UK company. The Business English course gave me confidence in meetings and writing professional emails. My manager noticed the improvement within weeks." },
    { id: 3, avatar: "AB", color: "bg-emerald-600", rating: 5, name: "Ana Beridze", role: "High School Student", location: "Kutaisi", text: "I started from absolute zero and now I can have full conversations in English. The teachers make learning fun and engaging. The academy feels like a family — everyone supports each other." },
    { id: 4, avatar: "LG", color: "bg-amber-600", rating: 5, name: "Luka Gelashvili", role: "Marketing Manager", location: "Kutaisi", text: "I had taken English courses before, but nothing like this. The methodology here is completely different — practical, modern, and results-oriented. I can now lead international client calls confidently." },
    { id: 5, avatar: "NS", color: "bg-rose-600", rating: 5, name: "Nino Shalamberidze", role: "Medical Professional", location: "Kutaisi", text: "As a doctor needing English for international conferences and research papers, the Advanced course was exactly what I needed. The academic writing component was invaluable for my career." },
  ],
  benefits: [
    { title: "Experienced Teachers", description: "Our educators hold internationally recognized CELTA/DELTA certifications with 5–15 years of teaching experience." },
    { title: "Small Group Classes", description: "Maximum 8 students per class ensures every student receives individual attention and personalized feedback." },
    { title: "Modern Methodology", description: "We use communicative, task-based learning aligned with the Common European Framework of Reference (CEFR)." },
    { title: "Flexible Scheduling", description: "Morning, afternoon, and evening classes available — weekdays and weekends — to fit your lifestyle." },
    { title: "Native-Speaker Sessions", description: "Regular sessions with native English speakers provide authentic language exposure and real-world practice." },
    { title: "Certified Curriculum", description: "Our curriculum meets international educational standards with proven outcomes and progress tracking for every student." },
  ],
  contact: {
    phone: "+995 599 123 456",
    email: "info@kutaisi-english.ge",
    address: "12 Rustaveli Avenue, Kutaisi, Georgia",
    hours: "Mon–Fri: 9:00–20:00, Sat: 10:00–17:00",
    social: { facebook: "#", instagram: "#", youtube: "#", linkedin: "#" },
  },
  cta: {
    badge: "Limited Seats Available",
    title: "Start Your English",
    titleHighlight: "Journey Today",
    description: "Take the first step toward fluency. Our placement assessment is completely free — no pressure, no commitment. Just find out where you are and where you can go.",
    benefits: ["Free Placement Test", "No Commitment", "Flexible Start Dates", "Certified Teachers"],
  },
  pages: {
    about: {
      hero: { eyebrow: "About the Academy", title: "Trusted English Education in the Heart of", highlight: "Kutaisi", subtitle: "For over eight years we have been Kutaisi's leading destination for professional English language education — from complete beginners to advanced speakers." },
      story: { eyebrow: "Our Story", title: "Eight years of shaping", titleHighlight: "English fluency in Georgia", p1: "Founded in 2017 by Davit Gorgodze, Kutaisi English Academy was born from a simple but powerful belief: every student in Kutaisi deserves access to world-class English education. What started as a small classroom has grown into the city's most trusted language institution.", p2: "Today we offer four CEFR-aligned programmes, taught by 15+ CELTA/DELTA-certified educators, with a 96% student satisfaction rate and over 1,200 graduates who have transformed their careers, studies, and lives through English.", badges: ["CEFR Aligned", "15+ Teachers", "96% Satisfaction", "8 Years"] },
      values: { eyebrow: "What We Stand For", title: "Our Core Values", items: [{ title: "Student-First", desc: "Every decision we make starts and ends with what is best for the learner." }, { title: "Academic Rigour", desc: "CEFR-aligned curriculum, research-backed methodology, measurable outcomes." }, { title: "Excellence", desc: "We hold ourselves and our students to the highest possible standards." }, { title: "Global Mindset", desc: "English is the bridge to the world. We build that bridge one student at a time." }] },
      mission: { quote: "Our mission is simple: give every student in Kutaisi the tools to communicate confidently in English — and unlock the world.", founder: "Davit Gorgodze", founderTitle: "Founder & Academic Director" },
      highlights: { eyebrow: "Why Students Choose Us", title: "Built around what actually works", points: ["Founded in 2017 with a mission to make quality English education accessible to all", "Curriculum fully aligned with the Common European Framework of Reference (CEFR)", "Small group sizes ensure personalized attention for every learner", "Modern, communicative teaching methodology backed by research", "CELTA/DELTA certified educators with 5–15 years of teaching experience"], stats: [{ label: "Student Satisfaction", value: "96%" }, { label: "Average Rating", value: "4.9★" }, { label: "Total Graduates", value: "1,200+" }, { label: "Years of Excellence", value: "8+" }], viewCourses: "View Our Courses", getInTouch: "Get in Touch" },
      timeline: [{ title: "Academy Founded", desc: "Davit Gorgodze opens Kutaisi English Academy with a vision to make quality English education accessible to all." }, { title: "CEFR Accreditation", desc: "Curriculum fully aligned with the Common European Framework of Reference, recognised across Europe." }, { title: "500 Graduates", desc: "Over 500 students successfully complete our courses and go on to achieve their personal and professional goals." }, { title: "1,200+ Students", desc: "The academy grows to become Kutaisi's leading English language institution with 15+ certified educators." }],
      ka: {},
    },
    faq: {
      hero: { eyebrow: "FAQ", title: "Your Questions,", highlight: "Answered", subtitle: "Everything you need to know about studying at Kutaisi English Academy. Can't find your answer? Contact us directly." },
      categories: [
        { id: "general", label: "General", items: [{ q: "What is Kutaisi English Academy?", a: "Kutaisi English Academy is a professional English language school founded in 2017. We offer CEFR-aligned courses for all levels from complete beginners (A1) to advanced speakers (C2), as well as a dedicated Business English programme." }, { q: "Where are you located?", a: "We are located at 12 Rustaveli Avenue, Kutaisi, Georgia. Our academy is easy to reach by public transport and has nearby parking. Open Monday–Friday 9:00–20:00, Saturday 10:00–17:00." }, { q: "How long has the academy been running?", a: "We opened our doors in 2017 and have been teaching English continuously since then — that's over 8 years of experience. In that time we have helped more than 1,200 students reach their English language goals." }, { q: "Are your teachers qualified?", a: "Every teacher at the academy holds a CELTA or DELTA qualification — the internationally recognised standard for English language teaching. Many also hold additional post-graduate degrees in Applied Linguistics, TESOL, or Education." }, { q: "Do you offer online classes?", a: "Our main programme is in-person, which we believe produces the best results for most learners. In exceptional circumstances (illness, travel) we can accommodate a limited number of online sessions. Please contact us to discuss your situation." }] },
        { id: "enrollment", label: "Enrollment & Placement", items: [{ q: "How do I enroll?", a: "The easiest way is to fill in the enrollment form on our website or contact us by phone or WhatsApp. We'll arrange a free placement assessment at a time that suits you, and from there you can begin in the appropriate course." }, { q: "What is the placement assessment?", a: "The placement assessment is a short (20–30 minute) written and spoken test that helps us identify your current level of English. It is completely free, there is no pressure to enrol, and the results are useful to you regardless of what you decide." }, { q: "Can I start at any time of year?", a: "New cohorts start at the beginning of each month. In most cases you can join within 2–4 weeks of contacting us, depending on availability in the relevant level group." }, { q: "What if I already have some English knowledge but am not sure of my level?", a: "That is exactly what the placement assessment is for. Our assessment will place you accurately so you are challenged but not overwhelmed from your very first class." }, { q: "Is there a minimum age requirement?", a: "Our main adult programme is designed for students aged 16 and above. For younger learners, please contact us directly to discuss available options." }] },
        { id: "classes", label: "Classes & Schedule", items: [{ q: "How many students are in each class?", a: "We keep classes intentionally small — a maximum of 8 students in most groups, and just 6 in our Mastery and Business English courses. This ensures every student receives personal attention and meaningful speaking practice in every session." }, { q: "How often are classes held?", a: "Foundation, Progressive, and Mastery courses meet 3 times per week. Business English meets twice per week. Each session is 90 minutes. We offer morning, afternoon, and evening time slots, as well as Saturday classes." }, { q: "What happens if I miss a class?", a: "We understand that life happens. We ask that you notify us in advance where possible. Teachers share session notes and materials for missed classes. However, if a student misses more than 30% of sessions in a month without prior notification, they may be asked to repeat that month at the standard fee." }, { q: "What materials will I need?", a: "All course materials — including textbooks, workbooks, and digital resources — are included in the course fee. You will not need to purchase anything separately." }, { q: "Do you teach on Georgian public holidays?", a: "Classes are suspended on official Georgian public holidays. We compensate for any missed sessions by extending the course duration accordingly, so you always receive the full number of scheduled lessons." }] },
        { id: "fees", label: "Fees & Payment", items: [{ q: "How much do courses cost?", a: "Foundation English is ₾180/month, Progressive English ₾200/month, Mastery English ₾240/month, and Business English ₾220/month. All fees include course materials." }, { q: "When and how do I pay?", a: "Monthly fees are due by the 5th of each calendar month. We accept bank transfer, cash payment at the academy, and card payment. Details are provided upon enrollment." }, { q: "Can I get a refund if I leave mid-month?", a: "We do not issue refunds for partially-completed months as a general rule. However, in exceptional circumstances — serious illness or family bereavement — refund requests will be considered on a case-by-case basis." }, { q: "Is the placement assessment really free?", a: "Yes, completely free and with no obligation to enrol. We believe everyone deserves to know their current English level." }, { q: "Are there any discounts available?", a: "We offer a 10% sibling discount for two or more family members enrolled at the same time. We also periodically offer early-bird rates for new cohorts." }] },
        { id: "progress", label: "Progress & Certification", items: [{ q: "Will I receive a certificate when I finish?", a: "Yes. Upon successful completion of any course, you will receive a Kutaisi English Academy certificate of completion, which includes your CEFR level achieved." }, { q: "How will I know if I'm making progress?", a: "Progress is tracked continuously through in-class activities, monthly progress reviews, and end-of-course assessments. Teachers provide regular verbal and written feedback." }, { q: "Do you help with IELTS or TOEFL preparation?", a: "Our Mastery English course includes dedicated IELTS and TOEFL preparation modules. We also offer one-to-one exam preparation sessions for students who need focused coaching on a specific exam." }, { q: "What is the average improvement a student makes?", a: "Most students advance by one full CEFR level (e.g., A2 to B1) within a single 3–4 month course." }, { q: "Can I move up to the next course level before completing the current one?", a: "If a student is progressing exceptionally quickly, the teacher may recommend an early advancement. This is assessed by the Academic Director and is based on demonstrated proficiency." }] },
      ],
      ka: {},
    },
    teachers: {
      hero: { eyebrow: "Meet the Team", title: "Expert Teachers,", highlight: "Proven Results", subtitle: "Every teacher at Kutaisi English Academy holds a professional CELTA or DELTA qualification. We don't just teach English — we live it." },
      stats: [{ value: "15+", label: "Expert Teachers" }, { value: "100%", label: "CELTA / DELTA Certified" }, { value: "5–15", label: "Years of Experience" }, { value: "4.9 / 5", label: "Average Teacher Rating" }],
      join: { title: "Want to join our team?", desc: "We are always looking for passionate, qualified English teachers. CELTA or equivalent required.", btn: "Get in Touch" },
      ka: {},
    },
    testimonials: {
      hero: { eyebrow: "Testimonials", title: "Hear from Our", highlight: "Students", subtitle: "Don't take our word for it. Here's what our students say about learning English at Kutaisi English Academy." },
      stats: [{ value: "4.9 / 5", label: "Average Rating", stars: true }, { value: "96%", label: "Student Satisfaction" }, { value: "1,200+", label: "Total Students" }, { value: "8+ Years", label: "Trusted Since 2017" }],
      ctaText: "Ready to write your own success story?",
      ctaBtn: "Book Your Free Assessment",
      ka: {},
    },
    courses: {
      hero: { eyebrow: "Our Courses", title: "Find the Perfect", highlight: "Course for You", subtitle: "From absolute beginner to advanced professional — each programme is designed with clear outcomes, proven methodology, and personalised support." },
      ka: {},
    },
    courseDetail: {
      foundation: { tagline: "Build a solid foundation from zero", description: "Start your English journey with confidence. Foundation English is designed for absolute beginners and those who want to strengthen core skills from the ground up — pronunciation, grammar, vocabulary, and everyday conversation.", whoIsItFor: ["Complete beginners with no prior English experience", "Students who studied English years ago and need a fresh start", "Anyone wanting a strong grammatical foundation before advancing", "Young adults preparing for travel, study, or work abroad"], features: ["Alphabet, phonics & pronunciation training", "Core vocabulary — 1,000+ essential words", "Simple grammar structures & sentence patterns", "Everyday conversations & guided role-play"], ka: {} },
      progressive: { tagline: "Take your English to the next level", description: "Bridge the gap between basic and advanced. Progressive English focuses on fluency, grammar accuracy, and professional communication skills used in real-world situations — from the workplace to everyday conversation.", whoIsItFor: ["Learners who completed Foundation English or equivalent (A2 level)", "Professionals who need English for work communications", "Students preparing for higher-level English certification", "Anyone who can have basic conversations but wants more fluency"], features: ["Advanced grammar & complex sentence structures", "Business & professional vocabulary sets", "Reading comprehension & academic writing", "Listening to native speakers & authentic media"], ka: {} },
      mastery: { tagline: "Achieve near-native proficiency", description: "Reach the pinnacle of English proficiency. Mastery English is designed for confident speakers targeting academic excellence, IELTS/TOEFL certification, or international career advancement.", whoIsItFor: ["Advanced speakers (B2+) aiming for C1 or C2 fluency", "Students preparing for IELTS (band 6.5+) or TOEFL", "Professionals targeting international careers or postgraduate programs", "Anyone who wants near-native command and precision in English"], features: ["Academic writing & critical argumentation", "Full IELTS / TOEFL examination preparation", "Debate, negotiation & advanced presentation", "Literature, nuance & advanced comprehension"], ka: {} },
      business: { tagline: "Master the language of global business", description: "Tailored for professionals and entrepreneurs. Master the language of global business — from high-stakes meetings and negotiations to polished emails, compelling presentations, and cross-cultural communication.", whoIsItFor: ["Professionals working with international clients or partners", "Entrepreneurs expanding into global markets", "Managers and team leads in multinational companies", "Anyone preparing for an international business career"], features: ["Corporate vocabulary & professional register", "Business email & formal report writing", "Presentations, pitching & public speaking", "Cross-cultural business communication"], ka: {} },
    },
  },
  englishTest: {
    title: "Find Your English Level",
    subtitle: "Free placement test · 20 questions · 5 minutes",
    description: "Answer 20 carefully selected questions to discover your CEFR English level — from A1 Beginner to C2 Proficient. Get your result instantly and find the perfect course for you.",
    instructions: "Read each question carefully and choose the best answer. There are no tricks — just pick what feels most natural to you.",
    questions: [
      { id: 1,  level: "A1", category: "Grammar",    text: 'Complete the sentence: "My name ___ Sarah."',                                                           options: ["are","am","is","be"],                                                                                correct: 2 },
      { id: 2,  level: "A1", category: "Grammar",    text: 'Which sentence is correct?',                                                                             options: ["I have 25 years","I am 25 years old","I am 25 years","My age is 25 years old"],                   correct: 1 },
      { id: 3,  level: "A1", category: "Vocabulary", text: 'What do you say when you meet someone for the first time?',                                              options: ["Good night","See you later","Nice to meet you","Take care"],                                       correct: 2 },
      { id: 4,  level: "A2", category: "Grammar",    text: 'Choose the correct form: "She ___ to school every day."',                                               options: ["go","going","gone","goes"],                                                                       correct: 3 },
      { id: 5,  level: "A2", category: "Grammar",    text: '"I ___ a great film last night." — Choose the correct tense.',                                           options: ["see","have seen","saw","was seeing"],                                                             correct: 2 },
      { id: 6,  level: "A2", category: "Vocabulary", text: 'Choose the opposite of "expensive".',                                                                    options: ["cheap","small","fast","easy"],                                                                    correct: 0 },
      { id: 7,  level: "B1", category: "Grammar",    text: '"If it ___ tomorrow, we will cancel the picnic." — Choose the correct form.',                           options: ["will rain","rained","rains","would rain"],                                                        correct: 2 },
      { id: 8,  level: "B1", category: "Grammar",    text: '"I ___ this book twice. It\'s brilliant!" — Which tense is correct?',                                   options: ["read","was reading","have read","am reading"],                                                    correct: 2 },
      { id: 9,  level: "B1", category: "Grammar",    text: '"She asked me where ___." — Choose the correct reported speech form.',                                   options: ["I come from","did I come from","do I come from","I came from"],                                   correct: 3 },
      { id: 10, level: "B1", category: "Vocabulary", text: 'Choose the word that best completes the sentence: "The meeting was ___ due to bad weather."',           options: ["cancelled","stopped","ended","finished"],                                                         correct: 0 },
      { id: 11, level: "B2", category: "Grammar",    text: '"If I ___ more time, I would learn another language." — Choose the correct form.',                      options: ["have","had","would have","will have"],                                                            correct: 1 },
      { id: 12, level: "B2", category: "Grammar",    text: '"The report ___ by Friday morning." — Choose the correct passive form.',                                 options: ["must complete","must be completing","must be completed","must have complete"],                    correct: 2 },
      { id: 13, level: "B2", category: "Grammar",    text: '"___ for two hours, she finally finished the presentation." — Choose the correct participle clause.',   options: ["Working","Worked","Having worked","She worked"],                                                  correct: 2 },
      { id: 14, level: "B2", category: "Vocabulary", text: 'Choose the correct collocation: "The government must ___ action on climate change."',                   options: ["do","make","take","have"],                                                                        correct: 2 },
      { id: 15, level: "C1", category: "Grammar",    text: '"No sooner ___ the door than the phone rang." — Choose the correct inversion.',                         options: ["I opened","I had opened","had I opened","did I open"],                                           correct: 2 },
      { id: 16, level: "C1", category: "Grammar",    text: '"It is high time we ___ about the budget." — Choose the correct form.',                                  options: ["talk","talked","have talked","are talking"],                                                      correct: 1 },
      { id: 17, level: "C1", category: "Vocabulary", text: 'Choose the word closest in meaning to "ubiquitous".',                                                   options: ["rare","widespread","dangerous","modern"],                                                         correct: 1 },
      { id: 18, level: "C1", category: "Grammar",    text: '"The manager insisted that the report ___ submitted immediately." — Choose the correct subjunctive.',   options: ["is","was","be","were"],                                                                           correct: 2 },
      { id: 19, level: "C2", category: "Grammar",    text: '"Scarcely ___ when problems began to emerge." — Choose the correct inversion.',                         options: ["they had arrived","had they arrived","they arrived","did they arrive"],                          correct: 1 },
      { id: 20, level: "C2", category: "Vocabulary", text: 'Which sentence uses "ostensibly" correctly?',                                                           options: ["She ostensibly ran very fast","He ostensibly agreed but had reservations","The ostensibly door was open","They were ostensibly running late"], correct: 1 },
    ],
  },
  blogs: [
    {
      id: "1",
      title: "5 Proven Techniques to Improve Your English Speaking",
      slug: "5-techniques-improve-english-speaking",
      excerpt: "Speaking confidently in English is a skill that can be developed with the right practice techniques. Here are 5 methods our teachers swear by.",
      content: "<p>Speaking confidently in English doesn't happen overnight, but with consistent practice and the right techniques, you can make rapid progress.</p><h2>1. Shadowing</h2><p>Choose a native speaker recording and repeat what they say, mimicking their rhythm, intonation, and pronunciation.</p><h2>2. Think in English</h2><p>When you catch yourself forming a thought in Georgian, try to immediately translate it to English. Over time, you'll start thinking directly in English.</p><h2>3. Record Yourself</h2><p>Recording your speech and listening back is one of the most powerful tools for identifying and correcting your own mistakes.</p><h2>4. Join a Conversation Group</h2><p>Our academy offers weekly conversation clubs where students of all levels practice real-world English in a supportive environment.</p><h2>5. Use English Every Day</h2><p>Change your phone and social media to English. Watch movies with English subtitles. The more immersive your environment, the faster you'll improve.</p>",
      category: "Tips",
      coverImage: "",
      author: "Sarah Johnson",
      authorRole: "Senior English Instructor",
      publishedAt: "2026-04-15T10:00:00Z",
      readTime: "4 min",
      published: true,
    },
    {
      id: "2",
      title: "Understanding English Grammar: The Present Perfect Tense",
      slug: "understanding-present-perfect-tense",
      excerpt: "The present perfect tense is one of the most commonly misunderstood parts of English grammar. Let's break it down clearly with real examples.",
      content: "<p>The present perfect tense connects the past to the present. It's used to describe an action that has happened at some point before now.</p><h2>Structure</h2><p><strong>Subject + have/has + past participle</strong></p><ul><li>I have lived in Kutaisi for five years.</li><li>She has studied English since 2020.</li><li>They have visited London twice.</li></ul><h2>When to Use It</h2><ul><li>The action happened at an unspecified time in the past</li><li>The action started in the past and continues to the present</li><li>You're talking about life experiences</li></ul>",
      category: "Grammar",
      coverImage: "",
      author: "David Mitchell",
      authorRole: "Grammar Specialist",
      publishedAt: "2026-04-10T09:00:00Z",
      readTime: "5 min",
      published: true,
    },
    {
      id: "3",
      title: "Business English: Phrases for Professional Emails",
      slug: "business-english-professional-email-phrases",
      excerpt: "Writing professional emails in English is a critical skill in today's global workplace. Master these essential phrases to communicate with confidence.",
      content: "<p>In the modern global workplace, the ability to write clear and professional emails in English can open doors to international opportunities.</p><h2>Opening an Email</h2><ul><li>I hope this email finds you well.</li><li>I am writing to inquire about...</li><li>Following up on our conversation...</li></ul><h2>Making Requests</h2><ul><li>Could you please...</li><li>I would appreciate it if you could...</li><li>Would it be possible to...</li></ul><h2>Closing an Email</h2><ul><li>Please do not hesitate to contact me if you have any questions.</li><li>I look forward to hearing from you.</li><li>Best regards / Kind regards / Sincerely</li></ul>",
      category: "Business",
      coverImage: "",
      author: "Sarah Johnson",
      authorRole: "Business English Instructor",
      publishedAt: "2026-04-05T08:00:00Z",
      readTime: "6 min",
      published: true,
    },
  ],
}

const STORAGE_KEY = 'kea-site-data'

const SiteDataContext = createContext(null)

export function SiteDataProvider({ children }) {
  const [siteData, setSiteData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...DEFAULT_SITE_DATA, ...parsed }
      }
    } catch {}
    return DEFAULT_SITE_DATA
  })

  useEffect(() => {
    const handler = (e) => {
      if (e.key !== STORAGE_KEY) return
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : null
        setSiteData(parsed ? { ...DEFAULT_SITE_DATA, ...parsed } : DEFAULT_SITE_DATA)
      } catch {}
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const updateSection = useCallback((key, value) => {
    setSiteData(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const resetSection = useCallback((key) => {
    setSiteData(prev => {
      const next = { ...prev, [key]: DEFAULT_SITE_DATA[key] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSiteData(DEFAULT_SITE_DATA)
  }, [])

  return (
    <SiteDataContext.Provider value={{ siteData, updateSection, resetSection, resetAll }}>
      {children}
    </SiteDataContext.Provider>
  )
}

export const useSiteData = () => useContext(SiteDataContext)
