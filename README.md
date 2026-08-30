# Yashvardhan — Photography Portfolio

A one-page professional portfolio built around one idea: **the site reads
light like a camera does.** As you scroll past each photo, the accent color
across the whole page shifts to match that photo's tone — like the site is
white-balancing itself to whatever you're looking at. Each frame also
carries real EXIF-style metadata (aperture, shutter, ISO, focal length) that
shows live in the nav bar as you scroll, like a light meter readout.

No template like this exists elsewhere — it was built from scratch around
your name and your work.

## What's inside

```
yashvardhan/
├── index.html            the whole site (one scrolling page)
├── css/style.css          all styling, incl. the color-shift system
├── js/main.js             hero rotator, scroll-driven color, modal, carousel
├── data/work.json         <-- YOU EDIT THIS to add/replace your photos + stories
├── data/upcoming.json     <-- YOU EDIT THIS for projects "in the field"
└── images/                <-- YOU PUT YOUR PHOTOS HERE
```

Everything currently in `work.json` is **sample content** — placeholder
gradient images standing in for real photos, with sample stories, so you can
see exactly how the site behaves. Replace all of it with your own.

## Page order

Hero → Selected Frames (your work) → Watch (YouTube) → In the Field (one
upcoming project, name only) → About → Contact (with photo collage
background) → Footer.

## The Contact section's photo collage

The tiled background behind "Have a story worth telling well?" is generated
automatically from the same photos in `data/work.json` — it just repeats
your work photos in a grid, dimmed and darkened so the text stays readable.
This means you don't need to configure it separately: as soon as you replace
the sample photos in `work.json` with your real ones, this collage updates
itself. Nothing to edit here directly.

## How to add/replace a photo + story

1. Put your photo in `images/` (e.g. `images/sundarbans-01.jpg`). 1600–2400px
   wide is plenty — bigger just slows the site down.
2. Open `data/work.json` in a plain text editor (Notepad / TextEdit in plain-text
   mode — not Word).
3. Copy one `{ ... }` block, paste it as a new entry, and edit the fields:

```json
{
  "id": "sundarbans-01",
  "title": "The Last Boatmen",
  "place": "Sundarbans Delta, West Bengal",
  "category": "Documentary · Portrait",
  "date": "2026",
  "image": "images/sundarbans-01.jpg",
  "accent": "#3f86a8",
  "exif": { "aperture": "f/4", "shutter": "1/320", "iso": "400", "focal": "50mm" },
  "blurb": "One short, punchy sentence — shown on the main scroll.",
  "headline": "A rotating one-liner for the hero banner. <em>Emphasis goes here.</em>",
  "story": "The full story, in your own words.\n\nLeave a blank line between paragraphs, like this."
}
```

- `id` — unique, no spaces.
- `accent` — a hex color that matches the photo's mood/tone (warm sunset → amber;
  rainy street → blue; festival colour → magenta, etc). This is what the whole
  page shifts to when that photo is in view, and it's also what the light-meter
  readout in the nav bar uses — the more accurately it matches your photo, the
  better the effect works.
- `headline` is only used if that photo is one of the first 5 (shown in the hero
  rotator). If you have fewer than 5 photos, all of them appear there.
- Photos now dissolve softly into the page background (no box, no border, no
  corner marks) — this is intentional, matching the rest of the site.

To remove a sample post, just delete its whole `{ ... }` block (and the comma
before or after it, whichever keeps the file valid).

## How to update "In the Field" (the one upcoming project)

Only one project shows at a time, on purpose. Edit the single entry in
`data/upcoming.json` — `title`, `place`, `status` ("Scouting" / "In production" /
"Post-processing" / etc.), `eta`, `accent`, and `blurb`. To switch to a
different project later, just replace the values in that one block.

## Setting up the "Watch" (YouTube) section

Right now this section shows a placeholder image (clearly labeled
"REPLACE WITH YOUR YOUTUBE EMBED") and a "Watch more on YouTube" button that
points at youtube.com generally. To make it live:

1. **Swap in a real video.** Open `index.html`, find the `<div class="watch-frame">`
   block (search for `watch-frame`), and replace its contents with a real
   YouTube embed:

   ```html
   <div class="watch-frame">
     <iframe
       src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
       title="Yashvardhan — behind the scenes film"
       frameborder="0"
       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
       allowfullscreen
       loading="lazy">
     </iframe>
   </div>
   ```

   Get `YOUR_VIDEO_ID` from your video's YouTube URL — e.g. for
   `youtube.com/watch?v=abc123XYZ`, the ID is `abc123XYZ`. No API key or YouTube
   Data API setup needed for this — embeds are free and public by default as
   long as the video itself isn't set to private.

2. **Point the button at your channel.** Search for `youtube-cta` in
   `index.html` and change `href="https://www.youtube.com/"` to your channel
   URL (e.g. `https://www.youtube.com/@yourchannel`).

## Before you publish — replace these

- **Your video embed and channel link** in the Watch section (see above).
- **Email address** in the Contact section (`index.html`, search for `mailto:`).
- **Instagram / social link** — currently a placeholder `#` link.
- All sample photos and stories in `work.json`, and the project in `upcoming.json`.

## Putting it online for free

Same two options as before — pick whichever's easier for you:

### Option A — Netlify Drop (fastest)
1. Go to **netlify.com**, sign up free.
2. From your dashboard, drag the whole `yashvardhan` folder onto the drop zone.
3. You get a live link immediately — works for anyone, any time, for free.
4. To update later: edit your files, then drag the folder onto your site's
   **Deploys** tab again.

### Option B — GitHub Pages
1. Create a free account at **github.com**.
2. Create a new repository and upload all the files in this folder (drag-and-drop
   works fine on github.com, no command line needed).
3. Go to **Settings → Pages**, set Source to your main branch, root folder. Save.
4. Your live link appears within a minute: `https://yourusername.github.io/reponame/`.

Both are 100% free, no time limit, no card required, and stay live permanently.

## Customizing further

- Colors, fonts, and spacing are all controlled from `css/style.css` — the
  `:root` block at the top holds the base palette (the parts that stay
  constant); `--accent` is the one that shifts per photo.
- Fonts used: **Instrument Serif** (headlines/emphasis), **Space Grotesk**
  (UI/body), **JetBrains Mono** (EXIF/metadata labels) — all free via Google Fonts.
