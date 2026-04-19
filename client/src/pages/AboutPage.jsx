import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Users, BookOpen, Award, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { Stats } from '../components/sections/Stats'
import { CTA } from '../components/sections/CTA'
import { useSiteData } from '../context/SiteDataContext'

const VALUE_ICONS = [Users, BookOpen, Award, Globe]

export function AboutPage() {
  const { t, i18n } = useTranslation()
  const { siteData } = useSiteData()
  const isKa = i18n.language.startsWith('ka')
  const pd = siteData.pages?.about || {}
  const g = (key) => (isKa ? pd.ka?.[key] : pd[key]) || t(`aboutPage.${key}`, { returnObjects: true })

  const story = g('story')
  const values = g('values')
  const mission = g('mission')
  const highlights = g('highlights')
  const hero = (isKa ? pd.ka?.hero : pd.hero) || t('aboutPage.pageHero', { returnObjects: true })
  const timeline = g('timeline')

  return (
    <PageLayout pageTitle="About Us">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        subtitle={hero.subtitle}
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
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3 block">
                {story.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                {story.title} <span className="text-primary-700 dark:text-primary-400">{story.titleHighlight}</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{story.p1}</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{story.p2}</p>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(story.badges) && story.badges.map((badge) => (
                  <span key={badge} className="px-4 py-1.5 rounded-full text-sm font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Timeline — uses about section translations */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute left-6 top-0 bottom-0 w-px bg-primary-100 dark:bg-primary-900" />
              <div className="flex flex-col gap-8">
                {['2017', '2019', '2021', '2024'].map((year, i) => (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex gap-6"
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary-900 dark:bg-primary-700 flex items-center justify-center z-10 relative shadow-md shadow-primary-900/20">
                        <span className="text-white text-xs font-bold">{year}</span>
                      </div>
                    </div>
                    <div className="pt-2.5">
                      <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                        {Array.isArray(timeline) && timeline[i]?.title}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {Array.isArray(timeline) && timeline[i]?.desc}
                      </p>
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
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3 block">
              {values.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">{values.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(values.items) && values.items.map((item, i) => {
              const Icon = VALUE_ICONS[i]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.55 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
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
              {mission.quote}
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-500 flex items-center justify-center">
                <span className="text-white font-bold">DG</span>
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">{mission.founder}</div>
                <div className="text-blue-300/60 text-sm">{mission.founderTitle}</div>
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
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3 block">
                {highlights.eyebrow}
              </span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">{highlights.title}</h2>
              <ul className="flex flex-col gap-4">
                {Array.isArray(highlights.points) && highlights.points.map((point, i) => (
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
              {Array.isArray(highlights.stats) && highlights.stats.map(({ label, value }, i) => {
                const colors = [
                  'text-emerald-600 dark:text-emerald-400',
                  'text-amber-600 dark:text-amber-400',
                  'text-blue-600 dark:text-blue-400',
                  'text-purple-600 dark:text-purple-400',
                ]
                return (
                  <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center">
                    <div className={`text-3xl font-bold mb-1 ${colors[i]}`}>{value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
                  </div>
                )
              })}
            </motion.div>
          </div>
          <div className="flex gap-4 mt-10">
            <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors shadow-md shadow-primary-900/20 group">
              {highlights.viewCourses} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              {highlights.getInTouch}
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </PageLayout>
  )
}
