# Encounters in Joy — Website

The static website for [Encounters in Joy, Inc.](https://encountersinjoy.org), a 501(c)(3)
counseling ministry based in Statham, GA, serving Barrow County and surrounding areas.

## Stack

- Plain static HTML + Tailwind, compiled once at build time into `assets/site.css` (fonts self-hosted in `assets/fonts/`). See [Styles, fonts, images, favicon](#styles-fonts-images-favicon).
- Hosted on Netlify
- Lead form via Netlify Forms
- Blog: [Decap CMS](https://decapcms.org/) editor at `/admin/` + a small build script (no framework)
- Blog comments: Netlify Forms + Netlify Functions + Netlify Blobs, moderated at `/admin/comments.html`
- Analytics: Google Analytics 4 + Microsoft Clarity
- Indexed via Google Search Console

## Local development

Install the build packages once, build the stylesheet and the blog pages, then
serve the folder with any static server:

```bash
npm install
```

```bash
npm run build
```

```bash
# Python
python -m http.server 3000

# Node (npx)
npx serve .
```

Then visit `http://localhost:3000`. (`assets/site.css` is committed, so the
hand-written pages also open fine directly in a browser; `npm run build` is only
needed after changing blog posts, or Tailwind classes anywhere in the site.)

To try the blog editor locally, run `npx decap-server` in a second terminal, then open
`http://localhost:3000/admin/` and click **Login** — no password needed locally. Posts
you save land in `blog/posts/`; run the build again to see them.

Blog comments need the Netlify Functions running; see
[Comments → Trying it locally](#trying-it-locally).

## Blog

### For authors (the therapists)

1. Go to **encountersinjoy.org/admin/** and log in (Google, Microsoft, or the
   email/password from your invitation).
2. Click **New Blog Post**. Fill in the title, date, author, and a one-to-two
   sentence summary, then write the post using the toolbar (headings, bold,
   links, quotes, lists, photos). The right-hand pane previews it.
3. Click **Publish → Publish now**. The post is live at
   `encountersinjoy.org/blog/<title-as-a-slug>/` within about a minute.

Turn on **Save as draft** to save without publishing. To edit or unpublish later,
open the post from the list; drafts are hidden from the website but kept.

### Login setup (DecapBridge)

Logins are handled by [DecapBridge](https://decapbridge.com) (free for up to 3 sites
/ 10 authors) so authors never need a GitHub account. The site is registered there
under the owner's account (repo `toddhaag77/encounters-in-joy-website`, CMS URL
`https://encountersinjoy.org/admin/`, PKCE auth), and the matching backend block
lives in `admin/config.yml`.

- **Invite an author:** DecapBridge dashboard → My Sites → the site →
  **Manage collaborators** → enter their email → *Send invitation email*. They
  get a link to set up a Google, Microsoft, or password login.
- **If the GitHub token expires or is revoked:** dashboard → the site →
  **Settings** → paste a new fine-grained token (Contents + Pull requests:
  read/write on the repo).
- **If the backend block ever needs regenerating:** dashboard → the site →
  **config.yml** tab; copy it over the `backend:` block in `admin/config.yml`.

### How it works

- Posts are Markdown files in `blog/posts/` with a small header (title, date,
  author, summary, photo, draft). The editor writes these files to GitHub.
- Every push to `main` makes Netlify run `npm run build` (see `netlify.toml`
  and `package.json`). Its blog half, `node tools/build-blog.js`, generates
  `blog/index.html`, one page per post at `blog/<slug>/index.html`,
  `blog/feed.xml` (RSS), and refreshes the blog entries in `sitemap.xml`. Those
  generated files are git-ignored. (The other half compiles the stylesheet.)
- Page templates (nav, footer, article styling) live in `tools/blog-templates.js`.
  `tools/vendor/` holds the two libraries the blog build uses (marked, js-yaml)
  so it needs no packages of its own. (Netlify's `npm install` is for the
  stylesheet and the comment functions; see [Comments](#comments).)
- Photos uploaded in the editor go to `images/blog/`. On the live site they are
  served through Netlify's Image CDN (resized + compressed), so big phone photos
  are fine.
- A post that can't be read (missing title/date, broken header) is skipped with a
  warning in the Netlify build log; it never breaks the deploy.

### Adding an author

Add the name to the `author` options in `admin/config.yml`, and (optionally) a
photo, role and two-sentence bio in the `AUTHORS` list at the top of
`tools/blog-templates.js`. The bio shows under every post by that author and goes
into the post's structured data, so keep it factual and in step with the
credentials on `about.html#team`.

### Updating the editor

The editor version is pinned in `admin/index.html`
(`decap-cms@3.16.0`). Change the number to upgrade.

## Comments

Every blog post ends with share buttons and a comment section. Comments go
live the moment they're posted; nothing waits for approval. Readers give a
name, the comment, and (optionally) an email address that is never shown.

### For moderators

- **Netlify emails you about every new comment**, the same way it emails
  lead-form submissions (the form is called `blog-comment`). If the person
  left an email address, replying to that email reaches them privately.
- **To remove a comment or block someone**, go to
  **encountersinjoy.org/admin/comments.html** and sign in with the comments
  password. Bookmark it.
  - **Delete** removes one comment.
  - **Block & delete** removes the comment and keeps that person's future
    comments off the site. It matches their email address (if they gave one)
    and their internet connection, so anyone sharing that connection (the
    same home or church Wi-Fi) is blocked too. Undo it under **Blocked** at
    the bottom of the page.
- Netlify's spam filter stops most junk before it appears. A real comment it
  flags by mistake never shows on the site; it sits in Netlify → Forms →
  `blog-comment` → Spam.

### One-time setup (site owner)

1. Netlify → the site → **Site configuration → Environment variables → Add a
   variable**: key `COMMENTS_ADMIN_PASSWORD`, value a long passphrase (four or
   more random words), scope **Functions**. Give it to the moderators.
2. **Deploys → Trigger deploy → Deploy site**, so the functions see the new
   variable. Until then the moderation page says moderation isn't switched on
   (comments still post and are kept).

Changing the password later is the same two steps; everyone then signs in again.

### How it works

- The form under each post is a Netlify Form (`blog-comment`) with a honeypot
  field and Netlify's spam filter. For every submission Netlify accepts, it runs
  `netlify/functions/submission-created.mjs`, which saves the comment in Netlify
  Blobs (store `blog-comments`, visible in Netlify under **Blobs**) unless the
  commenter is blocked.
- The post page loads its comments from `/api/comments?post=<slug>`
  (`netlify/functions/comments.mjs`), which returns names, comments and dates
  only, never email or IP addresses. The moderation page uses
  `/api/comments/admin` (`netlify/functions/comments-admin.mjs`), which requires
  the password. Shared storage code is in `netlify/lib/comments.mjs`.
- The share bar, comment section and the script that shows comments are in
  `tools/blog-templates.js`.
- Comments belong to a post's web address. If a post is renamed to a new
  address, its old comments stay with the old one.
- The functions use one package, `@netlify/blobs` (`package.json`), which
  Netlify installs on every deploy.
- Share buttons are plain links (Facebook, X, email, copy link, plus the phone's
  own share sheet where the browser has one), with no social-media scripts on
  the page. Clicks are recorded in Google Analytics as `share` events, and
  posted comments as `blog_comment`.

### Trying it locally

Run [`netlify dev`](https://docs.netlify.com/cli/local-development/) (Netlify
CLI) after `npm install` and `node tools/build-blog.js`. It serves the site with
the functions and a local Blobs store at `http://localhost:8888`. Put
`COMMENTS_ADMIN_PASSWORD=<anything>` in a `.env` file (git-ignored) to sign in to
the moderation page.

`netlify dev` doesn't run Netlify Forms, so a comment posted from the page shows
only until you reload. To save one, send the form event to the function yourself:

```bash
curl -X POST http://localhost:8888/.netlify/functions/submission-created -H "content-type: application/json" --data '{"payload":{"id":"test1","form_name":"blog-comment","created_at":"2026-10-26T12:00:00Z","data":{"post":"welcome-to-our-blog","post-title":"Welcome","name":"Test","comment":"Hello","ip":"192.0.2.1"}}}'
```

## Styles, fonts, images, favicon

- **Stylesheet.** Every page loads one compiled stylesheet, `assets/site.css`,
  built by `npm run build:css` from `tailwind.config.js` (the colour palette and
  font names) and `tools/tailwind.css` (the `@font-face` rules). Netlify rebuilds
  it on every deploy, and it is also committed so the pages work without a
  build. The pages used to load Tailwind's Play CDN, which generated the CSS in
  the visitor's browser on every visit (slow first paint, a flash of unstyled
  content); don't put that script back. If a page outside the repo root starts
  using Tailwind classes, add its path to `content` in `tailwind.config.js` or
  its classes won't be compiled.
- **Fonts.** Cormorant Garamond and Source Sans 3 are self-hosted in
  `assets/fonts/` (the Latin subsets Google Fonts serves, variable weight, SIL
  Open Font License), so no page waits on fonts.googleapis.com. Each page
  preloads the two files it paints first.
- **Images.** The logo, apple mark and counselor photos are served as WebP from
  `images/` (`eij-logo.webp`, `eij-logo-hero.webp`, `eij-apple.webp`,
  `jeff-langley.webp`, `stephanie-langley.webp`), sized for how they appear,
  with `width`/`height` on every `<img>` so nothing shifts while loading. The
  originals (`EIJ logo.png`, `WatercolorApple(4).png`, `Jeff.jpg`,
  `Stephanie.jpg`) stay in the repo as masters; regenerate the WebP files from
  them if a photo changes. `images/og-encounters-in-joy.jpg` (1200×630) is the
  preview image for links shared on Facebook, in texts, etc.
- **Favicon.** `favicon.ico`, `favicon-192.png` and `apple-touch-icon.png` in
  the root, cropped from the apple-and-cross logo. Google shows it beside the
  site name in mobile results.
- **Breadcrumbs.** Every page except the homepage shows a small breadcrumb trail
  under the menu (`<nav aria-label="Breadcrumb">`) with a matching
  `BreadcrumbList` block in its `<head>`; blog pages get theirs from the
  template. Keep the two in step when a page is renamed.

## Files

| File | Purpose |
|---|---|
| `index.html` | Homepage |
| `about.html` | About page: mission statement, programs, team, and the nonprofit details (legal name, EIN, office address). See [Nonprofit details](#nonprofit-details-google-for-nonprofits). |
| `services.html` | Programs and services |
| `contact.html` | Contact page (address, phone, email, and the lead form) |
| `grief.html`, `why-no-insurance.html`, `counseling-*-ga.html` | Service and city landing pages |
| `intake.html` | Intake-forms download page |
| `donate.html` | Donation page |
| `encounters_in_joy_intake-YYYY-MM.pdf` | Counseling intake PDF (download/print/bring). Exported from the ministry's Word master; the filename carries the revision. See [Revising the intake form](#revising-the-intake-form). |
| `intake-source/*.docx` | The Word masters the intake PDFs are exported from. Kept in git so revisions are reproducible; stripped from the deploy by the build command, so they are not downloadable from the site. |
| `admin/` | Blog editor (Decap CMS) and its `config.yml` |
| `admin/comments.html` | Comment moderation page (delete, block). See [Comments](#comments). |
| `netlify/functions/`, `netlify/lib/` | Server-side code for blog comments |
| `package.json`, `package-lock.json` | Build scripts and the two packages: `tailwindcss` (stylesheet) and `@netlify/blobs` (comment functions) |
| `tailwind.config.js`, `tools/tailwind.css` → `assets/site.css` | Stylesheet source and the compiled stylesheet every page loads. See [Styles](#styles-fonts-images-favicon). |
| `assets/fonts/` | Self-hosted web fonts |
| `images/*.webp`, `images/og-encounters-in-joy.jpg` | Site images (logo, apple mark, counselor photos) and the social preview image |
| `favicon.ico`, `favicon-192.png`, `apple-touch-icon.png` | Browser tab / search result / home screen icons |
| `blog/posts/*.md` | Blog post source files (the only blog files in git) |
| `tools/build-blog.js`, `tools/blog-templates.js` | Blog build script and page templates |
| `images/blog/` | Photos uploaded through the editor |
| `netlify.toml` | Netlify build command, functions folder, redirects + headers |
| `sitemap.xml` | Search engine sitemap (blog section is auto-generated) |
| `robots.txt` | Crawler directives |
| `Jeff.jpg`, `Stephanie.jpg` | Counselor headshot masters (the pages use the WebP copies in `images/`) |
| `WatercolorApple(4).png`, `EIJ logo.png` | Logo masters (the pages use the WebP copies in `images/`) |
| `eij with words.png` | Wordmark; the organization logo in structured data and the source of the social preview image |

## Nonprofit details (Google for Nonprofits)

Google for Nonprofits reviews this site before it will apply nonprofit pricing
to the `encountersinjoy.org` Google Workspace account. It requires the site to
show four things. Keep all four in place:

- **The EIN (83-4371871).** It is in the footer of every page (the line under
  the brand blurb), on `about.html`, `contact.html`, `donate.html`, and in the
  homepage's "Our mission" box.
- **A physical street address.** Already in every footer; also on `about.html`
  and `contact.html`.
- **A mission statement that describes the programs.** On `about.html`
  (`#mission`) and in the homepage's "Our mission" box. If the wording changes,
  change it in all three places: those two, and the organization `description`
  in the JSON-LD block in the `<head>` of `about.html`.
- **Separate pages, not one long page.** The top menu's About, Services, and
  Contact links go to their own pages. Don't turn them back into `#anchor`
  links to homepage sections — Google for Nonprofits does not accept
  single-page website layouts.

The footer and menu are repeated by hand in every page, so a change to either
has to be made in each `.html` file, in `tools/blog-templates.js` (the blog's
copy), and in `.claude/build_city_pages.py`, the local generator for the six
`counseling-*-ga.html` pages. That script is not in git (`.claude/` is
ignored); if you run it, check that its NAV and FOOTER match the committed
pages first, or it will overwrite them.

## Revising the intake form

The published PDF carries its revision in the filename —
`encounters_in_joy_intake-2025-08.pdf` — matching the `Rev MM/YY` printed in the
form's own footer. That way a new revision is a genuinely new URL, so no browser
or CDN can serve someone the previous form, and a counselor holding a printed
page can tell which file it came from.

The Word master each PDF was exported from lives beside it in
`intake-source/`, under the same name. That keeps a revision reproducible
instead of depending on a file in somebody's Downloads folder. The build command
deletes `intake-source/` from the deploy, so the editable masters stay in git
without being downloadable from the site — if you ever move or rename that
folder, update the build command in `netlify.toml` to match.

Two stable paths always point at the current revision, via 302 redirects in
`netlify.toml`:

- **`/intake-form.pdf`** — the durable link. Use this one in emails, on business
  cards, anywhere printed. It never changes.
- **`/encounters_in_joy_intake.pdf`** — the old unversioned path, kept alive so
  links shared before September 2026 keep working.

The redirects are deliberately `302`, not `301`: browsers cache a 301 more or
less forever, which would make the alias impossible to re-point.

### When Jeff sends a revised Word document

1. **Export it to PDF with Word itself** (not a converter — Word preserves the
   cover page, logo, and the form's spacing). From PowerShell:

   ```powershell
   $word = New-Object -ComObject Word.Application
   $doc  = $word.Documents.Open("C:\path\to\revised.docx", $false, $true)
   $doc.ComputeStatistics(2)          # page count — you need this for step 4
   $doc.SaveAs([ref]"C:\path\to\EIJ\encounters_in_joy_intake-YYYY-MM.pdf", [ref]17)
   $doc.Close($false); $word.Quit()
   ```

   Name it for the `Rev MM/YY` in the new form's footer.

2. **Commit the `.docx` to `intake-source/`** under the same name as the PDF, so
   the master and the file it produced always travel together.

3. **Delete the previous revision's PDF and its master.** Both stay recoverable
   from git history; leaving the old PDF deployed just invites someone to print
   the wrong one.

4. **Update `intake.html`** — the `href` on the download button, and the page
   count in the card (`PDF · N pages`). If the form got materially longer or
   shorter, revisit the "about 45–60 minutes" estimate in the body copy *and* in
   the `<meta name="description">`, which otherwise contradicts the page.

5. **Update `netlify.toml`** — both redirect targets and the `immutable`
   cache-header path, all four of which name the versioned file.

6. **Re-read the form for instructions the download card should surface.** The
   08/25 revision, for instance, says pages 7–8 are the counselee's to keep and
   that married couples each need their own copy of pages 9–15 — things someone
   printing at home needs to know before they hit print.

7. **Push, then verify against the live site,** not just the local preview:

   ```bash
   curl -sI https://encountersinjoy.org/intake-form.pdf          # 302 to the new file
   curl -s https://encountersinjoy.org/encounters_in_joy_intake-YYYY-MM.pdf -o live.pdf
   ```

## Deploys

This repo is connected to Netlify — every push to `main` triggers an auto-deploy
to `https://encountersinjoy.org`. Publishing a blog post is just a push made by
the editor, so it deploys the same way.

## Contact

- Phone: 770-807-1227 (voicemail; response within 24 hours)
- Email: brojefflangley@encountersinjoy.org
- Office: 2064 Highway 82, Statham, GA 30666
