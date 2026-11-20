import { AtmosphereIndex } from './sections/AtmosphereIndex'
import { ClosingCta } from './sections/ClosingCta'
import { Hero } from './sections/Hero'
import { HowItWorks } from './sections/HowItWorks'
import { ListeningModes } from './sections/ListeningModes'
import { SiteFooter } from './sections/SiteFooter'

export function LandingPage() {
  return (
    <>
      <Hero />
      <main>
        <HowItWorks />
        <ListeningModes />
        <AtmosphereIndex />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  )
}
