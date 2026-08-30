import { useTranslation } from 'react-i18next'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Seo } from '../Seo'
import { FloatingHelpers } from '../ui/FloatingHelpers'

/**
 * Shell for every non-home route: header, main landmark, footer and the two
 * floating helpers. Scroll restoration lives in <ScrollToTop> in App.jsx.
 *
 * @param {{
 *   pageTitle?: string,
 *   description?: string,
 *   noIndex?: boolean,
 *   children: React.ReactNode
 * }} props
 */
export function PageLayout({ children, pageTitle, description, noIndex }) {
  const { i18n } = useTranslation()
  const isKa = i18n.language?.startsWith('ka')

  return (
    <div className="min-h-screen bg-canvas">
      <Seo title={pageTitle} description={description} noIndex={noIndex} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-white focus:px-4 focus:py-2 focus:text-btn focus:font-semibold focus:text-primary-900 focus:shadow-lg"
      >
        {isKa ? 'მთავარ კონტენტზე გადასვლა' : 'Skip to main content'}
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingHelpers />
    </div>
  )
}
