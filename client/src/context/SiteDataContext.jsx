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
