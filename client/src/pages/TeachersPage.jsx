import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Award, Globe, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { CTA } from '../components/sections/CTA'
import { useSiteData } from '../context/SiteDataContext'

function TeacherCard({ teacher, index, experienceLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-7 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-14 h-14 rounded-2xl ${teacher.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
          {teacher.avatar}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{teacher.name}</h3>
          <p className="text-sm text-primary-600 dark:text-primary-400 mt-0.5">{teacher.title}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{teacher.experience} {experienceLabel}</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1 mb-5">
        {teacher.bio}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {teacher.credentials.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded-lg"
          >
            <Award className="w-3 h-3" />
            {c}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {teacher.specialties.map((s) => (
          <span
            key={s}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-700">
        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-xs text-slate-400 dark:text-slate-500">{teacher.languages.join(' · ')}</span>
      </div>
    </motion.div>
  )
}

export function TeachersPage() {
  const { t } = useTranslation()
  const { siteData } = useSiteData()
  const teachers = siteData.teachers
  const stats = t('teachersPage.stats', { returnObjects: true })
  const hero = t('teachersPage.pageHero', { returnObjects: true })
  const join = t('teachersPage.join', { returnObjects: true })

  return (
    <PageLayout pageTitle="Our Teachers">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        subtitle={hero.subtitle}
      />

      {/* Stats bar */}
      <section className="py-10 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-10">
            {Array.isArray(stats) && stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary-900 dark:text-primary-300 mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher grid */}
      <section className="py-20 lg:py-28 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {teachers.map((teacher, i) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                index={i}
                experienceLabel={t('teachersPage.experienceLabel')}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-primary-50 dark:bg-primary-950/20 rounded-2xl border border-primary-100 dark:border-primary-900/30 p-8 text-center max-w-2xl mx-auto"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{join.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{join.desc}</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors shadow-md shadow-primary-900/20 group"
            >
              {join.btn}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <CTA />
    </PageLayout>
  )
}
