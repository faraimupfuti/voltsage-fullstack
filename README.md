# VoltSage Solutions — Light Theme

Built by Farai Mupfuti.

Clean white professional design of the VoltSage solar sizing platform.
Same tools, same content, different visual design.

## Tech stack
- Next.js 15 + React 19 (App Router, TypeScript)
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
The app already points at the VoltSage project (`lib/supabase/config.ts`). Configure the project itself in one of two ways.

**A. Command line (recommended).** Install the [Supabase CLI](https://supabase.com/docs/guides/cli), copy `supabase/.env.example` to `supabase/.env` and fill in the Google client ID and secret, then run `./scripts/setup-supabase.sh`. It logs in, links the project (asks for the database password), applies migrations 001-003, and pushes the auth settings in `supabase/config.toml` (Google sign-in, redirect URLs, email confirmation on). It is safe to re-run.

**B. Dashboard.**
1. SQL Editor > New query: paste all of `supabase/setup.sql` and run it.
2. Authentication > URL Configuration: Site URL `https://voltsage.co`; add `https://voltsage.co/**`, `https://www.voltsage.co/**`, `https://voltsage-fullstack.*.workers.dev/**` and `http://localhost:3000/**` to the redirect URLs.
3. Authentication > Sign In / Providers > Google: enable it and paste the client ID and secret.
4. Authentication > Sign In / Providers > Email: keep **Confirm email on**. Team invites are matched to verified email addresses only; with confirmation off, anyone could claim an invite by typing the invited address.

**Either way, also do these two things (no tool can do them for you)**
- Google Cloud Console > APIs & Services > Credentials > your OAuth client > **Authorized redirect URIs**: add `https://qnlpdsqrqqrmbggjujqi.supabase.co/auth/v1/callback`.
- Authentication > SMTP Settings: add your own email provider. Supabase's built-in sender is for testing only (heavily rate limited, and it only delivers to your own team's addresses), so without this, new users will not receive their confirmation emails.

Never commit the database password, the Google client secret or `supabase/.env`; `.gitignore` already excludes them.

### Legal pages
`/terms` and `/fair-use` render from `lib/legal.ts`. The company seat limit (`COMPANY_USERS`) and the "last updated" date live in `lib/plans.ts`.

## Deploy on Cloudflare (from GitHub)

The site runs as a Cloudflare Worker, built with [OpenNext](https://opennext.js.org/cloudflare) (this needs Next.js 15.5.29 or newer, which the project now uses). Cloudflare builds and deploys every push to your GitHub repository.

**Create the project**
1. Cloudflare dashboard > Workers & Pages > Create > **Import a repository** (connect GitHub, pick this repo and the `main` branch).
2. **Project name: `voltsage`.** It must match `name` in `wrangler.jsonc`.
3. **Build command:** `npx opennextjs-cloudflare build`
4. **Deploy command:** `npx opennextjs-cloudflare deploy`
5. Save and deploy. Later pushes to `main` deploy automatically.

**Lockfile (do this once, before the first build)**
Cloudflare installs with `npm clean-install`, which needs a `package-lock.json` that matches `package.json`. The zip ships without one on purpose (the old one was out of date). On your computer run `npm install`, then commit and push the new `package-lock.json`. If an old `package-lock.json` is still in your GitHub repo, replace it with the new one.

**Environment**
- Workers & Pages > voltsage > Settings > **Variables and secrets**: add `ANTHROPIC_API_KEY`, `WEATHERSTACK_API_KEY`, `CONTACT_WEBHOOK_URL`, `FEEDBACK_WEBHOOK_URL` as **Secrets**.
- `NEXT_PUBLIC_*` values are baked in at build time. If you want to override the Supabase defaults, add them under Settings > **Build** > Variables and secrets (not the runtime ones).

**Domain and auth**
- Add `voltsage.co` to your Cloudflare account, then use Workers & Pages > voltsage > Settings > Domains & Routes (or uncomment `routes` in `wrangler.jsonc`).
- Supabase > Authentication > URL Configuration: add your `voltsage.<subdomain>.workers.dev` URL and `https://voltsage.co/auth/callback` to the redirect URLs.

**Try it locally** (needs a Cloudflare login): `npm run preview:cf`. Plain `npm run dev` is still the everyday command.

Notes
- Image optimisation is off (`images.unoptimized`), which is what you want on Workers. No other bindings are needed.
- `.github/workflows/deploy-cloudflare.yml` is an optional manual alternative; ignore it if you use the dashboard route above.

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
