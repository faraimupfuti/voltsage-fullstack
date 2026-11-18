import Header from '@/components/Header'
import { Footer } from '@/components/ContactAndFooter'
import type { LegalSection } from '@/lib/legal'
import { LEGAL_UPDATED } from '@/lib/plans'

const OTHER_DOCS = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/fair-use', label: 'Fair Use & Subscription Access Policy' },
  { href: '/privacy', label: 'Privacy Policy' },
]

/** Shared layout for the Terms of Service and Fair Use pages: contents list on the left, readable column on the right. */
export default function LegalDoc({ title, intro, sections, current }: { title: string; intro?: string[]; sections: LegalSection[]; current: string }) {
  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="panel-dark pt-32 pb-14">
          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
            <p className="mb-3 text-sm text-white/55">VoltSage Solutions</p>
            <h1 className="max-w-3xl font-disp text-4xl font-extrabold leading-tight text-white sm:text-5xl">{title}</h1>
            <p className="mt-4 text-sm text-white/55">Last updated {LEGAL_UPDATED}</p>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[250px_1fr]">
          <nav aria-label="Contents" className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-3 text-xs font-semibold text-ink-faint">Contents</p>
            <ol className="space-y-1 border-l border-surface-border text-sm">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#s-${i + 1}`} className="-ml-px flex gap-2 border-l border-transparent py-1 pl-3 text-ink-muted transition-colors hover:border-brand-orange hover:text-brand-orange">
                    <span className="w-5 flex-shrink-0 text-right font-mono text-xs tabular-nums text-ink-faint">{i + 1}</span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-[68ch]">
            {intro?.map(p => <p key={p} className="mb-5 text-base leading-relaxed text-ink-muted">{p}</p>)}
            {sections.map((s, i) => (
              <section key={s.title} id={`s-${i + 1}`} className="scroll-mt-28 border-t border-surface-border pt-8 pb-8 first:border-t-0 first:pt-0">
                <h2 className="mb-4 flex items-baseline gap-3 font-disp text-2xl font-bold text-ink">
                  <span className="font-mono text-base font-medium tabular-nums text-brand-orange">{i + 1}.</span>{s.title}
                </h2>
                <div className="space-y-4 text-[15px] leading-relaxed text-ink-muted">
                  {s.blocks.map((b, j) =>
                    typeof b === 'string' ? <p key={j}>{b}</p>
                    : Array.isArray(b) ? (
                      <ul key={j} className="space-y-2">
                        {b.map(li => (
                          <li key={li} className="flex gap-3"><span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-orange/60" /><span>{li}</span></li>
                        ))}
                      </ul>
                    ) : <h3 key={j} className="pt-3 font-disp text-lg font-bold text-ink">{b.h}</h3>
                  )}
                </div>
              </section>
            ))}

            <div className="mt-6 rounded-2xl border border-surface-border bg-surface-subtle p-5">
              <p className="mb-3 text-sm font-semibold text-ink">Related documents</p>
              <ul className="space-y-1.5 text-sm">
                {OTHER_DOCS.filter(d => d.href !== current).map(d => (
                  <li key={d.href}><a href={d.href} className="text-brand-orange underline-offset-4 hover:underline">{d.label}</a></li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
