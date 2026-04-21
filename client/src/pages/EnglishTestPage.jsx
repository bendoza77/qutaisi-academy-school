import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, RotateCcw, Trophy, BookOpen, Zap } from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'
import { useSiteData } from '../context/SiteDataContext'

const CEFR_CONFIG = {
  A1: { label: 'A1 – Beginner',      color: '#10b981', bg: '#d1fae5', desc: 'You know basic greetings and simple phrases. The Foundation English course is the perfect place to start your journey.' },
  A2: { label: 'A2 – Elementary',    color: '#3b82f6', bg: '#dbeafe', desc: 'You can handle simple conversations and familiar topics. Foundation English will sharpen these skills and prepare you for B1.' },
  B1: { label: 'B1 – Intermediate',  color: '#8b5cf6', bg: '#ede9fe', desc: 'You can deal with most everyday situations in English. Progressive English will take you to the next level with fluency and accuracy.' },
  B2: { label: 'B2 – Upper-Intermediate', color: '#f59e0b', bg: '#fef3c7', desc: 'You communicate effectively on a wide range of topics. Progressive English (Advanced Track) or Mastery English will unlock C-level proficiency.' },
  C1: { label: 'C1 – Advanced',      color: '#ef4444', bg: '#fee2e2', desc: 'You express yourself fluently and spontaneously. Mastery English will refine your academic and professional communication to near-native level.' },
  C2: { label: 'C2 – Proficient',    color: '#7c3aed', bg: '#f3e8ff', desc: 'You have mastered English at the highest level. Mastery English or Business English will help you excel in any professional context.' },
}

const COURSE_FOR_LEVEL = {
  A1: 'foundation',
  A2: 'foundation',
  B1: 'progressive',
  B2: 'progressive',
  C1: 'mastery',
  C2: 'mastery',
}

function getLevel(answers, questions) {
  const correct = answers.filter((a, i) => a === questions[i]?.correct)
  const score = correct.length
  const pct = score / questions.length

  if (pct <= 0.20) return 'A1'
  if (pct <= 0.35) return 'A2'
  if (pct <= 0.50) return 'B1'
  if (pct <= 0.65) return 'B2'
  if (pct <= 0.80) return 'C1'
  return 'C2'
}

// ─── Start Screen ─────────────────────────────────────────────────────────────

function StartScreen({ data, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-20 text-center"
    >
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
        <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
        <Zap className="w-3.5 h-3.5" />
        {data.subtitle || 'Free placement test · 20 questions · 5 minutes'}
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
        {data.title || 'Find Your English Level'}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
        {data.description || 'Answer 20 carefully selected questions to discover your CEFR English level — from A1 Beginner to C2 Proficient.'}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
        {[
          { value: '20', label: 'Questions' },
          { value: '~5 min', label: 'Duration' },
          { value: 'A1–C2', label: 'Scale' },
        ].map(({ value, label }) => (
          <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
            <div className="text-xl font-bold text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">
        {data.instructions || 'Read each question carefully and choose the best answer.'}
      </p>

      <button
        onClick={onStart}
        className="inline-flex items-center gap-2.5 px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl text-lg transition-colors shadow-lg shadow-blue-700/20"
      >
        Start the Test
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  )
}

// ─── Question Screen ──────────────────────────────────────────────────────────

function QuestionScreen({ questions, current, selected, onSelect, onNext, onPrev }) {
  const q = questions[current]
  const total = questions.length
  const progress = ((current) / total) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
          <span>Question {current + 1} of {total}</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {q.level} · {q.category}
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
              {q.text}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === i
              return (
                <button
                  key={i}
                  onClick={() => onSelect(i)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium text-sm flex items-center gap-4 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  {opt}
                </button>
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
          className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium disabled:opacity-30 hover:border-slate-300 dark:hover:border-slate-600 transition-colors disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={selected === null}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors"
        >
          {current === questions.length - 1 ? 'See Results' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({ level, score, total, questions, answers, siteData, onRetake }) {
  const config = CEFR_CONFIG[level]
  const recommendedSlug = COURSE_FOR_LEVEL[level]
  const recommendedCourse = siteData.courses?.find(c => c.slug === recommendedSlug)

  const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const levelIdx = cefrLevels.indexOf(level)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      {/* Trophy */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: config.bg }}
        >
          <Trophy className="w-10 h-10" style={{ color: config.color }} />
        </motion.div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Your Result</p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-1"
          style={{ color: config.color }}
        >
          {config.label}
        </motion.h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          You answered <strong className="text-slate-800 dark:text-slate-200">{score} out of {total}</strong> questions correctly
        </p>
      </div>

      {/* CEFR scale */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">CEFR Scale</p>
        <div className="flex gap-1.5">
          {cefrLevels.map((lvl, i) => (
            <div key={lvl} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`w-full h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${i === levelIdx ? 'scale-110 shadow-md' : 'opacity-40'}`}
                style={i === levelIdx ? { backgroundColor: config.color, color: '#fff' } : { backgroundColor: '#e2e8f0', color: '#64748b' }}
              >
                {lvl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: config.color }} />
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{config.desc}</p>
        </div>
      </div>

      {/* Recommended course */}
      {recommendedCourse && (
        <div className="rounded-2xl border-2 p-6 mb-8" style={{ borderColor: recommendedCourse.accent || config.color, backgroundColor: (recommendedCourse.accent || config.color) + '10' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: recommendedCourse.accent || config.color }}>
            Recommended Course
          </p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-lg">{recommendedCourse.title}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{recommendedCourse.level}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{recommendedCourse.description}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${recommendedCourse.badgeColor || 'bg-blue-100 text-blue-700'}`}>
              {recommendedCourse.badge}
            </span>
          </div>
          <div className="flex gap-3 mt-5">
            <Link
              to={`/courses/${recommendedCourse.slug}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: recommendedCourse.accent || config.color }}
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
        </div>
      )}

      {/* Retake */}
      <div className="text-center">
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Retake the Test
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function EnglishTestPage() {
  const { siteData } = useSiteData()
  const data = siteData.englishTest || {}
  const questions = data.questions || []

  const [phase, setPhase] = useState('start') // start | test | result
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)

  const start = () => {
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    setPhase('test')
  }

  const select = (i) => setSelected(i)

  const next = () => {
    const newAnswers = [...answers]
    newAnswers[current] = selected
    setAnswers(newAnswers)

    if (current === questions.length - 1) {
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
                onSelect={select}
                onNext={next}
                onPrev={prev}
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
                onRetake={retake}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  )
}
