import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw,
  Trophy, BookOpen, Zap, Clock, Target, BarChart2,
  ChevronDown, ChevronUp, Copy, Check,
} from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'
import { useSiteData } from '../context/SiteDataContext'

// ─── CEFR Configuration ───────────────────────────────────────────────────────

const CEFR_CONFIG = {
  A1: {
    label: 'A1 – Beginner',
    color: '#10b981',
    ring: '#6ee7b7',
    bg: '#d1fae5',
    text: 'text-emerald-700',
    desc: 'You know basic greetings and simple phrases. Our Foundation English course is the perfect starting point — you\'ll build confidence fast.',
    can: ['Introduce yourself', 'Use basic phrases', 'Understand very slow speech'],
    next: 'Foundation English (A1–A2)',
  },
  A2: {
    label: 'A2 – Elementary',
    color: '#3b82f6',
    ring: '#93c3fd',
    bg: '#dbeafe',
    text: 'text-blue-700',
    desc: 'You can handle simple conversations on familiar topics. Foundation English will sharpen these skills and prepare you for B1.',
    can: ['Describe your routine', 'Handle simple transactions', 'Understand common phrases'],
    next: 'Foundation English (A1–A2)',
  },
  B1: {
    label: 'B1 – Intermediate',
    color: '#8b5cf6',
    ring: '#c4b5fd',
    bg: '#ede9fe',
    text: 'text-violet-700',
    desc: 'You can deal with most everyday situations in English. Progressive English will take you to the next level with fluency and accuracy.',
    can: ['Travel and handle unexpected situations', 'Discuss familiar topics', 'Write simple connected texts'],
    next: 'Progressive English (B1–B2)',
  },
  B2: {
    label: 'B2 – Upper-Intermediate',
    color: '#f59e0b',
    ring: '#fcd34d',
    bg: '#fef3c7',
    text: 'text-amber-700',
    desc: 'You communicate effectively on a wide range of topics. Progressive English (Advanced Track) or Mastery English will unlock C-level proficiency.',
    can: ['Understand complex texts', 'Interact fluently with native speakers', 'Produce clear, detailed writing'],
    next: 'Progressive English (B1–B2)',
  },
  C1: {
    label: 'C1 – Advanced',
    color: '#ef4444',
    ring: '#fca5a5',
    bg: '#fee2e2',
    text: 'text-red-700',
    desc: 'You express yourself fluently and spontaneously. Mastery English will refine your academic and professional communication to near-native level.',
    can: ['Use language flexibly for any purpose', 'Express ideas spontaneously', 'Understand implicit meaning'],
    next: 'Mastery English (C1–C2)',
  },
  C2: {
    label: 'C2 – Proficient',
    color: '#7c3aed',
    ring: '#c4b5fd',
    bg: '#f3e8ff',
    text: 'text-purple-700',
    desc: 'You have mastered English at the highest level. Mastery English or Business English will help you excel in any professional context.',
    can: ['Understand everything with ease', 'Express yourself spontaneously', 'Distinguish fine shades of meaning'],
    next: 'Mastery English (C1–C2)',
  },
}

const COURSE_FOR_LEVEL = { A1: 'foundation', A2: 'foundation', B1: 'progressive', B2: 'progressive', C1: 'mastery', C2: 'mastery' }
const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

function getLevel(answers, questions) {
  const correct = answers.filter((a, i) => a === questions[i]?.correct)
  const pct = correct.length / questions.length
  if (pct <= 0.20) return 'A1'
  if (pct <= 0.35) return 'A2'
  if (pct <= 0.50) return 'B1'
  if (pct <= 0.65) return 'B2'
  if (pct <= 0.80) return 'C1'
  return 'C2'
}

