import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { WhyChooseUs } from '../components/sections/WhyChooseUs'
import { Stats } from '../components/sections/Stats'
import { Testimonials } from '../components/sections/Testimonials'
import { CTA } from '../components/sections/CTA'

export function WhyUsPage() {
  const { t } = useTranslation()
  return (
    <PageLayout pageTitle={t('benefits.eyebrow')}>
      <PageHero
        eyebrow={t('benefits.eyebrow')}
        title={t('benefits.title')}
        highlight={t('benefits.titleHighlight')}
        subtitle={t('benefits.description')}
      />
      <WhyChooseUs />
      <Stats />
      <Testimonials />
      <CTA />
    </PageLayout>
  )
}
