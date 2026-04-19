import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Bot } from 'lucide-react'
import { useSiteData } from '../../context/SiteDataContext'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-8b-instant'

function buildSystemPrompt(siteData, isKa) {
  const { courses, contact, stats } = siteData
  return `You are a friendly AI assistant for Kutaisi English Academy, an English language school in Kutaisi, Georgia. ${isKa ? 'Respond in Georgian if the user writes in Georgian, in English if they write in English.' : 'Respond in the same language the user uses.'}

Academy details:
- Address: ${contact.address}
- Phone: ${contact.phone}
- Email: ${contact.email}
- Hours: ${contact.hours}
- ${stats[0]?.value}${stats[0]?.suffix} students, ${stats[2]?.value} years of excellence, ${stats[3]?.value}${stats[3]?.suffix} success rate

Courses:
${courses.map(c => `• ${c.title} (${c.level}) — ${c.price} ${c.priceNote}, ${c.duration}, ${c.sessionsPerWeek}, max ${c.groupSize}`).join('\n')}

Rules: Be warm and concise (2–4 sentences). Help users pick the right course. Mention the free placement test. Don't invent facts. If unsure, suggest calling or emailing the academy.`
}

export function AIChatWidget() {
  const { i18n } = useTranslation()
  const { siteData } = useSiteData()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [greeted, setGreeted] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const isKa = i18n.language.startsWith('ka')
  const ui = {
    title:       isKa ? 'AI ასისტენტი'            : 'AI Assistant',
    subtitle:    isKa ? 'ქუთ. ინგლისური აკადემია'  : 'Kutaisi English Academy',
    placeholder: isKa ? 'დაწერეთ შეტყობინება…'     : 'Type a message…',
    powered:     isKa ? 'AI-ით • Groq'              : 'Powered by AI • Groq',
    greeting:    isKa
      ? 'გამარჯობა! მე ვარ ქუთაისის ინგლისური აკადემიის AI ასისტენტი. რომელი კურსი გაინტერესებთ? 😊'
      : "Hi! I'm the AI assistant for Kutaisi English Academy. Which course are you interested in? 😊",
    error:       isKa ? 'შეცდომა მოხდა. სცადეთ თავიდან.' : 'Something went wrong. Please try again.',
  }

  useEffect(() => {
    if (open && !greeted) {
      setMessages([{ role: 'assistant', content: ui.greeting }])
      setGreeted(true)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const history = [...messages, { role: 'user', content: text }]
    setMessages(history)
    setInput('')
    setLoading(true)

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      if (!apiKey) throw new Error('no key')

      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: buildSystemPrompt(siteData, isKa) },
            ...history.map(m => ({ role: m.role, content: m.content })),
          ],
          stream: true,
          max_tokens: 350,
          temperature: 0.7,
        }),
      })

      if (!res.ok) throw new Error(res.status)

      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let reply = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of dec.decode(value).split('\n')) {
          if (!line.startsWith('data: ') || line === 'data: [DONE]') continue
          try {
            const delta = JSON.parse(line.slice(6)).choices[0]?.delta?.content || ''
            reply += delta
            setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: reply }])
          } catch {}
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: ui.error }])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 w-[340px] sm:w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
            style={{ maxHeight: '520px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 bg-blue-700 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-white leading-none">{ui.title}</div>
                <div className="text-xs text-blue-200 mt-0.5 truncate">{ui.subtitle}</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-700 text-white rounded-br-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm'
                    }`}
                  >
                    {msg.content || (
                      <span className="flex gap-1 items-center h-4">
                        {[0, 150, 300].map(d => (
                          <span
                            key={d}
                            className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${d}ms` }}
                          />
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-slate-100 dark:border-slate-700 shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  rows={1}
                  placeholder={ui.placeholder}
                  disabled={loading}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none transition-all disabled:opacity-60"
                  style={{ maxHeight: '80px' }}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="p-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white disabled:text-slate-400 rounded-xl transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-2">{ui.powered}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={ui.title}
        className="relative w-14 h-14 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-lg shadow-blue-700/30 flex items-center justify-center transition-colors duration-200"
      >
        <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20" />
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Sparkles className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
