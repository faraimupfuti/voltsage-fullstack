'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Menu, X, Zap, ChevronDown, Sun, Home, Battery, Cable } from 'lucide-react'
import { useLang } from './LanguageProvider'
import LanguageSwitcher from './LanguageSwitcher'
import AccountMenu, { MobileAccount } from './AccountMenu'
import { useAuthT } from './AccessGate'

export default function Header() {
  const { t } = useLang()
  const a = useAuthT()
  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const toolsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = document.documentElement
        const max = el.scrollHeight - el.clientHeight
        setScrolled(window.scrollY > 40)
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setToolsOpen(false) }
    document.addEventListener('mousedown', onDown); document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [])

  const TOOLS = [
    { label: t.nav.sizing, href: '/#sizing', icon: <Home size={15} /> },
    { label: t.nav.agricultural, href: '/#agricultural', icon: <Sun size={15} /> },
    { label: t.nav.battery, href: '/#battery', icon: <Battery size={15} /> },
    { label: t.nav.dcCable, href: '/#dc-cable-sizing', icon: <Cable size={15} /> },
  ]
  const NAV = [
    { label: t.nav.why, href: '/#why' }, { label: t.nav.problems, href: '/#problems' },
  ]
  const NAV_AFTER = [
    { label: t.nav.comingSoon, href: '/#coming-soon' }, { label: t.nav.articles, href: '/#articles' }, { label: t.nav.contact, href: '/#contact' },
  ]
  const link = 'text-[13px] font-medium text-ink-muted hover:text-brand-orange transition-colors'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-surface-border' : 'bg-white/70 backdrop-blur-md'}`}>
      <div className="h-[3px] w-full bg-transparent" aria-hidden>
        <div className="h-full origin-left" style={{ transform: `scaleX(${progress})`, background: 'linear-gradient(90deg,#2621FF,#4C46FF,#C6741E)' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <Image src="/logo.png" alt="VoltSage Solutions — premium solar energy assessment & sizing tools" width={170} height={36} priority className="h-8 w-auto sm:h-9" />
        </a>

        <nav className="hidden xl:flex items-center gap-6" aria-label="Main">
          {NAV.map(n => <a key={n.href} href={n.href} className={link}>{n.label}</a>)}
          <div ref={toolsRef} className="relative">
            <button onClick={() => setToolsOpen(v => !v)} aria-haspopup="menu" aria-expanded={toolsOpen} className={`${link} flex items-center gap-1`}>
              {a.navTools} <ChevronDown size={13} className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>
            {toolsOpen && (
              <div role="menu" className="absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-surface-border bg-white p-1.5 shadow-card-lg">
                {TOOLS.map(tool => (
                  <a key={tool.href} role="menuitem" href={tool.href} onClick={() => setToolsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-surface-subtle hover:text-brand-orange">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/8 text-brand-orange" style={{ background: 'rgba(38,33,255,.07)' }}>{tool.icon}</span>{tool.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          {NAV_AFTER.map(n => <a key={n.href} href={n.href} className={link}>{n.label}</a>)}
        </nav>

        <div className="hidden xl:flex items-center gap-4">
          <LanguageSwitcher />
          <AccountMenu />
        </div>

        <div className="xl:hidden flex items-center gap-1">
          <LanguageSwitcher compact />
          <button onClick={() => setOpen(v => !v)} aria-label="Menu" aria-expanded={open} className="p-2 rounded-lg text-ink-muted hover:bg-surface-subtle transition-all">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={`xl:hidden bg-white border-b border-surface-border overflow-hidden transition-all duration-300 ${open ? 'max-h-[85vh] overflow-y-auto opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 flex flex-col gap-1">
          <MobileAccount onNavigate={() => setOpen(false)} />
          {[...NAV, ...TOOLS, ...NAV_AFTER].map(n => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-3 px-3 text-sm font-medium text-ink-muted hover:text-brand-orange hover:bg-surface-subtle rounded-xl transition-all">{n.label}</a>
          ))}
          <a href="/#sizing" onClick={() => setOpen(false)} className="mt-2 btn-primary justify-center"><Zap size={14} /> {t.nav.ctaMobile}</a>
        </div>
      </div>
    </header>
  )
}
