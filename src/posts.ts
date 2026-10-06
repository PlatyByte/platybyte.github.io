import { getCollection, type CollectionEntry } from 'astro:content';
import { LANG } from './site';

export type Post = CollectionEntry<'blog'>;

/** Every post, newest first. */
export async function allPosts(): Promise<Post[]> {
  const posts = await getCollection('blog');
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/** The path of a post, relative to the site root. */
export function postPath(post: Post): string {
  return `/blog/${post.id}/`;
}

/** The first words of the body, for a note that has no title. */
export function excerpt(post: Post, limit = 160): string {
  if (post.data.description) return post.data.description;
  const text = (post.body ?? '')
    .replace(/^---[\s\S]*?---/, '')
    .replace(/[#>*_`\[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

/** The text shown in a list and in the <title> element. */
export function postLabel(post: Post): string {
  return post.data.title ?? excerpt(post, 60);
}

const dateFormat = new Intl.DateTimeFormat(LANG, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

/** A human readable date, for example "3 March 2026". */
export function readableDate(date: Date): string {
  return dateFormat.format(date);
}

/** The machine readable date for a <time datetime> attribute. */
export function machineDate(date: Date): string {
  return date.toISOString();
}
