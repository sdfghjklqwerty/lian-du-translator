// LianDu fork: reading sessions belong to one page, not the entire tab/site.
export function getReadingPageIdentity(href) {
  try {
    const url = new URL(href);
    // Ordinary article anchors stay in the current page. Hash-based SPA routes
    // are pages, just like X's pathname routes.
    const routeHash = /^#!?\//.test(url.hash) ? url.hash : "";
    return `${url.origin}${url.pathname}${url.search}${routeHash}`;
  } catch {
    return href || "";
  }
}
