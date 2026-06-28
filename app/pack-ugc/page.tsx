import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pack vidéos UGC — Contenu pro pour votre écran LED',
  description:
    '5 vidéos professionnelles (UGC, motion design, voix off) calibrées pour écrans NEOSENIA. 1 800 € HT le pack, livraison 7–10 jours.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Pack vidéos UGC NEOSENIA',
  description: '5 vidéos pro pour écran LED vitrine — UGC, animations, motion design.',
  offers: {
    '@type': 'Offer',
    price: '1800',
    priceCurrency: 'EUR',
    priceSpecification: { '@type': 'UnitPriceSpecification', unitText: 'HT' },
  },
};

const INCLUS = [
  { icon: <IconVideo />, title: '5 vidéos verticales 9:16', body: 'Format optimisé écrans NEOSENIA et réseaux sociaux. Prêtes à diffuser en boucle.' },
  { icon: <IconBrief />, title: 'Brief créatif personnalisé', body: 'Ton, couleurs, message commercial, logo intégré. On part de zéro avec vous.' },
  { icon: <IconMotion />, title: 'Motion design + voix off', body: 'Option voix off professionnelle. Ambiance premium adaptée à votre commerce.' },
  { icon: <IconClock />, title: 'Livraison 7–10 jours', body: 'Fichiers MP4 prêts à uploader dans le CMS cloud NEOSENIA.' },
  { icon: <IconEdit />, title: '2 retouches par vidéo', body: 'Jusqu\'à validation finale — zéro frais supplémentaire sur les modifications.' },
];

const PACK_INCLUS = [
  'Brief stratégique 30 min (visio ou écrit)',
  'Storyboard avant production',
  'Musique libre de droits',
  'Sous-titres FR (option ON/OFF)',
  'Cession des droits commerciaux',
];

export default function PackUgc() {
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
          style={{ background: 'radial-gradient(ellipse 70% 60% at 70% -10%, rgba(99,102,241,0.14), transparent)' }}
          aria-hidden="true"
        />
        <p className="anim-fade-up mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
          NEOSENIA · Service vidéo
        </p>
        <h1
          className="anim-fade-up anim-fade-up-2 font-bold uppercase leading-[1.02] tracking-tight text-primary"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
        >
          Du contenu qui rend<br />
          <span className="text-cyan">votre écran irrésistible</span>
        </h1>
        <p className="anim-fade-up anim-fade-up-3 mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Votre écran LED mérite mieux que des images statiques. Notre équipe produit pour vous{' '}
          <span className="font-medium text-primary">5 vidéos pro</span> (UGC, animations, motion design)
          calibrées pour vitrines NEOSENIA — prêtes à diffuser en boucle.
        </p>
      </section>

      {/* ── Ce que comprend le Pack ── */}
      <section className="mx-auto max-w-6xl px-5 pb-14">
        <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.28em] text-muted" style={{ fontFamily: 'var(--font-heading)' }}>
          Ce que comprend le Pack
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INCLUS.map(({ icon, title, body }, i) => (
            <div
              key={title}
              className="orb-card card-hover anim-fade-up rounded-2xl border border-border-card bg-card p-6"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="orb-bg" aria-hidden><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /></div>
              <div className="relative z-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/[0.08] text-cyan">
                  {icon}
                </span>
                <h3 className="mt-4 font-semibold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </div>
          ))}
          {/* 6ème slot — ce qui est inclus dans TOUS les packs */}
          <div className="rounded-2xl border border-border-card bg-card p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted" style={{ fontFamily: 'var(--font-heading)' }}>
              Inclus dans tous les packs
            </p>
            <ul className="space-y-2">
              {PACK_INCLUS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-0.5 text-cyan shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Tarif ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
                Tarification
              </p>
              <h2 className="mt-3 text-xl font-bold text-primary sm:text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Tarif client NEOSENIA
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Réservé aux clients ayant commandé ou en cours de commande d'un écran NEOSENIA.
                Tarif préférentiel garanti — non disponible hors programme.
              </p>
            </div>
            <div className="orb-card rounded-2xl border border-cyan/20 bg-card p-6">
              <div className="orb-bg" aria-hidden><div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" /><div className="orb orb-4" /></div>
              <div className="relative z-10">
                <div className="flex items-end gap-3">
                  <div className="text-4xl font-bold text-cyan" style={{ fontFamily: 'var(--font-display)' }}>
                    400 €
                  </div>
                  <div className="mb-1 text-sm text-muted">HT / vidéo</div>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                  Pack 5 vidéos : 1 800 € HT
                  <span className="text-muted line-through">2 000 €</span>
                </div>
                <p className="mt-3 text-xs text-muted">
                  Économie de 200 € sur le pack complet — 10 % de remise fidélité.
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
            Prêt à animer votre écran ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Envoyez-nous votre logo, vos couleurs et votre message commercial. On s'occupe du reste.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="mailto:contact@neosenia.com?subject=Pack%20vidéos%20UGC&body=Bonjour%2C%20je%20souhaite%20commander%20le%20pack%20vidéos%20UGC%20NEOSENIA."
              className="cta-glow rounded-full bg-cyan px-8 py-3.5 font-bold text-bg transition-opacity"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Commander le pack →
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

/* ── Icônes ── */
function IconVideo() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>;
}
function IconBrief() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
}
function IconMotion() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
}
function IconClock() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>;
}
function IconEdit() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
