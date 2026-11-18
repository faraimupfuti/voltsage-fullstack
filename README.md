# VoltSage Solutions — Light Theme

Built by Farai Mupfuti.

Clean white professional design of the VoltSage solar sizing platform.
Same tools, same content, different visual design.

## Tech stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (light palette — white + orange/teal brand accents)
- Lucide React icons
- Framer Motion (sign-in dialog, hero)
- Supabase Auth + Postgres (accounts, organisations)
- Runs on Cloudflare Workers through OpenNext (see below); the Dockerfile still works for other hosts

## Local development
```bash
npm install
npm run dev   # → http://localhost:3000
```

## Boujie (site chat assistant)
Boujie is a chat widget (bottom-right, on every page) that answers questions about
VoltSage and can run the same sizing/battery-runtime calculations as the free tools,
via Claude tool-use — see `lib/boujie.ts`, `app/api/chat/route.ts`, `components/Boujie.tsx`.

It needs an Anthropic API key to work:
```bash
cp .env.example .env.local
# then set ANTHROPIC_API_KEY in .env.local (get one at https://console.anthropic.com)
```
Without a key set, the chat widget still renders but replies with a "not configured yet" message
instead of erroring the whole site. `ANTHROPIC_MODEL` is optional and defaults to `claude-sonnet-5`. Boujie only runs sizing calculations for signed-in users.

## Accounts and access rules

Accounts use Supabase Auth (email + password, and Google). Access is decided in one place, `components/AccessGate.tsx`, with the numbers in `lib/plans.ts`.

| Who | Standard mode (all tools) | Advanced mode | PDF reports | Boujie calculations | Network Design | Team seats |
| --- | --- | --- | --- | --- | --- | --- |
| Visitor, no account | 2 tries, then an account is required | No | No | No (chat only) | No | No |
| Individual account | Unlimited | Yes | Yes (Advanced mode only) | Yes | No | No |
| Organisation account | Unlimited | Yes | Yes (Advanced mode only) | Yes | Yes | Up to `seat_limit` (10), managed by the admin |

Sign-in has two tabs, **Individual** and **Organisation**. An account only signs in on its own tab. An organisation is created at registration (or later from the Account page); the admin invites colleagues by email, and each one gets their own login. Seat limits are enforced in the database. Which tool each account type may use is the `ACCESS` table in `lib/plans.ts`.

- One "try" is the first time a visitor works with a tool in a page view. It is counted in the browser (cookie + localStorage), so it is a soft limit: the calculations run client-side.
- Boujie's calculation tools are checked on the server (`app/api/chat/route.ts`) against the Supabase session, so that one is a hard limit.
- Battery Runtime has no Advanced mode, so it is standard-only (no PDF).

### One-time Supabase setup
1. Run `supabase/migrations/001_profiles.sql`, `002_terms_acceptance.sql`, then `003_account_types.sql` (SQL editor).
2. Authentication > URL Configuration: set the Site URL to `https://voltsage.co` and add `https://voltsage.co/auth/callback` and `http://localhost:3000/auth/callback` to the redirect URLs.
3. Authentication > Providers: enable Google (add your Google OAuth client ID and secret).
4. Authentication > Sign In / Providers > Email: keep **Confirm email on**. Team invites are matched to verified email addresses only; with confirmation off, anyone could claim an invite by typing the invited address.

### Legal pages
`/terms` and `/fair-use` render from `lib/legal.ts`. The company seat limit (`COMPANY_USERS`) and the "last updated" date live in `lib/plans.ts`.

## Deploy on Cloudflare (from GitHub)

The site runs as a Cloudflare Worker built with [OpenNext](https://opennext.js.org/cloudflare). Every push to `main` deploys through `.github/workflows/deploy-cloudflare.yml`.

**One-time setup**
1. Push the project to a GitHub repository (default branch `main`).
2. Cloudflare dashboard: copy your **Account ID** (Workers & Pages overview). Then My Profile > API Tokens > Create Token > the **Edit Cloudflare Workers** template.
3. GitHub repo > Settings > Secrets and variables > Actions > **Secrets**: add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
4. Push (or run the workflow from the Actions tab). The first run creates the Worker named `voltsage`; its URL is shown in the log (`voltsage.<your-subdomain>.workers.dev`).
5. Cloudflare > Workers & Pages > voltsage > Settings > **Variables and secrets**: add `ANTHROPIC_API_KEY`, `WEATHERSTACK_API_KEY`, `CONTACT_WEBHOOK_URL`, `FEEDBACK_WEBHOOK_URL` as **Secrets**. Secrets set in the dashboard survive later deploys.
6. Custom domain: add `voltsage.co` to your Cloudflare account, then either uncomment `routes` in `wrangler.jsonc` or use Workers & Pages > voltsage > Settings > Domains & Routes.
7. Supabase > Authentication > URL Configuration: add your Worker URL and `https://voltsage.co/auth/callback` (and the `workers.dev` equivalent) to the redirect URLs.

**Try it locally** (needs a Cloudflare login): `npm install && npm run preview:cf`. Plain `npm run dev` still works for everyday development.

Notes
- `NEXT_PUBLIC_*` values are baked in at build time, so set them as GitHub Actions *variables*, not Cloudflare secrets. They are optional; the code falls back to the project's current Supabase values.
- Image optimisation is off (`images.unoptimized`), which is what you want on Workers. No other bindings are needed.
- Commit the refreshed `package-lock.json` after your first `npm install`.

## Deploy to GitHub
```bash
git init
git add .
git commit -m "feat: voltsage-light initial build"
git remote add origin https://github.com/YOUR_USERNAME/voltsage-light.git
git push -u origin main
```

## Deploy on Render
1. Push to GitHub
2. Render → New → Web Service → connect repo
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Or use Docker (Render auto-detects Dockerfile)

## Deploy on Fly.io
```bash
fly auth login
fly launch
fly deploy
```

## Deploy on Heroku
```bash
heroku create voltsage-light
heroku stack:set container
git push heroku main
```

## Location, PSH and report details

- `lib/geoPsh.ts` — browser geolocation → place name → PSH. Table entry if the country (or Zimbabwe province) is in `PSH_TABLE`; otherwise NASA POWER long-term irradiance for the exact coordinates; otherwise a latitude-based estimate. If device location is blocked it falls back to an approximate network (IP) lookup, then to the default location. No API keys required.
- `components/SiteProvider.tsx` — shared detection state + the name / company / site-location captured for PDF reports (stored in the browser only).
- `components/tools/SiteTools.tsx` — `usePshSelection`, `PshSelect`, `LocationStatus`, `useReportDetails` used by every sizing tool.
- Geolocation requires HTTPS (or localhost).
