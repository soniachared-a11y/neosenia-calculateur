import type { Metadata } from 'next';
import { PackUgcConfigurator } from '@/components/PackUgcConfigurator';

export const metadata: Metadata = {
  title: 'Pack vidéos UGC — Contenu pro pour votre écran LED',
  description:
    'Vidéos professionnelles (UGC, motion design, voix off) calibrées pour écrans NEOSENIA. Configurez votre pack, remise dès 5 vidéos. Livraison 7–10 jours.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Pack vidéos UGC NEOSENIA',
  description: 'Vidéos pro pour écran LED vitrine — UGC, animations, motion design.',
  offers: { '@type': 'Offer', price: '1800', priceCurrency: 'EUR' },
};

const INCLUS = [
  { icon: <IconVideo />, title: 'Vidéos verticales 9:16', body: 'Format optimisé écrans NEOSENIA et réseaux sociaux. Prêtes à diffuser en boucle.' },
  { icon: <IconBrief />, title: 'Brief créatif personnalisé', body: 'Ton, couleurs, message commercial, logo intégré. On part de zéro avec vous.' },
  { icon: <IconMotion />, title: 'Motion design + voix off', body: 'Option voix off professionnelle. Ambiance premium adaptée à votre commerce.' },
  { icon: <IconClock />, title: 'Livraison 7–10 jours', body: 'Fichiers MP4 prêts à uploader dans le CMS cloud NEOSENIA.' },
  { icon: <IconEdit />, title: '2 retouches par vidéo', body: "Jusqu'à validation finale — zéro frais supplémentaire sur les modifications." },
  { icon: <IconCheck />, title: 'Droits commerciaux cédés', body: 'Musique libre de droits, sous-titres FR, cession des droits commerciaux incluse.' },
];

export default function PackUgc() {
  return (
    <main className="min-h-screen bg-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-8 pt-12 sm:pt-16">
        <div className="led-grid pointer-events-none absolute inset-x-0 top-0 h-72" aria-hidden="true" />
        <div className="pointer-events-none absolute -inset-x-20 top-0 h-72" style={{ background: 'radial-gradient(ellipse 70% 60% at 70% -10%, rgba(0,212,255,0.14), transparent)' }} aria-hidden="true" />
        <p className="anim-fade-up relative mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
          NEOSENIA · Service vidéo
        </p>
        <h1 className="anim-fade-up anim-fade-up-2 relative font-bold leading-[1.04] tracking-tight text-primary" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 5.5vw, 3.25rem)' }}>
          Du contenu qui rend<br />
          <span className="text-cyan">votre écran irrésistible</span>
        </h1>
        <p className="anim-fade-up anim-fade-up-3 relative mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">
          Votre écran LED mérite mieux que des images statiques. Notre équipe produit des vidéos pro
          (UGC, animations, motion design) calibrées pour vitrines NEOSENIA — prêtes à diffuser en boucle.
        </p>
      </section>

      {/* ── Configurateur interactif ── */}
      <section className="mx-auto max-w-3xl px-5 pb-8">
        <PackUgcConfigurator />
      </section>

      {/* ── Ce que comprend chaque vidéo ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <p className="anim-fade-up text-xs font-semibold uppercase tracking-[0.28em] text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
            Inclus dans le pack
          </p>
          <h2 className="anim-fade-up anim-fade-up-2 mt-3 text-xl font-bold text-primary sm:text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Tout est compris, sans frais cachés
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUS.map(({ icon, title, body }, i) => (
              <div key={title} className="orb-card card-hover anim-fade-up rounded-2xl border border-border-card bg-card p-6" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="orb-bg" aria-hidden><div className="orb orb-1" /><div className="orb orb-2" /></div>
                <div className="relative z-10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/[0.08] text-cyan">{icon}</span>
                  <h3 className="mt-4 font-semibold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </div>
            ))}
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
            <a href="mailto:contact@neosenia.com?subject=Pack%20vidéos%20UGC" className="cta-glow rounded-full bg-cyan px-8 py-3.5 font-bold text-bg" style={{ fontFamily: 'var(--font-heading)' }}>
              Commander le pack →
            </a>
            <a href="https://wa.me/33785994352" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border-card px-8 py-3.5 text-sm font-medium text-muted transition-colors hover:text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
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
function IconVideo() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>; }
function IconBrief() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>; }
function IconMotion() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /></svg>; }
function IconClock() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" /></svg>; }
function IconEdit() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>; }
function IconCheck() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>; }
