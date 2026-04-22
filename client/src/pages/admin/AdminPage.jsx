import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Image, Info, BarChart2, BookOpen, Users, MessageSquare,
  Star, Phone, Megaphone, LogOut, Menu, X, Save, RotateCcw, Plus, Trash2,
  Edit3, Eye, Settings, Shield, FileText, HelpCircle, GraduationCap,
  MessageCircle, Layers, BookMarked, Newspaper, Upload, Trash
} from 'lucide-react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { auth, storage } from '../../firebase'
import { AdminBlogSection } from './AdminBlogSection'
import { useSiteData, DEFAULT_SITE_DATA } from '../../context/SiteDataContext'
import kaT from '../../i18n/locales/ka/translation.json'

// ─── Reusable UI ────────────────────────────────────────────────────────────

function Field({ label, value, onChange, type = 'text', rows, placeholder, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-y"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
      )}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

function ArrayField({ label, items, onChange, placeholder }) {
  const { t } = useTranslation()
  const ph = placeholder || t('admin.add')
  const add = () => onChange([...items, ''])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i, val) => onChange(items.map((x, idx) => idx === i ? val : x))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
          <Plus className="w-3.5 h-3.5" /> {t('admin.add')}
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={ph}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
          <button onClick={() => remove(i)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

function SaveBar({ onSave, onReset, saved }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
      <button
        onClick={onSave}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
      >
        <Save className="w-4 h-4" />
        {t('admin.saveChanges')}
      </button>
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-sm font-medium transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        {t('admin.resetDefault')}
      </button>
      {saved && (
        <span className="text-sm text-emerald-600 font-medium animate-pulse">{t('admin.saved')}</span>
      )}
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
        </div>
      )}
      <div className="p-6 flex flex-col gap-5">{children}</div>
    </div>
  )
}

