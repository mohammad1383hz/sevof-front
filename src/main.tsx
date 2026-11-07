import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import I18nRoot from './i18n/I18nRoot.tsx'
import { initI18n } from './i18n'

// Pick the interface language (saved choice → visitor country by IP → English) before the first render.
initI18n().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <I18nRoot>
        <App />
      </I18nRoot>
    </StrictMode>,
  )
})
