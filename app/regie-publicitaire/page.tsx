import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Régie publicitaire locale — Monétisez votre écran LED',
  description:
    'Transformez votre écran NEOSENIA en centre de profit local. 65 % reversés chaque mois, NEOSENIA gère la prospection annonceurs et la diffusion.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Régie publicitaire locale NEOSENIA',
  description: 'Programme de monétisation écran LED — 65 % reversés au propriétaire, NEOSENIA gère les annonceurs.',
  provider: { '@type': 'Organization', name: 'NEOSENIA' },
};

const STEPS = [
  {
    num: '01',
    title: 'Vous installez votre écran NEOSENIA',
    body: 'Sur vitrine, façade ou en intérieur. La pose est libre par vos soins ou un électricien local. Branchement 220 V + internet suffit.',
  },
  {
    num: '02',
    title: 'On démarche les annonceurs du quartier',
    body: 'Commerces, restaurants, agences immo, concessions auto. NEOSENIA signe en votre nom des contrats mensuels — vous n\'avez rien à prospecter.',
  },
  {
    num: '03',
    title: 'On gère la diffusion via le CMS cloud',
    body: 'Rotation des spots, reporting mensuel, modération du contenu — entièrement géré par NEOSENIA. Votre écran tourne, vous ne faites rien.',
  },
  {
    num: '04',
    title: 'Vous encaissez chaque mois',
    body: '65 % du chiffre net annonceurs, virés directement sur votre compte. Reporting transparent. Résiliable à tout moment sans frais.',
  },
];

export default function Regie() {
  return (
    <main className="min-h-screen bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-10 pt-12 sm:pt-16">
        <div
          className="pointer-events-none absolute -inset-x-20 top-0 h-96"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 30% -10%, rgba(212,168,83,0.12), transparent)' }}
          aria-hidden="true"
        />
        <p className="anim-fade-up mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-gold" style={{ fontFamily: 'var(--font-heading)' }}>
          NEOSENIA · Programme partenaire
        </p>
        <h1
          className="anim-fade-up anim-fade-up-2 font-bold uppercase leading-[1.02] tracking-tight text-primary"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
        >
          Transformez votre écran<br />
          <span className="text-gold">en centre de profit local</span>
        </h1>
        <p className="anim-fade-up anim-fade-up-3 mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Vous installez un écran NEOSENIA. On démarche pour vous les commerçants du quartier,
          on gère la diffusion et la facturation.{' '}
          <span className="font-medium text-primary">Vous touchez 65 % à vie sur chaque annonceur signé.</span>
        </p>
      </section>

      {/* ── Stats ── */}
      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '65 %', label: 'Reversé au propriétaire', color: 'text-gold' },
            { value: '35 %', label: 'Commission NEOSENIA', color: 'text-muted' },
            { value: '6–12', label: 'Mois d\'amortissement type', color: 'text-cyan' },
          ].map(({ value, label, color }) => (
            <div key={label} className="orb-card rounded-2xl border border-border-card bg-card p-5 text-center">
              <div className="orb-bg" aria-hidden><div className="orb orb-1" /><div className="orb orb-4" /></div>
              <div className="relative z-10">
                <div className={`text-3xl font-bold ${color}`} style={{ fontFamily: 'var(--font-display)' }}>
                  {value}
                </div>
                <p className="mt-1 text-xs leading-snug text-muted">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <p className="anim-fade-up text-xs font-semibold uppercase tracking-[0.28em] text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
            Le processus
          </p>
          <h2 className="anim-fade-up anim-fade-up-2 mt-3 text-xl font-bold text-primary sm:text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Comment ça marche
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {STEPS.map(({ num, title, body }, i) => (
              <div
                key={num}
                className="card-hover anim-fade-up rounded-2xl border border-border-card bg-card p-6"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="step-number mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-cyan" style={{ fontFamily: 'var(--font-display)' }}>
                  {num}
                </div>
                <h3 className="font-semibold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exemple chiffré ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold" style={{ fontFamily: 'var(--font-heading)' }}>
            Simulation
          </p>
          <h2 className="mt-3 text-xl font-bold text-primary sm:text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Exemple chiffré
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border-card bg-card p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted" style={{ fontFamily: 'var(--font-heading)' }}>Hypothèses</p>
              <ul className="space-y-2.5 text-sm">
                {[
                  '4 annonceurs × 700 € / mois HT',
                  'Chiffre brut annonceurs : 2 800 € / mois',
                  'Commission NEOSENIA 35 % : 980 €',
                  'Reversement propriétaire 65 % : 1 820 €',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-muted">
                    <span className="mt-0.5 text-cyan shrink-0">·</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="orb-card rounded-2xl border border-gold/20 bg-card p-6">
              <div className="orb-bg" aria-hidden><div className="orb orb-1" /><div className="orb orb-2" /></div>
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold" style={{ fontFamily: 'var(--font-heading)' }}>
                  Revenu propriétaire
                </p>
                <div className="mt-3 text-5xl font-bold text-gold" style={{ fontFamily: 'var(--font-display)' }}>
                  1 820 €
                </div>
                <p className="mt-1 text-sm text-muted">/ mois · soit ~21 800 € / an</p>
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  Estimation indicative — varie selon zone, trafic, format d'écran
                  et qualité de l'emplacement. Pas un revenu garanti.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-14 text-center">
          <h2 className="text-xl font-bold text-primary sm:text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Prêt à activer votre régie ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Dites-nous où se trouve votre écran (ou votre projet d'écran) — on vous rappelle sous 24 h.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="mailto:contact@neosenia.com?subject=Programme%20régie%20publicitaire&body=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20le%20programme%20régie%20publicitaire%20NEOSENIA."
              className="cta-glow rounded-full bg-gold px-8 py-3.5 font-bold text-bg transition-opacity"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Activer ma régie →
            </a>
            <a
              href="https://wa.me/33785994352"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border-card px-8 py-3.5 text-sm font-medium text-muted transition-colors hover:text-primary"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              WhatsApp +33 7 85 99 43 52
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-8 text-xs text-muted">
        NEOSEN LIMITED (trading as NEOSENIA) · Dublin, Irlande · contact@neosenia.com
      </footer>
    </main>
  );
}