function LangTabs({ lang, setLang }) {
  const { t } = useTranslation()
  return (
    <div className="flex gap-2 border-b border-slate-100 pb-4">
      <button
        onClick={() => setLang('en')}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${lang === 'en' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      >
        {t('admin.english')}
      </button>
      <button
        onClick={() => setLang('ka')}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${lang === 'ka' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      >
        {t('admin.georgian')}
      </button>
    </div>
  )
}

// ─── Firebase error messages ─────────────────────────────────────────────────

function firebaseError(code) {
  const map = {
    'auth/invalid-email':          'Invalid email address.',
    'auth/user-not-found':         'No account found with this email.',
    'auth/wrong-password':         'Incorrect password.',
    'auth/email-already-in-use':   'An account with this email already exists.',
    'auth/weak-password':          'Password must be at least 6 characters.',
    'auth/too-many-requests':      'Too many attempts. Try again later.',
    'auth/invalid-credential':     'Invalid email or password.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return map[code] || 'Authentication error. Please try again.'
}

// ─── Login ───────────────────────────────────────────────────────────────────

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (err) {
      setError(firebaseError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Kutaisi English Academy</div>
              <div className="text-xs text-slate-400">Admin Panel</div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="admin@example.com"
                autoFocus
                required
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <p className="text-xs text-rose-600 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors mt-1"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function DashboardSection() {
  const { t } = useTranslation()
  const { siteData } = useSiteData()
  const stats = [
    { label: t('admin.dashboard.statCourses'),      value: siteData.courses.length,      color: 'bg-blue-50 text-blue-700' },
    { label: t('admin.dashboard.statTeachers'),     value: siteData.teachers.length,     color: 'bg-purple-50 text-purple-700' },
    { label: t('admin.dashboard.statTestimonials'), value: siteData.testimonials.length, color: 'bg-emerald-50 text-emerald-700' },
    { label: t('admin.dashboard.statBenefits'),     value: siteData.benefits.length,     color: 'bg-amber-50 text-amber-700' },
  ]

  const tips = t('admin.dashboard.tips', { returnObjects: true })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('admin.dashboard.title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('admin.dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <div className={`text-3xl font-bold mb-1 ${s.color.split(' ')[1]}`}>{s.value}</div>
            <div className="text-xs text-slate-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <Card title={t('admin.dashboard.quickGuide')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
          {['✏️','💾','↩️','👁️'].map((icon, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-xl shrink-0">{icon}</span>
              <span>{Array.isArray(tips) ? tips[i] : ''}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const { t } = useTranslation()
  const { siteData, updateSection, resetSection } = useSiteData()
  const [data, setData] = useState(siteData.hero)
  const [lang, setLang] = useState('en')
  const [saved, setSaved] = useState(false)

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))
  const setKa = (key, val) => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), [key]: val } }))

  const save = () => {
    updateSection('hero', data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('hero')
    setData(DEFAULT_SITE_DATA.hero)
  }

  const ka = data.ka || {}

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.hero.title')}</h1>
      <LangTabs lang={lang} setLang={setLang} />

      {lang === 'en' ? (
        <>
          <Card title={t('admin.hero.mainContent')}>
            <Field label={t('admin.hero.badgeText')} value={data.badge} onChange={v => set('badge', v)} />
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.hero.titleLabel')} value={data.title} onChange={v => set('title', v)} />
              <Field label={t('admin.hero.titleHighlight')} value={data.titleHighlight} onChange={v => set('titleHighlight', v)} />
            </div>
            <Field label={t('admin.hero.subtitle')} value={data.subtitle} onChange={v => set('subtitle', v)} rows={3} />
          </Card>
          <Card title={t('admin.hero.trustBadges')}>
            <ArrayField label={t('admin.hero.badgesHint')} items={data.trustBadges} onChange={v => set('trustBadges', v)} placeholder="e.g. 1200+ Students" />
          </Card>
        </>
      ) : (
        <Card title={t('admin.hero.georgianContent')}>
          <Field label={t('admin.hero.badgeText')} value={ka.badge || kaT.hero.badge} onChange={v => setKa('badge', v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.hero.titleLabel')} value={ka.title || kaT.hero.title} onChange={v => setKa('title', v)} />
            <Field label={t('admin.hero.titleHighlight')} value={ka.titleHighlight || kaT.hero.titleHighlight} onChange={v => setKa('titleHighlight', v)} />
          </div>
          <Field label={t('admin.hero.subtitle')} value={ka.subtitle || kaT.hero.subtitle} onChange={v => setKa('subtitle', v)} rows={3} />
          <ArrayField label={t('admin.hero.trustBadges')} items={ka.trustBadges || kaT.hero.trustBadges} onChange={v => setKa('trustBadges', v)} />
        </Card>
      )}

      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  const { t } = useTranslation()
  const { siteData, updateSection, resetSection } = useSiteData()
  const [data, setData] = useState(siteData.about)
  const [lang, setLang] = useState('en')
  const [saved, setSaved] = useState(false)

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))
  const setKa = (key, val) => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), [key]: val } }))

  const save = () => {
    updateSection('about', data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('about')
    setData(DEFAULT_SITE_DATA.about)
  }

  const ka = data.ka || {}

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.about.title')}</h1>
      <LangTabs lang={lang} setLang={setLang} />

      {lang === 'en' ? (
        <>
          <Card title={t('admin.about.heading')}>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.hero.titleLabel')} value={data.title} onChange={v => set('title', v)} />
              <Field label={t('admin.hero.titleHighlight')} value={data.titleHighlight} onChange={v => set('titleHighlight', v)} />
            </div>
            <Field label={t('admin.courses.description')} value={data.description} onChange={v => set('description', v)} rows={3} />
          </Card>
          <Card title={t('admin.about.highlights')}>
            <ArrayField label="" items={data.highlights} onChange={v => set('highlights', v)} placeholder="Add highlight point…" />
          </Card>
          <Card title={t('admin.about.quoteBlock')}>
            <Field label={t('admin.about.quote')} value={data.quote} onChange={v => set('quote', v)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.about.founderName')} value={data.founder} onChange={v => set('founder', v)} />
              <Field label={t('admin.about.founderTitle')} value={data.founderTitle} onChange={v => set('founderTitle', v)} />
            </div>
          </Card>
        </>
      ) : (
        <Card title={t('admin.about.georgianContent')}>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.hero.titleLabel')} value={ka.title || kaT.about.title} onChange={v => setKa('title', v)} />
            <Field label={t('admin.hero.titleHighlight')} value={ka.titleHighlight || kaT.about.titleHighlight} onChange={v => setKa('titleHighlight', v)} />
          </div>
          <Field label={t('admin.courses.description')} value={ka.description || kaT.about.description} onChange={v => setKa('description', v)} rows={3} />
          <ArrayField label={t('admin.about.highlights')} items={ka.highlights || kaT.about.highlights} onChange={v => setKa('highlights', v)} />
          <Field label={t('admin.about.quote')} value={ka.quote || kaT.about.quote} onChange={v => setKa('quote', v)} rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.about.founderName')} value={ka.founder || kaT.about.founder} onChange={v => setKa('founder', v)} />
            <Field label={t('admin.about.founderTitle')} value={ka.founderTitle || kaT.about.founderTitle} onChange={v => setKa('founderTitle', v)} />
          </div>
        </Card>
      )}

      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Stats Section ────────────────────────────────────────────────────────────

function StatsSection() {
  const { t } = useTranslation()
  const { siteData, updateSection, resetSection } = useSiteData()
  const [stats, setStats] = useState(siteData.stats)
  const [saved, setSaved] = useState(false)

  const updateStat = (i, key, val) => {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: key === 'value' ? Number(val) : val } : s))
  }

  const save = () => {
    updateSection('stats', stats)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('stats')
    setStats(DEFAULT_SITE_DATA.stats)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.stats.title')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <Card key={s.id} title={`${t('admin.stats.stat')} ${i + 1}`}>
            <div className="grid grid-cols-3 gap-3">
              <Field label={t('admin.stats.value')} type="number" value={s.value} onChange={v => updateStat(i, 'value', v)} />
              <Field label={t('admin.stats.suffix')} value={s.suffix} onChange={v => updateStat(i, 'suffix', v)} placeholder="+ or %" />
              <div className="col-span-3">
                <Field label={t('admin.stats.label')} value={s.label} onChange={v => updateStat(i, 'label', v)} />
              </div>
              <div className="col-span-3">
                <Field label={t('admin.stats.labelKa')} value={s.labelKa || [kaT.stats.students, kaT.stats.teachers, kaT.stats.years, kaT.stats.success][i] || ''} onChange={v => updateStat(i, 'labelKa', v)} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Courses Section ──────────────────────────────────────────────────────────

// ─── Course Modal ─────────────────────────────────────────────────────────────

const COURSE_ICONS = [
  'BookOpen', 'TrendingUp', 'Award', 'Briefcase', 'Star',
  'Zap', 'Target', 'Globe', 'GraduationCap', 'Layers',
]

const COURSE_BADGE_COLORS = [
  { label: 'Green',  value: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  { label: 'Blue',   value: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-500' },
  { label: 'Purple', value: 'bg-purple-100 text-purple-700',   dot: 'bg-purple-500' },
  { label: 'Amber',  value: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-500' },
  { label: 'Rose',   value: 'bg-rose-100 text-rose-700',       dot: 'bg-rose-500' },
  { label: 'Cyan',   value: 'bg-cyan-100 text-cyan-700',       dot: 'bg-cyan-500' },
  { label: 'Indigo', value: 'bg-indigo-100 text-indigo-700',   dot: 'bg-indigo-500' },
  { label: 'Slate',  value: 'bg-slate-100 text-slate-700',     dot: 'bg-slate-500' },
]

const EMPTY_COURSE = {
  slug: '', icon: 'BookOpen', accent: '#2563eb',
  badgeColor: 'bg-blue-100 text-blue-700', popular: false,
  level: '', badge: '', title: '', description: '',
  duration: '', sessionsPerWeek: '', groupSize: '',
  price: '', priceNote: 'per month', features: [],
}

function CourseModal({ course, onSave, onClose }) {
  const [data, setData] = useState({ ...EMPTY_COURSE, ...course })
  const [lang, setLang] = useState('en')
  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))
  const setKa = (key, val) => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), [key]: val } }))
  const ka = data.ka || {}
  const isNew = !course.id

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl my-8">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: data.accent + '20', color: data.accent }}>
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900">{isNew ? 'Add New Course' : 'Edit Course'}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <LangTabs lang={lang} setLang={setLang} />
        </div>

        <div className="p-6 flex flex-col gap-5">
          {lang === 'en' ? (
            <>
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Course Title" value={data.title} onChange={v => set('title', v)} placeholder="e.g. Foundation English" />
                <Field label="Badge Label" value={data.badge} onChange={v => set('badge', v)} placeholder="e.g. Beginner" />
                <Field label="Level" value={data.level} onChange={v => set('level', v)} placeholder="e.g. A1 – A2" />
                <Field label="Slug" value={data.slug} onChange={v => set('slug', v.toLowerCase().replace(/\s+/g, '-'))} hint="URL: /courses/[slug]" />
              </div>
              <Field label="Description" value={data.description} onChange={v => set('description', v)} rows={3} placeholder="Short course description…" />

              {/* Pricing & Schedule */}
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pricing & Schedule</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Field label="Price" value={data.price} onChange={v => set('price', v)} placeholder="₾180" />
                  <Field label="Price Note" value={data.priceNote} onChange={v => set('priceNote', v)} placeholder="per month" />
                  <Field label="Duration" value={data.duration} onChange={v => set('duration', v)} placeholder="3 months" />
                  <Field label="Sessions / Week" value={data.sessionsPerWeek} onChange={v => set('sessionsPerWeek', v)} placeholder="3× per week" />
                </div>
                <Field label="Group Size" value={data.groupSize} onChange={v => set('groupSize', v)} placeholder="Up to 8 students" />
              </div>

              {/* Style */}
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Style</p>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {COURSE_ICONS.map(icon => (
                      <button
                        key={icon}
                        onClick={() => set('icon', icon)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${data.icon === icon ? 'bg-blue-700 text-white border-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={data.accent}
                        onChange={e => set('accent', e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                      />
                      <span className="text-sm text-slate-500 font-mono">{data.accent}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Badge Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {COURSE_BADGE_COLORS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => set('badgeColor', opt.value)}
                          title={opt.label}
                          className={`w-7 h-7 rounded-lg ${opt.dot} border-2 transition-all ${data.badgeColor === opt.value ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.popular}
                    onChange={e => set('popular', e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-700"
                  />
                  <span className="text-sm font-medium text-slate-700">Mark as Most Popular</span>
                </label>
              </div>

              {/* Features */}
              <ArrayField label="What Students Learn" items={data.features} onChange={v => set('features', v)} placeholder="Add learning outcome…" />
            </>
          ) : (
            <>
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">Georgian translations are optional. Leave blank to show English.</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Course Title" value={ka.title || ''} onChange={v => setKa('title', v)} placeholder="კურსის სახელი…" />
                <Field label="Badge" value={ka.badge || ''} onChange={v => setKa('badge', v)} placeholder="დონე…" />
                <Field label="Level" value={ka.level || ''} onChange={v => setKa('level', v)} placeholder="A1 – A2" />
              </div>
              <Field label="Description" value={ka.description || ''} onChange={v => setKa('description', v)} rows={3} placeholder="კურსის აღწერა…" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Duration" value={ka.duration || ''} onChange={v => setKa('duration', v)} placeholder="3 თვე…" />
                <Field label="Sessions / Week" value={ka.sessionsPerWeek || ''} onChange={v => setKa('sessionsPerWeek', v)} placeholder="კვირაში 3×" />
              </div>
              <Field label="Group Size" value={ka.groupSize || ''} onChange={v => setKa('groupSize', v)} placeholder="მაქსიმუმ 8 სტუდენტი" />
              <ArrayField label="What Students Learn" items={ka.features || []} onChange={v => setKa('features', v)} placeholder="სასწავლო შედეგი…" />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={() => onSave(data)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" /> {isNew ? 'Add Course' : 'Save Changes'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:border-slate-300 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function CoursesSection() {
  const { siteData, updateSection, resetSection } = useSiteData()
  const [courses, setCourses] = useState(siteData.courses)
  const [modal, setModal] = useState(null)
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateSection('courses', courses)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('courses')
    setCourses(DEFAULT_SITE_DATA.courses)
  }

  const handleSave = (data) => {
    if (data.id) {
      setCourses(prev => prev.map(c => c.id === data.id ? data : c))
    } else {
      const newId = Math.max(0, ...courses.map(c => c.id)) + 1
      setCourses(prev => [...prev, { ...data, id: newId }])
    }
    setModal(null)
  }

  const remove = (id) => {
    if (!confirm('Delete this course? This cannot be undone.')) return
    setCourses(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      {modal && <CourseModal course={modal} onSave={handleSave} onClose={() => setModal(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-colors"
          >
            {/* Color stripe */}
            <div className="h-1.5 w-full" style={{ backgroundColor: course.accent || '#2563eb' }} />

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: (course.accent || '#2563eb') + '18' }}>
                    <BookOpen className="w-4 h-4" style={{ color: course.accent || '#2563eb' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm leading-tight">{course.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{course.level}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {course.popular && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Popular</span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${course.badgeColor || 'bg-blue-100 text-blue-700'}`}>
                    {course.badge}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{course.description}</p>

              <div className="flex items-center gap-3 mb-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {course.price} {course.priceNote}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {course.features?.length || 0} outcomes
                </span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setModal(course)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => remove(course.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No courses yet</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add Course" to create your first one</p>
          </div>
        )}
      </div>

      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Teachers Section ─────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-blue-700', 'bg-purple-600', 'bg-emerald-600', 'bg-rose-600',
  'bg-amber-600', 'bg-cyan-600', 'bg-indigo-600', 'bg-pink-600',
]

const EMPTY_TEACHER = {
  name: '', title: '', avatar: '', color: 'bg-blue-700',
  credentials: [], experience: '', specialties: [], bio: '', languages: [],
}

function TeacherModal({ teacher, onSave, onClose }) {
  const { t } = useTranslation()
  const [data, setData] = useState({ ...EMPTY_TEACHER, ...teacher })
  const [lang, setLang] = useState('en')
  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))
  const setKa = (key, val) => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), [key]: val } }))
  const ka = data.ka || {}

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{teacher.id ? t('admin.teachers.editTeacher') : t('admin.teachers.addTeacher')}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 pt-4">
          <LangTabs lang={lang} setLang={setLang} />
        </div>
        <div className="p-6 flex flex-col gap-5">
          {lang === 'en' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('admin.teachers.fullName')} value={data.name} onChange={v => set('name', v)} placeholder="John Smith" />
                <Field label={t('admin.teachers.position')} value={data.title} onChange={v => set('title', v)} placeholder="Senior English Teacher" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('admin.teachers.avatarInitials')} value={data.avatar} onChange={v => set('avatar', v.toUpperCase().slice(0, 2))} placeholder="JS" hint={t('admin.teachers.avatarHint')} />
                <Field label={t('admin.teachers.experience')} value={data.experience} onChange={v => set('experience', v)} placeholder="5+ years" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.teachers.avatarColor')}</label>
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_COLORS.map(color => (
                    <button key={color} onClick={() => set('color', color)}
                      className={`w-8 h-8 rounded-lg ${color} border-2 transition-all ${data.color === color ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </div>
              <Field label={t('admin.teachers.bio')} value={data.bio} onChange={v => set('bio', v)} rows={4} placeholder="Short biography…" />
              <ArrayField label={t('admin.teachers.credentials')} items={data.credentials} onChange={v => set('credentials', v)} placeholder="e.g. CELTA" />
              <ArrayField label={t('admin.teachers.specialties')} items={data.specialties} onChange={v => set('specialties', v)} placeholder="e.g. Business English" />
              <ArrayField label={t('admin.teachers.languages')} items={data.languages} onChange={v => set('languages', v)} placeholder="e.g. English" />
            </>
          ) : (
            <>
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{t('admin.georgianHint')}</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('admin.teachers.fullName')} value={data.name} onChange={v => set('name', v)} hint="Name stays the same in both languages" />
                <Field label={t('admin.teachers.position')} value={ka.title || ''} onChange={v => setKa('title', v)} placeholder="პოზიცია ქართულად…" />
              </div>
              <Field label={t('admin.teachers.bio')} value={ka.bio || ''} onChange={v => setKa('bio', v)} rows={4} placeholder="მოკლე ბიოგრაფია…" />
              <ArrayField label={t('admin.teachers.specialties')} items={ka.specialties || []} onChange={v => setKa('specialties', v)} />
            </>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={() => onSave(data)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" /> {t('admin.teachers.saveTeacher')}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:border-slate-300 transition-colors">
            {t('admin.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}

function TeachersSection() {
  const { t } = useTranslation()
  const { siteData, updateSection, resetSection } = useSiteData()
  const [teachers, setTeachers] = useState(siteData.teachers)
  const [modal, setModal] = useState(null)
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateSection('teachers', teachers)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('teachers')
    setTeachers(DEFAULT_SITE_DATA.teachers)
  }

  const handleSave = (data) => {
    if (data.id) {
      setTeachers(prev => prev.map(t => t.id === data.id ? data : t))
    } else {
      const newId = Math.max(0, ...teachers.map(t => t.id)) + 1
      setTeachers(prev => [...prev, { ...data, id: newId }])
    }
    setModal(null)
  }

  const remove = (id) => {
    if (!confirm(t('admin.teachers.deleteConfirm'))) return
    setTeachers(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('admin.teachers.title')}</h1>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> {t('admin.teachers.addTeacher')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.title}</div>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setModal(t)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => remove(t.id)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{t.bio}</p>
            <div className="flex flex-wrap gap-1">
              {t.credentials.map(c => (
                <span key={c} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">{c}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SaveBar onSave={save} onReset={reset} saved={saved} />

      {modal !== null && (
        <TeacherModal teacher={modal} onSave={handleSave} onClose={() => setModal(null)} />
      )}
    </div>
  )
}

// ─── Testimonials Section ─────────────────────────────────────────────────────

const TESTIMONIAL_COLORS = [
  'bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-amber-600',
  'bg-rose-600', 'bg-cyan-600', 'bg-indigo-600',
]

const EMPTY_TESTIMONIAL = {
  avatar: '', color: 'bg-blue-600', rating: 5, name: '', role: '', location: '', text: '', photoUrl: '',
}

function TestimonialModal({ item, onSave, onClose }) {
  const { t } = useTranslation()
  const [data, setData] = useState({ ...EMPTY_TESTIMONIAL, ...item })
  const [lang, setLang] = useState('en')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))
  const setKa = (key, val) => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), [key]: val } }))
  const ka = data.ka || {}

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const ext = file.name.split('.').pop()
    const storageRef = ref(storage, `testimonials/${Date.now()}.${ext}`)
    setUploading(true)
    setUploadProgress(0)
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      'state_changed',
      (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => { console.error(err); setUploading(false) },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        set('photoUrl', url)
        setUploading(false)
      }
    )
  }

  const handleRemovePhoto = async () => {
    if (data.photoUrl) {
      try {
        await deleteObject(ref(storage, data.photoUrl))
      } catch {}
      set('photoUrl', '')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{item.id ? t('admin.testimonials.editTestimonial') : t('admin.testimonials.addTestimonial')}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 pt-4">
          <LangTabs lang={lang} setLang={setLang} />
        </div>
        <div className="p-6 flex flex-col gap-4">
          {lang === 'en' ? (
            <>
              {/* Photo Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    {data.photoUrl ? (
                      <img src={data.photoUrl} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
                    ) : (
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${data.color}`}>
                        {data.avatar || '?'}
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{uploadProgress}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed border-slate-200 text-slate-400' : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'}`}>
                      <Upload className="w-4 h-4" />
                      {uploading ? `Uploading… ${uploadProgress}%` : 'Upload Photo'}
                      <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handlePhotoUpload} />
                    </label>
                    {data.photoUrl && !uploading && (
                      <button onClick={handleRemovePhoto} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 text-sm font-medium transition-colors">
                        <Trash className="w-4 h-4" /> Remove Photo
                      </button>
                    )}
                  </div>
                </div>
                {uploading && (
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label={t('admin.testimonials.studentName')} value={data.name} onChange={v => set('name', v)} />
                <Field label={t('admin.testimonials.avatar')} value={data.avatar} onChange={v => set('avatar', v.toUpperCase().slice(0, 2))} hint="2 letters — shown if no photo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('admin.testimonials.role')} value={data.role} onChange={v => set('role', v)} placeholder="University Student" />
                <Field label={t('admin.testimonials.location')} value={data.location} onChange={v => set('location', v)} placeholder="Kutaisi" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.testimonials.avatarColor')}</label>
                <div className="flex gap-2 flex-wrap">
                  {TESTIMONIAL_COLORS.map(color => (
                    <button key={color} onClick={() => set('color', color)}
                      className={`w-7 h-7 rounded-lg ${color} border-2 transition-all ${data.color === color ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.testimonials.starRating')}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => set('rating', n)}
                      className={`w-8 h-8 rounded-lg text-lg transition-all ${n <= data.rating ? 'text-amber-400' : 'text-slate-200'}`}
                    >★</button>
                  ))}
                </div>
              </div>
              <Field label={t('admin.testimonials.reviewText')} value={data.text} onChange={v => set('text', v)} rows={4} placeholder="Student review…" />
            </>
          ) : (
            <>
              <Field label={t('admin.testimonials.role')} value={ka.role || kaT.testimonials.items[data.id - 1]?.role || ''} onChange={v => setKa('role', v)} />
              <Field label={t('admin.testimonials.reviewText')} value={ka.text || kaT.testimonials.items[data.id - 1]?.text || ''} onChange={v => setKa('text', v)} rows={4} />
            </>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={() => onSave(data)} disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" /> {t('admin.testimonials.save')}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:border-slate-300 transition-colors">
            {t('admin.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const { t } = useTranslation()
  const { siteData, updateSection, resetSection } = useSiteData()
  const [items, setItems] = useState(siteData.testimonials)
  const [modal, setModal] = useState(null)
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateSection('testimonials', items)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('testimonials')
    setItems(DEFAULT_SITE_DATA.testimonials)
  }

  const handleSave = (data) => {
    if (data.id) {
      setItems(prev => prev.map(t => t.id === data.id ? data : t))
    } else {
      const newId = Math.max(0, ...items.map(t => t.id)) + 1
      setItems(prev => [...prev, { ...data, id: newId }])
    }
    setModal(null)
  }

  const remove = (id) => {
    if (!confirm(t('admin.testimonials.deleteConfirm'))) return
    setItems(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('admin.testimonials.title')}</h1>
        <button onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> {t('admin.testimonials.addTestimonial')}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start gap-4">
              {item.photoUrl ? (
                <img src={item.photoUrl} alt={item.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200" />
              ) : (
                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {item.avatar}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-900 text-sm">{item.name}</span>
                  <span className="text-xs text-slate-400">{item.role} · {item.location}</span>
                  <span className="text-amber-400 text-xs ml-auto">{'★'.repeat(item.rating)}</span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 italic">"{item.text}"</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setModal(item)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => remove(item.id)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SaveBar onSave={save} onReset={reset} saved={saved} />

      {modal !== null && (
        <TestimonialModal item={modal} onSave={handleSave} onClose={() => setModal(null)} />
      )}
    </div>
  )
}

// ─── Benefits Section ─────────────────────────────────────────────────────────

function BenefitsSection() {
  const { t } = useTranslation()
  const { siteData, updateSection, resetSection } = useSiteData()
  const [benefits, setBenefits] = useState(siteData.benefits)
  const [lang, setLang] = useState('en')
  const [saved, setSaved] = useState(false)

  const update = (i, key, val) => {
    setBenefits(prev => prev.map((b, idx) => idx === i ? { ...b, [key]: val } : b))
  }
  const updateKa = (i, key, val) => {
    setBenefits(prev => prev.map((b, idx) => idx === i ? { ...b, ka: { ...(b.ka || {}), [key]: val } } : b))
  }

  const add = () => setBenefits(prev => [...prev, { title: '', description: '' }])
  const remove = (i) => setBenefits(prev => prev.filter((_, idx) => idx !== i))

  const save = () => {
    updateSection('benefits', benefits)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('benefits')
    setBenefits(DEFAULT_SITE_DATA.benefits)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('admin.benefits.title')}</h1>
        <button onClick={add}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> {t('admin.benefits.addBenefit')}
        </button>
      </div>

      <LangTabs lang={lang} setLang={setLang} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefits.map((b, i) => {
          const ka = b.ka || {}
          return (
            <Card key={i} title={`${t('admin.benefits.benefit')} ${i + 1}`}>
              {lang === 'en' ? (
                <>
                  <Field label={t('admin.hero.titleLabel')} value={b.title} onChange={v => update(i, 'title', v)} />
                  <Field label={t('admin.courses.description')} value={b.description} onChange={v => update(i, 'description', v)} rows={3} />
                </>
              ) : (
                <>
                  <Field label={t('admin.hero.titleLabel')} value={ka.title || kaT.benefits.items[i]?.title || ''} onChange={v => updateKa(i, 'title', v)} />
                  <Field label={t('admin.courses.description')} value={ka.description || kaT.benefits.items[i]?.description || ''} onChange={v => updateKa(i, 'description', v)} rows={3} />
                </>
              )}
              <button onClick={() => remove(i)}
                className="self-start flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> {t('admin.remove')}
              </button>
            </Card>
          )
        })}
      </div>

      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Contact Section ──────────────────────────────────────────────────────────

function ContactSection() {
  const { t } = useTranslation()
  const { siteData, updateSection, resetSection } = useSiteData()
  const [data, setData] = useState(siteData.contact)
  const [lang, setLang] = useState('en')
  const [saved, setSaved] = useState(false)

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))
  const setKa = (key, val) => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), [key]: val } }))
  const setSocial = (key, val) => setData(prev => ({ ...prev, social: { ...prev.social, [key]: val } }))

  const save = () => {
    updateSection('contact', data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('contact')
    setData(DEFAULT_SITE_DATA.contact)
  }

  const ka = data.ka || {}

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.contact.title')}</h1>
      <LangTabs lang={lang} setLang={setLang} />

      {lang === 'en' ? (
        <>
          <Card title={t('admin.contact.contactDetails')}>
            <Field label={t('admin.contact.phone')} value={data.phone} onChange={v => set('phone', v)} placeholder="+995 599 123 456" />
            <Field label={t('admin.contact.email')} value={data.email} onChange={v => set('email', v)} placeholder="info@academy.ge" />
            <Field label={t('admin.contact.address')} value={data.address} onChange={v => set('address', v)} placeholder="12 Rustaveli Avenue, Kutaisi" />
            <Field label={t('admin.contact.hours')} value={data.hours} onChange={v => set('hours', v)} placeholder="Mon–Fri: 9:00–20:00" />
          </Card>
          <Card title={t('admin.contact.social')}>
            <Field label={t('admin.contact.facebook')} value={data.social.facebook} onChange={v => setSocial('facebook', v)} placeholder="https://facebook.com/…" />
            <Field label={t('admin.contact.instagram')} value={data.social.instagram} onChange={v => setSocial('instagram', v)} placeholder="https://instagram.com/…" />
            <Field label={t('admin.contact.youtube')} value={data.social.youtube} onChange={v => setSocial('youtube', v)} placeholder="https://youtube.com/…" />
            <Field label={t('admin.contact.linkedin')} value={data.social.linkedin} onChange={v => setSocial('linkedin', v)} placeholder="https://linkedin.com/…" />
          </Card>
        </>
      ) : (
        <Card title={t('admin.contact.georgianContent')}>
          <Field label={t('admin.contact.address')} value={ka.address || kaT.contact.address} onChange={v => setKa('address', v)} />
          <Field label={t('admin.contact.hours')} value={ka.hours || kaT.contact.hours} onChange={v => setKa('hours', v)} />
        </Card>
      )}

      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── CTA Section ──────────────────────────────────────────────────────────────

function CTASection() {
  const { t } = useTranslation()
  const { siteData, updateSection, resetSection } = useSiteData()
  const [data, setData] = useState(siteData.cta)
  const [lang, setLang] = useState('en')
  const [saved, setSaved] = useState(false)

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))
  const setKa = (key, val) => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), [key]: val } }))

  const save = () => {
    updateSection('cta', data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('cta')
    setData(DEFAULT_SITE_DATA.cta)
  }

  const ka = data.ka || {}

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.cta.title')}</h1>
      <LangTabs lang={lang} setLang={setLang} />

      {lang === 'en' ? (
        <>
          <Card title={t('admin.cta.content')}>
            <Field label={t('admin.cta.badge')} value={data.badge} onChange={v => set('badge', v)} placeholder="Limited Seats Available" />
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.cta.titleLabel')} value={data.title} onChange={v => set('title', v)} />
              <Field label={t('admin.cta.titleHighlight')} value={data.titleHighlight} onChange={v => set('titleHighlight', v)} />
            </div>
            <Field label={t('admin.cta.description')} value={data.description} onChange={v => set('description', v)} rows={3} />
          </Card>
          <Card title={t('admin.cta.bulletPoints')}>
            <ArrayField label="" items={data.benefits} onChange={v => set('benefits', v)} placeholder="e.g. Free Placement Test" />
          </Card>
        </>
      ) : (
        <Card title={t('admin.cta.georgianContent')}>
          <Field label={t('admin.cta.badge')} value={ka.badge || kaT.cta.badge} onChange={v => setKa('badge', v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.cta.titleLabel')} value={ka.title || kaT.cta.title} onChange={v => setKa('title', v)} />
            <Field label={t('admin.cta.titleHighlight')} value={ka.titleHighlight || kaT.cta.titleHighlight} onChange={v => setKa('titleHighlight', v)} />
          </div>
          <Field label={t('admin.cta.description')} value={ka.description || kaT.cta.description} onChange={v => setKa('description', v)} rows={3} />
          <ArrayField label={t('admin.cta.bulletPoints')} items={ka.benefits || kaT.cta.benefits} onChange={v => setKa('benefits', v)} />
        </Card>
      )}

      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Settings Section ─────────────────────────────────────────────────���───────

function SettingsSection({ onLogout }) {
  const { t } = useTranslation()
  const { resetAll } = useSiteData()
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [msg, setMsg] = useState('')

  const changePw = async (e) => {
    e.preventDefault()
    if (newPw.length < 6) { setMsg(t('admin.settings.tooShort')); return }
    if (newPw !== confirmPw) { setMsg(t('admin.settings.noMatch')); return }
    try {
      await updatePassword(auth.currentUser, newPw)
      setMsg(t('admin.settings.updated'))
      setNewPw('')
      setConfirmPw('')
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setMsg('Please sign out and sign in again before changing your password.')
      } else {
        setMsg('Error: ' + err.message)
      }
    }
  }

  const handleResetAll = () => {
    if (!confirm(t('admin.settings.resetConfirm'))) return
    resetAll()
    setMsg(t('admin.settings.resetAllDesc'))
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.settings.title')}</h1>
      <Card title={t('admin.settings.changePassword')}>
        <form onSubmit={changePw} className="flex flex-col gap-4">
          <Field label={t('admin.settings.newPassword')} type="password" value={newPw} onChange={setNewPw} placeholder="Min. 6 characters" />
          <Field label={t('admin.settings.confirmPassword')} type="password" value={confirmPw} onChange={setConfirmPw} placeholder="Repeat password" />
          {msg && <p className={`text-sm font-medium ${msg === t('admin.settings.updated') ? 'text-emerald-600' : 'text-rose-500'}`}>{msg}</p>}
          <button type="submit" className="self-start flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors">
            {t('admin.settings.updatePassword')}
          </button>
        </form>
      </Card>
      <Card title={t('admin.settings.dangerZone')}>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-slate-600 mb-3">{t('admin.settings.resetAllDesc')}</p>
            <button
              onClick={handleResetAll}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> {t('admin.settings.resetAllBtn')}
            </button>
          </div>
        </div>
      </Card>
      <Card title={t('admin.settings.session')}>
        <button
          onClick={onLogout}
          className="self-start flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-600 rounded-xl text-sm font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" /> {t('admin.signOut')}
        </button>
      </Card>
    </div>
  )
}

// ─── Page: About ─────────────────────────────────────────────────────────────

function AboutPageSection() {
  const { t } = useTranslation()
  const { siteData, updateSection } = useSiteData()
  const [data, setData] = useState(() => siteData.pages?.about || DEFAULT_SITE_DATA.pages.about)
  const [lang, setLang] = useState('en')
  const [saved, setSaved] = useState(false)

  const set = (section, key, val) => setData(prev => ({ ...prev, [section]: { ...(prev[section] || {}), [key]: val } }))
  const setArr = (section, key, val) => set(section, key, val)
  const setKa = (section, key, val) => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), [section]: { ...(prev.ka?.[section] || {}), [key]: val } } }))
  const setKaArr = (section, key, val) => setKa(section, key, val)

  const save = () => {
    updateSection('pages', { ...(siteData.pages || {}), about: data })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  const reset = () => {
    const next = { ...(siteData.pages || {}) }
    delete next.about
    updateSection('pages', next)
    setData(DEFAULT_SITE_DATA.pages.about)
  }

  const en = data
  const ka = data.ka || {}

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.nav.pageAbout')}</h1>
      <LangTabs lang={lang} setLang={setLang} />
      {lang === 'en' ? (
        <>
          <Card title={t('admin.pageHero')}>
            <Field label={t('admin.eyebrow')} value={en.hero?.eyebrow || ''} onChange={v => set('hero', 'eyebrow', v)} />
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.title')} value={en.hero?.title || ''} onChange={v => set('hero', 'title', v)} />
              <Field label={t('admin.highlight')} value={en.hero?.highlight || ''} onChange={v => set('hero', 'highlight', v)} />
            </div>
            <Field label={t('admin.subtitle')} value={en.hero?.subtitle || ''} onChange={v => set('hero', 'subtitle', v)} rows={2} />
          </Card>
          <Card title={t('admin.storySection')}>
            <Field label={t('admin.eyebrow')} value={en.story?.eyebrow || ''} onChange={v => set('story', 'eyebrow', v)} />
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.title')} value={en.story?.title || ''} onChange={v => set('story', 'title', v)} />
              <Field label={t('admin.highlight')} value={en.story?.titleHighlight || ''} onChange={v => set('story', 'titleHighlight', v)} />
            </div>
            <Field label="Paragraph 1" value={en.story?.p1 || ''} onChange={v => set('story', 'p1', v)} rows={3} />
            <Field label="Paragraph 2" value={en.story?.p2 || ''} onChange={v => set('story', 'p2', v)} rows={3} />
            <ArrayField label={t('admin.badges')} items={en.story?.badges || []} onChange={v => setArr('story', 'badges', v)} />
          </Card>
          <Card title={t('admin.missionSection')}>
            <Field label={t('admin.quote')} value={en.mission?.quote || ''} onChange={v => set('mission', 'quote', v)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.founder')} value={en.mission?.founder || ''} onChange={v => set('mission', 'founder', v)} />
              <Field label={t('admin.founderTitle')} value={en.mission?.founderTitle || ''} onChange={v => set('mission', 'founderTitle', v)} />
            </div>
          </Card>
          <Card title={t('admin.timeline')}>
            {(en.timeline || []).map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <Field label={`${i + 1}. ${t('admin.title')}`} value={item.title || ''} onChange={v => setData(prev => ({ ...prev, timeline: prev.timeline.map((x, j) => j === i ? { ...x, title: v } : x) }))} />
                <Field label={t('admin.description')} value={item.desc || ''} onChange={v => setData(prev => ({ ...prev, timeline: prev.timeline.map((x, j) => j === i ? { ...x, desc: v } : x) }))} />
              </div>
            ))}
          </Card>
        </>
      ) : (
        <>
          <Card title={t('admin.pageHero')}>
            <Field label={t('admin.eyebrow')} value={ka.hero?.eyebrow || kaT.aboutPage?.pageHero?.eyebrow || ''} onChange={v => setKa('hero', 'eyebrow', v)} />
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.title')} value={ka.hero?.title || kaT.aboutPage?.pageHero?.title || ''} onChange={v => setKa('hero', 'title', v)} />
              <Field label={t('admin.highlight')} value={ka.hero?.highlight || kaT.aboutPage?.pageHero?.highlight || ''} onChange={v => setKa('hero', 'highlight', v)} />
            </div>
            <Field label={t('admin.subtitle')} value={ka.hero?.subtitle || kaT.aboutPage?.pageHero?.subtitle || ''} onChange={v => setKa('hero', 'subtitle', v)} rows={2} />
          </Card>
          <Card title={t('admin.storySection')}>
            <Field label={t('admin.eyebrow')} value={ka.story?.eyebrow || kaT.aboutPage?.story?.eyebrow || ''} onChange={v => setKa('story', 'eyebrow', v)} />
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.title')} value={ka.story?.title || kaT.aboutPage?.story?.title || ''} onChange={v => setKa('story', 'title', v)} />
              <Field label={t('admin.highlight')} value={ka.story?.titleHighlight || kaT.aboutPage?.story?.titleHighlight || ''} onChange={v => setKa('story', 'titleHighlight', v)} />
            </div>
            <Field label="Paragraph 1" value={ka.story?.p1 || kaT.aboutPage?.story?.p1 || ''} onChange={v => setKa('story', 'p1', v)} rows={3} />
            <Field label="Paragraph 2" value={ka.story?.p2 || kaT.aboutPage?.story?.p2 || ''} onChange={v => setKa('story', 'p2', v)} rows={3} />
            <ArrayField label={t('admin.badges')} items={ka.story?.badges || kaT.aboutPage?.story?.badges || []} onChange={v => setKaArr('story', 'badges', v)} />
          </Card>
          <Card title={t('admin.missionSection')}>
            <Field label={t('admin.quote')} value={ka.mission?.quote || kaT.aboutPage?.mission?.quote || ''} onChange={v => setKa('mission', 'quote', v)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.founder')} value={ka.mission?.founder || kaT.aboutPage?.mission?.founder || ''} onChange={v => setKa('mission', 'founder', v)} />
              <Field label={t('admin.founderTitle')} value={ka.mission?.founderTitle || kaT.aboutPage?.mission?.founderTitle || ''} onChange={v => setKa('mission', 'founderTitle', v)} />
            </div>
          </Card>
        </>
      )}
      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Page: FAQ ────────────────────────────────────────────────────────────────

function FAQPageSection() {
  const { t } = useTranslation()
  const { siteData, updateSection } = useSiteData()
  const [data, setData] = useState(() => siteData.pages?.faq || DEFAULT_SITE_DATA.pages.faq)
  const [lang, setLang] = useState('en')
  const [saved, setSaved] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)

  const save = () => {
    updateSection('pages', { ...(siteData.pages || {}), faq: data })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  const reset = () => {
    const next = { ...(siteData.pages || {}) }
    delete next.faq
    updateSection('pages', next)
    setData(DEFAULT_SITE_DATA.pages.faq)
  }

  const categories = lang === 'en' ? (data.categories || []) : (data.ka?.categories || data.categories || [])
  const kaT_cats = kaT.faqPage?.categories || []

  const updateCategory = (catIdx, field, val) => {
    if (lang === 'en') {
      setData(prev => ({ ...prev, categories: prev.categories.map((c, i) => i === catIdx ? { ...c, [field]: val } : c) }))
    } else {
      setData(prev => {
        const kaCats = prev.ka?.categories || prev.categories.map(c => ({ ...c }))
        return { ...prev, ka: { ...(prev.ka || {}), categories: kaCats.map((c, i) => i === catIdx ? { ...c, [field]: val } : c) } }
      })
    }
  }

  const updateItem = (catIdx, itemIdx, field, val) => {
    if (lang === 'en') {
      setData(prev => ({
        ...prev,
        categories: prev.categories.map((c, ci) => ci === catIdx
          ? { ...c, items: c.items.map((it, ii) => ii === itemIdx ? { ...it, [field]: val } : it) }
          : c
        )
      }))
    } else {
      setData(prev => {
        const kaCats = prev.ka?.categories || prev.categories.map(c => ({ ...c, items: [...c.items] }))
        return {
          ...prev,
          ka: {
            ...(prev.ka || {}),
            categories: kaCats.map((c, ci) => ci === catIdx
              ? { ...c, items: (c.items || []).map((it, ii) => ii === itemIdx ? { ...it, [field]: val } : it) }
              : c
            )
          }
        }
      })
    }
  }

  const addItem = (catIdx) => {
    if (lang === 'en') {
      setData(prev => ({ ...prev, categories: prev.categories.map((c, i) => i === catIdx ? { ...c, items: [...c.items, { q: '', a: '' }] } : c) }))
    } else {
      setData(prev => {
        const kaCats = prev.ka?.categories || prev.categories.map(c => ({ ...c, items: [...c.items] }))
        return { ...prev, ka: { ...(prev.ka || {}), categories: kaCats.map((c, i) => i === catIdx ? { ...c, items: [...(c.items || []), { q: '', a: '' }] } : c) } }
      })
    }
  }

  const removeItem = (catIdx, itemIdx) => {
    if (lang === 'en') {
      setData(prev => ({ ...prev, categories: prev.categories.map((c, ci) => ci === catIdx ? { ...c, items: c.items.filter((_, ii) => ii !== itemIdx) } : c) }))
    } else {
      setData(prev => {
        const kaCats = prev.ka?.categories || prev.categories.map(c => ({ ...c, items: [...c.items] }))
        return { ...prev, ka: { ...(prev.ka || {}), categories: kaCats.map((c, ci) => ci === catIdx ? { ...c, items: (c.items || []).filter((_, ii) => ii !== itemIdx) } : c) } }
      })
    }
  }

  const cat = categories[activeCategory]
  const kaFallbackItems = kaT_cats[activeCategory]?.items || []

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.nav.pageFaq')}</h1>
      <LangTabs lang={lang} setLang={setLang} />
      <Card title={t('admin.pageHero')}>
        {lang === 'en' ? (
          <>
            <Field label={t('admin.eyebrow')} value={data.hero?.eyebrow || ''} onChange={v => setData(prev => ({ ...prev, hero: { ...(prev.hero || {}), eyebrow: v } }))} />
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.title')} value={data.hero?.title || ''} onChange={v => setData(prev => ({ ...prev, hero: { ...(prev.hero || {}), title: v } }))} />
              <Field label={t('admin.highlight')} value={data.hero?.highlight || ''} onChange={v => setData(prev => ({ ...prev, hero: { ...(prev.hero || {}), highlight: v } }))} />
            </div>
            <Field label={t('admin.subtitle')} value={data.hero?.subtitle || ''} onChange={v => setData(prev => ({ ...prev, hero: { ...(prev.hero || {}), subtitle: v } }))} rows={2} />
          </>
        ) : (
          <>
            <Field label={t('admin.eyebrow')} value={data.ka?.hero?.eyebrow || kaT.faqPage?.pageHero?.eyebrow || ''} onChange={v => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), eyebrow: v } } }))} />
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.title')} value={data.ka?.hero?.title || kaT.faqPage?.pageHero?.title || ''} onChange={v => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), title: v } } }))} />
              <Field label={t('admin.highlight')} value={data.ka?.hero?.highlight || kaT.faqPage?.pageHero?.highlight || ''} onChange={v => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), highlight: v } } }))} />
            </div>
            <Field label={t('admin.subtitle')} value={data.ka?.hero?.subtitle || kaT.faqPage?.pageHero?.subtitle || ''} onChange={v => setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), subtitle: v } } }))} rows={2} />
          </>
        )}
      </Card>
      <Card title={t('admin.faqCategories')}>
        <div className="flex flex-wrap gap-2 mb-4">
          {(data.categories || []).map((c, i) => (
            <button key={i} onClick={() => setActiveCategory(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeCategory === i ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >{c.label}</button>
          ))}
        </div>
        {cat && (
          <div className="flex flex-col gap-4">
            {cat.items?.map((item, itemIdx) => {
              const kaItem = lang === 'ka' ? (data.ka?.categories?.[activeCategory]?.items?.[itemIdx] || kaFallbackItems[itemIdx] || {}) : item
              return (
                <div key={itemIdx} className="border border-slate-100 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Q{itemIdx + 1}</span>
                    <button onClick={() => removeItem(activeCategory, itemIdx)} className="p-1 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  {lang === 'en' ? (
                    <>
                      <Field label="Question" value={item.q || ''} onChange={v => updateItem(activeCategory, itemIdx, 'q', v)} />
                      <Field label="Answer" value={item.a || ''} onChange={v => updateItem(activeCategory, itemIdx, 'a', v)} rows={3} />
                    </>
                  ) : (
                    <>
                      <Field label="Question" value={kaItem.q || ''} onChange={v => updateItem(activeCategory, itemIdx, 'q', v)} />
                      <Field label="Answer" value={kaItem.a || ''} onChange={v => updateItem(activeCategory, itemIdx, 'a', v)} rows={3} />
                    </>
                  )}
                </div>
              )
            })}
            <button onClick={() => addItem(activeCategory)} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
              <Plus className="w-4 h-4" /> {t('admin.add')} Q&A
            </button>
          </div>
        )}
      </Card>
      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Page: Teachers ───────────────────────────────────────────────────────────

