import { useEffect } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppButton } from '../ui/WhatsAppButton'
import { AIChatWidget } from '../ui/AIChatWidget'

export function PageLayout({ children, pageTitle }) {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = pageTitle
      ? `${pageTitle} | Kutaisi English Academy`
      : 'Kutaisi English Academy'
  }, [pageTitle])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <WhatsAppButton />
      <AIChatWidget />
    </div>
  )
}
