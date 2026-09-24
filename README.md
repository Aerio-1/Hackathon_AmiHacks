# Surplus-to-Shelter

**Rescue surplus food. Route it where it matters.** A responsive hackathon MVP that coordinates a donor, eligible shelters and drivers against an operational expiry window. It preserves the original prototype in [`original/Surplus-to-Shelter.html`](original/Surplus-to-Shelter.html) while providing a Vite/React application and a Supabase deployment foundation.

## Features
- **Demo Mode (default):** zero-key judge flow with persistent browser storage: donor posts food → rule-based matching → NGO claims → driver accepts → picked up → transit → delivered → impact.
- Rule-Based Smart Matching Engine: transparent distance **30%**, capacity **25%**, food need **20%**, and time feasibility **25%** scoring; hard failures are excluded.
- Responsive donor, NGO, driver and admin consoles; live food map concept, countdowns, status tracker, notifications, impact dashboard, and mobile navigation.
- Supabase-ready schema, RLS foundation, Realtime-ready notifications, atomic `claim_donation` PostgreSQL function, storage-ready `image_url`, and Edge Function entry points.
- Demo routing is clearly labelled. Real routing and Gemini intake are server-side integration points, never client secrets. AI output is an estimate, not a food-safety certification.

## Architecture
```text
React + TypeScript + Vite + Tailwind
              ↓ Vercel
Supabase: PostgreSQL / Auth / Realtime / Storage / Edge Functions
  ├─ match-donation ├─ claim-donation ├─ assign-driver
  ├─ calculate-route (Google Routes / Route Matrix)
  └─ ai-food-intake (Gemini)
```

## Repository structure
- `src/` React UI, demo persistence, types and matching service.
- `supabase/migrations/` relational schema, indexes, RLS and atomic claim RPC.
- `supabase/functions/` server-side integration entry points.
- `supabase/seed.sql` seed entry point; browser Demo Mode has deterministic Jaipur demo data.
- `original/` preserved prototype.

## Requirements and local run
Node.js 20+ and npm are required. Demo Mode needs no external account.
```bash
git clone https://github.com/Aerio-1/Hackathon_AmiHacks.git
cd Hackathon_AmiHacks
npm install
cp .env.example .env
npm run dev
```
Open the URL printed by Vite. Use the role switcher: **DONOR** → **Post Donation** → **NGO** accepts the offer → **DRIVER** advances delivery → **Impact**. Refreshing preserves demo data. Reset browser local storage key `s2s-demo-v2` to restore initial demo records.

Production checks:
```bash
npm run typecheck
npm run build
npm run preview
```

## Supabase setup (Mumbai recommended)
1. Create a Supabase project in Mumbai / `ap-south-1`; enable Email Auth and add local/Vercel redirect URLs.
2. Run `supabase db push` (or apply `supabase/migrations/202609240001_initial_schema.sql` in SQL Editor). Review and expand the supplied RLS policies for organization membership before production launch.
3. Use the SQL schema to add auth users, profiles, Jaipur organizations, shelter profiles, drivers and production seed records. Enable Realtime replication for `donations`, `donation_matches`, `pickup_requests`, and `notifications`.
4. Create a private `donation-images` Storage bucket and upload images from authenticated clients with bucket policies.
5. Deploy functions with `supabase functions deploy match-donation` (repeat for each directory) and set secrets: `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=... GOOGLE_ROUTES_API_KEY=... GEMINI_API_KEY=...`.

## Environment variables
| Variable | Visibility | Use |
|---|---|---|
| `VITE_APP_MODE=demo` | Public | Demo/real application selection |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Public | Browser Supabase client |
| `VITE_GOOGLE_MAPS_BROWSER_KEY` | Public/restricted | Maps JavaScript API only |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Edge Function privileged work |
| `GOOGLE_ROUTES_API_KEY` | Server only | Routes / Route Matrix |
| `GEMINI_API_KEY` | Server only | Gemini food intake |

Never put a service-role, Gemini, or server-side Routes key in a `VITE_` variable or Git.

## Real mode and integrations
Configure public Supabase values in Vercel and server secrets in Supabase Edge Functions. Implement function bodies using the provided entry points: `match-donation` calculates persisted offers and notifications; `claim-donation` calls atomic `claim_donation`; `assign-driver` revalidates availability/expiry and creates a pickup request; `calculate-route` calls Google Routes/Matrix; `ai-food-intake` calls Gemini and returns structured estimates. Restrict the browser Maps key by referrer and keep Routes key server-side.

## Vercel deployment and global test run
1. Push this repository, import `Aerio-1/Hackathon_AmiHacks` into Vercel, and accept Vite defaults (`npm run build`, output `dist`).
2. Add only public `VITE_*` variables in Vercel. Set Supabase Auth Site URL and redirect URLs to the deployment URL.
3. Deploy, then test desktop and Android/iPhone on another network: login, donor post, NGO offer/claim, driver status transitions, notification/realtime delivery, map key, image upload, Gemini fallback, and widths 320/375/390/412/768/1024/1280/1440.

## Troubleshooting and limitations
- **Supabase/RLS denial:** verify profile role, organization mapping, and policy coverage. The current migration is a secure foundation but organization membership policies must be tailored before production.
- **No realtime:** enable table replication and confirm anon key/project URL.
- **Map/Gemini unavailable:** Demo Mode continues; manual food entry remains available.
- **Vercel build:** use Node 20+, clear stale lockfiles, and ensure no server secret is prefixed `VITE_`.

This is a hackathon MVP: demo routing uses seeded estimates; Gemini output and environmental/meal metrics are estimates; it does not certify food safety; advanced fleet optimization is future work.
