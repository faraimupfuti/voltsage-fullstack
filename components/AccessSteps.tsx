'use client'
import { Play, UserPlus, FileDown, ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import { useAccess, useAuthT } from './AccessGate'

/** Explains the access model: two free standard tries, then a free account for Advanced mode and PDF reports. */
export default function AccessSteps() {
  const a = useAuthT()
  const { user, loading, ready, triesUsed, triesLimit, openAuth } = useAccess()
  const anon = !user && !loading
  const STEPS = [
    { icon: <Play size={18} />, title: a.step1T, body: a.step1B },
    { icon: <UserPlus size={18} />, title: a.step2T, body: a.step2B },
    { icon: <FileDown size={18} />, title: a.step3T, body: a.step3B },
  ]
  return (
    <section id="access" className="panel-dark overflow-hidden py-24">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full orb-pulse" style={{ background: 'radial-gradient(circle,rgba(38,33,255,.35) 0%,transparent 70%)' }} />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full orb-pulse" style={{ background: 'radial-gradient(circle,rgba(198,116,30,.25) 0%,transparent 70%)', animationDelay: '4s' }} />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <h2 className="font-disp text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">{a.stepsTitle}</h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">{a.stepsSub}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#sizing" className="btn-primary">{a.stepsCta1} <ArrowRight size={14} /></a>
            {!user && <button onClick={() => openAuth('signup')} className="inline-flex items-center gap-2 rounded-[9px] border border-white/25 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10">{a.stepsCta2}</button>}
          </div>
          {anon && ready && (
            <div className="mt-8 flex items-center gap-3 text-sm text-white/60" aria-label={a.triesLeft.replace('{n}', String(Math.max(0, triesLimit - triesUsed))).replace('{max}', String(triesLimit))}>
              <span className="flex gap-1.5" aria-hidden>
                {Array.from({ length: triesLimit }).map((_, i) => (
                  <span key={i} className={`h-2.5 w-8 rounded-full transition-colors duration-500 ${i < triesUsed ? 'bg-white/20' : 'bg-[#5B55FF]'}`} />
                ))}
              </span>
              {a.triesLeft.replace('{n}', String(Math.max(0, triesLimit - triesUsed))).replace('{max}', String(triesLimit))}
            </div>
          )}
        </Reveal>

        <ol className="relative space-y-5">
          <span aria-hidden className="absolute left-[27px] top-8 bottom-8 w-px border-l border-dashed border-[#5B55FF]/50" />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <li className="relative flex gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors duration-300 hover:border-[#5B55FF]/60 hover:bg-white/[0.07]">
                <span className="relative z-10 flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2621FF] to-[#171254] text-white shadow-brand">{s.icon}</span>
                <div>
                  <h3 className="font-disp text-lg font-bold text-white"><span className="mr-2 font-mono text-sm font-medium text-[#8D88FF]">{i + 1}.</span>{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{s.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
