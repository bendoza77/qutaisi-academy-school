import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { CTA } from '../components/sections/CTA'
import { useSiteData } from '../context/SiteDataContext'

const CATEGORY_COLORS = {
  general:    'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
  enrollment: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  classes:    'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  fees:       'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  progress:   'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
}

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
  const { t, i18n } = useTranslation()
  const { siteData } = useSiteData()
  const isKa = i18n.language.startsWith('ka')
  const pd = siteData.pages?.faq || {}
  const hero = (isKa ? pd.ka?.hero : pd.hero) || t('faqPage.pageHero', { returnObjects: true })
  const categories = (isKa ? pd.ka?.categories : pd.categories) || t('faqPage.categories', { returnObjects: true })
  const stillQ = t('faqPage.stillQuestion', { returnObjects: true })

  const [activeCategory, setActiveCategory] = useState('general')

  const category = Array.isArray(categories)
    ? categories.find((c) => c.id === activeCategory)
    : null

  return (
    <PageLayout pageTitle="FAQ">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        subtitle={hero.subtitle}
      />

      <section className="py-20 lg:py-28 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {Array.isArray(categories) && categories.map((cat) => (
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

          {/* Category content */}
          {category && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold mb-6 ${CATEGORY_COLORS[category.id] || CATEGORY_COLORS.general}`}>
                {category.label}
              </span>

              <div className="flex flex-col gap-3">
                {Array.isArray(category.items) && category.items.map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} index={i} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-16 text-center p-8 bg-primary-50 dark:bg-primary-950/20 rounded-2xl border border-primary-100 dark:border-primary-900/30"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{stillQ.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{stillQ.desc}</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors shadow-md shadow-primary-900/20 group"
            >
              {stillQ.btn}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <CTA />
    </PageLayout>
  )
}
