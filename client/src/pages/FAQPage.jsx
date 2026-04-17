import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { CTA } from '../components/sections/CTA'

const FAQ_CATEGORIES = [
  {
    id: 'general',
    label: 'General',
    color: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
    items: [
      {
        q: 'What is Kutaisi English Academy?',
        a: 'Kutaisi English Academy is a professional English language school founded in 2017. We offer CEFR-aligned courses for all levels from complete beginners (A1) to advanced speakers (C2), as well as a dedicated Business English programme.',
      },
      {
        q: 'Where are you located?',
        a: 'We are located at 12 Rustaveli Avenue, Kutaisi, Georgia. Our academy is easy to reach by public transport and has nearby parking. Open Monday–Friday 9:00–20:00, Saturday 10:00–17:00.',
      },
      {
        q: 'How long has the academy been running?',
        a: 'We opened our doors in 2017 and have been teaching English continuously since then — that\'s over 8 years of experience. In that time we have helped more than 1,200 students reach their English language goals.',
      },
      {
        q: 'Are your teachers qualified?',
        a: 'Every teacher at the academy holds a CELTA or DELTA qualification — the internationally recognised standard for English language teaching. Many also hold additional post-graduate degrees in Applied Linguistics, TESOL, or Education.',
      },
      {
        q: 'Do you offer online classes?',
        a: 'Our main programme is in-person, which we believe produces the best results for most learners. In exceptional circumstances (illness, travel) we can accommodate a limited number of online sessions. Please contact us to discuss your situation.',
      },
    ],
  },
  {
    id: 'enrollment',
    label: 'Enrollment & Placement',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    items: [
      {
        q: 'How do I enroll?',
        a: 'The easiest way is to fill in the enrollment form on our website or contact us by phone or WhatsApp. We\'ll arrange a free placement assessment at a time that suits you, and from there you can begin in the appropriate course.',
      },
      {
        q: 'What is the placement assessment?',
        a: 'The placement assessment is a short (20–30 minute) written and spoken test that helps us identify your current level of English. It is completely free, there is no pressure to enrol, and the results are useful to you regardless of what you decide. We use the CEFR framework (A1–C2) to determine the right course for you.',
      },
      {
        q: 'Can I start at any time of year?',
        a: 'New cohorts start at the beginning of each month. In most cases you can join within 2–4 weeks of contacting us, depending on availability in the relevant level group. Contact us for exact start dates.',
      },
      {
        q: 'What if I already have some English knowledge but am not sure of my level?',
        a: 'That is exactly what the placement assessment is for. Many students have some prior knowledge but are unsure where they fit. Our assessment will place you accurately so you are challenged but not overwhelmed from your very first class.',
      },
      {
        q: 'Is there a minimum age requirement?',
        a: 'Our main adult programme is designed for students aged 16 and above. For younger learners, please contact us directly to discuss available options.',
      },
    ],
  },
  {
    id: 'classes',
    label: 'Classes & Schedule',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    items: [
      {
        q: 'How many students are in each class?',
        a: 'We keep classes intentionally small — a maximum of 8 students in most groups, and just 6 in our Mastery and Business English courses. This ensures every student receives personal attention and meaningful speaking practice in every session.',
      },
      {
        q: 'How often are classes held?',
        a: 'Foundation, Progressive, and Mastery courses meet 3 times per week. Business English meets twice per week. Each session is 90 minutes. We offer morning, afternoon, and evening time slots, as well as Saturday classes.',
      },
      {
        q: 'What happens if I miss a class?',
        a: 'We understand that life happens. We ask that you notify us in advance where possible. Teachers share session notes and materials for missed classes. However, if a student misses more than 30% of sessions in a month without prior notification, they may be asked to repeat that month at the standard fee.',
      },
      {
        q: 'What materials will I need?',
        a: 'All course materials — including textbooks, workbooks, and digital resources — are included in the course fee. You will not need to purchase anything separately. We use internationally published textbooks aligned to the CEFR framework.',
      },
      {
        q: 'Do you teach on Georgian public holidays?',
        a: 'Classes are suspended on official Georgian public holidays. We compensate for any missed sessions by extending the course duration accordingly, so you always receive the full number of scheduled lessons.',
      },
    ],
  },
  {
    id: 'fees',
    label: 'Fees & Payment',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    items: [
      {
        q: 'How much do courses cost?',
        a: 'Foundation English is ₾180/month, Progressive English ₾200/month, Mastery English ₾240/month, and Business English ₾220/month. All fees include course materials. Visit our Courses page for full pricing details.',
      },
      {
        q: 'When and how do I pay?',
        a: 'Monthly fees are due by the 5th of each calendar month. We accept bank transfer, cash payment at the academy, and card payment. Details are provided upon enrollment. You can also pay via our online enrollment form.',
      },
      {
        q: 'Can I get a refund if I leave mid-month?',
        a: 'We do not issue refunds for partially-completed months as a general rule. However, in exceptional circumstances — serious illness or family bereavement — refund requests will be considered on a case-by-case basis. Please contact us as soon as possible if you are in this situation.',
      },
      {
        q: 'Is the placement assessment really free?',
        a: 'Yes, completely free and with no obligation to enrol. We believe everyone deserves to know their current English level, and we\'re happy to provide that service regardless of whether you choose to study with us.',
      },
      {
        q: 'Are there any discounts available?',
        a: 'We offer a 10% sibling discount for two or more family members enrolled at the same time. We also periodically offer early-bird rates for new cohorts — subscribe to our newsletter or follow us on social media to be the first to hear about promotions.',
      },
    ],
  },
  {
    id: 'progress',
    label: 'Progress & Certification',
    color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    items: [
      {
        q: 'Will I receive a certificate when I finish?',
        a: 'Yes. Upon successful completion of any course, you will receive a Kutaisi English Academy certificate of completion, which includes your CEFR level achieved. This is a recognised document that you can include in your CV or university applications.',
      },
      {
        q: 'How will I know if I\'m making progress?',
        a: 'Progress is tracked continuously through in-class activities, monthly progress reviews, and end-of-course assessments. Teachers provide regular verbal and written feedback. You will always know where you stand and what to focus on next.',
      },
      {
        q: 'Do you help with IELTS or TOEFL preparation?',
        a: 'Our Mastery English course includes dedicated IELTS and TOEFL preparation modules. We also offer one-to-one exam preparation sessions for students who need focused coaching on a specific exam. Contact us to discuss your target score and timeline.',
      },
      {
        q: 'What is the average improvement a student makes?',
        a: 'Most students advance by one full CEFR level (e.g., A2 to B1) within a single 3–4 month course. Results depend on attendance, home study, and the individual student, but our 96% student satisfaction rate reflects how consistently we help people progress.',
      },
      {
        q: 'Can I move up to the next course level before completing the current one?',
        a: 'If a student is progressing exceptionally quickly, the teacher may recommend an early advancement. This is assessed by the Academic Director and is based on demonstrated proficiency, not just enthusiasm. We want every student in the class level where they will thrive.',
      },
    ],
  },
]

function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
      >
        <span className="font-semibold text-slate-900 dark:text-white text-sm pr-4">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div className="px-6 pb-5 pt-2 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {a}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general')
  const category = FAQ_CATEGORIES.find((c) => c.id === activeCategory)

  return (
    <PageLayout pageTitle="FAQ">
      <PageHero
        eyebrow="FAQ"
        title="Your Questions,"
        highlight="Answered"
        subtitle="Everything you need to know about studying at Kutaisi English Academy. Can't find your answer? Contact us directly."
      />

      <section className="py-20 lg:py-28 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-primary-900 text-white shadow-md shadow-primary-900/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Category badge */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold mb-6 ${category.color}`}>
              {category.label}
            </span>

            <div className="flex flex-col gap-3">
              {category.items.map((item, i) => (
                <FaqItem key={item.q} q={item.q} a={item.a} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-16 text-center p-8 bg-primary-50 dark:bg-primary-950/20 rounded-2xl border border-primary-100 dark:border-primary-900/30"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Still have a question?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Our team is happy to help. Get in touch and we'll respond within 24 hours.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors shadow-md shadow-primary-900/20 group"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <CTA />
    </PageLayout>
  )
}
