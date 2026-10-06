import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { SITE_TITLE, SITE_DESCRIPTION, LANG } from '../site';
import { allPosts, postPath, postLabel, excerpt } from '../posts';

const parser = new MarkdownIt();

export const GET: APIRoute = async (context) => {
  const posts = await allPosts();

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    customData: `<language>${LANG}</language>`,
    items: posts.map((post) => ({
      title: postLabel(post),
      description: excerpt(post),
      pubDate: post.data.pubDate,
      link: postPath(post),
      // The full post body, so that a reader and Bridgy Fed get everything.
      content: sanitizeHtml(parser.render(post.body ?? ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'title', 'width', 'height'],
        },
      }),
    })),
  });
};