function TeachersPageSection() {
  const { t } = useTranslation()
  const { siteData, updateSection } = useSiteData()
  const [data, setData] = useState(() => siteData.pages?.teachers || DEFAULT_SITE_DATA.pages.teachers)
  const [lang, setLang] = useState('en')
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateSection('pages', { ...(siteData.pages || {}), teachers: data })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  const reset = () => {
    const next = { ...(siteData.pages || {}) }
    delete next.teachers
    updateSection('pages', next)
    setData(DEFAULT_SITE_DATA.pages.teachers)
  }

  const setHero = (key, val, isKa) => {
    if (isKa) setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), [key]: val } } }))
    else setData(prev => ({ ...prev, hero: { ...(prev.hero || {}), [key]: val } }))
  }
  const setJoin = (key, val, isKa) => {
    if (isKa) setData(prev => ({ ...prev, ka: { ...(prev.ka || {}), join: { ...(prev.ka?.join || {}), [key]: val } } }))
    else setData(prev => ({ ...prev, join: { ...(prev.join || {}), [key]: val } }))
  }

  const isKaLang = lang === 'ka'
  const hero = isKaLang ? (data.ka?.hero || {}) : (data.hero || {})
  const join = isKaLang ? (data.ka?.join || {}) : (data.join || {})
  const kaHero = kaT.teachersPage?.pageHero || {}
  const kaJoin = kaT.teachersPage?.join || {}

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.nav.pageTeachers')}</h1>
      <LangTabs lang={lang} setLang={setLang} />
      <Card title={t('admin.pageHero')}>
        <Field label={t('admin.eyebrow')} value={hero.eyebrow || (isKaLang ? kaHero.eyebrow : '') || ''} onChange={v => setHero('eyebrow', v, isKaLang)} />
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('admin.title')} value={hero.title || (isKaLang ? kaHero.title : '') || ''} onChange={v => setHero('title', v, isKaLang)} />
          <Field label={t('admin.highlight')} value={hero.highlight || (isKaLang ? kaHero.highlight : '') || ''} onChange={v => setHero('highlight', v, isKaLang)} />
        </div>
        <Field label={t('admin.subtitle')} value={hero.subtitle || (isKaLang ? kaHero.subtitle : '') || ''} onChange={v => setHero('subtitle', v, isKaLang)} rows={2} />
      </Card>
      {!isKaLang && (
        <Card title={t('admin.pageStats')}>
          {(data.stats || []).map((stat, i) => (
            <div key={i} className="grid grid-cols-2 gap-4">
              <Field label={`Stat ${i + 1} Value`} value={stat.value || ''} onChange={v => setData(prev => ({ ...prev, stats: prev.stats.map((s, si) => si === i ? { ...s, value: v } : s) }))} />
              <Field label="Label" value={stat.label || ''} onChange={v => setData(prev => ({ ...prev, stats: prev.stats.map((s, si) => si === i ? { ...s, label: v } : s) }))} />
            </div>
          ))}
        </Card>
      )}
      {isKaLang && (
        <Card title={t('admin.pageStats')}>
          {(data.ka?.stats || data.stats || []).map((stat, i) => {
            const kaStat = data.ka?.stats?.[i] || {}
            const kaFallback = kaT.teachersPage?.stats?.[i] || {}
            return (
              <div key={i} className="grid grid-cols-2 gap-4">
                <Field label={`Stat ${i + 1} Value`} value={kaStat.value || kaFallback.value || ''} onChange={v => setData(prev => { const s = [...(prev.ka?.stats || prev.stats.map(x => ({ ...x })))]; s[i] = { ...s[i], value: v }; return { ...prev, ka: { ...(prev.ka || {}), stats: s } } })} />
                <Field label="Label" value={kaStat.label || kaFallback.label || ''} onChange={v => setData(prev => { const s = [...(prev.ka?.stats || prev.stats.map(x => ({ ...x })))]; s[i] = { ...s[i], label: v }; return { ...prev, ka: { ...(prev.ka || {}), stats: s } } })} />
              </div>
            )
          })}
        </Card>
      )}
      <Card title={t('admin.joinSection')}>
        <Field label={t('admin.title')} value={join.title || (isKaLang ? kaJoin.title : '') || ''} onChange={v => setJoin('title', v, isKaLang)} />
        <Field label={t('admin.description')} value={join.desc || (isKaLang ? kaJoin.desc : '') || ''} onChange={v => setJoin('desc', v, isKaLang)} rows={2} />
        <Field label={t('admin.buttonText')} value={join.btn || (isKaLang ? kaJoin.btn : '') || ''} onChange={v => setJoin('btn', v, isKaLang)} />
      </Card>
      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Page: Testimonials ───────────────────────────────────────────────────────

