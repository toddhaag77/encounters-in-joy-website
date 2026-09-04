# Encounters in Joy — Website

The static website for [Encounters in Joy, Inc.](https://encountersinjoy.org), a 501(c)(3)
counseling ministry based in Statham, GA, serving Barrow County and surrounding areas.

## Stack

- Plain static HTML + Tailwind (loaded from CDN)
- Hosted on Netlify
- Lead form via Netlify Forms
- Blog: [Decap CMS](https://decapcms.org/) editor at `/admin/` + a small build script (no framework, no npm install)
- Analytics: Google Analytics 4 + Microsoft Clarity
- Indexed via Google Search Console

## Local development

Build the blog pages once, then serve the folder with any static server:

```bash
node tools/build-blog.js
```

```bash
# Python
python -m http.server 3000

# Node (npx)
npx serve .
```

Then visit `http://localhost:3000`. (`index.html` and the other hand-written pages
also open fine directly in a browser; only the blog needs the build step.)

To try the blog editor locally, run `npx decap-server` in a second terminal, then open
`http://localhost:3000/admin/` and click **Login** — no password needed locally. Posts
you save land in `blog/posts/`; run the build again to see them.

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
- Every push to `main` makes Netlify run `node tools/build-blog.js`
  (see `netlify.toml`), which generates `blog/index.html`, one page per post at
  `blog/<slug>/index.html`, `blog/feed.xml` (RSS), and refreshes the blog
  entries in `sitemap.xml`. Those generated files are git-ignored.
- Page templates (nav, footer, article styling) live in `tools/blog-templates.js`.
  `tools/vendor/` holds the two libraries the build uses (marked, js-yaml) so
  Netlify needs no `npm install`.
- Photos uploaded in the editor go to `images/blog/`. On the live site they are
  served through Netlify's Image CDN (resized + compressed), so big phone photos
  are fine.
- A post that can't be read (missing title/date, broken header) is skipped with a
  warning in the Netlify build log; it never breaks the deploy.

### Adding an author

Add the name to the `author` options in `admin/config.yml`, and (optionally) a
photo + role in the `AUTHORS` list at the top of `tools/blog-templates.js`.

### Updating the editor

The editor version is pinned in `admin/index.html`
(`decap-cms@3.16.0`). Change the number to upgrade.

## Files

| File | Purpose |
|---|---|
| `index.html` | Homepage |
| `grief.html`, `why-no-insurance.html`, `counseling-*-ga.html` | Service and city landing pages |
| `intake.html` | Intake-forms download page |
| `donate.html` | Donation page |
| `encounters_in_joy_intake.pdf` | Counseling intake PDF (download/print/bring) |
| `admin/` | Blog editor (Decap CMS) and its `config.yml` |
| `blog/posts/*.md` | Blog post source files (the only blog files in git) |
| `tools/build-blog.js`, `tools/blog-templates.js` | Blog build script and page templates |
| `images/blog/` | Photos uploaded through the editor |
| `netlify.toml` | Netlify build command + headers |
| `sitemap.xml` | Search engine sitemap (blog section is auto-generated) |
| `robots.txt` | Crawler directives |
| `Jeff.jpg`, `Stephanie.jpg` | Counselor headshots (also used as blog author photos) |
| `WatercolorApple(4).png`, `eij with words.png`, `EIJ logo.png` | Logo assets |

## Deploys

This repo is connected to Netlify — every push to `main` triggers an auto-deploy
to `https://encountersinjoy.org`. Publishing a blog post is just a push made by
the editor, so it deploys the same way.

## Contact

- Phone: 770-807-1227 (voicemail; response within 24 hours)
- Email: brojefflangley@encountersinjoy.org
- Office: 2064 Highway 82, Statham, GA 30666
