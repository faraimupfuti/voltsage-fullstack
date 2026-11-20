'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import type { User } from '@supabase/supabase-js'
import { X, Mail, Lock, User as UserIcon, Globe, Loader2, Eye, EyeOff, MailCheck, Check, FileText, Zap, Building2 } from 'lucide-react'
import { getSupabase } from '@/lib/supabase/client'
import { FREE_TRIES, ACCESS, type AccountType, type AccessFeature } from '@/lib/plans'
import { authStrings, extraStrings, orgStrings } from '@/lib/i18n/auth'
import { useLang } from './LanguageProvider'

// ───────────────────────────── types & context ─────────────────────────────
export interface Lead { name: string; country: string; email: string }
export interface Profile { full_name: string | null; country: string | null; created_at: string | null; account_type: AccountType | null }
export interface OrgInfo { id: string; name: string; role: 'admin' | 'member'; seatLimit: number }
export type AuthMode = 'signin' | 'signup'
/** Why the dialog was opened: the 3rd free try, or an Advanced-mode request. */
export type AuthReason = 'trial' | 'advanced' | null

interface AccessCtx {
  user: User | null
  lead: Lead | null
  profile: Profile | null
  accountType: AccountType | null
  /** the organisation this user belongs to, if any */
  org: OrgInfo | null
  /** true once the profile and organisation have been loaded for the signed-in user */
  accountReady: boolean
  /** whether this account may use a restricted tool (organisation accounts need an organisation) */
  can: (feature: AccessFeature) => boolean
  refreshAccount: () => Promise<void>
  /** true until the first session check finishes */
  loading: boolean
  /** true once the free-try counter has been read from this browser */
  ready: boolean
  openAuth: (mode?: AuthMode, reason?: AuthReason, kind?: AccountType) => void
  signOut: () => Promise<void>
  /** resolves to an error message, or null on success */
  updateProfile: (patch: { full_name?: string; country?: string }) => Promise<string | null>
  triesUsed: number
  triesLimit: number
  /** Spends one free try for an anonymous visitor. Returns false (and opens the dialog) when none are left. */
  consumeTry: () => boolean
}

const Ctx = createContext<AccessCtx | null>(null)
export function useAccess() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAccess must be used within AccessProvider')
  return c
}

export function useAuthT() {
  const { locale } = useLang()
  return useMemo(() => ({ ...authStrings[locale], ...extraStrings[locale], ...orgStrings[locale] }), [locale])
}

// ───────────────────────────── free-try counter ─────────────────────────────
// Kept in localStorage AND a cookie so clearing only one of them doesn't reset it.
// This is a soft limit by nature: calculations run in the browser, so a determined visitor can reset it.
const TRIES_KEY = 'voltsage_free_tries'
const TRIES_COOKIE = 'vs_tries'
// Account type chosen before a Google redirect, applied once when the profile has no type yet.
const PENDING_KEY = 'voltsage_pending_account'
const KIND_KEY = 'voltsage_login_kind'

