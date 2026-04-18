import { motion } from 'framer-motion'
import { Link, useParams, Navigate } from 'react-router-dom'
import { CheckCircle2, Clock, Users, Calendar, ChevronDown, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'
import { COURSE_DETAILS } from '../data/courseDetails'

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
      >
        <span className="font-semibold text-slate-900 dark:text-white text-sm">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 ml-3"
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
        <div className="px-6 pb-4 pt-1 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {a}
        </div>
      </motion.div>
    </div>
  )
}

export function CourseDetailPage() {
  const { courseSlug } = useParams()
  const { t } = useTranslation()
  const baseData = COURSE_DETAILS[courseSlug]

  if (!baseData) return <Navigate to="/courses" replace />

  const cd = t('courseDetail', { returnObjects: true })
  const translated = cd?.courses?.[courseSlug] || {}
  const card = cd?.card || {}

  const course = {
    ...baseData,
    tagline:      translated.tagline      || baseData.tagline,
    description:  translated.description  || baseData.description,
    whoIsItFor:   translated.whoIsItFor   || baseData.whoIsItFor,
    features:     translated.features     || baseData.features,
    curriculum:   translated.curriculum   || baseData.curriculum,
    schedule:     translated.schedule     || baseData.schedule,
    faq:          translated.faq          || baseData.faq,
  }

  const allCourses = Object.values(COURSE_DETAILS)
  const otherSlugs = allCourses.filter((c) => c.slug !== courseSlug)

  return (
    <PageLayout pageTitle={course.title}>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: course.accent }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 max-w-3xl">
            <nav className="flex items-center gap-2 text-blue-200/60 text-xs">
              <Link to="/courses" className="hover:text-white transition-colors">{cd.breadcrumb || 'Courses'}</Link>
              <span>/</span>
              <span className="text-white">{course.title}</span>
            </nav>
            <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold ${course.badgeClass}`}>
              {course.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">{course.title}</h1>
            <p className="text-blue-100/80 text-lg leading-relaxed max-w-2xl">{course.tagline}</p>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                { Icon: Clock,    label: course.duration        },
                { Icon: Calendar, label: course.sessionsPerWeek },
                { Icon: Users,    label: course.groupSize       },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-blue-200/70 text-sm">
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 lg:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left: content */}
            <div className="lg:col-span-2 flex flex-col gap-14">

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{cd.aboutCourse}</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{course.description}</p>
              </div>

              {/* Who is it for */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">{cd.whoIsItFor}</h2>
                <ul className="flex flex-col gap-3">
                  {course.whoIsItFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: course.accent }} />
                      <span className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curriculum */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{cd.curriculum}</h2>
                <div className="flex flex-col gap-4">
                  {course.curriculum.map((mod, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
                    >
                      <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: course.accent }}>
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{mod.title}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">{mod.weeks}</div>
                        </div>
                      </div>
                      <div className="px-6 py-4">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {mod.topics.map((topic, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: course.accent }} />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{cd.schedule}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {course.schedule.map((s, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 text-center">
                      <div className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: course.accent }}>{s.label}</div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">{s.time}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{s.days}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{cd.faq}</h2>
                <div className="flex flex-col gap-3">
                  {course.faq.map((item, i) => (
                    <FaqItem key={i} {...item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: enrollment card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg"
                >
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-slate-900 dark:text-white mb-0.5">{course.price}</div>
                    <div className="text-sm text-slate-400 dark:text-slate-500">{card.perMonth || 'per month'}</div>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-700 mb-5" />

                  <ul className="flex flex-col gap-3 mb-6">
                    {[
                      `${card.level || 'Level'}: ${course.level}`,
                      `${card.duration || 'Duration'}: ${course.duration}`,
                      course.sessionsPerWeek,
                      course.groupSize,
                      card.allMaterials || 'All materials included',
                      card.progressTracking || 'Progress tracking',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: course.accent }} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 group"
                    style={{ background: course.accent }}
                  >
                    {card.enrollNow || 'Enroll Now'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-3">
                    {card.freePlacement || 'Free placement test · No commitment required'}
                  </p>
                </motion.div>

                <div className="mt-6">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">
                    {card.otherCourses || 'Other Courses'}
                  </p>
                  <div className="flex flex-col gap-2">
                    {otherSlugs.map((c) => {
                      const otherTranslated = t(`courseDetail.courses.${c.slug}`, { returnObjects: true })
                      return (
                        <Link
                          key={c.slug}
                          to={`/courses/${c.slug}`}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.accent }} />
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {otherTranslated?.tagline ? c.title : c.title}
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">{c.level}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto shrink-0" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
