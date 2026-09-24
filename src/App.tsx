import { Demo } from './components/Demo'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Principles } from './components/Principles'
import { Problem } from './components/Problem'
import { Roadmap } from './components/Roadmap'
import { useReveal } from './components/useReveal'

export default function App() {
  useReveal()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Problem />
        <Demo />
        <Principles />
        <Roadmap />
      </main>
      <Footer />
    </>
  )
}