function readTries(): number {
  let n = 0
  try { n = Math.max(n, parseInt(localStorage.getItem(TRIES_KEY) || '0', 10) || 0) } catch { /* ignore */ }
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${TRIES_COOKIE}=(\\d+)`))
    if (m) n = Math.max(n, parseInt(m[1], 10) || 0)
  } catch { /* ignore */ }
  return n
}
function writeTries(n: number) {
  try { localStorage.setItem(TRIES_KEY, String(n)) } catch { /* ignore */ }
  try { document.cookie = `${TRIES_COOKIE}=${n}; path=/; max-age=31536000; SameSite=Lax` } catch { /* ignore */ }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ───────────────────────────── provider ─────────────────────────────
export function AccessProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const [triesUsed, setTriesUsed] = useState(0)
  const [org, setOrg] = useState<OrgInfo | null>(null)
  const [accountReady, setAccountReady] = useState(false)
  const [modal, setModal] = useState<{ mode: AuthMode; reason: AuthReason; kind?: AccountType } | null>(null)
  const userRef = useRef<User | null>(null)
  userRef.current = user

  useEffect(() => { setTriesUsed(readTries()); setReady(true) }, [])

  // session
  useEffect(() => {
    let alive = true
    let sb: ReturnType<typeof getSupabase>
    try { sb = getSupabase() } catch { setLoading(false); return }
    sb.auth.getSession()
      .then(({ data }) => { if (alive) { setUser(data.session?.user ?? null); setLoading(false) } })
      .catch(() => { if (alive) setLoading(false) })
    const { data } = sb.auth.onAuthStateChange((_event, session) => {
      if (!alive) return
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => { alive = false; data.subscription.unsubscribe() }
  }, [])

  // Profile, invites and organisation. Rows are created by database triggers and functions (see migration 003).
  const loadAccount = useCallback(async (u: User, alive: () => boolean) => {
    const sb: any = getSupabase() // no generated database types, so rows are untyped
    const cols = 'full_name,country,created_at,account_type'
    try { await sb.rpc('claim_org_invites') } catch { /* no invites, or migration not applied yet */ }
    let { data: p }: { data: any } = await sb.from('profiles').select(cols).eq('id', u.id).maybeSingle()
    if (p && !p.account_type) {
      let pending: { type?: string; org?: string } | null = null
      try { pending = JSON.parse(localStorage.getItem(PENDING_KEY) || 'null'); localStorage.removeItem(PENDING_KEY) } catch { /* ignore */ }
      try { await sb.rpc('complete_profile', { p_type: pending?.type === 'organisation' ? 'organisation' : 'individual', p_org_name: pending?.org || '' }) } catch { /* ignore */ }
      const again = await sb.from('profiles').select(cols).eq('id', u.id).maybeSingle()
      p = again.data
    }
    const { data: m }: { data: any } = await sb.from('org_members').select('role, organizations(id,name,seat_limit)').eq('user_id', u.id).maybeSingle()
    if (!alive()) return
    if (p) setProfile(p as Profile)
    const o = m ? (Array.isArray(m.organizations) ? m.organizations[0] : m.organizations) : null
    setOrg(o ? { id: o.id, name: o.name, role: m && m.role === 'admin' ? 'admin' : 'member', seatLimit: o.seat_limit } : null)
    setAccountReady(true)
  }, [])

  useEffect(() => {
    if (!user) { setProfile(null); setOrg(null); setAccountReady(false); return }
    let alive = true
    setAccountReady(false)
    loadAccount(user, () => alive).catch(() => { if (alive) setAccountReady(true) })
    return () => { alive = false }
  }, [user?.id, loadAccount]) // eslint-disable-line react-hooks/exhaustive-deps

  const refreshAccount = useCallback(async () => {
    const u = userRef.current
    if (u) await loadAccount(u, () => true)
  }, [loadAccount])

  const accountType = profile?.account_type ?? null
  /** Organisation tools need an organisation account that actually belongs to an organisation. */
  const can = useCallback((feature: AccessFeature) => {
    if (!user) return false
    const effective: AccountType = accountType === 'organisation' && org ? 'organisation' : 'individual'
    return ACCESS[effective][feature]
  }, [user, accountType, org])

  const lead = useMemo<Lead | null>(() => {
    if (!user) return null
    const m = (user.user_metadata || {}) as Record<string, unknown>
    const email = user.email || ''
    const name = String(profile?.full_name || m.full_name || m.name || email.split('@')[0] || '')
    const country = String(profile?.country || m.country || '')
    return { name, country, email }
  }, [user, profile])

  const openAuth = useCallback((mode: AuthMode = 'signup', reason: AuthReason = null, kind?: AccountType) => setModal({ mode, reason, kind }), [])

  const signOut = useCallback(async () => {
    try { await getSupabase().auth.signOut() } catch { /* ignore */ }
    setUser(null); setProfile(null)
  }, [])

  const updateProfile = useCallback(async (patch: { full_name?: string; country?: string }) => {
    const u = userRef.current
    if (!u) return 'not signed in'
    const sb: any = getSupabase()
    const { error } = await sb.from('profiles').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', u.id)
    if (error) return error.message
    setProfile(p => ({ full_name: null, country: null, created_at: null, account_type: null, ...(p || {}), ...patch }))
    sb.auth.updateUser({ data: patch }).then(() => {}, () => {})
    return null
  }, [])

  const consumeTry = useCallback((): boolean => {
    if (userRef.current) return true
    const n = readTries()
    if (n >= FREE_TRIES) { setTriesUsed(n); setModal({ mode: 'signup', reason: 'trial' }); return false }
    writeTries(n + 1); setTriesUsed(n + 1)
    return true
  }, [])

  const value = useMemo<AccessCtx>(() => ({
    user, lead, profile, accountType, org, accountReady, can, refreshAccount, loading, ready, openAuth, signOut, updateProfile,
    triesUsed, triesLimit: FREE_TRIES, consumeTry,
  }), [user, lead, profile, accountType, org, accountReady, can, refreshAccount, loading, ready, openAuth, signOut, updateProfile, triesUsed, consumeTry])

  return (
    <Ctx.Provider value={value}>
      <MotionConfig reducedMotion="user">
        {children}
        <AnimatePresence>
          {modal && <AuthDialog key="auth" initialMode={modal.mode} initialKind={modal.kind} reason={modal.reason} onClose={() => setModal(null)} />}
        </AnimatePresence>
      </MotionConfig>
    </Ctx.Provider>
  )
}

// ───────────────────────────── per-tool gate ─────────────────────────────
/**
 * Access rules for one sizing tool instance.
 *  - Advanced mode needs an account (selecting it while signed out opens the dialog).
 *  - Standard mode is free for FREE_TRIES assessments per browser. One assessment = the first
 *    time the visitor works with a tool in a page view; further edits in that view are free.
 *  - PDF is only available in Advanced mode, so only to signed-in users.
 */
export function useToolGate(mode: 'standard' | 'advanced', setMode: (m: 'standard' | 'advanced') => void) {
  const { user, loading, ready, openAuth, consumeTry, triesUsed, triesLimit } = useAccess()
  const counted = useRef(false)

  // Advanced mode never survives a sign-out.
  useEffect(() => { if (!loading && !user && mode === 'advanced') setMode('standard') }, [loading, user, mode, setMode])

  const selectMode = useCallback((m: 'standard' | 'advanced') => {
    if (m === 'advanced' && !user) { if (!loading) openAuth('signup', 'advanced'); return }
    setMode(m)
  }, [user, loading, openAuth, setMode])

  /** Call before the first meaningful action. Returns false when the action must not proceed. */
  const touch = useCallback((): boolean => {
    if (user) return true
    if (counted.current) return true
    if (loading) return false
    const ok = consumeTry()
    if (ok) counted.current = true
    return ok
  }, [user, loading, consumeTry])

  const locked = ready && !loading && !user && !counted.current && triesUsed >= triesLimit
  return { signedIn: !!user, locked, touch, selectMode, canPdf: mode === 'advanced' && !!user }
}

// ───────────────────────────── small UI helpers ─────────────────────────────
/** Replaces a tool's results once the free tries are spent. Real results are not rendered at all while locked. */
export function TrialLock({ locked, children, minHeight = 320 }: { locked: boolean; children: ReactNode; minHeight?: number }) {
  const { openAuth } = useAccess()
  const a = useAuthT()
  if (!locked) return <>{children}</>
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-dashed border-surface-border2 bg-surface-subtle" style={{ minHeight }}>
      <div aria-hidden className="absolute inset-0 flex flex-col gap-3 p-6 opacity-70">
        <div className="h-20 rounded-xl bg-surface-muted animate-pulse" />
        <div className="grid grid-cols-2 gap-3"><div className="h-16 rounded-xl bg-surface-muted animate-pulse" /><div className="h-16 rounded-xl bg-surface-muted animate-pulse" /></div>
        <div className="h-16 rounded-xl bg-surface-muted animate-pulse" />
      </div>
      <div className="relative flex flex-col items-center justify-center gap-3 p-8 text-center" style={{ minHeight }}>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-card"><Lock size={18} className="text-brand-orange" /></span>
        <h4 className="font-disp text-lg font-bold text-ink">{a.lockTitle}</h4>
        <p className="max-w-xs text-sm text-ink-muted">{a.lockBody.replace('{n}', String(FREE_TRIES))}</p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => openAuth('signup', 'trial')} className="btn-primary">{a.createAccount}</button>
          <button onClick={() => openAuth('signin', 'trial')} className="text-sm font-medium text-ink-muted underline-offset-4 hover:text-brand-orange hover:underline">{a.signIn}</button>
        </div>
      </div>
    </div>
  )
}

/** "1 of 2 free tries left" — only shown to visitors without an account. */
export function TrialBadge({ className = '' }: { className?: string }) {
  const { user, loading, ready, triesUsed, triesLimit } = useAccess()
  const a = useAuthT()
  if (loading || !ready || user) return null
  const left = Math.max(0, triesLimit - triesUsed)
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${left === 0 ? 'border-red-200 bg-red-50 text-red-600' : 'border-brand-orange/25 bg-brand-orange/5 text-brand-orange'} ${className}`}>
      <Zap size={11} aria-hidden /> {a.triesLeft.replace('{n}', String(left)).replace('{max}', String(triesLimit))}
    </span>
  )
}

