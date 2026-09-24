import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/sora'
import './styles/tokens.css'
import './styles/base.css'
import './styles/ui.css'
import './styles/marketing.css'
import './styles/app.css'
import App from './app/App'
import { createContainer } from './app/container'
import { ServicesProvider } from './app/services'
import { applyTheme } from './services/settings/ThemeSetting'

const container = createContainer()
// Apply the saved theme before the first paint, so there is no flash of the wrong colours.
applyTheme(container.theme.get())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ServicesProvider container={container}>
      <App />
    </ServicesProvider>
  </StrictMode>,
)

// Offline support: cache the app after the first visit. Production builds only.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => undefined)
  })
}
