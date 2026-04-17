import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, Users, Calendar } from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { CTA } from '../components/sections/CTA'
import { COURSE_DETAILS } from '../data/courseDetails'

const LEVELS = [
  { code: 'A1–A2', name: 'Beginner',     desc: 'No prior experience needed',       color: 'bg-emerald-500' },
  { code: 'B1–B2', name: 'Intermediate', desc: 'Basic sentences & conversations',   color: 'bg-blue-500'   },
  { code: 'C1–C2', name: 'Advanced',     desc: 'Confident speaker, targeting exam', color: 'bg-purple-500' },
  { code: 'All',   name: 'Business',     desc: 'Any level, professional focus',     color: 'bg-amber-500'  },
]

function CourseCard({ course }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Accent bar */}
      <div className="h-1 w-full" style={{ background: course.accent }} />

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${course.badgeClass}`}>
            {course.badge}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{course.level}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{course.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{course.tagline}</p>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-2 mb-5 pb-5 border-b border-slate-100 dark:border-slate-700">
          {[
            { Icon: Clock,    label: course.duration        },
            { Icon: Calendar, label: course.sessionsPerWeek },
            { Icon: Users,    label: course.groupSize       },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <Icon className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-2 mb-6 flex-1">
          {course.features.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: course.accent }} />
              <span className="text-sm text-slate-600 dark:text-slate-400">{feat}</span>
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{course.price}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">{course.priceNote}</span>
          </div>
          <Link
            to={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 group"
            style={{ background: course.accent }}
          >
            Enroll
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export function CoursesPage() {
  const courses = Object.values(COURSE_DETAILS)

  return (
    <PageLayout pageTitle="Our Courses">
      <PageHero
        eyebrow="Our Courses"
        title="Find the Perfect"
        highlight="Course for You"
        subtitle="From absolute beginner to advanced professional — each programme is designed with clear outcomes, proven methodology, and personalised support."
      />

      {/* Level guide */}
      <section className="py-14 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold mb-8">
            Find your level
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {LEVELS.map((l, i) => (
              <motion.div
                key={l.code}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center border border-slate-100 dark:border-slate-700"
              >
                <div className={`w-10 h-10 ${l.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white text-xs font-bold">{l.code}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">{l.name}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500">{l.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course grid */}
      <section className="py-20 lg:py-28 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-slate-400 dark:text-slate-500 mt-10"
          >
            Not sure which level is right for you?{' '}
            <Link to="/contact" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Book a free placement assessment →
            </Link>
          </motion.p>
        </div>
      </section>

      <CTA />
    </PageLayout>
  )
}
