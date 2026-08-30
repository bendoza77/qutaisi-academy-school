import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { WhyChooseUs } from '../components/sections/WhyChooseUs'
import { Stats } from '../components/sections/Stats'
import { Testimonials } from '../components/sections/Testimonials'
import { CTA } from '../components/sections/CTA'
import { PhotoStrip } from '../components/sections/PhotoStrip'
import { HERO_BACKDROPS } from '../constants/media'

export function WhyUsPage() {
  const { t } = useTranslation()
  return (
    <PageLayout pageTitle={t('benefits.eyebrow')}>
      <PageHero
        eyebrow={t('benefits.eyebrow')}
        title={t('benefits.title')}
        highlight={t('benefits.titleHighlight')}
        subtitle={t('benefits.description')}
        bgImage={HERO_BACKDROPS.whyUs}
      />
      <WhyChooseUs />
      <PhotoStrip photos={['studyGroup', 'teacherAtBoard', 'conversation']} />
      <Stats />
      <Testimonials />
      <CTA />
    </PageLayout>
  )
}
