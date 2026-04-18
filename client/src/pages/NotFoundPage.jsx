import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <PageLayout pageTitle="Page Not Found">
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-white dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-50 dark:bg-primary-950/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-50 dark:bg-blue-950/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center max-w-xl mx-auto px-4"
        >
          <div className="text-8xl sm:text-9xl font-black text-primary-100 dark:text-primary-900/50 leading-none mb-4 select-none">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {t('notFound.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            {t('notFound.desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors shadow-md shadow-primary-900/20 group"
            >
              <Home className="w-4 h-4" />
              {t('notFound.backHome')}
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
            >
              {t('notFound.browseCourses')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>
    </PageLayout>
  )
}
