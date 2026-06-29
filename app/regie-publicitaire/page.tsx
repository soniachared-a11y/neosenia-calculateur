import type { Metadata } from 'next';
import { RegieSimulator } from '@/components/RegieSimulator';

export const metadata: Metadata = {
  title: 'Régie publicitaire locale — Monétisez votre écran LED | NEOSENIA',
  description:
    'Transformez votre écran NEOSENIA en centre de profit. 65 % du CA annonceurs reversés chaque mois. NEOSENIA gère la prospection, la diffusion et la facturation. Simulez vos revenus.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Régie publicitaire locale NEOSENIA',
  description: 'Programme de monétisation écran LED — 65 % reversés au propriétaire, NEOSENIA gère les annonceurs.',
  provider: { '@type': 'Organization', name: 'NEOSENIA' },
};

const MARQUEE_ITEMS = [
  '65 % reversés chaque mois',
  'Zéro prospection de votre côté',
  'Contrats annonceurs signés par NEOSENIA',
  'Diffusion CMS cloud automatisée',
  'Reporting mensuel transparent',
  'Résiliable à tout moment sans frais',
  'Emplacement premium valorisé',
  'Revenus passifs à vie',
];

const FEATURES = [
  {
    step: '01',
    title: 'NEOSENIA démarche les annonceurs pour vous',
    body: 'Notre équipe commerciale identifie et signe les commerces locaux : restaurants, agences immo, concessions, salons. Vous ne passez aucun appel, ne rédigez aucun contrat.',
    visual: 'outreach',
    accent: 'gold',
    reverse: false,
  },
  {
    step: '02',
    title: 'Diffusion automatique via notre CMS cloud',
    body: 'Rotation des spots, planning de diffusion, modération du contenu — tout est géré à distance par NEOSENIA. Votre écran tourne 24 h/24 sans que vous touchiez quoi que ce soit.',
    visual: 'cms',
    accent: 'gold',
    reverse: true,
  },
  {
    step: '03',
    title: '65 % de chaque contrat, virés chaque mois',
    body: 'À chaque fin de mois, votre part (65 % du CA net annonceurs) est virée directement sur votre compte. Zéro ambiguïté — le reporting détaillé accompagne chaque virement.',
    visual: 'revenue',
    accent: 'gold',
    reverse: false,
  },
];

const STEPS = [
  { num: '01', title: 'Vous installez votre écran NEOSENIA', body: 'Branchement 220 V + internet. Pose libre ou par un électricien local. Aucune compétence technique requise.' },
  { num: '02', title: 'On signe les annonceurs du quartier', body: 'Restaurants, commerces, agences, concessions. NEOSENIA prospecte et signe en votre nom — vous ne décrochez pas un seul appel.' },
  { num: '03', title: 'On gère la diffusion 24 h/24', body: 'Rotation des spots, reporting mensuel, modération du contenu — tout est géré à distance via notre CMS cloud.' },
  { num: '04', title: 'Vous encaissez chaque mois', body: '65 % du CA net virés directement sur votre compte. Résiliable à tout moment, sans frais ni pénalité.' },
];

/* ── Composants CSS mockups ── */

