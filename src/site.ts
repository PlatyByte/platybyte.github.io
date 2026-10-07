/**
 * Every personal value for the site lives here.
 * One value still contains the word TODO: WEBMENTION_ENDPOINT.
 */

/** The apex domain. No www, no trailing slash. */
export const DOMAIN = 'platybyte.net';

/** The canonical origin of the site. */
export const SITE_URL = `https://${DOMAIN}`;

/** The language tag used on the <html> element. */
export const LANG = 'en';

/** The display name, used in the h-card, the page titles and the byline. */
export const NAME = 'PlatyByte';

/** One sentence, shown under the name and used as the meta description. */
export const BIO = 'Developer. Creating his own place on the internet.';

/**
 * The avatar, a 384px copy of the PlatyByte artwork.
 * ARTWORK is the full 1024px original, the same file that GitHub Pages
 * served at blog.platybyte.net. The avatar links to it.
 */
export const AVATAR = '/avatar.jpg';
export const ARTWORK = '/platybyte.jpg';

/** The synthwave banner. The site palette is sampled from this image. */
export const BANNER = '/banner.jpg';

/**
 * Profile URLs used for rel="me" links and for the two short redirects.
 *
 * There is no Mastodon entry, because there is no Mastodon account. To add
 * one later, put the URL here and add a line to PROFILE_LINKS below.
 */
export const PROFILES = {
  vernissage: 'https://vernissage.photos/@platybyte',
  bookwyrm: 'https://bookwyrm.social/user/platybyte',
  github: 'https://github.com/PlatyByte',
} as const;

/** The order of the visible profile links and of the rel="me" links. */
export const PROFILE_LINKS = [
  { key: 'vernissage', label: 'Vernissage (photos)', href: PROFILES.vernissage },
  { key: 'bookwyrm', label: 'BookWyrm (books)', href: PROFILES.bookwyrm },
  { key: 'github', label: 'GitHub', href: PROFILES.github },
] as const;

/**
 * TODO: a webmention endpoint URL, for example from webmention.io.
 * Leave it null until you have one. A null value prints an HTML comment
 * instead of a <link rel="webmention"> element.
 */
export const WEBMENTION_ENDPOINT: string | null = null;

/** Titles and descriptions for the feed and the sitemap. */
export const SITE_TITLE = NAME;
export const SITE_DESCRIPTION = BIO;