/**
 * Wraps a whole page or tool for signed-in members. With `feature`, the account type must also allow that tool
 * (see ACCESS in lib/plans.ts). Nothing inside renders until the check passes.
 */
export function MemberOnly({ children, feature }: { children: ReactNode; feature?: AccessFeature }) {
  const { user, loading, openAuth, accountReady, can } = useAccess()
  const a = useAuthT()
  if (user && !feature) return <>{children}</>
  if (loading || (user && !accountReady)) return <div className="min-h-[70vh]" aria-busy="true" />
  if (user && feature) {
    if (can(feature)) return <>{children}</>
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/10"><Building2 size={24} className="text-brand-orange" /></span>
        <h1 className="font-disp text-3xl font-extrabold text-ink">{a.orgOnlyTitle}</h1>
        <p className="mt-3 text-ink-muted">{a.orgOnlyBody}</p>
        <a href="/account#account-type" className="btn-primary mt-7">{a.orgOnlyCta}</a>
      </section>
    )
  }
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/10"><Lock size={24} className="text-brand-orange" /></span>
      <h1 className="font-disp text-3xl font-extrabold text-ink">{a.memberTitle}</h1>
      <p className="mt-3 text-ink-muted">{a.memberBody}</p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
        <button onClick={() => openAuth('signup', null, feature ? 'organisation' : undefined)} className="btn-primary">{a.createAccount}</button>
        <button onClick={() => openAuth('signin', null, feature ? 'organisation' : undefined)} className="text-sm font-semibold text-ink-muted underline-offset-4 hover:text-brand-orange hover:underline">{a.signIn}</button>
      </div>
    </section>
  )
}

