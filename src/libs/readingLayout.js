// X previews can clip a translation appended inside tweetText. Restore the
// site's original clamp automatically when the translation wrapper is removed.
export function installReadingLayout(setting, hostname = window.location.hostname) {
  if (!setting.readingWholePage || !/(^|\.)(x\.com|twitter\.com)$/.test(hostname)) return;
  if (document.querySelector('style[data-lian-du-reading-layout]')) return;
  const style = document.createElement('style');
  style.dataset.lianDuReadingLayout = '';
  style.textContent = `
    [data-testid="tweetText"]:has(.kiss-translator-wrapper) {
      display: block !important;
      -webkit-line-clamp: unset !important;
      max-height: none !important;
      overflow: visible !important;
    }
  `;
  (document.head || document.documentElement).append(style);
}
