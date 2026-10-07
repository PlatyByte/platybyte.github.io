# platybyte.net

A static personal site. Astro builds it. GitHub Actions deploys it to GitHub
Pages on the apex domain `platybyte.net`.

The homepage is a hub: a bio, links to profiles elsewhere, and recent posts.
The blog lives under `/blog/`.

## Before you push

`src/site.ts` holds every personal value. The name, the bio and the three
profile URLs are set. One `TODO` is left, `WEBMENTION_ENDPOINT`, and it stays
null until you have an endpoint.

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

The state on 2026-10-06, read from the GitHub API and from public DNS:

- Pages build type: `legacy`, which means a branch build, not Actions.
- Pages source branch: `gh-pages`. That branch holds a `CNAME` file reading
  `blog.platybyte.net`, which is what pins the custom domain today.
- Pages custom domain: `blog.platybyte.net`. Enforce HTTPS is off.
- Default branch: `main`.
- The `github-pages` environment uses a custom branch allowlist holding
  `dendron-pages`, `gh-pages`, `master` and `simple-html`. `main` is absent.
- DNS: the nameservers are `dns1.registrar-servers.com` and
  `dns2.registrar-servers.com`, which is Namecheap. The apex `platybyte.net`
  has no `A` record and no `AAAA` record. `blog.platybyte.net` is a `CNAME`
  to `platybyte.github.io`. There is no `www` record and no domain
  verification `TXT` record.

The workflow in this repository runs on a push to `main`. The build job
passes. The deploy job stops with this message:

```
Branch "main" is not allowed to deploy to github-pages due to environment
protection rules.
```

A custom allowlist replaces the default-branch rule, so making `main` the
default branch does not clear this on its own. The branch has to be in the
list by name.

### There is no CNAME file, on purpose

GitHub documents this: "If you are publishing from a custom GitHub Actions
workflow, no `CNAME` file is created, and any existing `CNAME` file is
ignored and is not required." A file in the repository therefore cannot set
the custom domain. You set it in Settings, then Pages, or through the API.

That is why `public/CNAME` does not exist here. An earlier version of this
project shipped one. It did nothing.

### The switch, in order

One repository serves one Pages site with one custom domain. Moving to the
apex domain `platybyte.net` therefore ends `blog.platybyte.net`. The artwork
that site shows is already part of this site, at `/platybyte.jpg`, so the
picture survives the move even though that address does not.

1. Settings, then Environments, then `github-pages`, then Deployment
   branches and tags. Add a rule with the name `main`.
2. Settings, then Pages. Change Source from "Deploy from a branch" to
   "GitHub Actions". At this moment `blog.platybyte.net` stops serving a
   site. Do this before step 3, because while the branch build is active
   the `CNAME` file on `gh-pages` keeps resetting the custom domain.
3. On the same page, set Custom domain to `platybyte.net` and save. GitHub
   checks DNS, which still fails at this point. That is expected.
4. Add the DNS records at Namecheap, listed below. GitHub asks you to claim
   the domain before pointing DNS at it, because DNS aimed at GitHub's
   shared addresses without a claim lets another account host a site there.
5. Wait for the DNS check to pass and the certificate to be issued. This can
   take up to 24 hours.
6. Turn on "Enforce HTTPS" in Settings, then Pages.
7. Open the Actions tab, pick the last run of "Deploy to GitHub Pages" and
   press "Re-run all jobs". The `workflow_dispatch` trigger also works.

The branches `simple-html`, `master`, `gh-pages` and `dendron-pages` keep
their content through all of this. Nothing is deleted.

### DNS records at Namecheap

Open Domain List, then Manage for `platybyte.net`, then Advanced DNS. The
host `@` means the apex.

| Type   | Host | Value             |
| ------ | ---- | ----------------- |
| A      | `@`  | `185.199.108.153` |
| A      | `@`  | `185.199.109.153` |
| A      | `@`  | `185.199.110.153` |
| A      | `@`  | `185.199.111.153` |
| AAAA   | `@`  | `2606:50c0:8000::153` |
| AAAA   | `@`  | `2606:50c0:8001::153` |
| AAAA   | `@`  | `2606:50c0:8002::153` |
| AAAA   | `@`  | `2606:50c0:8003::153` |

