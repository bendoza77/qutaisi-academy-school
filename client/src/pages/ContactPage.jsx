import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'
import { PageHero } from '../components/ui/PageHero'
import { Contact } from '../components/sections/Contact'
import { PhotoStrip } from '../components/sections/PhotoStrip'
import { HERO_BACKDROPS } from '../constants/media'

export function ContactPage() {
  const { t } = useTranslation()
  return (
    <PageLayout pageTitle={t('contact.eyebrow')}>
      <PageHero
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        highlight={t('contact.titleHighlight')}
        subtitle={t('contact.description')}
        bgImage={HERO_BACKDROPS.contact}
      />
      <Contact />
      <PhotoStrip photos={['loveToLearn', 'workshop', 'globe']} tone="canvas" />

    </PageLayout>
  )
}
