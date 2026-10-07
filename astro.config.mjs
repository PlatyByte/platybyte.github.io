// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/site.ts';

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

  markdown: {
    // No syntax colours. Markdown only ever renders on a blog post, every
    // post wears the paper theme, and a typewriter has one ribbon. Shiki
    // writes its colours as inline styles, so leaving it on would mean
    // fighting them from the stylesheet. Plain `pre` and `code` let
    // src/styles/global.css set the ink. Set this to 'shiki' to get colours
    // back, and pick a light theme to suit the paper.
    syntaxHighlight: false,
  },

  // The short links /photos and /books are pages, not `redirects` entries.
  // Astro's generated redirect page shows the visitor a line of unstyled text
  // before it moves on. src/layouts/Redirect.astro does the same job without
  // the flash. Both are excluded from the sitemap, because neither is a page
  // anybody should land on.
  integrations: [
    sitemap({
      filter: (page) =>
        !page.endsWith('/photos/') && !page.endsWith('/books/'),
    }),
  ],

});
