import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { WhyChooseUs } from '../components/sections/WhyChooseUs'
import { Stats } from '../components/sections/Stats'
import { Testimonials } from '../components/sections/Testimonials'
import { CTA } from '../components/sections/CTA'

export function WhyUsPage() {
  return (
    <PageLayout pageTitle="Why Choose Us">
      <PageHero
        eyebrow="Why Choose Us"
        title="Everything You Need to"
        highlight="Succeed"
        subtitle="We've built our academy around what actually works — research-backed methods, expert teachers, and an environment where students truly thrive."
      />
      <WhyChooseUs />
      <Stats />
      <Testimonials />
      <CTA />
    </PageLayout>
  )
}
