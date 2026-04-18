import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronRight, BookOpen, TrendingUp, Award, Briefcase, Copy, Check, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { cn } from '../utils/cn'

const COURSE_STYLES = [
  {
    slug: 'foundation',
    price: '₾180',
    Icon: BookOpen,
    accent: 'border-emerald-400 dark:border-emerald-600',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/20',
    accentText: 'text-emerald-700 dark:text-emerald-400',
    accentIcon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  },
  {
    slug: 'progressive',
    price: '₾200',
    Icon: TrendingUp,
    accent: 'border-blue-400 dark:border-blue-600',
    accentBg: 'bg-blue-50 dark:bg-blue-950/20',
    accentText: 'text-blue-700 dark:text-blue-400',
    accentIcon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
    popular: true,
  },
  {
    slug: 'mastery',
    price: '₾240',
    Icon: Award,
    accent: 'border-purple-400 dark:border-purple-600',
    accentBg: 'bg-purple-50 dark:bg-purple-950/20',
    accentText: 'text-purple-700 dark:text-purple-400',
    accentIcon: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400',
  },
  {
    slug: 'business',
    price: '₾220',
    Icon: Briefcase,
    accent: 'border-amber-400 dark:border-amber-600',
    accentBg: 'bg-amber-50 dark:bg-amber-950/20',
    accentText: 'text-amber-700 dark:text-amber-400',
    accentIcon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  },
]

const BANK_DETAILS = {
  bank: 'TBC Bank',
  accountName: 'Kutaisi English Academy LLC',
  iban: 'GE29TB7522345678901234',
  currency: 'GEL (₾)',
}

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

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
    </button>
  )
}

const INITIAL_DETAILS = { name: '', phone: '', email: '', notes: '' }

export function EnrollPage() {
  const { t } = useTranslation()
  const hero = t('enrollPage.pageHero', { returnObjects: true })
  const steps = t('enrollPage.steps', { returnObjects: true })
  const courseTexts = t('enrollPage.courses', { returnObjects: true })
  const s0 = t('enrollPage.step0', { returnObjects: true })
  const s1 = t('enrollPage.step1', { returnObjects: true })
  const s2 = t('enrollPage.step2', { returnObjects: true })
  const success = t('enrollPage.success', { returnObjects: true })

  const COURSES = COURSE_STYLES.map((style) => ({
    ...style,
    title: courseTexts?.[style.slug]?.title || style.slug,
    level: courseTexts?.[style.slug]?.level || '',
    badge: courseTexts?.[style.slug]?.badge || '',
    duration: courseTexts?.[style.slug]?.duration || '',
    sessions: courseTexts?.[style.slug]?.sessions || '',
  }))

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

  const bankLabels = s2.bankLabels || {}

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
              {success.thankYou} <span className="font-semibold text-slate-700 dark:text-slate-300">{details.name}</span>. {success.receivedFor} <span className="font-semibold text-slate-700 dark:text-slate-300">{course?.title}</span>.
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">{success.desc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 transition-colors"
              >
                {success.homeBtn}
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
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
            {/* Step 0: Choose course */}
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
                        className={cn(
                          'relative text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer group',
                          isSelected
                            ? `${c.accent} ${c.accentBg}`
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                        )}
                      >
                        {c.popular && (
                          <span className="absolute -top-3 left-4 px-2.5 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                            {s0.mostPopular}
                          </span>
                        )}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.accentIcon}`}>
                          <c.Icon className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{c.title}</div>
                        <div className={`text-xs font-semibold mb-3 ${c.accentText}`}>{c.level}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                          <div>{c.duration} · {c.sessions}</div>
                        </div>
                        <div className={`mt-3 text-lg font-bold ${c.accentText}`}>
                          {c.price} <span className="text-xs font-normal text-slate-400">{s0.perMonth}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className={`w-5 h-5 ${c.accentText}`} />
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

            {/* Step 1: Personal details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={cn('flex items-center gap-3 p-4 rounded-xl border mb-8', course?.accentBg, course?.accent)}>
                  {course && <course.Icon className={`w-5 h-5 ${course.accentText}`} />}
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{course?.title}</div>
                    <div className={`text-xs ${course?.accentText}`}>{course?.level} · {course?.price}{s0.perMonth}</div>
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
                  <InputField
                    label={s1.name}
                    name="name"
                    type="text"
                    placeholder={s1.namePlaceholder}
                    value={details.name}
                    onChange={handleDetailsChange}
                    error={errors.name}
                    required
                  />
                  <InputField
                    label={s1.phone}
                    name="phone"
                    type="tel"
                    placeholder={s1.phonePlaceholder}
                    value={details.phone}
                    onChange={handleDetailsChange}
                    error={errors.phone}
                    required
                  />
                  <InputField
                    label={s1.email}
                    name="email"
                    type="email"
                    placeholder={s1.emailPlaceholder}
                    value={details.email}
                    onChange={handleDetailsChange}
                    error={errors.email}
                  />
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
                  <button
                    onClick={() => setStep(0)}
                    className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {s1.backBtn}
                  </button>
                  <button
                    onClick={goNext}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-900 text-white rounded-xl font-semibold text-sm hover:bg-primary-800 transition-all shadow-md shadow-primary-900/20 cursor-pointer"
                  >
                    {s1.continueBtn}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Confirm & Pay */}
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
                      <span className={`font-bold text-lg ${course?.accentText}`}>{course?.price}</span>
                    </div>
                  </div>
                </div>

                {/* Bank transfer */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">{s2.bankTitle}</h3>
                  <div className="flex flex-col gap-3 text-sm">
                    {[
                      ['Bank', BANK_DETAILS.bank],
                      ['Account Name', BANK_DETAILS.accountName],
                      ['IBAN', BANK_DETAILS.iban],
                      ['Currency', BANK_DETAILS.currency],
                    ].map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 dark:text-slate-400 shrink-0">{bankLabels[key] || key}</span>
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="font-mono font-semibold text-slate-900 dark:text-white truncate">{value}</span>
                          <CopyButton text={value} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 leading-relaxed">{s2.bankRef}</p>
                </div>

                {/* Or pay in person */}
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
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
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
