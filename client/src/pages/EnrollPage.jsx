import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckCircle2, ChevronRight, BookOpen, TrendingUp, Award, Briefcase,
  Star, Zap, Target, Globe, GraduationCap, Layers,
  Check, AlertCircle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { cn } from '../utils/cn'
import { useSiteData } from '../context/SiteDataContext'

const iconMap = { BookOpen, TrendingUp, Award, Briefcase, Star, Zap, Target, Globe, GraduationCap, Layers }

function StepIndicator({ current, steps }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
              i < current
                ? 'bg-emerald-500 text-white'
                : i === current
                ? 'bg-primary-900 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
            )}>
              {i < current ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={cn(
              'text-xs font-medium hidden sm:block',
              i === current ? 'text-primary-900 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'
            )}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              'w-16 sm:w-24 h-0.5 mb-5 mx-1 transition-all duration-300',
              i < current ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

function InputField({ label, error, required, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <input
        className={cn(
          'w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
          'placeholder:text-slate-400 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
          error
            ? 'border-rose-400 dark:border-rose-500'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        )}
        {...props}
      />
      {error && (
        <span className="flex items-center gap-1.5 text-xs text-rose-500">
          <AlertCircle className="w-3 h-3" />
          {error}
        </span>
      )}
    </div>
  )
}

const INITIAL_DETAILS = { name: '', phone: '', email: '', notes: '' }

export function EnrollPage() {
  const { t, i18n } = useTranslation()
  const { siteData } = useSiteData()
  const isKa = i18n.language.startsWith('ka')

  const hero    = t('enrollPage.pageHero', { returnObjects: true })
  const steps   = t('enrollPage.steps',   { returnObjects: true })
  const s0      = t('enrollPage.step0',   { returnObjects: true })
  const s1      = t('enrollPage.step1',   { returnObjects: true })
  const s2      = t('enrollPage.step2',   { returnObjects: true })
  const success = t('enrollPage.success', { returnObjects: true })

  // Build course list from live siteData — updates instantly when admin saves
  const COURSES = siteData.courses.map((course) => {
    const kaData = course.ka || {}
    return {
      slug:     course.slug,
      accent:   course.accent || '#2563eb',
      popular:  course.popular || false,
      Icon:     iconMap[course.icon] || BookOpen,
      title:    isKa ? (kaData.title          || course.title)          : course.title,
      level:    isKa ? (kaData.level          || course.level)          : course.level,
      badge:    isKa ? (kaData.badge          || course.badge)          : course.badge,
      duration: isKa ? (kaData.duration       || course.duration)       : course.duration,
      sessions: isKa ? (kaData.sessionsPerWeek|| course.sessionsPerWeek): course.sessionsPerWeek,
      price:    course.price,
      priceNote:course.priceNote,
    }
  })

  const [step, setStep] = useState(0)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [details, setDetails] = useState(INITIAL_DETAILS)
  const [errors, setErrors] = useState({})
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const course = COURSES.find((c) => c.slug === selectedCourse)

  const validateDetails = () => {
    const errs = {}
    if (!details.name.trim()) errs.name = s1.nameRequired
    if (!details.phone.trim()) errs.phone = s1.phoneRequired
    else if (!/^[\d\s+\-()]{7,}$/.test(details.phone)) errs.phone = s1.phoneInvalid
    if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) errs.email = s1.emailInvalid
    return errs
  }

  const handleDetailsChange = (e) => {
    const { name, value } = e.target
    setDetails((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }))
  }

  const goNext = () => {
    if (step === 1) {
      const errs = validateDetails()
      if (Object.keys(errs).length > 0) { setErrors(errs); return }
    }
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirm = () => {
    if (!agreed) return
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <PageLayout pageTitle="Enrollment Confirmed">
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white dark:bg-slate-900 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg w-full text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{success.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
              {success.thankYou} <span className="font-semibold text-slate-700 dark:text-slate-300">{details.name}</span>.{' '}
              {success.receivedFor} <span className="font-semibold text-slate-700 dark:text-slate-300">{course?.title}</span>.
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">{success.desc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors">
                {success.homeBtn}
              </Link>
              <Link to="/courses" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                {success.coursesBtn}
              </Link>
            </div>
          </motion.div>
        </section>
      </PageLayout>
    )
  }

  return (
    <PageLayout pageTitle="Enroll Now">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlight={hero.highlight}
        subtitle={hero.subtitle}
      />

      <section className="py-16 lg:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <StepIndicator current={step} steps={Array.isArray(steps) ? steps : []} />

          <AnimatePresence mode="wait">

            {/* ── Step 0: Choose course ─────────────────────────────────── */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{s0.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                  {s0.notSure}{' '}
                  <Link to="/contact" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                    {s0.notSureLink}
                  </Link>{' '}
                  {s0.notSureEnd}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {COURSES.map((c) => {
                    const isSelected = selectedCourse === c.slug
                    return (
                      <button
                        key={c.slug}
                        onClick={() => setSelectedCourse(c.slug)}
                        style={isSelected ? { borderColor: c.accent, backgroundColor: c.accent + '18' } : {}}
                        className={cn(
                          'relative text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer group',
                          isSelected
                            ? ''
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                        )}
                      >
                        {c.popular && (
                          <span className="absolute -top-3 left-4 px-2.5 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                            {s0.mostPopular}
                          </span>
                        )}
                        <div
                          style={{ backgroundColor: c.accent + '20', color: c.accent }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                        >
                          <c.Icon className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{c.title}</div>
                        <div style={{ color: c.accent }} className="text-xs font-semibold mb-3">{c.level}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {c.duration} · {c.sessions}
                        </div>
                        <div style={{ color: c.accent }} className="mt-3 text-lg font-bold">
                          {c.price} <span className="text-xs font-normal text-slate-400">{s0.perMonth}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 style={{ color: c.accent }} className="w-5 h-5" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={goNext}
                  disabled={!selectedCourse}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-primary-900/20 cursor-pointer"
                >
                  {s0.continueBtn}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* ── Step 1: Personal details ──────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  style={{ borderColor: course?.accent, backgroundColor: course?.accent + '10' }}
                  className="flex items-center gap-3 p-4 rounded-xl border mb-8"
                >
                  {course && <course.Icon style={{ color: course.accent }} className="w-5 h-5 shrink-0" />}
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{course?.title}</div>
                    <div style={{ color: course?.accent }} className="text-xs font-medium">
                      {course?.level} · {course?.price}{s0.perMonth}
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(0)}
                    className="ml-auto text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline cursor-pointer"
                  >
                    {s1.changeBtn}
                  </button>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{s1.title}</h2>
                <div className="flex flex-col gap-5">
                  <InputField label={s1.name} name="name" type="text" placeholder={s1.namePlaceholder} value={details.name} onChange={handleDetailsChange} error={errors.name} required />
                  <InputField label={s1.phone} name="phone" type="tel" placeholder={s1.phonePlaceholder} value={details.phone} onChange={handleDetailsChange} error={errors.phone} required />
                  <InputField label={s1.email} name="email" type="email" placeholder={s1.emailPlaceholder} value={details.email} onChange={handleDetailsChange} error={errors.email} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {s1.notes} <span className="text-slate-400 font-normal">{s1.notesOptional}</span>
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder={s1.notesPH}
                      value={details.notes}
                      onChange={handleDetailsChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(0)} className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    {s1.backBtn}
                  </button>
                  <button onClick={goNext} className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 transition-all shadow-md shadow-primary-900/20 cursor-pointer">
                    {s1.continueBtn}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Confirm & Pay ─────────────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{s2.title}</h2>

                {/* Summary */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">{s2.summaryTitle}</h3>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{s2.courseLabel}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{course?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{s2.levelLabel}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{course?.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{s2.durationLabel}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{course?.duration} · {course?.sessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{s2.nameLabel}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{details.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{s2.phoneLabel}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{details.phone}</span>
                    </div>
                    <div className="pt-3 mt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{s2.amountDue}</span>
                      <span style={{ color: course?.accent }} className="font-bold text-lg">{course?.price}</span>
                    </div>
                  </div>
                </div>

                {/* Pay in person */}
                <div className="bg-primary-50 dark:bg-primary-950/20 rounded-xl border border-primary-100 dark:border-primary-900/30 p-4 mb-6 text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-primary-800 dark:text-primary-300">{s2.payInPerson}</span>{' '}
                  {s2.payInPersonDesc}
                </div>

                {/* Agreement */}
                <label className="flex items-start gap-3 cursor-pointer mb-8">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {s2.agreePrefix}{' '}
                    <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">{s2.termsLink}</Link>
                    {' '}{s2.agreeAnd}{' '}
                    <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">{s2.privacyLink}</Link>.{' '}
                    {s2.agreeSuffix}
                  </span>
                </label>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    {s2.backBtn}
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!agreed}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-primary-900/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {s2.confirmBtn}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageLayout>
  )
}
