#!/usr/bin/env bash
# One-time setup of the VoltSage Supabase project: applies the database migrations and pushes the auth settings
# (Google sign-in, redirect URLs, email confirmation). Run it from the project root on your own computer.
#
# Needs: the Supabase CLI (https://supabase.com/docs/guides/cli) and a filled-in supabase/.env
set -euo pipefail
PROJECT_REF="qnlpdsqrqqrmbggjujqi"

command -v supabase >/dev/null 2>&1 || { echo "Install the Supabase CLI first: https://supabase.com/docs/guides/cli"; exit 1; }
[ -f supabase/.env ] || { echo "Create supabase/.env first (copy supabase/.env.example and fill in the Google client ID and secret)."; exit 1; }
set -a; . supabase/.env; set +a
: "${SUPABASE_AUTH_GOOGLE_CLIENT_ID:?Set SUPABASE_AUTH_GOOGLE_CLIENT_ID in supabase/.env}"
: "${SUPABASE_AUTH_GOOGLE_SECRET:?Set SUPABASE_AUTH_GOOGLE_SECRET in supabase/.env}"

echo "1/4  Log in (opens a browser; skipped if SUPABASE_ACCESS_TOKEN is set)"
[ -n "${SUPABASE_ACCESS_TOKEN:-}" ] || supabase login

echo "2/4  Link this folder to the project (asks for the database password; or set SUPABASE_DB_PASSWORD)"
supabase link --project-ref "$PROJECT_REF"

echo "3/4  Apply the database migrations (001, 002, 003; safe to re-run)"
supabase db push

echo "4/4  Push the auth settings (shows what will change and asks to confirm)"
supabase config push

echo
echo "Done. Two things the CLI cannot do for you:"
echo "  - Google Cloud Console > your OAuth client > Authorized redirect URIs must include:"
echo "      https://${PROJECT_REF}.supabase.co/auth/v1/callback"
echo "  - Set up custom SMTP (Supabase > Authentication > SMTP Settings) before real users sign up."
