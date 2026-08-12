import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Build the Content-Security-Policy that is injected into index.html.
 *
 * The API origin has to be derived from VITE_API_URL rather than hard-coded:
 * `connect-src` must name the exact origin the app calls, and that differs
 * between the local backend and a deployed one.
 *
 * `style-src` needs 'unsafe-inline'. Tailwind v4 injects a <style> element at
 * runtime in dev, and framer-motion animates through the style attribute -
 * neither survives a strict style policy.
 *
 * Scripts stay locked to 'self' in the production build, which is the part that
 * matters here: the tokens live in localStorage, so script injection is
 * precisely the attack this is defending against. Dev additionally allows
 * inline scripts - see the note on `script` below for why it has no choice.
 */
function contentSecurityPolicy(apiUrl, isDev) {
  let apiOrigin = "'self'"
  try {
    apiOrigin = new URL(apiUrl).origin
  } catch {
    // Missing or malformed VITE_API_URL - fall back to same-origin only.
  }

  // Vite's dev server pushes HMR updates over a websocket on its own origin.
  const connect = ["'self'", apiOrigin, ...(isDev ? ['ws:', 'wss:'] : [])]

  // @vitejs/plugin-react injects its react-refresh preamble as an *inline*
  // module script, so a bare 'self' policy blocks it, React never bootstraps
  // and the page renders empty. Dev therefore has to allow inline scripts.
  // The production bundle emits no inline script, so the build keeps 'self'
  // and the guarantee described above holds where it actually matters.
  const script = ["'self'", ...(isDev ? ["'unsafe-inline'"] : [])]

  return [
    "default-src 'self'",
    `script-src ${script.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${[...new Set(connect)].join(' ')}`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ].join('; ')
}

function securityHeadersPlugin(env, isDev) {
  const csp = contentSecurityPolicy(env.VITE_API_URL, isDev)

  return {
    name: 'inject-security-meta',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content: csp },
            injectTo: 'head-prepend',
          },
          {
            tag: 'meta',
            attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' },
            injectTo: 'head-prepend',
          },
        ],
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react(), tailwindcss(), securityHeadersPlugin(env, mode !== 'production')],
  }
})
