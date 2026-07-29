# Ascendo Immersive

A fresh start — new repo, new deployment, new database. The immersive vision
(starfield, clouds, cinematic zoom into MAIN / MIND / BODY / ACADEMY / SIDES /
PROFILE) replaces the old dashboard-style Ascendo entirely.

Carried over from the old project (nothing to redo): Spotify integration
(OAuth, player, search, persistent mini-player) and the Google Calendar
read-only sync. The core 3D navigation prototype (starfield + clouds +
inertia scroll + zoom transition) is already built and is the home page.

## 1. Set up Supabase (new project)

1. Create a **new** project at supabase.com (don't reuse the old Ascendo one).
2. SQL Editor → paste `supabase/schema.sql` → Run.
3. Project Settings > API — note the Project URL and the secret key
   (`sb_secret_...` on new projects).

## 2. Spotify — reuse, don't recreate

Use the **same** Spotify app from the old project. You'll just add a new
Redirect URI once this project has a real domain (step 5).

## 3. Configure

```
cp .env.local.example .env.local
```

Fill in Supabase URL + secret key, Spotify Client ID + Secret (from the
existing app), and the Google Calendar ICS URL (same one as before).

## 4. Run locally

```
npm install
npm run dev
```

Open **http://127.0.0.1:3000** (not localhost, for Spotify's redirect to
match). You should land directly on the starfield — drag or scroll
horizontally, click a cloud.

## 5. Deploy

1. Push to a **new** GitHub repository.
2. Import it on vercel.com as a new project.
3. Add the same environment variables from `.env.local` in Vercel's project
   settings, with `SPOTIFY_REDIRECT_URI` set to your real Vercel domain.
4. On Spotify's dashboard, add that production URL as a second Redirect URI.
5. Deploy.

## What's next

The 6 detailed universes (MIND's transparent brain with its sub-categories,
BODY's figure, etc.) — once the core feel (inertia, zoom, loop) is confirmed
to work well on your end, both on desktop and on your phone.
