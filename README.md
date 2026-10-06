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

This repository is `PlatyByte/platybyte.github.io`. It already serves another
site, so the switch to the apex domain takes a few deliberate steps.

The Pages configuration today is a legacy branch build. It serves the branch
`simple-html` at `blog.platybyte.net`, with a certificate that expires on
2026-11-26. The branch `master` holds an older mkdocs site. The default
branch is `master`.

The workflow in this repository runs on a push to `main`. The build job
passes. The deploy job stops with this message:

```
Branch "main" is not allowed to deploy to github-pages due to environment
protection rules.
```

The `github-pages` environment allows a deployment only from the default
branch and from the branch that Pages is configured to serve. That rule is
what protects the live site right now.

One repository serves one Pages site with one custom domain. Moving to the
apex domain `platybyte.net` therefore ends `blog.platybyte.net`. The artwork
that site shows is already part of this site, at `/platybyte.jpg`, so the
picture survives the move even though that address does not.

### The switch, in order

1. Add the DNS records for the apex at your registrar, listed further down.
   Do this first. The certificate request later needs them in place.
2. Open Settings, then Pages, and set Source to GitHub Actions. This ends
   the legacy branch build and `blog.platybyte.net` stops serving a site.
3. Open Settings, then Branches, and set the default branch to `main`. The
   `github-pages` environment allows the default branch, so this one change
   also clears the rule that rejected the deploy. If you keep `master` as
   the default, open Settings, then Environments, then `github-pages`, and
   add `main` to the allowed deployment branches instead.
4. Open the Actions tab, pick the last run of "Deploy to GitHub Pages", and
   press "Re-run all jobs". The `workflow_dispatch` trigger also works.
5. The deploy reads `public/CNAME` from the artifact and sets the custom
   domain to `platybyte.net`. Wait for the certificate, then turn on
   "Enforce HTTPS" in Settings, then Pages.
6. Open Settings on your account, then Pages, and verify `platybyte.net` as
   a verified domain. This stops another account from claiming it.

The branches `simple-html`, `master` and `gh-pages` keep their content
through all of this. Nothing is deleted.

## The artwork and the theme

The PlatyByte artwork is the same picture that `blog.platybyte.net` served.
It appears here in three sizes, all cut from the same 1024px original:

- `public/platybyte.jpg` is the original, byte for byte. The avatar links
  to it.
- `public/avatar.jpg` is a 384px crop of the head, shown in the `h-card`.
- `public/favicon-32.png` and `public/apple-touch-icon.png` are the icons,
  cut from the same crop.

The palette in `src/styles/global.css` is sampled from that picture. The
sunset haze gives the light background, the darkest fur gives the light
text, the deep water teal gives the light link colour and the dark
background, and the cyan robot eye gives the dark link colour. Every pair
was measured against the WCAG AA ratio of 4.5:1 and passes. The comment at
the top of the stylesheet lists each source colour.

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