function TestimonialsPageSection() {
  const { t } = useTranslation()
  const { siteData, updateSection } = useSiteData()
  const [data, setData] = useState(() => siteData.pages?.testimonials || DEFAULT_SITE_DATA.pages.testimonials)
  const [lang, setLang] = useState('en')
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateSection('pages', { ...(siteData.pages || {}), testimonials: data })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  const reset = () => {
    const next = { ...(siteData.pages || {}) }
    delete next.testimonials
    updateSection('pages', next)
    setData(DEFAULT_SITE_DATA.pages.testimonials)
  }

  const isKaLang = lang === 'ka'
  const hero = isKaLang ? (data.ka?.hero || {}) : (data.hero || {})
  const kaHero = kaT.testimonialsPage?.pageHero || {}

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.nav.pageTestimonials')}</h1>
      <LangTabs lang={lang} setLang={setLang} />
      <Card title={t('admin.pageHero')}>
        <Field label={t('admin.eyebrow')} value={hero.eyebrow || (isKaLang ? kaHero.eyebrow : '') || ''} onChange={v => setData(prev => isKaLang ? { ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), eyebrow: v } } } : { ...prev, hero: { ...(prev.hero || {}), eyebrow: v } })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('admin.title')} value={hero.title || (isKaLang ? kaHero.title : '') || ''} onChange={v => setData(prev => isKaLang ? { ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), title: v } } } : { ...prev, hero: { ...(prev.hero || {}), title: v } })} />
          <Field label={t('admin.highlight')} value={hero.highlight || (isKaLang ? kaHero.highlight : '') || ''} onChange={v => setData(prev => isKaLang ? { ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), highlight: v } } } : { ...prev, hero: { ...(prev.hero || {}), highlight: v } })} />
        </div>
        <Field label={t('admin.subtitle')} value={hero.subtitle || (isKaLang ? kaHero.subtitle : '') || ''} onChange={v => setData(prev => isKaLang ? { ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), subtitle: v } } } : { ...prev, hero: { ...(prev.hero || {}), subtitle: v } })} rows={2} />
      </Card>
      <Card title={t('admin.ctaSection')}>
        <Field label={t('admin.ctaText')} value={isKaLang ? (data.ka?.ctaText || kaT.testimonialsPage?.ctaText || '') : (data.ctaText || '')} onChange={v => setData(prev => isKaLang ? { ...prev, ka: { ...(prev.ka || {}), ctaText: v } } : { ...prev, ctaText: v })} rows={2} />
        <Field label={t('admin.ctaButton')} value={isKaLang ? (data.ka?.ctaBtn || kaT.testimonialsPage?.ctaBtn || '') : (data.ctaBtn || '')} onChange={v => setData(prev => isKaLang ? { ...prev, ka: { ...(prev.ka || {}), ctaBtn: v } } : { ...prev, ctaBtn: v })} />
      </Card>
      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Page: Courses ────────────────────────────────────────────────────────────

