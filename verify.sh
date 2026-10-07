#!/usr/bin/env bash
# Check that the build output carries the markup Mastodon and Bridgy Fed read.
# Run `npm run build` first. The script exits non-zero on the first failure.
set -euo pipefail

DIST=dist
fail=0

check() {
  local label=$1 file=$2 pattern=$3
  if grep -q -- "$pattern" "$file"; then
    printf 'ok    %s\n' "$label"
  else
    printf 'FAIL  %s  (%s in %s)\n' "$label" "$pattern" "$file"
    fail=1
  fi
}

absent() {
  local label=$1 path=$2
  if [ -e "$path" ]; then
    printf 'FAIL  %s  (%s exists and must not)\n' "$label" "$path"
    fail=1
  else
    printf 'ok    %s\n' "$label"
  fi
}

[ -d "$DIST" ] || { echo "No $DIST directory. Run: npm run build"; exit 1; }

echo '-- head of the homepage'
check 'rel=me links present' "$DIST/index.html" 'rel="me" href='
printf '      rel=me links in the whole page: %s (3 in <head>, 3 visible, 1 self)\n' \
  "$(grep -o 'rel="me" href=' "$DIST/index.html" | wc -l)"
check 'rel=me link elements in head' "$DIST/index.html" '<link rel="me" href='
check 'rss alternate link'        "$DIST/index.html" '<link rel="alternate" type="application/rss+xml"'
check 'canonical link'            "$DIST/index.html" '<link rel="canonical"'

echo '-- h-card on the homepage'
check 'h-card wrapper' "$DIST/index.html" 'class="h-card"'
check 'p-name'         "$DIST/index.html" 'class="p-name"'
check 'u-url'          "$DIST/index.html" 'u-url'
check 'u-photo'        "$DIST/index.html" 'u-photo'
check 'p-note'         "$DIST/index.html" 'p-note'

echo '-- h-entry on each post'
# The posts are whatever is in src/data/blog, so find them instead of naming
# them. With no posts there is nothing to check, and the script says so.
posts=$(find "$DIST/blog" -mindepth 2 -name index.html 2>/dev/null | sort)
if [ -z "$posts" ]; then
  echo 'skip  no posts in the build, so the h-entry markup is unchecked'
  echo '      write a post in src/data/blog and run this again'
else
  for post in $posts; do
    label=$(basename "$(dirname "$post")")
    check "h-entry wrapper  [$label]" "$post" 'class="h-entry"'
    check "dt-published     [$label]" "$post" 'class="dt-published"'
    check "absolute u-url   [$label]" "$post" 'class="u-url" href="https://platybyte.net/blog/'
    check "e-content        [$label]" "$post" 'class="e-content"'
    check "p-author h-card  [$label]" "$post" 'class="p-author h-card"'
  done
fi

echo '-- feed'
check 'the feed exists' "$DIST/rss.xml" '<rss version="2.0"'
if [ -z "$posts" ]; then
  echo 'skip  the feed has no items, because there are no posts yet'
else
  check 'full content in the feed' "$DIST/rss.xml" '<content:encoded>'
  check 'absolute item link'       "$DIST/rss.xml" '<link>https://platybyte.net/blog/'
fi

echo '-- images'
check 'banner on the homepage'  "$DIST/index.html" 'class="banner"'
check 'banner is the og:image'  "$DIST/index.html" 'og:image" content="https://platybyte.net/banner.jpg"'
# Astro inlines a small stylesheet into the HTML and externalises a large
# one into _astro/, so search the whole build rather than one file.
if grep -rq 'cursor:url(/cursor.png)' "$DIST"; then
  printf 'ok    %s\n' 'platypus cursor on links'
else
  printf 'FAIL  %s\n' 'platypus cursor rule not found anywhere in the build'
  fail=1
fi
for f in banner.jpg avatar.jpg platybyte.jpg cursor.png favicon-32.png apple-touch-icon.png; do
  if [ -f "$DIST/$f" ]; then printf 'ok    %s present\n' "$f"
  else printf 'FAIL  %s missing from %s\n' "$f" "$DIST"; fail=1; fi
done

echo '-- deployment files'
# There is no CNAME file on purpose. With GitHub Actions as the publishing
# source, GitHub ignores any CNAME file in the artifact. The custom domain
# lives in Settings, then Pages.
absent 'no CNAME file in the build' "$DIST/CNAME"
check 'robots points to sitemap' "$DIST/robots.txt" 'Sitemap: https://platybyte.net/sitemap-index.xml'
check 'sitemap exists'           "$DIST/sitemap-index.xml" 'sitemap'

echo '-- short links'
check '/photos redirect page' "$DIST/photos/index.html" 'http-equiv="refresh"'
check '/books redirect page'  "$DIST/books/index.html"  'http-equiv="refresh"'

echo '-- paths that must stay unused for Bridgy Fed'
absent 'no webfinger file'  "$DIST/.well-known/webfinger"
absent 'no host-meta file'  "$DIST/.well-known/host-meta"

echo '-- remaining placeholders'
if grep -rliE 'TODO' "$DIST" >/dev/null 2>&1; then
  echo 'note  the build still contains TODO placeholders:'
  grep -rloiE 'TODO' "$DIST" | sed 's/^/        /'
else
  echo 'ok    no TODO placeholders left in the build'
fi

echo
if [ "$fail" -eq 0 ]; then
  echo 'All checks passed.'
else
  echo 'Some checks failed.'
  exit 1
fi
