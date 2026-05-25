# Encounters in Joy — Website

The static website for [Encounters in Joy, Inc.](https://encountersinjoy.org), a 501(c)(3)
counseling ministry based in Statham, GA, serving Barrow County and surrounding areas.

## Stack

- Plain static HTML + Tailwind (loaded from CDN)
- Hosted on Netlify
- Lead form via Netlify Forms
- Analytics: Google Analytics 4 + Microsoft Clarity
- Indexed via Google Search Console

## Local development

Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
# Python
python -m http.server 3000

# Node (npx)
npx serve .
```

Then visit `http://localhost:3000`.

## Files

| File | Purpose |
|---|---|
| `index.html` | Homepage |
| `intake.html` | Intake-forms download page |
| `encounters_in_joy_intake.pdf` | Counseling intake PDF (download/print/bring) |
| `sitemap.xml` | Search engine sitemap |
| `robots.txt` | Crawler directives |
| `Jeff.jpg`, `Stephanie.jpg` | Counselor headshots |
| `WatercolorApple(4).png`, `eij with words.png` | Logo assets |

## Deploys

This repo is connected to Netlify — every push to `main` triggers an auto-deploy
to `https://encountersinjoy.org`.

## Contact

- Phone: 770-807-1227 (voicemail; response within 24 hours)
- Email: brojefflangley@encountersinjoy.org
- Office: 2064 Highway 82, Statham, GA 30666
