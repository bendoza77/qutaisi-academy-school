import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Quote, Star, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { TESTIMONIALS_META } from '../constants'
import { CTA } from '../components/sections/CTA'
import { useSiteData } from '../context/SiteDataContext'

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-accent-500 fill-accent-500' : 'text-slate-200 dark:text-slate-700'}`} />
      ))}
    </div>
  )
}

function TestimonialCard({ meta, text, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-7 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-5">
        <Quote className="w-8 h-8 text-primary-200 dark:text-primary-800" strokeWidth={1.5} />
        <StarRow rating={meta.rating} />
      </div>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic flex-1 text-sm">
        "{text.text}"
      </p>
      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
        {meta.photoUrl ? (
          <img src={meta.photoUrl} alt={text.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
        ) : (
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${meta.color}`}>
            {meta.avatar}
          </div>
        )}
        <div>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">{text.name}</div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{text.role} · {text.location}</div>
        </div>
      </div>
    </motion.div>
  )
}

export function TestimonialsPage() {
  const { t, i18n } = useTranslation()
  const { siteData } = useSiteData()
  const isKa = i18n.language.startsWith('ka')
  const pd = siteData.pages?.testimonials || {}
  const hero = (isKa ? pd.ka?.hero : pd.hero) || t('testimonialsPage.pageHero', { returnObjects: true })
  const stats = (isKa ? pd.ka?.stats : pd.stats) || t('testimonialsPage.stats', { returnObjects: true })
  const ctaText = (isKa ? pd.ka?.ctaText : pd.ctaText) || t('testimonialsPage.ctaText')
  const ctaBtn = (isKa ? pd.ka?.ctaBtn : pd.ctaBtn) || t('testimonialsPage.ctaBtn')
  const items = siteData.testimonials

  return (
    <PageLayout pageTitle="Student Testimonials">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        subtitle={hero.subtitle}
      />

      {/* Overall rating */}
      <section className="py-10 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-10">
            {Array.isArray(stats) && stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary-900 dark:text-primary-300 mb-0.5">{stat.value}</div>
                {stat.stars && <StarRow rating={5} />}
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All testimonials grid */}
      <section className="py-20 lg:py-28 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.isArray(items) && items.map((item, i) => (
              <TestimonialCard key={item.id} meta={item} text={item} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-14 text-center"
          >
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
              {ctaText}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors shadow-md shadow-primary-900/20 group"
            >
              {ctaBtn}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <CTA />
    </PageLayout>
  )
}
