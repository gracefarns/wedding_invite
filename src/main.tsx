import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/jost/latin-300.css'
import '@fontsource/jost/latin-400.css'
import '@fontsource/cormorant-garamond/latin-300.css'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/monsieur-la-doulaise/latin-400.css'
import 'lenis/dist/lenis.css'

import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/intro.css'
import './styles/home.css'
import './styles/pages.css'

import App from './App'
import { images } from './content/images'
import { variantUrl } from './lib/images'

// The paper grain is an image; hand its URL to CSS so every paper surface can use it.
const grain = variantUrl(images.grain.file, 512)
if (grain) document.documentElement.style.setProperty('--grain', `url("${grain}")`)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
