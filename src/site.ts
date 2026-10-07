/**
 * Every personal value for the site lives here.
 * Every value is set. Nothing here is a placeholder any more.
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
 * Mastodon is the only one of these that verifies the domain back. It checks
 * for a rel="me" link here pointing at the profile, and shows a green mark
 * next to the matching link field on the profile.
 */
export const PROFILES = {
  mastodon: 'https://mastodon.social/@platybyte',
  vernissage: 'https://vernissage.photos/@platybyte',
  bookwyrm: 'https://bookwyrm.social/user/platybyte',
  github: 'https://github.com/PlatyByte',
} as const;

/** The order of the visible profile links and of the rel="me" links. */
export const PROFILE_LINKS = [
  { key: 'mastodon', label: 'Mastodon', href: PROFILES.mastodon },
  { key: 'vernissage', label: 'Vernissage (photos)', href: PROFILES.vernissage },
  { key: 'bookwyrm', label: 'BookWyrm (books)', href: PROFILES.bookwyrm },
  { key: 'github', label: 'GitHub', href: PROFILES.github },
] as const;

/**
 * The webmention endpoint, hosted by webmention.io. The service names every
 * endpoint after the domain it serves, so this URL is fixed by the domain.
 *
 * It only accepts a webmention once platybyte.net is registered there. Sign
 * in at https://webmention.io with "Sign in with your website". That uses
 * IndieAuth, which reads the rel="me" links on the homepage, and the GitHub
 * one is a provider it supports.
 *
 * Receiving a webmention is not the same as showing it. Nothing on this site
 * renders replies yet. The endpoint collects them, and webmention.io has an
 * API to read them back when there is something to show.
 */
export const WEBMENTION_ENDPOINT: string | null =
  'https://webmention.io/platybyte.net/webmention';

/** Titles and descriptions for the feed and the sitemap. */
export const SITE_TITLE = NAME;
export const SITE_DESCRIPTION = BIO;
