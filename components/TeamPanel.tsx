'use client'
import { useCallback, useEffect, useState } from 'react'
import { Building2, User as UserIcon, Trash2, Mail, Loader2 } from 'lucide-react'
import { useAccess, useAuthT } from './AccessGate'
import { getSupabase } from '@/lib/supabase/client'

interface RosterRow { kind: 'member' | 'invite'; id: string; email: string; full_name: string | null; role: string; created_at: string }

/** Account type, organisation set-up and (for admins) seat management. Lives on the account page. */
export default function TeamPanel() {
  const { user, lead, accountType, org, accountReady, refreshAccount } = useAccess()
  const a = useAuthT()
  const [roster, setRoster] = useState<RosterRow[]>([])
  const [email, setEmail] = useState('')
  const [orgName, setOrgName] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const isAdmin = org?.role === 'admin'

  const loadRoster = useCallback(async () => {
    const { data } = await getSupabase().rpc('org_roster')
    setRoster(Array.isArray(data) ? (data as RosterRow[]) : [])
  }, [])
  useEffect(() => { if (isAdmin) loadRoster().catch(() => {}) }, [isAdmin, loadRoster])

  const errText = (m: string) =>
    /seats_full/.test(m) ? a.seatsFull : /invalid_email/.test(m) ? a.errInvalidEmail : /already_member/.test(m) ? a.errAlreadyMember
    : /invalid_name/.test(m) ? a.errOrgName : a.errTeam

  const run = async (fn: () => PromiseLike<{ error: { message: string } | null }>, okText: string, after?: () => void) => {
    setBusy(true); setMsg(null)
    try {
      const { error } = await fn()
      if (error) { setMsg({ ok: false, text: errText(error.message) }); return }
      setMsg({ ok: true, text: okText }); after?.()
      await refreshAccount(); await loadRoster()
    } catch { setMsg({ ok: false, text: a.errTeam }) } finally { setBusy(false) }
  }

  if (!user || !accountReady) return null
  const seatsUsed = roster.length
  const limit = org?.seatLimit ?? 0

  return (
    <div id="account-type" className="scroll-mt-28 rounded-2xl border border-surface-border p-5 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
          {org ? <Building2 size={18} aria-hidden /> : <UserIcon size={18} aria-hidden />}
        </span>
        <div className="min-w-0">
          <h2 className="font-disp text-lg font-bold text-ink">{org ? a.teamTitle : a.acctTypeTitle}</h2>
          <p className="truncate text-sm text-ink-muted">{org ? org.name : accountType === 'organisation' ? a.typeOrg : a.typeIndividual}</p>
        </div>
      </div>

      {!org && (
        <div className="space-y-3.5">
          <p className="text-sm text-ink-muted">{accountType === 'organisation' ? a.typeNoOrgBody.replace('{email}', lead?.email || '') : a.typeIndividualBody}</p>
          <div id="team" className="flex flex-wrap items-end gap-3">
            <label className="min-w-[200px] flex-1">
              <span className="mb-1.5 block text-xs font-medium text-ink-muted">{a.orgName}</span>
              <input className="tool-input" value={orgName} onChange={e => setOrgName(e.target.value)} autoComplete="organization" />
            </label>
            <button disabled={busy || orgName.trim().length < 2} onClick={() => run(() => getSupabase().rpc('create_organisation', { p_name: orgName.trim() }), a.orgCreated, () => setOrgName(''))} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">
              {busy && <Loader2 size={14} className="animate-spin" />} {a.createOrgBtn}
            </button>
          </div>
        </div>
      )}

      {org && !isAdmin && <p className="text-sm text-ink-muted">{a.memberNote}</p>}

      {org && isAdmin && (
        <div className="space-y-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-ink-muted">{a.seatsUsed.replace('{n}', String(seatsUsed)).replace('{max}', String(limit))}</span>
              <span className="text-ink-faint">{a.seatsNote}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted"><div className="h-full rounded-full bg-brand-orange transition-all duration-500" style={{ width: `${limit ? Math.min(100, (seatsUsed / limit) * 100) : 0}%` }} /></div>
          </div>

          <ul className="divide-y divide-surface-border rounded-xl border border-surface-border">
            {roster.map(r => (
              <li key={`${r.kind}-${r.id}`} className="flex items-center gap-3 px-3.5 py-2.5 text-sm">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-ink">{r.full_name || r.email}{r.id === user.id && <span className="ml-2 text-xs font-normal text-ink-faint">{a.you}</span>}</span>
                  {r.full_name && <span className="block truncate text-xs text-ink-faint">{r.email}</span>}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${r.kind === 'invite' ? 'bg-amber-50 text-amber-700' : r.role === 'admin' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-surface-muted text-ink-muted'}`}>
                  {r.kind === 'invite' ? a.invitedTag : r.role === 'admin' ? a.roleAdmin : a.roleMember}
                </span>
                {r.id !== user.id && (
                  <button disabled={busy} aria-label={r.kind === 'invite' ? a.revokeBtn : a.removeBtn} title={r.kind === 'invite' ? a.revokeBtn : a.removeBtn}
                    onClick={() => run(() => getSupabase().rpc(r.kind === 'invite' ? 'revoke_invite' : 'remove_member', r.kind === 'invite' ? { p_id: r.id } : { p_user: r.id }), '')}
                    className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"><Trash2 size={15} /></button>
                )}
              </li>
            ))}
          </ul>

          <div>
            <div className="flex flex-wrap items-end gap-3">
              <label className="relative min-w-[200px] flex-1">
                <span className="mb-1.5 block text-xs font-medium text-ink-muted">{a.inviteEmail}</span>
                <Mail size={15} aria-hidden className="pointer-events-none absolute bottom-3 left-3.5 text-ink-faint" />
                <input type="email" className="tool-input !pl-10" value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" placeholder="colleague@company.com" />
              </label>
              <button disabled={busy || !email.trim() || seatsUsed >= limit} onClick={() => run(() => getSupabase().rpc('invite_member', { p_email: email.trim() }), a.inviteSent, () => setEmail(''))} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">
                {busy && <Loader2 size={14} className="animate-spin" />} {a.inviteBtn}
              </button>
            </div>
            <p className="mt-2 text-xs text-ink-faint">{seatsUsed >= limit ? a.seatsFull : a.inviteNote}</p>
          </div>
        </div>
      )}

      <div aria-live="polite" className="mt-3 min-h-[1rem]">
        {msg && msg.text && <p className={`text-xs font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg.text}</p>}
      </div>
    </div>
  )
}