function useElapsedTime(running) {
  const [elapsed, setElapsed] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setElapsed(s => s + 1), 1000)
    } else {
      clearInterval(ref.current)
    }
    return () => clearInterval(ref.current)
  }, [running])
  const reset = () => setElapsed(0)
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  return { elapsed, reset, fmt }
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function Counter({ to, duration = 1200 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = null
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setVal(Math.round(progress * to))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <>{val}</>
}

// ─── Start Screen ─────────────────────────────────────────────────────────────

function StartScreen({ data, onStart }) {
  const total = data.questions?.length || 20
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 py-16 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 18 }}
        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/30"
      >
        <BookOpen className="w-12 h-12 text-white" />
      </motion.div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-xs font-bold mb-6 tracking-wide uppercase">
        <Zap className="w-3.5 h-3.5" />
        Free Placement Test
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
        {data.title || 'Find Your'}
        <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          English Level
        </span>
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
        {data.description || `Answer ${total} carefully selected questions to discover your CEFR English level — from A1 Beginner to C2 Proficient.`}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto">
        {[
          { icon: Target, value: `${total}`, label: 'Questions' },
          { icon: Clock, value: '~5 min', label: 'Duration' },
          { icon: BarChart2, value: 'A1–C2', label: 'CEFR Scale' },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <Icon className="w-4 h-4 text-blue-500 mx-auto mb-1.5" />
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      {/* CEFR level pills preview */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {CEFR_ORDER.map((lvl) => (
          <span
            key={lvl}
            className="px-3 py-1 rounded-full text-xs font-bold border"
            style={{ backgroundColor: CEFR_CONFIG[lvl].bg, color: CEFR_CONFIG[lvl].color, borderColor: CEFR_CONFIG[lvl].ring }}
          >
            {lvl}
          </span>
        ))}
      </div>

      {/* Instructions */}
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">
        {data.instructions || 'Read each question carefully and choose the best answer. No time limit — take your time.'}
      </p>

      <button
        onClick={onStart}
        className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-2xl text-lg transition-all shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
      >
        Start the Test
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  )
}

// ─── Question Screen ──────────────────────────────────────────────────────────

const CATEGORY_COLORS = {
  Grammar: { bg: '#dbeafe', color: '#1d4ed8', label: 'Grammar' },
  Vocabulary: { bg: '#fef3c7', color: '#b45309', label: 'Vocabulary' },
  Reading: { bg: '#d1fae5', color: '#065f46', label: 'Reading' },
  Listening: { bg: '#fce7f3', color: '#9d174d', label: 'Listening' },
}

const LEVEL_COLORS = {
  A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#f59e0b', C1: '#ef4444', C2: '#7c3aed',
}

function QuestionScreen({ questions, current, selected, answers, onSelect, onNext, onPrev, elapsed, fmt }) {
  const q = questions[current]
  const total = questions.length
  const progress = (current / total) * 100
  const answered = answers.filter(a => a !== undefined && a !== null).length
  const catStyle = CATEGORY_COLORS[q.category] || { bg: '#f1f5f9', color: '#475569' }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {current + 1} <span className="text-slate-300 dark:text-slate-600">/ {total}</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            {fmt(elapsed)}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: catStyle.bg, color: catStyle.color }}
          >
            {q.category}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            style={{ color: LEVEL_COLORS[q.level] }}
          >
            {q.level}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Question card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-7 mb-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
              {q.text}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === i
              return (
                <motion.button
                  key={i}
                  onClick={() => onSelect(i)}
                  whileTap={{ scale: 0.985 }}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium text-sm flex items-center gap-4 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  <span className={isSelected ? 'text-blue-900 dark:text-blue-200' : 'text-slate-700 dark:text-slate-300'}>
                    {opt}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={onPrev}
          disabled={current === 0}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium disabled:opacity-30 hover:border-slate-300 dark:hover:border-slate-600 transition-colors disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Dot indicator (compact) */}
        <div className="hidden sm:flex items-center gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === current
                  ? 'w-5 h-2 bg-blue-600'
                  : answers[i] !== undefined && answers[i] !== null
                  ? 'w-2 h-2 bg-emerald-400'
                  : 'w-2 h-2 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={selected === null || selected === undefined}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/20"
        >
          {current === questions.length - 1 ? 'See Results' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Answered count */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-5">
        {answered} of {total} questions answered
      </p>
    </div>
  )
}

