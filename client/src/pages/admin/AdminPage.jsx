import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Image, Info, BarChart2, BookOpen, Users, MessageSquare,
  Star, Phone, Megaphone, LogOut, Menu, X, Save, RotateCcw, Plus, Trash2,
  Edit3, Eye, Settings, Shield
} from 'lucide-react'
import { useSiteData, DEFAULT_SITE_DATA } from '../../context/SiteDataContext'

const ADMIN_PW_KEY = 'kea-admin-pw'
const DEFAULT_PW = 'admin123'

function getPassword() {
  return localStorage.getItem(ADMIN_PW_KEY) || DEFAULT_PW
}

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

// ─── Login ───────────────────────────────────────────────────────────────────

function LoginPage({ onLogin }) {
  const { t } = useTranslation()
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (pw === getPassword()) {
      onLogin()
    } else {
      setError(t('admin.login.incorrect'))
      setPw('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">{t('admin.login.title')}</div>
              <div className="text-xs text-slate-400">{t('admin.login.subtitle')}</div>
            </div>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{t('admin.login.password')}</label>
              <input
                type="password"
                value={pw}
                onChange={e => { setPw(e.target.value); setError('') }}
                placeholder={t('admin.login.placeholder')}
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
              {error && <p className="text-xs text-rose-500">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              {t('admin.login.signIn')}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            {t('admin.login.defaultPw')} <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">admin123</code>
          </p>
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
          <p className="text-xs text-slate-400">{t('admin.georgianHint')}</p>
          <Field label={t('admin.hero.badgeText')} value={ka.badge || ''} onChange={v => setKa('badge', v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.hero.titleLabel')} value={ka.title || ''} onChange={v => setKa('title', v)} />
            <Field label={t('admin.hero.titleHighlight')} value={ka.titleHighlight || ''} onChange={v => setKa('titleHighlight', v)} />
          </div>
          <Field label={t('admin.hero.subtitle')} value={ka.subtitle || ''} onChange={v => setKa('subtitle', v)} rows={3} />
          <ArrayField label={t('admin.hero.trustBadges')} items={ka.trustBadges || []} onChange={v => setKa('trustBadges', v)} />
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
          <p className="text-xs text-slate-400">{t('admin.georgianHint')}</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.hero.titleLabel')} value={ka.title || ''} onChange={v => setKa('title', v)} />
            <Field label={t('admin.hero.titleHighlight')} value={ka.titleHighlight || ''} onChange={v => setKa('titleHighlight', v)} />
          </div>
          <Field label={t('admin.courses.description')} value={ka.description || ''} onChange={v => setKa('description', v)} rows={3} />
          <ArrayField label={t('admin.about.highlights')} items={ka.highlights || []} onChange={v => setKa('highlights', v)} />
          <Field label={t('admin.about.quote')} value={ka.quote || ''} onChange={v => setKa('quote', v)} rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.about.founderName')} value={ka.founder || ''} onChange={v => setKa('founder', v)} />
            <Field label={t('admin.about.founderTitle')} value={ka.founderTitle || ''} onChange={v => setKa('founderTitle', v)} />
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
                <Field label={t('admin.stats.labelKa')} value={s.labelKa || ''} onChange={v => updateStat(i, 'labelKa', v)} />
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

function CoursesSection() {
  const { t } = useTranslation()
  const { siteData, updateSection, resetSection } = useSiteData()
  const [courses, setCourses] = useState(siteData.courses)
  const [active, setActive] = useState(0)
  const [lang, setLang] = useState('en')
  const [saved, setSaved] = useState(false)

  const update = (i, key, val) => {
    setCourses(prev => prev.map((c, idx) => idx === i ? { ...c, [key]: val } : c))
  }
  const updateKa = (i, key, val) => {
    setCourses(prev => prev.map((c, idx) => idx === i ? { ...c, ka: { ...(c.ka || {}), [key]: val } } : c))
  }

  const save = () => {
    updateSection('courses', courses)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('courses')
    setCourses(DEFAULT_SITE_DATA.courses)
  }

  const c = courses[active]
  const ka = c.ka || {}

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.courses.title')}</h1>

      <div className="flex gap-2 flex-wrap">
        {courses.map((course, i) => (
          <button
            key={course.id}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${active === i ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}
          >
            {course.title}
          </button>
        ))}
      </div>

      <LangTabs lang={lang} setLang={setLang} />

      {lang === 'en' ? (
        <>
          <Card title={t('admin.courses.courseInfo')}>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.hero.titleLabel')} value={c.title} onChange={v => update(active, 'title', v)} />
              <Field label={t('admin.courses.badge')} value={c.badge} onChange={v => update(active, 'badge', v)} />
              <Field label={t('admin.courses.level')} value={c.level} onChange={v => update(active, 'level', v)} placeholder="e.g. A1 – A2" />
              <Field label={t('admin.courses.slug')} value={c.slug} onChange={v => update(active, 'slug', v)} hint="Used in URL: /courses/[slug]" />
            </div>
            <Field label={t('admin.courses.description')} value={c.description} onChange={v => update(active, 'description', v)} rows={3} />
          </Card>
          <Card title={t('admin.courses.pricingSchedule')}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label={t('admin.courses.price')} value={c.price} onChange={v => update(active, 'price', v)} placeholder="₾180" />
              <Field label={t('admin.courses.priceNote')} value={c.priceNote} onChange={v => update(active, 'priceNote', v)} placeholder="per month" />
              <Field label={t('admin.courses.duration')} value={c.duration} onChange={v => update(active, 'duration', v)} placeholder="3 months" />
              <Field label={t('admin.courses.sessionsWeek')} value={c.sessionsPerWeek} onChange={v => update(active, 'sessionsPerWeek', v)} placeholder="3× per week" />
            </div>
            <Field label={t('admin.courses.groupSize')} value={c.groupSize} onChange={v => update(active, 'groupSize', v)} placeholder="Up to 8 students" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={c.popular}
                onChange={e => update(active, 'popular', e.target.checked)}
                className="w-4 h-4 rounded accent-blue-700"
              />
              <span className="text-sm font-medium text-slate-700">{t('admin.courses.mostPopular')}</span>
            </label>
          </Card>
          <Card title={t('admin.courses.features')}>
            <ArrayField label="" items={c.features} onChange={v => update(active, 'features', v)} placeholder="Add learning outcome…" />
          </Card>
        </>
      ) : (
        <Card title={t('admin.courses.georgianContent')}>
          <p className="text-xs text-slate-400">{t('admin.georgianHint')}</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.hero.titleLabel')} value={ka.title || ''} onChange={v => updateKa(active, 'title', v)} />
            <Field label={t('admin.courses.badge')} value={ka.badge || ''} onChange={v => updateKa(active, 'badge', v)} />
            <Field label={t('admin.courses.level')} value={ka.level || ''} onChange={v => updateKa(active, 'level', v)} />
          </div>
          <Field label={t('admin.courses.description')} value={ka.description || ''} onChange={v => updateKa(active, 'description', v)} rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.courses.duration')} value={ka.duration || ''} onChange={v => updateKa(active, 'duration', v)} />
            <Field label={t('admin.courses.sessionsWeek')} value={ka.sessionsPerWeek || ''} onChange={v => updateKa(active, 'sessionsPerWeek', v)} />
          </div>
          <Field label={t('admin.courses.groupSize')} value={ka.groupSize || ''} onChange={v => updateKa(active, 'groupSize', v)} />
          <ArrayField label={t('admin.courses.features')} items={ka.features || []} onChange={v => updateKa(active, 'features', v)} />
        </Card>
      )}

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
  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{teacher.id ? t('admin.teachers.editTeacher') : t('admin.teachers.addTeacher')}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-5">
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
                <button
                  key={color}
                  onClick={() => set('color', color)}
                  className={`w-8 h-8 rounded-lg ${color} border-2 transition-all ${data.color === color ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
          </div>
          <Field label={t('admin.teachers.bio')} value={data.bio} onChange={v => set('bio', v)} rows={4} placeholder="Short biography…" />
          <ArrayField label={t('admin.teachers.credentials')} items={data.credentials} onChange={v => set('credentials', v)} placeholder="e.g. CELTA" />
          <ArrayField label={t('admin.teachers.specialties')} items={data.specialties} onChange={v => set('specialties', v)} placeholder="e.g. Business English" />
          <ArrayField label={t('admin.teachers.languages')} items={data.languages} onChange={v => set('languages', v)} placeholder="e.g. English" />
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
  avatar: '', color: 'bg-blue-600', rating: 5, name: '', role: '', location: '', text: '',
}

function TestimonialModal({ item, onSave, onClose }) {
  const { t } = useTranslation()
  const [data, setData] = useState({ ...EMPTY_TESTIMONIAL, ...item })
  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{item.id ? t('admin.testimonials.editTestimonial') : t('admin.testimonials.addTestimonial')}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.testimonials.studentName')} value={data.name} onChange={v => set('name', v)} />
            <Field label={t('admin.testimonials.avatar')} value={data.avatar} onChange={v => set('avatar', v.toUpperCase().slice(0, 2))} />
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
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={() => onSave(data)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
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
              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {item.avatar}
              </div>
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
                  <p className="text-xs text-slate-400">{t('admin.georgianHint')}</p>
                  <Field label={t('admin.hero.titleLabel')} value={ka.title || ''} onChange={v => updateKa(i, 'title', v)} />
                  <Field label={t('admin.courses.description')} value={ka.description || ''} onChange={v => updateKa(i, 'description', v)} rows={3} />
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
  const [saved, setSaved] = useState(false)

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('admin.contact.title')}</h1>
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
          <p className="text-xs text-slate-400">{t('admin.georgianHint')}</p>
          <Field label={t('admin.cta.badge')} value={ka.badge || ''} onChange={v => setKa('badge', v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.cta.titleLabel')} value={ka.title || ''} onChange={v => setKa('title', v)} />
            <Field label={t('admin.cta.titleHighlight')} value={ka.titleHighlight || ''} onChange={v => setKa('titleHighlight', v)} />
          </div>
          <Field label={t('admin.cta.description')} value={ka.description || ''} onChange={v => setKa('description', v)} rows={3} />
          <ArrayField label={t('admin.cta.bulletPoints')} items={ka.benefits || []} onChange={v => setKa('benefits', v)} />
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

  const changePw = (e) => {
    e.preventDefault()
    if (newPw.length < 6) { setMsg(t('admin.settings.tooShort')); return }
    if (newPw !== confirmPw) { setMsg(t('admin.settings.noMatch')); return }
    localStorage.setItem(ADMIN_PW_KEY, newPw)
    setMsg(t('admin.settings.updated'))
    setNewPw('')
    setConfirmPw('')
    setTimeout(() => setMsg(''), 3000)
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

// ─── Main Admin Page ──────────────────────────────────────────────────��───────

export function AdminPage() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(() => {
    return sessionStorage.getItem('kea-admin-session') === '1'
  })
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const NAV = [
    { id: 'dashboard',    label: t('admin.nav.dashboard'),    Icon: LayoutDashboard },
    { id: 'hero',         label: t('admin.nav.hero'),         Icon: Image },
    { id: 'about',        label: t('admin.nav.about'),        Icon: Info },
    { id: 'stats',        label: t('admin.nav.stats'),        Icon: BarChart2 },
    { id: 'courses',      label: t('admin.nav.courses'),      Icon: BookOpen },
    { id: 'teachers',     label: t('admin.nav.teachers'),     Icon: Users },
    { id: 'testimonials', label: t('admin.nav.testimonials'), Icon: MessageSquare },
    { id: 'benefits',     label: t('admin.nav.benefits'),     Icon: Star },
    { id: 'contact',      label: t('admin.nav.contact'),      Icon: Phone },
    { id: 'cta',          label: t('admin.nav.cta'),          Icon: Megaphone },
    { id: 'settings',     label: t('admin.nav.settings'),     Icon: Settings },
  ]

  const handleLogin = () => {
    sessionStorage.setItem('kea-admin-session', '1')
    setLoggedIn(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('kea-admin-session')
    setLoggedIn(false)
  }

  const navigate = (id) => {
    setActive(id)
    setSidebarOpen(false)
  }

  if (!loggedIn) return <LoginPage onLogin={handleLogin} />

  const sectionMap = {
    dashboard:    <DashboardSection />,
    hero:         <HeroSection />,
    about:        <AboutSection />,
    stats:        <StatsSection />,
    courses:      <CoursesSection />,
    teachers:     <TeachersSection />,
    testimonials: <TestimonialsSection />,
    benefits:     <BenefitsSection />,
    contact:      <ContactSection />,
    cta:          <CTASection />,
    settings:     <SettingsSection onLogout={handleLogout} />,
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t('admin.signOut')}
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {sectionMap[active]}
        </main>
      </div>
    </div>
  )
}