Namecheap also offers an `ALIAS` record, and GitHub accepts one for an apex:
"To create an `ALIAS` or `ANAME` record, point your apex domain to the
default domain for your site." One `ALIAS` on `@` pointing at
`platybyte.github.io` replaces all eight records above. The eight records
are the documented default, so use them unless you prefer the single record.

Two optional records:

- A `CNAME` on host `www` pointing at `platybyte.github.io`, if you want
  `www.platybyte.net` to work. GitHub redirects it to the apex.
- A `TXT` record on host `_github-pages-challenge-platybyte` holding the
  token from your account Settings, then Pages. This verifies the domain and
  stops another account from claiming it. Get the token first, because it is
  generated per account.

The existing `blog` record is a `CNAME` to `platybyte.github.io`. Once the
custom domain is the apex, a request to `blog.platybyte.net` still reaches
GitHub but carries a host name GitHub no longer recognizes, so it answers
with a 404 page. Delete the record, or leave it and accept the 404. GitHub
Pages cannot redirect it to the apex.

Check the records once they propagate:

```sh
dig +short platybyte.net A
dig +short platybyte.net AAAA
```

## The banner, the artwork and the theme

`public/banner.jpg` is the synthwave banner: a striped sun over purple
mountains, mirrored in water above a neon grid. It is the reusable asset,
1536x1024, and it serves from `https://platybyte.net/banner.jpg` so other
sites can point at it. The homepage shows it as a wide strip, cropped by CSS
rather than by a second file, and it is the `og:image` for every page.

The PlatyByte artwork is the picture that `blog.platybyte.net` served. It
appears here in these forms:

- `public/platybyte.jpg` is the original, byte for byte, ungraded. The
  avatar links to it, so the picture as it was stays reachable.
- `public/avatar.jpg` is a 384px crop of the head, graded toward the banner.
- `public/favicon-32.png` and `public/apple-touch-icon.png` come from the
  same graded crop.
- `public/cursor.png` is the 20x25 bill cursor, graded the same way. Every
  link shows it, with the hotspot at the bill tip in the top left corner and
  `pointer` as the fallback.

### How the grading works

`tools/grade.py` does it, and it is reproducible. The script maps the
luminance of the source through a three stop ramp, from indigo `#140b2e` in
the shadows through magenta `#c7419a` in the midtones to amber `#ff9d5c` in
the highlights. It blends that result back over the original at 80 percent,
so the animal stays readable instead of flattening into a duotone. It then
masks the original cyan circuitry, the robot eye above all, and paints it
back brightened, so the eye reads as neon the way the banner's grid lines
do. Alpha survives, which is what keeps the cursor transparent.

Run it on any source:

```sh
python3 tools/grade.py input.png output.png
```

The script needs Pillow. It is not part of the site build, and the generated
files are committed, so a deploy never runs it.

### The palette

The site is dark only, on purpose. `src/styles/global.css` defines one
palette and there is no `prefers-color-scheme: light` block. A neon 1990s
look with a hint of Far Cry Blood Dragon has no light register, and a
half-hearted light mode reads worse than none. To bring one back, add the
media query and redefine the custom properties inside it.

The hues come from the banner and are then pushed harder. The sky darkens
almost to black at `#06040d`, the neon cyan grid becomes the link colour at
`#22e7ff`, the neon magenta grid becomes the hover and the glow at
`#ff2d95`, headings take a softer magenta at `#ff4fa8`, and the focus ring
takes a warning amber at `#ffcf3a` so it stays distinct from both link
states.

The 1990s cues are a monospace stack for headings, the navigation and the
dates, set in uppercase with wide letter spacing; a magenta glow on the
headings; scanlines over the banner; and a cyan to magenta gradient for the
horizontal rule.

Contrast against the page, measured: text 15.4:1, muted text 7.0:1, links
13.5:1, hover 5.9:1, headings 6.7:1, focus ring 13.8:1. All of it clears
WCAG AA and most clears AAA. Every glow is a shadow only. No glow carries
meaning and no body text depends on one, so the page still reads correctly
with text shadows disabled.

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
