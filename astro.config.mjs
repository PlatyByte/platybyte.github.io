// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL, PROFILES } from './src/site.ts';

export default defineConfig({
  // The apex domain. Used for absolute URLs in the feed, the sitemap and
  // the microformats permalinks.
  site: SITE_URL,

  // No `base` on purpose: the site lives at the root of the apex domain.

  // Every URL ends with a slash. GitHub Pages serves index.html for a
  // directory, so this format needs no server configuration.
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },

  integrations: [sitemap()],

  // Short links. In a static build Astro writes a small HTML page with a
  // meta refresh tag and a canonical link for each entry.
  redirects: {
    '/photos': PROFILES.vernissage,
    '/books': PROFILES.bookwyrm,
  },
});
