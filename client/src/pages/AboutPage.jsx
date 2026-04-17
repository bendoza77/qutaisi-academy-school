import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Users, BookOpen, Award, Globe } from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { Stats } from '../components/sections/Stats'
import { CTA } from '../components/sections/CTA'

const TIMELINE = [
  { year: '2017', title: 'Academy Founded', desc: 'Davit Gorgodze opens Kutaisi English Academy with a vision to make quality English education accessible to all.' },
  { year: '2019', title: 'CEFR Accreditation', desc: 'Curriculum fully aligned with the Common European Framework of Reference, recognised across Europe.' },
  { year: '2021', title: '500 Graduates', desc: 'Over 500 students successfully complete our courses and go on to achieve their personal and professional goals.' },
  { year: '2024', title: '1,200+ Students', desc: 'The academy grows to become Kutaisi\'s leading English language institution with 15+ certified educators.' },
]

const VALUES = [
  { Icon: Users,    title: 'Student-First',   desc: 'Every decision we make starts and ends with what is best for the learner.' },
  { Icon: BookOpen, title: 'Academic Rigour',  desc: 'CEFR-aligned curriculum, research-backed methodology, measurable outcomes.' },
  { Icon: Award,    title: 'Excellence',       desc: 'We hold ourselves and our students to the highest possible standards.' },
  { Icon: Globe,    title: 'Global Mindset',   desc: 'English is the bridge to the world. We build that bridge one student at a time.' },
]

export function AboutPage() {
  return (
    <PageLayout pageTitle="About Us">
      <PageHero
        eyebrow="About the Academy"
        title="Trusted English Education in the Heart of"
        highlight="Kutaisi"
        subtitle="For over eight years we have been Kutaisi's leading destination for professional English language education — from complete beginners to advanced speakers."
      />

      {/* Story */}
      <section className="py-20 lg:py-28 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3 block">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Eight years of shaping <span className="text-primary-700 dark:text-primary-400">English fluency</span> in Georgia
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Founded in 2017 by Davit Gorgodze, Kutaisi English Academy was born from a simple but powerful belief: every student in Kutaisi deserves access to world-class English education. What started as a small classroom has grown into the city's most trusted language institution.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                Today we offer four CEFR-aligned programmes, taught by 15+ CELTA/DELTA-certified educators, with a 96% student satisfaction rate and over 1,200 graduates who have transformed their careers, studies, and lives through English.
              </p>
              <div className="flex flex-wrap gap-3">
                {['CEFR Aligned', '15+ Teachers', '96% Satisfaction', '8 Years'].map((badge) => (
                  <span key={badge} className="px-4 py-1.5 rounded-full text-sm font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute left-6 top-0 bottom-0 w-px bg-primary-100 dark:bg-primary-900" />
              <div className="flex flex-col gap-8">
                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex gap-6"
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary-900 dark:bg-primary-700 flex items-center justify-center z-10 relative shadow-md shadow-primary-900/20">
                        <span className="text-white text-xs font-bold">{item.year}</span>
                      </div>
                    </div>
                    <div className="pt-2.5">
                      <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3 block">What We Stand For</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission quote */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-br from-primary-900 to-primary-950 rounded-3xl p-10 lg:p-14"
          >
            <div className="text-6xl font-serif text-accent-400 leading-none mb-6">"</div>
            <p className="text-white/90 text-xl lg:text-2xl leading-relaxed font-medium mb-8 max-w-2xl mx-auto">
              Our mission is simple: give every student in Kutaisi the tools to communicate confidently in English — and unlock the world.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-500 flex items-center justify-center">
                <span className="text-white font-bold">DG</span>
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">Davit Gorgodze</div>
                <div className="text-blue-300/60 text-sm">Founder & Academic Director</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Stats />

      {/* Quick highlights */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3 block">Why Students Choose Us</span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Built around what actually works</h2>
              <ul className="flex flex-col gap-4">
                {[
                  'Founded in 2017 with a mission to make quality English education accessible to all',
                  'Curriculum fully aligned with the Common European Framework of Reference (CEFR)',
                  'Small group sizes ensure personalized attention for every learner',
                  'Modern, communicative teaching methodology backed by research',
                  'CELTA/DELTA certified educators with 5–15 years of teaching experience',
                ].map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Student Satisfaction', value: '96%', color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Average Rating',       value: '4.9★', color: 'text-amber-600 dark:text-amber-400'   },
                { label: 'Total Graduates',      value: '1,200+', color: 'text-blue-600 dark:text-blue-400'   },
                { label: 'Years of Excellence',  value: '8+',   color: 'text-purple-600 dark:text-purple-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center">
                  <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="flex gap-4 mt-10">
            <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors shadow-md shadow-primary-900/20 group">
              View Our Courses <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </PageLayout>
  )
}
