/**
 * Every personal value for the site lives here.
 * Replace each value that contains the word TODO.
 */

/** The apex domain. No www, no trailing slash. */
export const DOMAIN = 'platybyte.net';

/** The canonical origin of the site. */
export const SITE_URL = `https://${DOMAIN}`;

/** The language tag used on the <html> element. */
export const LANG = 'en';

/** TODO: replace with your display name. */
export const NAME = 'TODO Your Name';

/** TODO: replace with your one-line bio. */
export const BIO = 'TODO short bio: one sentence about who you are.';

/** The avatar file you add at public/avatar.jpg. */
export const AVATAR = '/avatar.jpg';

/**
 * Profile URLs used for rel="me" links and for the two short redirects.
 * The `.invalid` hosts below never resolve. They are placeholders on purpose,
 * so that nothing points at a wrong real account before you fill them in.
 */
export const PROFILES = {
  /** TODO: replace with your real Mastodon profile URL. */
  mastodon: 'https://TODO-mastodon-instance.invalid/@TODO-you',
  /** TODO: replace with your real Vernissage profile URL. */
  vernissage: 'https://TODO-vernissage-instance.invalid/@TODO-you',
  /** TODO: replace with your real BookWyrm profile URL. */
  bookwyrm: 'https://TODO-bookwyrm-instance.invalid/user/TODO-you',
  /** The GitHub profile. */
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
 * TODO: a webmention endpoint URL, for example from webmention.io.
 * Leave it null until you have one. A null value prints an HTML comment
 * instead of a <link rel="webmention"> element.
 */
export const WEBMENTION_ENDPOINT: string | null = null;

/** Titles and descriptions for the feed and the sitemap. */
export const SITE_TITLE = NAME;
export const SITE_DESCRIPTION = BIO;
