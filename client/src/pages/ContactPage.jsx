import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { Contact } from '../components/sections/Contact'

export function ContactPage() {
  return (
    <PageLayout pageTitle="Contact Us">
      <PageHero
        eyebrow="Contact Us"
        title="Let's Start a"
        highlight="Conversation"
        subtitle="Have questions about our courses? Ready to enrol? Our team will get back to you within 24 hours."
      />
      <Contact />
    </PageLayout>
  )
}