function CoursesPageSection() {
  const { t } = useTranslation()
  const { siteData, updateSection } = useSiteData()
  const [data, setData] = useState(() => siteData.pages?.courses || DEFAULT_SITE_DATA.pages.courses)
  const [lang, setLang] = useState('en')
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateSection('pages', { ...(siteData.pages || {}), courses: data })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  const reset = () => {
    const next = { ...(siteData.pages || {}) }
    delete next.courses
    updateSection('pages', next)
    setData(DEFAULT_SITE_DATA.pages.courses)
  }

  const isKaLang = lang === 'ka'
  const hero = isKaLang ? (data.ka?.hero || {}) : (data.hero || {})
  const kaHero = kaT.coursesPage?.pageHero || {}

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.nav.pageCourses')}</h1>
      <LangTabs lang={lang} setLang={setLang} />
      <Card title={t('admin.pageHero')}>
        <Field label={t('admin.eyebrow')} value={hero.eyebrow || (isKaLang ? kaHero.eyebrow : '') || ''} onChange={v => setData(prev => isKaLang ? { ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), eyebrow: v } } } : { ...prev, hero: { ...(prev.hero || {}), eyebrow: v } })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('admin.title')} value={hero.title || (isKaLang ? kaHero.title : '') || ''} onChange={v => setData(prev => isKaLang ? { ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), title: v } } } : { ...prev, hero: { ...(prev.hero || {}), title: v } })} />
          <Field label={t('admin.highlight')} value={hero.highlight || (isKaLang ? kaHero.highlight : '') || ''} onChange={v => setData(prev => isKaLang ? { ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), highlight: v } } } : { ...prev, hero: { ...(prev.hero || {}), highlight: v } })} />
        </div>
        <Field label={t('admin.subtitle')} value={hero.subtitle || (isKaLang ? kaHero.subtitle : '') || ''} onChange={v => setData(prev => isKaLang ? { ...prev, ka: { ...(prev.ka || {}), hero: { ...(prev.ka?.hero || {}), subtitle: v } } } : { ...prev, hero: { ...(prev.hero || {}), subtitle: v } })} rows={2} />
      </Card>
      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Page: Course Detail ──────────────────────────────────────────────────────

