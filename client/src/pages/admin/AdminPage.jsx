import { useState } from 'react'
import {
  LayoutDashboard, Image, Info, BarChart2, BookOpen, Users, MessageSquare,
  Star, Phone, Megaphone, LogOut, Menu, X, Save, RotateCcw, Plus, Trash2,
  Edit3, ChevronDown, ChevronUp, GripVertical, Eye, Settings, Shield
} from 'lucide-react'
import { useSiteData, DEFAULT_SITE_DATA } from '../../context/SiteDataContext'

const ADMIN_PW_KEY = 'kea-admin-pw'
const DEFAULT_PW = 'admin123'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getPassword() {
  return localStorage.getItem(ADMIN_PW_KEY) || DEFAULT_PW
}

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

function ArrayField({ label, items, onChange, placeholder = 'Add item…' }) {
  const add = () => onChange([...items, ''])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const update = (i, val) => onChange(items.map((x, idx) => idx === i ? val : x))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
        <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholder}
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
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
      <button
        onClick={onSave}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
      >
        <Save className="w-4 h-4" />
        Save Changes
      </button>
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl text-sm font-medium transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Reset to Default
      </button>
      {saved && (
        <span className="text-sm text-emerald-600 font-medium animate-pulse">Saved!</span>
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

// ─── Login ───────────────────────────────────────────────────────────────────

function LoginPage({ onLogin }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (pw === getPassword()) {
      onLogin()
    } else {
      setError('Incorrect password')
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
              <div className="font-bold text-slate-900 text-sm">Admin Panel</div>
              <div className="text-xs text-slate-400">Kutaisi English Academy</div>
            </div>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={pw}
                onChange={e => { setPw(e.target.value); setError('') }}
                placeholder="Enter admin password"
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
              {error && <p className="text-xs text-rose-500">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            Default password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">admin123</code>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function DashboardSection() {
  const { siteData } = useSiteData()
  const stats = [
    { label: 'Courses', value: siteData.courses.length, color: 'bg-blue-50 text-blue-700' },
    { label: 'Teachers', value: siteData.teachers.length, color: 'bg-purple-50 text-purple-700' },
    { label: 'Testimonials', value: siteData.testimonials.length, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Benefits', value: siteData.benefits.length, color: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back. All changes save to the browser and reflect on the site instantly.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <div className={`text-3xl font-bold mb-1 ${s.color.split(' ')[1]}`}>{s.value}</div>
            <div className="text-xs text-slate-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <Card title="Quick Guide">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
          {[
            { icon: '✏️', text: 'Edit any section from the sidebar — changes apply to the live site immediately.' },
            { icon: '💾', text: 'Click "Save Changes" after editing. Data persists in the browser (localStorage).' },
            { icon: '↩️', text: 'Use "Reset to Default" to revert any section to its original content.' },
            { icon: '👁️', text: 'Open the site in another tab to preview your changes in real time.' },
          ].map((tip, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-xl shrink-0">{tip.icon}</span>
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const { siteData, updateSection, resetSection } = useSiteData()
  const [data, setData] = useState(siteData.hero)
  const [saved, setSaved] = useState(false)

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  const save = () => {
    updateSection('hero', data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('hero')
    setData(DEFAULT_SITE_DATA.hero)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Hero Section</h1>
      <Card title="Main Content">
        <Field label="Badge Text" value={data.badge} onChange={v => set('badge', v)} placeholder="Now Enrolling…" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title" value={data.title} onChange={v => set('title', v)} />
          <Field label="Title Highlight" value={data.titleHighlight} onChange={v => set('titleHighlight', v)} />
        </div>
        <Field label="Subtitle" value={data.subtitle} onChange={v => set('subtitle', v)} rows={3} />
      </Card>
      <Card title="Trust Badges">
        <ArrayField label="Badges (shown below hero buttons)" items={data.trustBadges} onChange={v => set('trustBadges', v)} placeholder="e.g. 1200+ Students" />
      </Card>
      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  const { siteData, updateSection, resetSection } = useSiteData()
  const [data, setData] = useState(siteData.about)
  const [saved, setSaved] = useState(false)

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  const save = () => {
    updateSection('about', data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('about')
    setData(DEFAULT_SITE_DATA.about)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">About Section</h1>
      <Card title="Heading">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title" value={data.title} onChange={v => set('title', v)} />
          <Field label="Title Highlight" value={data.titleHighlight} onChange={v => set('titleHighlight', v)} />
        </div>
        <Field label="Description" value={data.description} onChange={v => set('description', v)} rows={3} />
      </Card>
      <Card title="Highlights (bullet list)">
        <ArrayField label="" items={data.highlights} onChange={v => set('highlights', v)} placeholder="Add highlight point…" />
      </Card>
      <Card title="Quote Block">
        <Field label="Quote" value={data.quote} onChange={v => set('quote', v)} rows={3} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Founder Name" value={data.founder} onChange={v => set('founder', v)} />
          <Field label="Founder Title" value={data.founderTitle} onChange={v => set('founderTitle', v)} />
        </div>
      </Card>
      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Stats Section ────────────────────────────────────────────────────────────

function StatsSection() {
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
      <h1 className="text-2xl font-bold text-slate-900">Statistics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <Card key={s.id} title={`Stat ${i + 1}`}>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Value" type="number" value={s.value} onChange={v => updateStat(i, 'value', v)} />
              <Field label="Suffix" value={s.suffix} onChange={v => updateStat(i, 'suffix', v)} placeholder="+ or %" />
              <div className="col-span-3">
                <Field label="Label" value={s.label} onChange={v => updateStat(i, 'label', v)} />
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
  const { siteData, updateSection, resetSection } = useSiteData()
  const [courses, setCourses] = useState(siteData.courses)
  const [active, setActive] = useState(0)
  const [saved, setSaved] = useState(false)

  const update = (i, key, val) => {
    setCourses(prev => prev.map((c, idx) => idx === i ? { ...c, [key]: val } : c))
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Courses</h1>

      {/* Tab bar */}
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

      <Card title="Course Info">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title" value={c.title} onChange={v => update(active, 'title', v)} />
          <Field label="Badge" value={c.badge} onChange={v => update(active, 'badge', v)} />
          <Field label="Level" value={c.level} onChange={v => update(active, 'level', v)} placeholder="e.g. A1 – A2" />
          <Field label="Slug (URL)" value={c.slug} onChange={v => update(active, 'slug', v)} hint="Used in URL: /courses/[slug]" />
        </div>
        <Field label="Description" value={c.description} onChange={v => update(active, 'description', v)} rows={3} />
      </Card>

      <Card title="Pricing & Schedule">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Price" value={c.price} onChange={v => update(active, 'price', v)} placeholder="₾180" />
          <Field label="Price Note" value={c.priceNote} onChange={v => update(active, 'priceNote', v)} placeholder="per month" />
          <Field label="Duration" value={c.duration} onChange={v => update(active, 'duration', v)} placeholder="3 months" />
          <Field label="Sessions / Week" value={c.sessionsPerWeek} onChange={v => update(active, 'sessionsPerWeek', v)} placeholder="3× per week" />
        </div>
        <Field label="Group Size" value={c.groupSize} onChange={v => update(active, 'groupSize', v)} placeholder="Up to 8 students" />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={c.popular}
              onChange={e => update(active, 'popular', e.target.checked)}
              className="w-4 h-4 rounded accent-blue-700"
            />
            <span className="text-sm font-medium text-slate-700">Mark as "Most Popular"</span>
          </label>
        </div>
      </Card>

      <Card title="What You'll Learn (features)">
        <ArrayField label="" items={c.features} onChange={v => update(active, 'features', v)} placeholder="Add learning outcome…" />
      </Card>

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
  const [data, setData] = useState({ ...EMPTY_TEACHER, ...teacher })
  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{teacher.id ? 'Edit Teacher' : 'Add Teacher'}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" value={data.name} onChange={v => set('name', v)} placeholder="John Smith" />
            <Field label="Title / Position" value={data.title} onChange={v => set('title', v)} placeholder="Senior English Teacher" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Avatar Initials" value={data.avatar} onChange={v => set('avatar', v.toUpperCase().slice(0, 2))} placeholder="JS" hint="2 capital letters" />
            <Field label="Experience" value={data.experience} onChange={v => set('experience', v)} placeholder="5+ years" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Avatar Color</label>
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
          <Field label="Bio" value={data.bio} onChange={v => set('bio', v)} rows={4} placeholder="Short biography…" />
          <ArrayField label="Credentials" items={data.credentials} onChange={v => set('credentials', v)} placeholder="e.g. CELTA" />
          <ArrayField label="Specialties" items={data.specialties} onChange={v => set('specialties', v)} placeholder="e.g. Business English" />
          <ArrayField label="Languages Spoken" items={data.languages} onChange={v => set('languages', v)} placeholder="e.g. English" />
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={() => onSave(data)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" /> Save Teacher
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:border-slate-300 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function TeachersSection() {
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
    if (!confirm('Delete this teacher?')) return
    setTeachers(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Teachers</h1>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Teacher
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
  const [data, setData] = useState({ ...EMPTY_TESTIMONIAL, ...item })
  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{item.id ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Student Name" value={data.name} onChange={v => set('name', v)} />
            <Field label="Avatar (2 letters)" value={data.avatar} onChange={v => set('avatar', v.toUpperCase().slice(0, 2))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role" value={data.role} onChange={v => set('role', v)} placeholder="University Student" />
            <Field label="Location" value={data.location} onChange={v => set('location', v)} placeholder="Kutaisi" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Avatar Color</label>
            <div className="flex gap-2 flex-wrap">
              {TESTIMONIAL_COLORS.map(color => (
                <button key={color} onClick={() => set('color', color)}
                  className={`w-7 h-7 rounded-lg ${color} border-2 transition-all ${data.color === color ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Star Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => set('rating', n)}
                  className={`w-8 h-8 rounded-lg text-lg transition-all ${n <= data.rating ? 'text-amber-400' : 'text-slate-200'}`}
                >★</button>
              ))}
            </div>
          </div>
          <Field label="Review Text" value={data.text} onChange={v => set('text', v)} rows={4} placeholder="Student review…" />
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={() => onSave(data)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" /> Save
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:border-slate-300 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection() {
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
    if (!confirm('Delete this testimonial?')) return
    setItems(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
        <button onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
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
  const { siteData, updateSection, resetSection } = useSiteData()
  const [benefits, setBenefits] = useState(siteData.benefits)
  const [saved, setSaved] = useState(false)

  const update = (i, key, val) => {
    setBenefits(prev => prev.map((b, idx) => idx === i ? { ...b, [key]: val } : b))
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
        <h1 className="text-2xl font-bold text-slate-900">Why Choose Us</h1>
        <button onClick={add}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Benefit
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefits.map((b, i) => (
          <Card key={i} title={`Benefit ${i + 1}`}>
            <Field label="Title" value={b.title} onChange={v => update(i, 'title', v)} />
            <Field label="Description" value={b.description} onChange={v => update(i, 'description', v)} rows={3} />
            <button onClick={() => remove(i)}
              className="self-start flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </Card>
        ))}
      </div>

      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Contact Section ──────────────────────────────────────────────────────────

function ContactSection() {
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
      <h1 className="text-2xl font-bold text-slate-900">Contact Information</h1>
      <Card title="Contact Details">
        <Field label="Phone Number" value={data.phone} onChange={v => set('phone', v)} placeholder="+995 599 123 456" />
        <Field label="Email Address" value={data.email} onChange={v => set('email', v)} placeholder="info@academy.ge" />
        <Field label="Address" value={data.address} onChange={v => set('address', v)} placeholder="12 Rustaveli Avenue, Kutaisi" />
        <Field label="Working Hours" value={data.hours} onChange={v => set('hours', v)} placeholder="Mon–Fri: 9:00–20:00" />
      </Card>
      <Card title="Social Media Links">
        <Field label="Facebook URL" value={data.social.facebook} onChange={v => setSocial('facebook', v)} placeholder="https://facebook.com/…" />
        <Field label="Instagram URL" value={data.social.instagram} onChange={v => setSocial('instagram', v)} placeholder="https://instagram.com/…" />
        <Field label="YouTube URL" value={data.social.youtube} onChange={v => setSocial('youtube', v)} placeholder="https://youtube.com/…" />
        <Field label="LinkedIn URL" value={data.social.linkedin} onChange={v => setSocial('linkedin', v)} placeholder="https://linkedin.com/…" />
      </Card>
      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── CTA Section ──────────────────────────────────────────────────────────────

function CTASection() {
  const { siteData, updateSection, resetSection } = useSiteData()
  const [data, setData] = useState(siteData.cta)
  const [saved, setSaved] = useState(false)

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  const save = () => {
    updateSection('cta', data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const reset = () => {
    resetSection('cta')
    setData(DEFAULT_SITE_DATA.cta)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">CTA Section</h1>
      <Card title="Content">
        <Field label="Badge" value={data.badge} onChange={v => set('badge', v)} placeholder="Limited Seats Available" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title" value={data.title} onChange={v => set('title', v)} />
          <Field label="Title Highlight" value={data.titleHighlight} onChange={v => set('titleHighlight', v)} />
        </div>
        <Field label="Description" value={data.description} onChange={v => set('description', v)} rows={3} />
      </Card>
      <Card title="Bullet Points">
        <ArrayField label="" items={data.benefits} onChange={v => set('benefits', v)} placeholder="e.g. Free Placement Test" />
      </Card>
      <SaveBar onSave={save} onReset={reset} saved={saved} />
    </div>
  )
}

// ─── Settings Section ─────────────────────────────────────────────────────────

function SettingsSection({ onLogout }) {
  const { resetAll } = useSiteData()
  const [newPw, setNewPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState('')

  const changePw = (e) => {
    e.preventDefault()
    if (newPw.length < 6) { setMsg('Password must be at least 6 characters'); return }
    if (newPw !== confirm) { setMsg('Passwords do not match'); return }
    localStorage.setItem(ADMIN_PW_KEY, newPw)
    setMsg('Password updated successfully!')
    setNewPw('')
    setConfirm('')
    setTimeout(() => setMsg(''), 3000)
  }

  const handleResetAll = () => {
    if (!confirm('This will reset ALL site content to defaults. This cannot be undone. Continue?')) return
    resetAll()
    setMsg('All content reset to defaults.')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <Card title="Change Admin Password">
        <form onSubmit={changePw} className="flex flex-col gap-4">
          <Field label="New Password" type="password" value={newPw} onChange={setNewPw} placeholder="Min. 6 characters" />
          <Field label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat password" />
          {msg && <p className={`text-sm font-medium ${msg.includes('success') ? 'text-emerald-600' : 'text-rose-500'}`}>{msg}</p>}
          <button type="submit" className="self-start flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors">
            Update Password
          </button>
        </form>
      </Card>
      <Card title="Danger Zone">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-slate-600 mb-3">Reset all site content to the original defaults. This will erase every change you've made across all sections.</p>
            <button
              onClick={handleResetAll}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset All Content to Defaults
            </button>
          </div>
        </div>
      </Card>
      <Card title="Session">
        <button
          onClick={onLogout}
          className="self-start flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-600 rounded-xl text-sm font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </Card>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

const NAV = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'hero', label: 'Hero Section', Icon: Image },
  { id: 'about', label: 'About', Icon: Info },
  { id: 'stats', label: 'Statistics', Icon: BarChart2 },
  { id: 'courses', label: 'Courses', Icon: BookOpen },
  { id: 'teachers', label: 'Teachers', Icon: Users },
  { id: 'testimonials', label: 'Testimonials', Icon: MessageSquare },
  { id: 'benefits', label: 'Why Choose Us', Icon: Star },
  { id: 'contact', label: 'Contact & Social', Icon: Phone },
  { id: 'cta', label: 'CTA Section', Icon: Megaphone },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return sessionStorage.getItem('kea-admin-session') === '1'
  })
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    dashboard: <DashboardSection />,
    hero: <HeroSection />,
    about: <AboutSection />,
    stats: <StatsSection />,
    courses: <CoursesSection />,
    teachers: <TeachersSection />,
    testimonials: <TestimonialsSection />,
    benefits: <BenefitsSection />,
    contact: <ContactSection />,
    cta: <CTASection />,
    settings: <SettingsSection onLogout={handleLogout} />,
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 z-30 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-none">KEA Admin</div>
              <div className="text-slate-500 text-xs mt-0.5">Content Manager</div>
            </div>
          </div>
        </div>

        {/* Nav */}
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

        {/* View site link */}
        <div className="px-3 py-4 border-t border-slate-800">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Eye className="w-4 h-4 shrink-0" />
            View Live Site
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
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
            Sign Out
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {sectionMap[active]}
        </main>
      </div>
    </div>
  )
}
