import Link from 'next/link';
import { Calculator } from '@/components/Calculator';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NEOSENIA',
  description:
    "Écrans LED transparents pour vitrines : Crystal Film holographique et LED transparent sur structure démontable. Prix livré DDP, garantie 5 ans.",
  url: 'https://neosenia-calculateur.vercel.app',
  areaServed: 'FR',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ── */}
      <header className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-10 pt-12 sm:pb-16 sm:pt-20">
        {/* Grille LED entonnoir */}
        <div className="led-grid pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden="true" />
        {/* Glow radial */}
        <div
          className="pointer-events-none absolute -inset-x-20 top-0 h-80"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -5%, rgba(0,212,255,0.16), transparent)' }}
          aria-hidden="true"
        />

        <p
          className="anim-fade-up relative mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-cyan"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          NEOSENIA — Écrans LED transparents pour vitrines
        </p>
        <h1
          className="anim-fade-up anim-fade-up-2 relative font-bold leading-[1.04] tracking-tight text-primary"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 5.5vw, 3.5rem)' }}
        >
          Le prix de votre écran LED,<br />
          <span className="text-cyan">livré France — sans mauvaise surprise.</span>
        </h1>
        <p
          className="anim-fade-up anim-fade-up-3 relative mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          La plupart des devis LED arrivent sans transport ni douane.
          Ici, <span className="font-semibold text-primary">tout est inclus</span> — fabrication, fret ferroviaire, dédouanement, TVA 20 %.
          Configurez votre vitrine en 30 secondes. Devis ferme sous 48 h, sans engagement.
        </p>

        {/* Trust inline */}
        <div className="anim-fade-up anim-fade-up-4 relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
          {[
            { text: 'Sans engagement' },
            { text: 'Devis ferme sous 48 h' },
            { text: '200+ vitrines équipées' },
            { text: 'Garantie 5 ans' },
          ].map(({ text }) => (
            <span key={text} className="flex items-center gap-1.5">
              <svg className="text-cyan" width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {text}
            </span>
          ))}
        </div>
      </header>

      {/* ── Bandeau stats — marquee ── */}
      <div className="border-b border-t border-border overflow-hidden py-3">
        <div className="marquee-track flex w-max gap-12 text-xs font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-heading)' }}>
          {['200+ vitrines équipées', 'Zéro frais caché — DDP inclus', 'Votre devis en 30 secondes', 'Garantie 5 ans pièces', 'En vitrine en 50 jours', 'Crystal Film · LED transparent', '200+ vitrines équipées', 'Zéro frais caché — DDP inclus', 'Votre devis en 30 secondes', 'Garantie 5 ans pièces', 'En vitrine en 50 jours', 'Crystal Film · LED transparent'].map((item, i) => (
            <span key={i} className={i % 2 === 0 ? 'text-cyan' : 'text-muted'}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Configurateur ── */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <Calculator />
      </section>

      {/* ── Bandeau confiance — dark, orbes animés ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <p
            className="anim-fade-up text-xs font-semibold uppercase tracking-[0.28em] text-cyan"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Ce qui nous différencie
          </p>
          <h2
            className="anim-fade-up anim-fade-up-2 mt-3 text-xl font-bold leading-snug text-primary sm:text-2xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Pourquoi 200+ commerçants<br className="hidden sm:block" /> nous ont fait confiance
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TrustCard
              icon={<IconPackage />}
              title="Le prix affiché est le prix payé"
              body="Transport ferroviaire, dédouanement, TVA 20 % — tout est dans le tarif. Aucune ligne surprise à la livraison. Ce que vous configurez ici, c'est ce que vous signez."
              delay={0}
            />
            <TrustCard
              icon={<IconShield />}
              title="Panne en année 3 ? On répare."
              body="5 ans de garantie constructeur sur panneaux, alimentations et cartes. Certifiés CE, RoHS, FCC. La conformité Europe n'est pas une option — c'est notre standard."
              delay={100}
            />
            <div className="sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-sm lg:col-span-1 lg:mx-0 lg:max-w-none">
              <TrustCard
                icon={<IconClock />}
                title="En vitrine avant la prochaine saison"
                body="Vous signez aujourd'hui. 15 à 20 jours de fabrication sur mesure, puis 35 jours de fret ferroviaire. Planning ferme et traçable dès la commande."
                delay={200}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Cross-sell ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <p className="anim-fade-up text-xs font-semibold uppercase tracking-[0.28em] text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
            Votre écran travaille pour vous
          </p>
          <h2 className="anim-fade-up anim-fade-up-2 mt-3 text-xl font-bold text-primary sm:text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Il attire. Il diffuse. Il rapporte.
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <CrossSellCard
              href="/regie-publicitaire"
              eyebrow="Programme partenaire"
              title="Votre vitrine affiche, vous encaissez"
              body="NEOSENIA signe les annonceurs locaux à votre place et gère la diffusion. Vous touchez 65 % du CA chaque mois — sans décrocher un seul appel."
              accent="gold"
            />
            <CrossSellCard
              href="/pack-ugc"
              eyebrow="Contenu vidéo"
              title="Des vidéos qui hypnotisent les passants"
              body="Motion design sur mesure, calibré 9:16 pour votre écran LED. Brief créatif inclus, 2 retouches offertes, livré en 10 jours. À partir de 400 € / vidéo."
              accent="cyan"
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        id="contact"
        className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <p>
          Les prix affichés sont des <strong className="font-medium text-primary">estimations</strong> basées sur nos grilles tarifaires actuelles.
          Votre devis ferme — établi après mesure précise de votre vitrine — vous est adressé sous 48 h, sans engagement.
          La pose et la structure de support sont chiffrées séparément selon la configuration du site.
        </p>
      </footer>
    </main>
  );
}

function TrustCard({
  icon, title, body, delay = 0,
}: {
  icon: React.ReactNode; title: string; body: string; delay?: number;
}) {
  return (
    <div
      className="orb-card anim-fade-up rounded-2xl border border-border-card bg-card p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Orbes animés en fond */}
      <div className="orb-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      {/* Contenu au-dessus des orbes */}
      <div className="relative z-10">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/[0.08] text-cyan">
          {icon}
        </span>
        <h3
          className="mt-5 font-semibold text-primary"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}

function IconPackage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function CrossSellCard({ href, eyebrow, title, body, accent }: {
  href: string; eyebrow: string; title: string; body: string; accent: 'gold' | 'cyan';
}) {
  const isCyan = accent === 'cyan';
  return (
    <Link
      href={href}
      className="orb-card card-hover group block rounded-2xl border border-border-card bg-card p-6 no-underline transition-colors hover:border-cyan/20"
    >
      <div className="orb-bg" aria-hidden><div className="orb orb-1" /><div className="orb orb-2" /></div>
      <div className="relative z-10">
        <p
          className={`text-xs font-semibold uppercase tracking-[0.2em] ${isCyan ? 'text-cyan' : 'text-gold'}`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {eyebrow}
        </p>
        <h3 className="mt-2.5 text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
        <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${isCyan ? 'text-cyan' : 'text-gold'}`} style={{ fontFamily: 'var(--font-heading)' }}>
          En savoir plus
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
    </Link>
  );
}