// ─── Course Detail Sub-Editors ────────────────────────────────────────────────

function CurriculumEditor({ modules, onChange }) {
  const add = () => onChange([...modules, { module: `Module ${modules.length + 1}`, title: '', weeks: '', topics: [] }])
  const remove = (i) => onChange(modules.filter((_, idx) => idx !== i))
  const update = (i, key, val) => onChange(modules.map((m, idx) => idx === i ? { ...m, [key]: val } : m))

  return (
    <div className="flex flex-col gap-3">
      {modules.map((mod, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-400 shrink-0">M{i + 1}</span>
            <input
              value={mod.title}
              onChange={e => update(i, 'title', e.target.value)}
              placeholder="Module title…"
              className="flex-1 px-2 py-1 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
            <input
              value={mod.weeks}
              onChange={e => update(i, 'weeks', e.target.value)}
              placeholder="Weeks 1–3"
              className="w-28 px-2 py-1 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
            <button onClick={() => remove(i)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-4">
            <ArrayField label="Topics" items={mod.topics || []} onChange={v => update(i, 'topics', v)} placeholder="Add topic…" />
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
        <Plus className="w-3.5 h-3.5" /> Add Module
      </button>
    </div>
  )
}

function ScheduleEditor({ slots, onChange }) {
  const add = () => onChange([...slots, { label: '', time: '', days: '' }])
  const remove = (i) => onChange(slots.filter((_, idx) => idx !== i))
  const update = (i, key, val) => onChange(slots.map((s, idx) => idx === i ? { ...s, [key]: val } : s))

  return (
    <div className="flex flex-col gap-3">
      {slots.map((slot, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 items-center">
          <input value={slot.label} onChange={e => update(i, 'label', e.target.value)} placeholder="Morning"
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" />
          <input value={slot.time} onChange={e => update(i, 'time', e.target.value)} placeholder="09:00–11:00"
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" />
          <div className="flex gap-2">
            <input value={slot.days} onChange={e => update(i, 'days', e.target.value)} placeholder="Mon / Wed / Fri"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" />
            <button onClick={() => remove(i)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
        <Plus className="w-3.5 h-3.5" /> Add Time Slot
      </button>
    </div>
  )
}

function FaqEditor({ items, onChange }) {
  const add = () => onChange([...items, { q: '', a: '' }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i, key, val) => onChange(items.map((f, idx) => idx === i ? { ...f, [key]: val } : f))

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">Q{i + 1}</span>
            <input value={item.q} onChange={e => update(i, 'q', e.target.value)} placeholder="Question…"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" />
            <button onClick={() => remove(i)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea value={item.a} onChange={e => update(i, 'a', e.target.value)} placeholder="Answer…" rows={2}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-y" />
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
        <Plus className="w-3.5 h-3.5" /> Add FAQ
      </button>
    </div>
  )
}

function CourseDetailSection() {
  const { siteData, updateSection } = useSiteData()
  const courses = siteData.courses
  const firstSlug = courses[0]?.slug || ''
  const [lang, setLang] = useState('en')
  const [activeSlug, setActiveSlug] = useState(firstSlug)
  const [saved, setSaved] = useState(false)

  const [data, setData] = useState(siteData.pages?.courseDetail || DEFAULT_SITE_DATA.pages.courseDetail)

  const isKa = lang === 'ka'
  const course = data[activeSlug] || {}
  const kaData = course.ka || {}
  const enCourse = isKa ? kaData : course

  const set = (key, val) => {
    if (isKa) {
      setData(prev => ({ ...prev, [activeSlug]: { ...(prev[activeSlug] || {}), ka: { ...(prev[activeSlug]?.ka || {}), [key]: val } } }))
    } else {
      setData(prev => ({ ...prev, [activeSlug]: { ...(prev[activeSlug] || {}), [key]: val } }))
    }
  }

  // Curriculum, schedule, faq are language-neutral (stored under EN)
  const setEn = (key, val) =>
    setData(prev => ({ ...prev, [activeSlug]: { ...(prev[activeSlug] || {}), [key]: val } }))

  const save = () => {
    updateSection('pages', { ...(siteData.pages || {}), courseDetail: data })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const activeCourse = courses.find(c => c.slug === activeSlug)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Course Detail Pages</h1>
        <p className="text-sm text-slate-500 mt-1">Edit the full detail page content for each course.</p>
      </div>

      {/* Course tabs */}
      <div className="flex flex-wrap gap-2">
        {courses.map(c => (
          <button
            key={c.slug}
            onClick={() => setActiveSlug(c.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeSlug === c.slug ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.accent || '#2563eb' }} />
            {c.title}
          </button>
        ))}
      </div>

      <LangTabs lang={lang} setLang={setLang} />

      {/* Hero text */}
      <Card title="Page Hero">
        <Field
          label="Tagline"
          value={enCourse.tagline || ''}
          onChange={v => set('tagline', v)}
          placeholder={activeCourse?.description || 'Short tagline shown under the title…'}
        />
        <Field
          label="Description"
          value={enCourse.description || ''}
          onChange={v => set('description', v)}
          rows={4}
          placeholder="Full course description…"
        />
      </Card>

      {/* Who is it for + features */}
      <Card title="Audience & Features">
        <ArrayField label="Who Is It For" items={enCourse.whoIsItFor || []} onChange={v => set('whoIsItFor', v)} placeholder="Add audience description…" />
        <ArrayField label="What Students Learn" items={enCourse.features || []} onChange={v => set('features', v)} placeholder="Add learning outcome…" />
      </Card>

      {/* Curriculum — language-neutral structure */}
      {!isKa && (
        <Card title="Curriculum">
          <p className="text-xs text-slate-400 -mt-2">Add modules with topics. Each module appears as a numbered section on the course page.</p>
          <CurriculumEditor
            modules={course.curriculum || []}
            onChange={v => setEn('curriculum', v)}
          />
        </Card>
      )}

      {/* Schedule — language-neutral */}
      {!isKa && (
        <Card title="Class Schedule">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Label</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Days</span>
          </div>
          <ScheduleEditor
            slots={course.schedule || []}
            onChange={v => setEn('schedule', v)}
          />
        </Card>
      )}

      {/* FAQ */}
      {!isKa && (
        <Card title="FAQ">
          <FaqEditor
            items={course.faq || []}
            onChange={v => setEn('faq', v)}
          />
        </Card>
      )}

      <SaveBar onSave={save} onReset={() => {}} saved={saved} />
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export function AdminPage() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language.startsWith('ka') ? 'ka' : 'en'
  const switchLang = (lang) => {
    if (lang === currentLang) return
    i18n.changeLanguage(lang)
    document.documentElement.lang = lang
  }
  const [firebaseUser, setFirebaseUser] = useState(undefined)
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, u => setFirebaseUser(u ?? null))
  }, [])

  const NAV = [
    { id: 'dashboard',        label: t('admin.nav.dashboard'),        Icon: LayoutDashboard },
    { id: 'hero',             label: t('admin.nav.hero'),             Icon: Image },
    { id: 'about',            label: t('admin.nav.about'),            Icon: Info },
    { id: 'stats',            label: t('admin.nav.stats'),            Icon: BarChart2 },
    { id: 'courses',          label: t('admin.nav.courses'),          Icon: BookOpen },
    { id: 'teachers',         label: t('admin.nav.teachers'),         Icon: Users },
    { id: 'testimonials',     label: t('admin.nav.testimonials'),     Icon: MessageSquare },
    { id: 'benefits',         label: t('admin.nav.benefits'),         Icon: Star },
    { id: 'contact',          label: t('admin.nav.contact'),          Icon: Phone },
    { id: 'cta',              label: t('admin.nav.cta'),              Icon: Megaphone },
    { id: 'page_about',       label: t('admin.nav.pageAbout'),        Icon: FileText },
    { id: 'page_faq',         label: t('admin.nav.pageFaq'),          Icon: HelpCircle },
    { id: 'page_teachers',    label: t('admin.nav.pageTeachers'),     Icon: GraduationCap },
    { id: 'page_testimonials',label: t('admin.nav.pageTestimonials'), Icon: MessageCircle },
    { id: 'page_courses',     label: t('admin.nav.pageCourses'),      Icon: Layers },
    { id: 'page_coursedetail',label: t('admin.nav.pageCourseDetail'), Icon: BookMarked },
    { id: 'blog',             label: 'Blog Posts',                    Icon: Newspaper },
    { id: 'settings',         label: t('admin.nav.settings'),         Icon: Settings },
  ]

  const handleLogout = () => signOut(auth)

  const navigate = (id) => {
    setActive(id)
    setSidebarOpen(false)
  }

  if (firebaseUser === undefined) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!firebaseUser) return <LoginPage />

  const sectionMap = {
    dashboard:          <DashboardSection />,
    hero:               <HeroSection />,
    about:              <AboutSection />,
    stats:              <StatsSection />,
    courses:            <CoursesSection />,
    teachers:           <TeachersSection />,
    testimonials:       <TestimonialsSection />,
    benefits:           <BenefitsSection />,
    contact:            <ContactSection />,
    cta:                <CTASection />,
    page_about:         <AboutPageSection />,
    page_faq:           <FAQPageSection />,
    page_teachers:      <TeachersPageSection />,
    page_testimonials:  <TestimonialsPageSection />,
    page_courses:       <CoursesPageSection />,
    page_coursedetail:  <CourseDetailSection />,
    blog:               <AdminBlogSection />,
    settings:           <SettingsSection onLogout={handleLogout} />,
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 z-30 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-none">{t('admin.brand')}</div>
              <div className="text-slate-500 text-xs mt-0.5">{t('admin.brandSub')}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
                active === id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Eye className="w-4 h-4 shrink-0" />
            {t('admin.nav.viewSite')}
          </a>
        </div>
      </aside>

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block">
            <span className="text-sm font-semibold text-slate-900">
              {NAV.find(n => n.id === active)?.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
              {['en', 'ka'].map(lang => (
                <button
                  key={lang}
                  onClick={() => switchLang(lang)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    currentLang === lang
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {lang === 'en' ? 'EN' : 'ქარ'}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('admin.signOut')}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {sectionMap[active]}
        </main>
      </div>
    </div>
  )
}
