# platybyte.net

A static personal site. Astro builds it. GitHub Actions deploys it to GitHub
Pages on the apex domain `platybyte.net`.

The homepage is a hub: a bio, links to profiles elsewhere, and recent posts.
The blog lives under `/blog/`.

## Before you push

Open `src/site.ts` and replace every value that contains the word `TODO`.
That file holds the display name, the bio, and the four profile URLs. The
profile URLs use reserved `.invalid` host names until you replace them, so
no link points at a wrong real account by accident.

Add your avatar at `public/avatar.jpg`. The homepage `h-card` reads it.

## Local commands

Install the dependencies once:

```sh
npm install
```

Start the development server at http://localhost:4321:

```sh
npm run dev
```

Build the static output into `dist/`:

```sh
npm run build
```

Serve `dist/` the way GitHub Pages will:

```sh
npm run preview
```

Report type errors in the Astro files:

```sh
npm run check
```

## How to add a post

Create a Markdown file in `src/data/blog/`. The file name becomes the URL.
A file named `my-first-post.md` becomes `/blog/my-first-post/`.

A post with a title:

```markdown
---
title: "My first post"
description: "One sentence that goes in the feed."
pubDate: 2026-10-20
---

The body of the post, in Markdown.
```

A note has no title. Leave the `title` field out:

```markdown
---
pubDate: 2026-10-20
---

A short thought. No title, no description.
```

The `pubDate` field is required. The `title`, `description` and `updatedDate`
fields are optional. The build fails if the frontmatter does not match the
schema in `src/content.config.ts`.

## How to delete the sample posts

Two sample posts ship with this repository. Delete both files:

```sh
rm src/data/blog/hello-world.md src/data/blog/a-short-note.md
```

The blog index, the homepage and the feed update on the next build. No other
file refers to them.

## Short links

`platybyte.net/photos` and `platybyte.net/books` send a visitor to your
Vernissage and BookWyrm profiles. The two targets live in the `redirects`
block of `astro.config.mjs`, which reads them from `src/site.ts`.

A static build turns each one into a small HTML page with a `meta refresh`
tag. GitHub Pages cannot send a real 301 response.

These are paths on your own domain, not subdomains. A `CNAME` record for
`photos.platybyte.net` pointing at a Vernissage server would not work,
because that server does not know the host name and holds no TLS certificate
for it, so the browser would report a certificate error before the page
loaded.

## Microformats and the feed

Bridgy Fed needs one of two things from a web site: microformats plus
webmention support, or a feed it can discover from the homepage. This site
provides both.

The homepage carries an `h-card`. Each post page carries an `h-entry`. The
`<head>` of every page links the feed at `/rss.xml`.

Check the build output after a build:

```sh
grep -o 'rel="me" href="[^"]*"' dist/index.html
grep -c 'h-card' dist/index.html
grep -c 'h-entry' dist/blog/hello-world/index.html
grep -o '<link rel="alternate"[^>]*>' dist/index.html
```

The script `./verify.sh` runs the full set of checks at once.

## Webmentions

This site sends no webmentions and receives none. To receive replies from
the fediverse you need a webmention endpoint. A hosted service such as
webmention.io provides one. Put its URL in `WEBMENTION_ENDPOINT` in
`src/site.ts`. The layout then prints a `<link rel="webmention">` element
instead of an HTML comment.

## What this repository does not contain

There is no `/.well-known/webfinger` file and no `/.well-known/host-meta`
file, on purpose. The Bridgy Fed handle for this site is
`@platybyte.net@web.brid.gy`, which needs neither path. A custom handle such
as `@me@platybyte.net` would need those two paths redirected to
`fed.brid.gy`, and GitHub Pages cannot send that kind of redirect.

## Version control

This repository uses Jujutsu (`jj`), colocated with Git. The `.git`
directory sits next to `.jj`, so plain `git` commands also work here.

The `main` bookmark already points at the first commit. Add a GitHub remote,
then push:

```sh
jj git remote add origin git@github.com:PlatyByte/platybyte.github.io.git
jj git push --bookmark main --allow-new
```

Later work follows the same shape. Describe the working copy commit, start a
new one, move the bookmark, then push:

```sh
jj describe -m "post: a new note"
jj new
jj bookmark set main -r @-
jj git push --bookmark main
```