// ─── Review toggle ────────────────────────────────────────────────────────────

function AnswerReview({ questions, answers }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Review All Answers</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-3">
              {questions.map((q, i) => {
                const userAns = answers[i]
                const correct = q.correct
                const isCorrect = userAns === correct
                return (
                  <div key={q.id} className={`rounded-xl p-4 border ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'}`}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {isCorrect
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          : <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 leading-snug">
                          <span className="text-slate-400 dark:text-slate-500 mr-1.5">{i + 1}.</span>
                          {q.text}
                        </p>
                        <div className="text-xs space-y-1">
                          <p>
                            <span className="font-semibold text-slate-500 dark:text-slate-400">Your answer: </span>
                            <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-red-700 dark:text-red-400 font-semibold line-through'}>
                              {userAns !== null && userAns !== undefined ? q.options[userAns] : '—'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="font-semibold text-slate-500 dark:text-slate-400">Correct: </span>
                              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{q.options[correct]}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({ level, score, total, questions, answers, siteData, elapsed, fmt, onRetake }) {
  const config = CEFR_CONFIG[level]
  const recommendedSlug = COURSE_FOR_LEVEL[level]
  const recommendedCourse = siteData.courses?.find(c => c.slug === recommendedSlug)
  const levelIdx = CEFR_ORDER.indexOf(level)
  const pct = Math.round((score / total) * 100)
  const [copied, setCopied] = useState(false)

  // Category breakdown
  const categories = {}
  questions.forEach((q, i) => {
    if (!categories[q.category]) categories[q.category] = { total: 0, correct: 0 }
    categories[q.category].total++
    if (answers[i] === q.correct) categories[q.category].correct++
  })

  const copyResult = () => {
    const text = `I just took the English Level Test at Kutaisi English Academy and scored ${config.label} — ${score}/${total} correct (${pct}%). Take the free test at: ${window.location.href}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 16 }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
          style={{ backgroundColor: config.bg, boxShadow: `0 20px 60px ${config.color}30` }}
        >
          <Trophy className="w-12 h-12" style={{ color: config.color }} />
        </motion.div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Your Result</p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl font-extrabold mb-1"
          style={{ color: config.color }}
        >
          {level}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-semibold text-slate-600 dark:text-slate-400"
        >
          {config.label.split(' – ')[1]}
        </motion.p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Score', value: <><Counter to={score} /><span className="text-slate-400 dark:text-slate-500 text-lg">/{total}</span></> },
          { label: 'Accuracy', value: <><Counter to={pct} />%</> },
          { label: 'Time', value: fmt(elapsed) },
        ].map(({ label, value }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center shadow-sm"
          >
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* CEFR Scale */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-5"
      >
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">CEFR Scale</p>
        <div className="flex gap-1.5">
          {CEFR_ORDER.map((lvl, i) => {
            const active = i === levelIdx
            const below = i < levelIdx
            return (
              <div key={lvl} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div
                  initial={active ? { scale: 0.7 } : {}}
                  animate={active ? { scale: 1.12 } : {}}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className={`w-full h-9 rounded-lg flex items-center justify-center text-xs font-black transition-all ${!active && !below ? 'opacity-25' : ''}`}
                  style={
                    active
                      ? { backgroundColor: CEFR_CONFIG[lvl].color, color: '#fff', boxShadow: `0 4px 16px ${CEFR_CONFIG[lvl].color}50` }
                      : below
                      ? { backgroundColor: CEFR_CONFIG[lvl].color + '30', color: CEFR_CONFIG[lvl].color }
                      : { backgroundColor: '#e2e8f0', color: '#94a3b8' }
                  }
                >
                  {lvl}
                </motion.div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Skill breakdown */}
      {Object.keys(categories).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-5"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Skill Breakdown</p>
          <div className="flex flex-col gap-4">
            {Object.entries(categories).map(([cat, data]) => {
              const catPct = Math.round((data.correct / data.total) * 100)
              const catStyle = CATEGORY_COLORS[cat] || { bg: '#f1f5f9', color: '#475569' }
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{cat}</span>
                    <span className="font-bold text-slate-500 dark:text-slate-400">{data.correct}/{data.total}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${catPct}%` }}
                      transition={{ delay: 0.7, duration: 0.7, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: catStyle.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Level description */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border p-6 mb-5"
        style={{ borderColor: config.color + '40', backgroundColor: config.bg + '60' }}
      >
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: config.color }} />
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{config.desc}</p>
        </div>
        <div className="pt-4 border-t" style={{ borderColor: config.color + '25' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: config.color }}>At this level you can…</p>
          <ul className="space-y-1.5">
            {config.can.map(c => (
              <li key={c} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Recommended course */}
      {recommendedCourse && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="rounded-2xl border-2 p-6 mb-6"
          style={{ borderColor: recommendedCourse.accent || config.color, backgroundColor: (recommendedCourse.accent || config.color) + '08' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: recommendedCourse.accent || config.color }}>
            Recommended for You
          </p>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white text-xl">{recommendedCourse.title}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{recommendedCourse.level}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">{recommendedCourse.description}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${recommendedCourse.badgeColor || 'bg-blue-100 text-blue-700'}`}>
              {recommendedCourse.badge}
            </span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              to={`/courses/${recommendedCourse.slug}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: recommendedCourse.accent || config.color, boxShadow: `0 4px 14px ${(recommendedCourse.accent || config.color)}35` }}
            >
              View Course <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/enroll"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              style={{ borderColor: recommendedCourse.accent || config.color, color: recommendedCourse.accent || config.color }}
            >
              Enroll Now
            </Link>
          </div>
        </motion.div>
      )}

      {/* Answer review */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-6"
      >
        <AnswerReview questions={questions} answers={answers} />
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-semibold hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Retake the Test
        </button>
        <button
          onClick={copyResult}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Share My Result'}
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function EnglishTestPage() {
  const { siteData } = useSiteData()
  const data = siteData.englishTest || {}
  const questions = data.questions || []

  const [phase, setPhase] = useState('start')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const { elapsed, reset: resetTimer, fmt } = useElapsedTime(phase === 'test')
  const [finalTime, setFinalTime] = useState(0)

  const start = () => {
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    resetTimer()
    setPhase('test')
  }

  const select = (i) => setSelected(i)

  const next = () => {
    const newAnswers = [...answers]
    newAnswers[current] = selected
    setAnswers(newAnswers)
    if (current === questions.length - 1) {
      setFinalTime(elapsed)
      setPhase('result')
    } else {
      setSelected(newAnswers[current + 1] ?? null)
      setCurrent(c => c + 1)
    }
  }

  const prev = () => {
    const newAnswers = [...answers]
    newAnswers[current] = selected
    setAnswers(newAnswers)
    setSelected(newAnswers[current - 1] ?? null)
    setCurrent(c => c - 1)
  }

  const retake = () => {
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    resetTimer()
    setFinalTime(0)
    setPhase('start')
  }

  const level = phase === 'result' ? getLevel(answers, questions) : null
  const score = phase === 'result' ? answers.filter((a, i) => a === questions[i]?.correct).length : 0

  return (
    <PageLayout pageTitle="English Level Test">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-16">
        <AnimatePresence mode="wait">
          {phase === 'start' && (
            <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StartScreen data={data} onStart={start} />
            </motion.div>
          )}
          {phase === 'test' && (
            <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuestionScreen
                questions={questions}
                current={current}
                selected={selected}
                answers={answers}
                onSelect={select}
                onNext={next}
                onPrev={prev}
                elapsed={elapsed}
                fmt={fmt}
              />
            </motion.div>
          )}
          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultsScreen
                level={level}
                score={score}
                total={questions.length}
                questions={questions}
                answers={answers}
                siteData={siteData}
                elapsed={finalTime}
                fmt={fmt}
                onRetake={retake}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  )
}
