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
          NEOSENIA — Écrans LED B2B
        </p>
        <h1
          className="anim-fade-up anim-fade-up-2 relative font-bold leading-[1.04] tracking-tight text-primary"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 5.5vw, 3.5rem)' }}
        >
          Combien coûte votre<br />
          <span className="text-cyan">écran LED tout compris&nbsp;?</span>
        </h1>
        <p
          className="anim-fade-up anim-fade-up-3 relative mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Prix HT livré en <span className="font-semibold text-primary">30 secondes</span> — transport,
          dédouanement et TVA 20 % déjà inclus dans le tarif affiché.
          Devis ferme sous 48 h, verrouillé 7 jours.{' '}
          <span className="font-semibold text-primary">Garantie 5 ans constructeur.</span>
        </p>

        {/* Trust inline */}
        <div className="anim-fade-up anim-fade-up-4 relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
          {[
            { icon: '✓', text: 'DDP France inclus' },
            { icon: '✓', text: 'Prix verrouillé 7 jours' },
            { icon: '✓', text: 'Garantie 5 ans' },
            { icon: '✓', text: '200+ installations' },
          ].map(({ icon, text }) => (
            <span key={text} className="flex items-center gap-1.5">
              <span className="text-cyan">{icon}</span>
              {text}
            </span>
          ))}
        </div>
      </header>

      {/* ── Bandeau stats — marquee ── */}
      <div className="border-b border-t border-border overflow-hidden py-3">
        <div className="marquee-track flex w-max gap-12 text-xs font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-heading)' }}>
          {['200+ installations', 'DDP France inclus', 'Prix verrouillé 7 j', 'Garantie 5 ans constructeur', 'Livraison ~50 j', 'Certifié CE · RoHS · FCC', '200+ installations', 'DDP France inclus', 'Prix verrouillé 7 j', 'Garantie 5 ans constructeur', 'Livraison ~50 j', 'Certifié CE · RoHS · FCC'].map((item, i) => (
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
            Nos engagements
          </p>
          <h2
            className="anim-fade-up anim-fade-up-2 mt-3 text-xl font-bold leading-snug text-primary sm:text-2xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Transparent. Garanti. Livré.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TrustCard
              icon={<IconPackage />}
              title="Prix DDP · zéro surprise"
              body="Fabrication, fret ferroviaire, dédouanement et TVA 20 % inclus dans le tarif affiché. Ce que vous voyez, vous payez."
              delay={0}
            />
            <TrustCard
              icon={<IconShield />}
              title="5 ans garantie constructeur"
              body="Panneaux, alimentations et cartes couverts sans frais. Certifiés CE, RoHS, FCC — conformité Europe assurée."
              delay={100}
            />
            {/* 3ème card — centrée entre les deux à tablet, col normale à desktop */}
            <div className="sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-sm lg:col-span-1 lg:mx-0 lg:max-w-none">
              <TrustCard
                icon={<IconClock />}
                title="En vitrine en 50–65 jours"
                body="15–20 j de fabrication sur mesure, puis ~35 j de fret ferroviaire. Planning ferme dès la commande."
                delay={200}
              />
            </div>
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
          Les prix indiqués sont des <strong className="font-medium text-primary">estimations</strong> basées
          sur nos grilles tarifaires. Votre devis ferme — établi après mesure de votre vitrine — vous est
          adressé sous 48 h. Sans engagement. Pose et structure de support chiffrées séparément selon le site.
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
