# platybyte.net

A static personal site. Astro builds it. GitHub Actions deploys it to GitHub
Pages on the apex domain `platybyte.net`.

The homepage is a hub: a bio, links to profiles elsewhere, and recent posts.
The blog lives under `/blog/`.

## Before you push

Open `src/site.ts` and replace every value that contains the word `TODO`.
Two are left: `NAME` and `BIO`. The three profile URLs are already set.

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

## Deployment status

This repository is `PlatyByte/platybyte.github.io`, and it already serves
another site. Read this before you change any Pages setting.

The Pages configuration today is a legacy branch build. It serves the branch
`simple-html` at the custom domain `blog.platybyte.net`, with a certificate
that expires on 2026-11-26. The branch `master` holds an older mkdocs site.
The default branch is `master`.

The workflow in this repository runs on a push to `main`. The build job
passes: it installs, builds and uploads `dist/` as the Pages artifact. The
deploy job stops with this message:

```
Branch "main" is not allowed to deploy to github-pages due to environment
protection rules.
```

The `github-pages` environment allows a deployment only from the default
branch and from the branch that Pages is configured to serve. That rule is
what protects the live `blog.platybyte.net` site right now.

One repository serves one Pages site with one custom domain. To put this
Astro site on the apex domain `platybyte.net` from this repository, you give
up `blog.platybyte.net`. The steps, in order, and each one is deliberate:

1. Decide what happens to `blog.platybyte.net`. The old content lives on the
   branches `simple-html` and `master`, so nothing is lost, but the address
   stops resolving to a site.
2. In Settings, then Pages, set Source to GitHub Actions. This ends the
   legacy branch build.
3. In Settings, then Environments, open `github-pages` and add `main` to the
   allowed deployment branches. Alternatively, make `main` the default
   branch, which allows it without an extra rule.
4. Add the DNS records for the apex, listed in the checklist below.
5. Re-run the workflow. The first successful deploy reads `public/CNAME`
   from the artifact and sets the custom domain to `platybyte.net`. The
   certificate for `blog.platybyte.net` stops applying at that moment.
6. Wait for the new certificate, then turn on "Enforce HTTPS".

If you want to keep `blog.platybyte.net` as it is, put this Astro site in a
second repository instead and point the apex domain at that one.

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
