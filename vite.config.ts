import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
// @ts-expect-error plain ESM script, no types
import { buildImages } from './scripts/images.mjs'
import { site } from './src/content/site.config'

const base = process.env.BASE_PATH || '/'
const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Fills the page title, description and share image from site.config.ts. */
function siteMeta(): Plugin {
  return {
    name: 'wedding:meta',
    transformIndexHtml(html) {
      // Link previews need an absolute image URL; set meta.url once the site has an address.
      const origin = site.meta.url.replace(/\/$/, '')
      const image = origin ? `${origin}/images/og.jpg` : `${base}images/og.jpg`
      return html
        .replaceAll('__TITLE__', escapeHtml(site.meta.title))
        .replaceAll('__DESCRIPTION__', escapeHtml(site.meta.description))
        .replaceAll('__OG_IMAGE__', image)
    },
  }
}

/** Re-runs the image optimiser whenever a file is added to or changed in public/images. */
function imageWatcher(): Plugin {
  let timer: ReturnType<typeof setTimeout> | undefined
  return {
    name: 'wedding:image-watcher',
    apply: 'serve',
    configureServer(server) {
      const dir = resolve(server.config.root, 'public/images')
      const onChange = (file: string) => {
        if (!file.startsWith(dir) || file.includes('/_gen/')) return
        clearTimeout(timer)
        timer = setTimeout(() => {
          buildImages({ quiet: true }).catch((err: unknown) => server.config.logger.error(String(err)))
        }, 250)
      }
      server.watcher.on('add', onChange).on('change', onChange).on('unlink', onChange)
    },
  }
}

/** GitHub Pages serves 404.html for unknown paths, which lets the SPA router take over. */
function spaFallback(): Plugin {
  return {
    name: 'wedding:spa-fallback',
    apply: 'build',
    closeBundle() {
      const index = resolve('dist/index.html')
      if (existsSync(index)) copyFileSync(index, resolve('dist/404.html'))
    },
  }
}

export default defineConfig({
  // GitHub Pages project sites live under /<repo>/. The workflow sets BASE_PATH; Vercel uses '/'.
  base,
  plugins: [react(), siteMeta(), imageWatcher(), spaFallback()],
  build: { target: 'es2020' },
})