function OutreachMockup() {
  return (
    <div className="relative mx-auto max-w-xs">
      <div className="overflow-hidden rounded-2xl border border-gold/30 bg-card" style={{ boxShadow: '0 0 60px rgba(212,168,83,0.12)' }}>
        <div className="h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent" />
        <div className="p-5">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Prospects locaux</p>
          {[
            { name: 'Brasserie Le Central', status: 'Signé', badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
            { name: 'Immo Côte Basque', status: 'Signé', badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
            { name: 'Auto Premium 64', status: 'En cours', badge: 'text-gold bg-gold/10 border-gold/20' },
            { name: 'Salon Prestige', status: 'Contact', badge: 'text-muted bg-muted/10 border-border-card' },
          ].map((item) => (
            <div key={item.name} className="mb-2.5 flex items-center justify-between gap-3 rounded-xl border border-border-card bg-bg px-3.5 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="h-6 w-6 shrink-0 rounded-full bg-gold/20" />
                <span className="truncate text-xs font-medium text-primary">{item.name}</span>
              </div>
              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${item.badge}`}>{item.status}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border-card bg-gold/[0.04] px-5 py-3 text-center text-xs text-muted">
          Prospection 100 % gérée par NEOSENIA
        </div>
      </div>
      {/* Glow */}
      <div className="pointer-events-none absolute -inset-8 rounded-3xl" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,168,83,0.1), transparent)' }} aria-hidden="true" />
    </div>
  );
}

function CmsMockup() {
  return (
    <div className="relative mx-auto max-w-xs">
      <div className="overflow-hidden rounded-2xl border border-gold/30 bg-card" style={{ boxShadow: '0 0 60px rgba(212,168,83,0.12)' }}>
        <div className="h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent" />
        <div className="p-5">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Planning de diffusion</p>
          <div className="space-y-2">
            {[
              { slot: '08h–10h', label: 'Brasserie Le Central', pct: 80 },
              { slot: '10h–14h', label: 'Immo Côte Basque', pct: 60 },
              { slot: '14h–18h', label: 'Auto Premium 64', pct: 90 },
              { slot: '18h–22h', label: 'Spot NEOSENIA', pct: 40 },
            ].map((item) => (
              <div key={item.slot} className="rounded-lg border border-border-card bg-bg p-2.5">
                <div className="mb-1.5 flex justify-between text-[10px]">
                  <span className="font-semibold text-primary">{item.label}</span>
                  <span className="text-muted">{item.slot}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-gold transition-all duration-700" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[9px] text-muted">Rotation automatique · mise à jour en temps réel</p>
        </div>
      </div>
      <div className="pointer-events-none absolute -inset-8 rounded-3xl" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,168,83,0.1), transparent)' }} aria-hidden="true" />
    </div>
  );
}

function RevenuMockup() {
  return (
    <div className="relative mx-auto max-w-xs">
      <div className="overflow-hidden rounded-2xl border border-gold/30 bg-card" style={{ boxShadow: '0 0 60px rgba(212,168,83,0.12)' }}>
        <div className="h-1 bg-gradient-to-r from-gold via-gold/60 to-transparent" />
        <div className="p-5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Virement mensuel</p>
          <div className="my-3 text-center">
            <p className="text-3xl font-bold tabular-nums text-gold" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>+1 820 €</p>
            <p className="text-xs text-muted">part propriétaire · novembre 2025</p>
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'Brasserie Le Central', val: '700 €' },
              { label: 'Immo Côte Basque', val: '700 €' },
              { label: 'Auto Premium 64', val: '400 €' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-lg bg-bg px-3 py-1.5 text-xs">
                <span className="text-muted">{row.label}</span>
                <span className="font-semibold text-primary">{row.val}</span>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-xl border border-gold/25 bg-gold/[0.06] px-3 py-2 text-xs">
              <span className="font-semibold text-gold">Votre 65 % net</span>
              <span className="font-bold text-gold">1 820 €</span>
            </div>
          </div>
        </div>
        <div className="border-t border-border-card bg-gold/[0.04] px-5 py-3 text-center text-xs text-muted">
          Virement automatique fin de mois
        </div>
      </div>
      <div className="pointer-events-none absolute -inset-8 rounded-3xl" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,168,83,0.1), transparent)' }} aria-hidden="true" />
    </div>
  );
}

export default function Regie() {
  const marqueeContent = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <main className="min-h-screen bg-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-10 pt-12 sm:pt-16">
        <div className="led-grid pointer-events-none absolute inset-x-0 top-0 h-72" aria-hidden="true" />
        <div className="pointer-events-none absolute -inset-x-20 top-0 h-72" style={{ background: 'radial-gradient(ellipse 70% 60% at 30% -10%, rgba(212,168,83,0.18), transparent)' }} aria-hidden="true" />

        {/* Trust inline */}
        <div className="anim-fade-up relative mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[11px] font-semibold text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            65 % reversés à vie
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-card bg-card px-3 py-1 text-[11px] text-muted">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Zéro prospection
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-card bg-card px-3 py-1 text-[11px] text-muted">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Résiliable à tout moment
          </span>
        </div>

        <p className="anim-fade-up anim-fade-up-2 relative mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-gold" style={{ fontFamily: 'var(--font-heading)' }}>
          NEOSENIA · Programme partenaire régie
        </p>
        <h1 className="anim-fade-up anim-fade-up-3 relative font-bold leading-[1.04] tracking-tight text-primary" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5.5vw, 3.4rem)' }}>
          Votre écran LED devient<br />
          <span className="text-gold">une source de revenus</span>
        </h1>
        <p className="anim-fade-up relative mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]" style={{ animationDelay: '120ms' }}>
          Installez un écran NEOSENIA. On signe les annonceurs locaux pour vous, on gère la diffusion, on vous vire
          <span className="font-semibold text-primary"> 65 % du CA chaque mois</span> — sans que vous fassiez quoi que ce soit.
        </p>
      </section>

      {/* ── Marquee ── */}
      <div className="relative overflow-hidden border-y border-border-card bg-card py-3.5" aria-hidden="true">
        <div className="flex" style={{ animation: 'marquee 36s linear infinite', width: 'max-content' }}>
          {marqueeContent.map((item, i) => (
            <span key={i} className="mx-6 shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/70">
              {item}
              <span className="ml-6 text-gold/30">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Simulateur interactif ── */}
      <section className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold" style={{ fontFamily: 'var(--font-heading)' }}>Simulateur</p>
          <h2 className="mt-2 text-xl font-bold text-primary sm:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
            Combien peut vous rapporter votre écran ?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">Ajustez les curseurs — la simulation se met à jour en temps réel.</p>
        </div>
        <RegieSimulator />
      </section>

      {/* ── Features alternées ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl space-y-20 px-5 py-16 sm:space-y-28 sm:py-24">
          {FEATURES.map((feat) => (
            <div
              key={feat.step}
              className={`flex flex-col gap-10 sm:flex-row sm:items-center sm:gap-16 ${feat.reverse ? 'sm:flex-row-reverse' : ''}`}
            >
              {/* Visuel */}
              <div className="w-full sm:w-1/2">
                {feat.visual === 'outreach' && <OutreachMockup />}
                {feat.visual === 'cms' && <CmsMockup />}
                {feat.visual === 'revenue' && <RevenuMockup />}
              </div>

              {/* Texte */}
              <div className="w-full sm:w-1/2">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-gold" style={{ fontFamily: 'var(--font-heading)' }}>
                  Étape {feat.step}
                </p>
                <h2 className="text-xl font-bold leading-snug text-primary sm:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                  {feat.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-[15px]">{feat.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4 étapes ── */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <p className="anim-fade-up text-[11px] font-bold uppercase tracking-[0.28em] text-gold" style={{ fontFamily: 'var(--font-heading)' }}>
            Le processus
          </p>
          <h2 className="anim-fade-up mt-3 text-xl font-bold text-primary sm:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
            4 étapes — zéro effort de votre côté
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {STEPS.map(({ num, title, body }, i) => (
              <div key={num} className="card-hover anim-fade-up rounded-2xl border border-border-card bg-bg p-6" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="step-number mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-gold" style={{ fontFamily: 'var(--font-display)' }}>
                  {num}
                </div>
                <h3 className="font-semibold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA unique ── */}
      <section className="border-t border-border">
        <div className="relative mx-auto max-w-3xl overflow-hidden px-5 py-16 text-center sm:py-24">
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,168,83,0.1), transparent)' }} aria-hidden="true" />
          <p className="relative text-[11px] font-bold uppercase tracking-[0.28em] text-gold" style={{ fontFamily: 'var(--font-heading)' }}>
            Programme régie
          </p>
          <h2 className="relative mt-3 text-2xl font-bold text-primary sm:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
            Activez votre régie — rappel sous 24 h
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            Dites-nous où se trouve votre écran (ou votre projet). On vous présente le programme en détail et on démarre la prospection annonceurs dès validation.
          </p>
          <div className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="mailto:contact@neosenia.com?subject=Programme%20régie%20publicitaire&body=Bonjour%2C%20je%20souhaite%20activer%20la%20régie%20publicitaire%20sur%20mon%20écran%20NEOSENIA."
              className="cta-glow flex items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 font-bold text-bg"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}
            >
              <span>Activer ma régie maintenant</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bg/15">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5h9M7.5 2l4 4.5-4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <a
              href="https://wa.me/33785994352"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border-card px-8 py-4 text-sm font-medium text-muted transition-colors hover:border-gold/30 hover:text-primary"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp +33 7 85 99 43 52
            </a>
          </div>
          <p className="relative mt-4 text-xs text-muted">Sans engagement · rappel sous 24 h · revenus indicatifs non garantis</p>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-8 text-xs text-muted">
        NEOSEN LIMITED (trading as NEOSENIA) · Dublin, Irlande · contact@neosenia.com · Revenus indicatifs, non garantis. Performances variables selon emplacement et marché local.
      </footer>
    </main>
  );
}
