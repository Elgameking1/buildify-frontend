/**
 * Applies the saved theme before the first paint.
 *
 * This runs as a render-blocking script in <head>, ahead of React, because the
 * alternative is a flash of the wrong theme: React cannot mount until the
 * bundle has parsed, and by then the browser has already painted a white page
 * to someone who chose dark.
 *
 * It is a separate file rather than an inline <script> on purpose. The
 * production CSP is `script-src 'self'` (see vite.config.js), which blocks
 * inline scripts outright - the usual inline theme snippet would simply never
 * run, and only in production, where it is hardest to notice.
 *
 * Only an explicit choice is written. Absence of the attribute means "follow
 * the device", which index.css already handles through prefers-color-scheme,
 * so there is nothing to do in that case.
 */
;(function () {
  try {
    var stored = localStorage.getItem('buildify.theme')
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored)
    }
  } catch {
    // Private-mode Safari throws on localStorage access. Falling through
    // leaves the device preference in charge, which is the right default.
  }
})()
