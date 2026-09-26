# Vientos & La Yareta

Frontend for the Vientos & La Yareta hotel website (San Pedro de Atacama). React + Vite + TypeScript, with a small
Azure Functions API for the booking form. Room and area photos are read live from two public Supabase Storage
buckets — nothing is hardcoded or duplicated locally.

## Architecture

The code favors small, single-purpose pieces wired together through interfaces (SOLID), so no component talks to
Supabase or `fetch` directly:

```
src/
  config/env.ts              Typed, validated access to VITE_* env vars
  types/domain.ts            Domain types (Room, Lodge, BookingFormValues, ...)
  content/                   Static editorial copy (room descriptions, prices, FAQs)
  services/
    http/                    HttpClient interface + fetch-based implementation
                              (timeouts, aborts, normalized errors — the one place
                              that talks to our own /api handlers)
    storage/                 StorageRepository interface + Supabase implementation
                              (lists bucket folders/images, builds public URLs)
    booking/                 BookingRepository interface + implementation that
                              posts to the protected /api/booking handler
    index.ts                 Composition root: wires concrete classes to interfaces
  hooks/                     useRooms, useRoomDetail, useLodgeMedia, useBookingForm...
                              — components depend on these, never on services directly
  components/, pages/        UI, grouped by feature (home, rooms, booking, gallery, layout)

api/                         Azure Functions (Node/TS) — the protected HTTP handler
  src/functions/booking.ts   Validates input server-side, rate-limits, notifies
  src/validation/booking.ts  Server-side validation (never trusts the client)
  src/security/rateLimiter.ts  Best-effort in-memory rate limiting
```

**Why a backend handler at all, if the buckets are public?** Listing/reading the public image buckets is safe to do
straight from the browser with the Supabase anon key — that's what the anon key is for. Writes (booking submissions)
are different: they go through `api/booking`, the one place that validates input server-side, rate-limits, and would
hold any future secret (an email/CRM API key) that must never ship to the browser.

## Room data comes from Storage, not from a hardcoded list

`StorageRepository.listRoomFolders(lodgeId)` lists the folders under `<bucket>/Habitaciones/`, and that list — not a
hardcoded array — is what decides which rooms render on the site. `src/content/rooms.ts` only supplies the
descriptive copy (bed/bath/price/description) that Storage can't hold, matched to a folder by its normalized name; a
folder with no matching entry still renders, with sensible defaults. Add, rename or remove a room by editing the
bucket — the site picks it up on next load, no deploy required.

Expected bucket layout (both `Vientos` and `Yareta` buckets, both **public**):

```
<bucket>/Areas comunes/*.jpg            → hero + gallery images
<bucket>/Habitaciones/<Room Name>/*.jpg → one folder per room, its photos inside
```

## Local development

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key
npm run dev
```

The booking form needs the API too. Easiest path is the [Azure Static Web Apps CLI](https://learn.microsoft.com/azure/static-web-apps/local-development),
which proxies both together on one origin (matching how it works in production):

```bash
npm install -g @azure/static-web-apps-cli
cd api && npm install && cd ..
npm run build          # or `npm run dev` in one terminal, swa in another
swa start dist --api-location api
```

Without `swa`, you can run the API standalone with the Azure Functions Core Tools (`cd api && npm start`, needs
`local.settings.json` copied from `local.settings.json.example`) — but then set `VITE_API_BASE_URL=http://localhost:7071/api`
in `.env` and add your Vite dev origin to `Host.CORS` in `api/local.settings.json`, since it's no longer same-origin.

## Deploy to Azure Static Web Apps (Free plan)

The Free plan includes exactly what this project needs: static hosting for the built frontend **and** a managed
Azure Functions API under `/api`, both from one GitHub-connected resource, no separate Function App to pay for.

### 1. Create the resource

1. Push this repo to GitHub.
2. Azure Portal → **Create a resource** → **Static Web App**.
3. Plan: **Free**. Deployment source: **GitHub**, then pick this repo/branch.
4. Build details:
   - **Build presets:** React
   - **App location:** `/`
   - **Api location:** `api`
   - **Output location:** `dist`
5. Create. Azure commits a workflow file to `.github/workflows/` for you and adds the
   `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to the repo automatically.

   This repo already includes `.github/workflows/azure-static-web-apps.yml` with the same locations — if Azure adds
   its own during creation, keep whichever one has the correct `app_location`/`api_location`/`output_location` and
   remove the duplicate so only one workflow deploys.

### 2. Set the frontend's build-time secrets (GitHub)

Vite bakes `VITE_*` variables into the JS bundle **at build time** — the GitHub Actions build step needs them as
**repository secrets** (Settings → Secrets and variables → Actions), not as Azure app settings:

| Secret name                     | Value                                  |
| -------------------------------- | --------------------------------------- |
| `VITE_SUPABASE_URL`              | Your Supabase project URL               |
| `VITE_SUPABASE_ANON_KEY`         | Your Supabase anon (public) key         |
| `VITE_SUPABASE_BUCKET_VIENTOS`   | `Vientos` (or your bucket's real name)  |
| `VITE_SUPABASE_BUCKET_YARETA`    | `Yareta` (or your bucket's real name)   |
| `VITE_CONTACT_EMAIL`             | Contact email shown on the site         |
| `VITE_CONTACT_PHONE`             | Contact phone shown on the site         |

Push to the deployed branch (or re-run the workflow) after adding these — the previous build won't have them.

### 3. Set the API's runtime secrets (Azure Portal)

The Functions API reads its own environment at **runtime**, so this one *does* go in Azure, not GitHub: Portal → your
Static Web App → **Environment variables** (previously "Configuration") → add:

| Name                          | Value                                                                 |
| ------------------------------ | ---------------------------------------------------------------------- |
| `BOOKING_NOTIFY_WEBHOOK_URL`   | Optional. A webhook URL (Zapier/Make/Power Automate, or your own endpoint) that receives each booking as JSON. Leave unset to just log bookings in the Function's logs (Log stream / Application Insights). |

Every submitted booking is always validated, rate-limited and logged regardless of this setting — it only controls
whether something *outside* Azure also gets notified.

### 4. Done

Every push to the connected branch rebuilds and redeploys both the static site and the API. Pull requests get their
own temporary staging environment automatically (and it's torn down when the PR closes) — that's what the
`close_pull_request_job` in the workflow handles.

## Scripts

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run preview   # preview the production build locally
npm run lint       # oxlint
```
