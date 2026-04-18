import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'

export function TermsPage() {
  const { t } = useTranslation()
  const sections = t('termsPage.sections', { returnObjects: true })

  return (
    <PageLayout pageTitle="Terms of Service">
      <section className="relative pt-32 pb-12 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300/70 mb-4 block">
              {t('termsPage.legal')}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t('termsPage.title')}</h1>
            <p className="text-blue-100/70 text-sm">{t('termsPage.lastUpdated')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-600 dark:text-slate-400 leading-relaxed mb-12 text-base border-l-4 border-primary-200 dark:border-primary-800 pl-5"
          >
            {t('termsPage.intro')}
          </motion.p>

          <div className="flex flex-col gap-10">
            {Array.isArray(sections) && sections.map((sec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
              >
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{sec.title}</h2>
                <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                  {sec.body}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