/** Shown in place of the PDF button while a tool is in Standard mode. */
export function PdfNote({ onUnlock, signedIn }: { onUnlock: () => void; signedIn: boolean }) {
  const a = useAuthT()
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-surface-border2 bg-surface-subtle px-4 py-3">
      <span className="flex items-center gap-2 text-xs text-ink-muted"><FileText size={14} className="flex-shrink-0 text-ink-faint" aria-hidden /> {a.pdfNote}</span>
      <button onClick={onUnlock} className="whitespace-nowrap text-xs font-semibold text-brand-orange underline-offset-4 hover:underline">{signedIn ? a.switchAdvanced : a.unlockAdvanced}</button>
    </div>
  )
}

// ───────────────────────────── sign-in / registration dialog ─────────────────────────────
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3A12 12 0 1 1 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7A20 20 0 1 0 44 24c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  )
}

function Field({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">{icon}</span>
        {children}
      </span>
    </label>
  )
}

function AuthDialog({ initialMode, initialKind, reason, onClose }: { initialMode: AuthMode; initialKind?: AccountType; reason: AuthReason; onClose: () => void }) {
  const a = useAuthT()
  const { user } = useAccess()
  const [kind, setKind] = useState<AccountType>(() => {
    if (initialKind) return initialKind
    try { return localStorage.getItem(KIND_KEY) === 'organisation' ? 'organisation' : 'individual' } catch { return 'individual' }
  })
  const [orgName, setOrgName] = useState('')
  const checking = useRef(false)
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [terms, setTerms] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [verifyEmail, setVerifyEmail] = useState('')
  const firstRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  // Close once signed in, except while a sign-in is still being checked against the chosen account type.
  useEffect(() => { if (user && !checking.current) closeRef.current() }, [user])
  const chooseKind = (k: AccountType) => { setKind(k); setError(''); try { localStorage.setItem(KIND_KEY, k) } catch { /* ignore */ } }

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    const prevFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prevOverflow; window.removeEventListener('keydown', onKey); prevFocus?.focus?.() }
  }, [])
  useEffect(() => { firstRef.current?.focus() }, [mode])

  const switchMode = (m: AuthMode) => { setMode(m); setError(''); setInfo('') }
  const redirectTo = () => {
    const here = window.location.pathname + window.location.search + window.location.hash
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(here)}`
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setInfo('')
    const em = email.trim()
    if (!EMAIL_RE.test(em) || !password || (mode === 'signup' && (!name.trim() || !country.trim()))) { setError(a.errFields); return }
    if (mode === 'signup' && password.length < 8) { setError(a.errPassword); return }
    if (mode === 'signup' && kind === 'organisation' && orgName.trim() && orgName.trim().length < 2) { setError(a.errOrgName); return }
    if (mode === 'signup' && !terms) { setError(a.errTerms); return }
    setBusy(true)
    try {
      const sb = getSupabase()
      if (mode === 'signup') {
        const { data, error: err } = await sb.auth.signUp({
          email: em, password,
          options: {
            emailRedirectTo: redirectTo(),
            data: { full_name: name.trim(), country: country.trim(), account_type: kind, org_name: kind === 'organisation' ? orgName.trim() : '', terms_accepted_at: new Date().toISOString() },
          },
        })
        if (err) { setError(/already|registered|exists/i.test(err.message) ? a.errExists : a.errGeneric); return }
        // Supabase hides duplicate sign-ups by returning a user with no identities.
        if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) { setError(a.errExists); return }
        if (!data.session) setVerifyEmail(em) // email confirmation is on; otherwise the auth listener closes this dialog
      } else {
        checking.current = true
        const { data: sess, error: err } = await sb.auth.signInWithPassword({ email: em, password })
        if (err || !sess?.user) { checking.current = false; if (err && /confirm/i.test(err.message)) setVerifyEmail(em); else setError(a.errCredentials); return }
        // Two logins: the account must match the tab it signed in on.
        const { data: prof }: { data: any } = await (sb as any).from('profiles').select('account_type').eq('id', sess.user.id).maybeSingle()
        const at = prof?.account_type as AccountType | null | undefined
        if (at && at !== kind) { await sb.auth.signOut(); checking.current = false; setError(at === 'organisation' ? a.errIsOrg : a.errIsIndividual); return }
        checking.current = false
        closeRef.current()
      }
    } catch { checking.current = false; setError(a.errGeneric) } finally { setBusy(false) }
  }

  const google = async () => {
    setError(''); setInfo('')
    if (mode === 'signup' && !terms) { setError(a.errTerms); return }
    try { localStorage.setItem(PENDING_KEY, JSON.stringify({ type: kind, org: kind === 'organisation' ? orgName.trim() : '' })) } catch { /* ignore */ }
    setBusy(true)
    try {
      const { error: err } = await getSupabase().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo() } })
      if (err) { setError(a.errGeneric); setBusy(false) }
    } catch { setError(a.errGeneric); setBusy(false) }
  }

  const forgot = async () => {
    setError(''); setInfo('')
    const em = email.trim()
    if (!EMAIL_RE.test(em)) { setError(a.resetPrompt); return }
    setBusy(true)
    try {
      const next = encodeURIComponent('/account?reset=1')
      const { error: err } = await getSupabase().auth.resetPasswordForEmail(em, { redirectTo: `${window.location.origin}/auth/callback?next=${next}` })
      if (err) setError(a.errGeneric); else setInfo(a.resetSent)
    } catch { setError(a.errGeneric) } finally { setBusy(false) }
  }

  const heading = reason === 'trial' ? a.trialTitle : reason === 'advanced' ? a.advancedTitle : mode === 'signup' ? a.titleCreate : a.titleSignIn
  const lede = reason === 'trial' ? a.trialBody.replace('{n}', String(FREE_TRIES)) : reason === 'advanced' ? a.advancedBody : mode === 'signup' ? a.subCreate : a.subSignIn
  const benefits = [a.benefit1, a.benefit2, a.benefit3, a.benefit4]

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        role="dialog" aria-modal="true" aria-labelledby="auth-title"
        className="relative grid w-full max-w-3xl overflow-hidden rounded-t-3xl bg-white shadow-card-lg sm:rounded-3xl md:grid-cols-[0.85fr_1.15fr]"
        initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      >
        {/* brand panel */}
        <div className="panel-dark relative hidden flex-col justify-between overflow-hidden p-8 md:flex">
          <svg aria-hidden viewBox="0 0 320 140" className="pointer-events-none absolute -bottom-2 left-0 w-full opacity-80" fill="none">
            <path d="M0 90 H110 L130 40 L160 120 L185 70 H320" stroke="#5B55FF" strokeWidth="1.5" className="trace-line" />
            <path d="M0 110 H90 Q110 110 110 90" stroke="#E89A4A" strokeWidth="1.2" className="trace-line" opacity=".6" />
          </svg>
          <div className="relative z-10">
            <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20"><Zap size={18} className="text-[#E89A4A]" /></span>
            <h2 className="font-disp text-2xl font-extrabold leading-tight text-white">{heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{lede}</p>
          </div>
          <ul className="relative z-10 mt-8 space-y-3 pb-14">
            {benefits.map((b, i) => (
              <motion.li key={b} className="flex items-start gap-2.5 text-sm text-white/80" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.07 }}>
                <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#2621FF]"><Check size={10} className="text-white" strokeWidth={3} /></span>{b}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* form panel */}
        <div className="relative p-6 sm:p-8">
          <button onClick={onClose} aria-label={a.close} className="absolute right-4 top-4 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-surface-subtle hover:text-ink"><X size={18} /></button>

          {verifyEmail ? (
            <div className="py-6 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10"><MailCheck size={26} className="text-brand-orange" /></span>
              <h3 id="auth-title" className="font-disp text-xl font-bold text-ink">{a.verifyTitle}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">{a.verifyBody.replace('{email}', verifyEmail)}</p>
              <button onClick={() => { setVerifyEmail(''); setPassword('') }} className="mt-5 text-sm font-medium text-ink-muted underline-offset-4 hover:text-brand-orange hover:underline">{a.differentEmail}</button>
            </div>
          ) : (
            <>
              <div className="mb-5 md:hidden">
                <h3 id="auth-title" className="pr-8 font-disp text-xl font-bold text-ink">{heading}</h3>
                <p className="mt-1 text-sm text-ink-muted">{lede}</p>
              </div>
              <div role="tablist" aria-label={a.kindLabel} className="mb-2 grid grid-cols-2 gap-2 md:mt-6">
                {(['individual', 'organisation'] as const).map(k => (
                  <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => chooseKind(k)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all ${kind === k ? 'border-brand-orange bg-brand-orange/5 text-ink' : 'border-surface-border text-ink-muted hover:border-surface-border2'}`}>
                    {k === 'individual' ? <UserIcon size={16} aria-hidden /> : <Building2 size={16} aria-hidden />}{k === 'individual' ? a.kindIndividual : a.kindOrg}
                  </button>
                ))}
              </div>
              <p className="mb-4 text-xs text-ink-faint">{kind === 'individual' ? a.kindHintIndividual : a.kindHintOrg}</p>
              <div role="tablist" className="mb-5 grid grid-cols-2 rounded-xl bg-surface-muted p-1">
                {(['signup', 'signin'] as const).map(m => (
                  <button key={m} role="tab" aria-selected={mode === m} onClick={() => switchMode(m)} className={`rounded-lg py-2 text-sm font-semibold transition-all ${mode === m ? 'bg-white text-ink shadow-sm' : 'text-ink-faint hover:text-ink'}`}>
                    {m === 'signup' ? a.createAccount : a.signIn}
                  </button>
                ))}
              </div>

              <button type="button" onClick={google} disabled={busy} className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-surface-border bg-white py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-subtle disabled:opacity-50"><GoogleMark /> {a.google}</button>
              <div className="my-4 flex items-center gap-3 text-xs text-ink-faint"><span className="h-px flex-1 bg-surface-border" />{a.or}<span className="h-px flex-1 bg-surface-border" /></div>

              <form onSubmit={submit} className="space-y-3.5" noValidate>
                {mode === 'signup' && (
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <Field icon={<UserIcon size={15} />} label={a.name}><input ref={firstRef} value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="Tendai Moyo" className="tool-input !pl-10" /></Field>
                    <Field icon={<Globe size={15} />} label={a.country}><input value={country} onChange={e => setCountry(e.target.value)} autoComplete="country-name" placeholder="Zimbabwe" className="tool-input !pl-10" /></Field>
                  </div>
                )}
                {mode === 'signup' && kind === 'organisation' && (
                  <div>
                    <Field icon={<Building2 size={15} />} label={a.orgName}><input value={orgName} onChange={e => setOrgName(e.target.value)} autoComplete="organization" placeholder="Sunrise Solar (Pvt) Ltd" className="tool-input !pl-10" /></Field>
                    <p className="mt-1.5 text-[11px] text-ink-faint">{a.orgNameHint}</p>
                  </div>
                )}
                <Field icon={<Mail size={15} />} label={a.email}>
                  <input ref={mode === 'signin' ? firstRef : undefined} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="you@email.com" className="tool-input !pl-10" />
                </Field>
                <Field icon={<Lock size={15} />} label={a.password}>
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder={mode === 'signup' ? a.passwordHint : ''} className="tool-input !pl-10 !pr-11" />
                  <button type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </Field>

                {mode === 'signup' && (
                  <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-ink-muted">
                    <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#2621FF]" />
                    <span>{a.acceptPre} <a href="/terms" target="_blank" rel="noopener" className="font-semibold text-brand-orange underline-offset-2 hover:underline">{a.terms}</a> {a.and} <a href="/fair-use" target="_blank" rel="noopener" className="font-semibold text-brand-orange underline-offset-2 hover:underline">{a.fairUse}</a>.</span>
                  </label>
                )}

                <div aria-live="polite" className="min-h-[1.25rem]">
                  {error && <p role="alert" className="text-xs font-medium text-red-600">{error}</p>}
                  {info && <p className="text-xs font-medium text-emerald-700">{info}</p>}
                </div>

                <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
                  {busy && <Loader2 size={15} className="animate-spin" />} {busy ? a.wait : mode === 'signup' ? a.submitCreate : a.submitSignIn}
                </button>
                {mode === 'signin' && <button type="button" onClick={forgot} disabled={busy} className="block w-full text-center text-xs font-medium text-ink-muted underline-offset-4 hover:text-brand-orange hover:underline">{a.forgot}</button>}
              </form>

              <p className="mt-4 text-center text-xs text-ink-faint">
                {mode === 'signup' ? a.haveAccount : a.noAccount}{' '}
                <button onClick={() => switchMode(mode === 'signup' ? 'signin' : 'signup')} className="font-semibold text-brand-orange underline-offset-2 hover:underline">{mode === 'signup' ? a.signIn : a.createAccount}</button>
              </p>
              {mode === 'signup' && <p className="mt-2 text-center text-[11px] text-ink-faint">{a.privacy}</p>}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
