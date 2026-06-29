import type { Metadata } from 'next';
import { PackUgcConfigurator } from '@/components/PackUgcConfigurator';

export const metadata: Metadata = {
  title: 'Pack vidéos UGC — Contenu pro pour votre écran LED NEOSENIA',
  description:
    'Vidéos professionnelles calibrées pour écrans LED NEOSENIA : UGC, motion design, voix off. Remise -10 % dès 5 vidéos. Livraison 7–10 jours. Droits commerciaux cédés.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Pack vidéos UGC NEOSENIA',
  description: 'Vidéos pro pour écran LED vitrine — UGC, animations, motion design.',
  offers: { '@type': 'Offer', price: '400', priceCurrency: 'EUR', priceValidUntil: '2027-01-01' },
};

const FEATURES = [
  {
    step: '01',
    title: 'Vidéos verticales 9:16, optimisées écran LED',
    body: "Votre écran NEOSENIA mérite du contenu taillé pour lui. Chaque vidéo est produite en format vitrine natif — aucun recadrage, aucune perte de qualité. Diffusion en boucle parfaite.",
    checklist: ['Format natif 9:16', 'Résolution 4K adaptée', 'Boucle sans coupure visible'],
    visual: 'phone',
    accent: 'cyan',
  },
  {
    step: '02',
    title: 'Brief créatif + motion design personnalisé',
    body: "On part de zéro avec vous : logo, couleurs, message, tone of voice. Motion design conçu pour capter l'attention en 3 secondes — le seuil critique d'une vitrine passante.",
    checklist: ['Brief créatif dédié', 'Logo + charte intégrés', 'Option voix off pro FR'],
    visual: 'brief',
    accent: 'cyan',
  },
  {
    step: '03',
    title: 'Livraison 7–10 jours, droits cédés à vie',
    body: "Fichiers MP4 prêts à uploader dans le CMS cloud NEOSENIA. 2 retouches incluses jusqu'à validation. Musique libre de droits, sous-titres FR — et droits commerciaux cédés sans limitation.",
    checklist: ['MP4 CMS-ready', '2 retouches incluses', 'Droits commerciaux à vie'],
    visual: 'delivery',
    accent: 'gold',
  },
];

const TRUST = [
  { icon: '✓', text: 'Livraison 7–10 jours' },
  { icon: '✓', text: 'Droits commerciaux cédés' },
  { icon: '✓', text: '2 retouches par vidéo' },
  { icon: '✓', text: 'Musique libre de droits' },
];

export default function PackUgc() {
  return (
    <main className="min-h-screen bg-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ── */}
      <header className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-10 pt-12 sm:pb-16 sm:pt-20">
        <div className="led-grid pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -inset-x-20 top-0 h-80"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 60% -5%, rgba(0,212,255,0.16), transparent)' }}
          aria-hidden="true"
        />

        <p className="anim-fade-up relative mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
          NEOSENIA · Service vidéo
        </p>
        <h1 className="anim-fade-up anim-fade-up-2 relative font-bold leading-[1.04] tracking-tight text-primary" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 5.5vw, 3.5rem)' }}>
          Votre écran LED mérite<br />
          <span className="text-cyan">du contenu qui convertit</span>
        </h1>
        <p className="anim-fade-up anim-fade-up-3 relative mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]" style={{ fontFamily: 'var(--font-body)' }}>
          Une image statique ne capte personne. Nos vidéos UGC et motion design sont conçues
          pour <span className="font-semibold text-primary">votre format d'écran exact</span> — livrées
          en 7–10 jours, prêtes à diffuser en boucle.
        </p>

        <div className="anim-fade-up anim-fade-up-4 relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
          {TRUST.map(({ icon, text }) => (
            <span key={text} className="flex items-center gap-1.5">
              <span className="text-cyan">{icon}</span>
              {text}
            </span>
          ))}
        </div>
      </header>

      {/* ── Marquee ── */}
      <div className="border-b border-t border-border overflow-hidden py-3">
        <div className="marquee-track flex w-max gap-12 text-xs font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-heading)' }}>
          {[
            'Format 9:16 natif', 'Motion design sur mesure', 'Voix off professionnelle',
            'Livraison 7–10 jours', 'Droits commerciaux à vie', 'Remise -10 % dès 5 vidéos',
            'Format 9:16 natif', 'Motion design sur mesure', 'Voix off professionnelle',
            'Livraison 7–10 jours', 'Droits commerciaux à vie', 'Remise -10 % dès 5 vidéos',
          ].map((item, i) => (
            <span key={i} className={i % 2 === 0 ? 'text-cyan' : 'text-muted'}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── Étapes entonnoir ── */}
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:pt-20">
        <p className="anim-fade-up text-xs font-semibold uppercase tracking-[0.28em] text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
          Comment ça marche
        </p>
        <h2 className="anim-fade-up anim-fade-up-2 mt-3 text-xl font-bold text-primary sm:text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
          3 étapes, 0 prise de tête
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { n: '1', label: 'CONFIGUREZ', sub: 'Choisissez votre nombre de vidéos' },
            { n: '2', label: 'VALIDEZ', sub: 'Brief créatif envoyé sous 24 h' },
            { n: '3', label: 'RECEVEZ', sub: 'MP4 livrés en 7–10 jours' },
          ].map(({ n, label, sub }, i) => (
            <div key={n} className="anim-fade-up flex items-center gap-4 rounded-2xl border border-border-card bg-card px-5 py-4" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="step-number flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-cyan" style={{ fontFamily: 'var(--font-display)' }}>
                {n}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>{label}</p>
                <p className="mt-0.5 text-sm text-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Configurateur ── */}
      <section className="mx-auto max-w-3xl px-5 pt-10 pb-8">
        <PackUgcConfigurator />
      </section>

      {/* ── Feature rows ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24 space-y-20 sm:space-y-28">
          {FEATURES.map(({ step, title, body, checklist, visual, accent }, i) => (
            <div
              key={step}
              className={`flex flex-col gap-10 sm:gap-16 ${i % 2 === 1 ? 'sm:flex-row-reverse' : 'sm:flex-row'} items-center`}
            >
              {/* Visuel */}
              <div className="w-full sm:w-1/2 shrink-0 flex justify-center">
                {visual === 'phone' && <PhoneMockup accent={accent} />}
                {visual === 'brief' && <BriefMockup accent={accent} />}
                {visual === 'delivery' && <DeliveryMockup accent={accent} />}
              </div>

              {/* Texte */}
              <div className="w-full sm:w-1/2">
                <div className="mb-4 flex items-center gap-3">
                  <div className="step-number flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-cyan" style={{ fontFamily: 'var(--font-display)' }}>
                    {step}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-cyan/30 to-transparent" />
                </div>
                <h3 className="text-xl font-bold leading-snug text-primary sm:text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-[15px]">{body}</p>
                <ul className="mt-5 space-y-2">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-muted">
                      <span className={`text-base font-bold ${accent === 'gold' ? 'text-gold' : 'text-cyan'}`}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="rounded-3xl border border-cyan/20 bg-card p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0,212,255,0.07), transparent)' }} aria-hidden="true" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Passez à l'action
              </p>
              <h2 className="text-2xl font-bold text-primary sm:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
                Prêt à animer votre écran ?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
                Envoyez-nous votre logo, vos couleurs et votre message commercial.
                On produit, vous diffusez.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a
                  href="mailto:contact@neosenia.com?subject=Pack%20vidéos%20UGC&body=Bonjour%2C%20je%20souhaite%20commander%20un%20pack%20vidéos%20UGC%20NEOSENIA."
                  className="cta-glow cursor-pointer rounded-full bg-cyan px-8 py-3.5 font-bold text-bg transition-opacity hover:opacity-90"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Commander mon pack →
                </a>
                <a
                  href="https://wa.me/33785994352"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-full border border-border-card px-8 py-3.5 text-sm font-medium text-muted transition-colors hover:border-cyan/30 hover:text-primary"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  WhatsApp +33 7 85 99 43 52
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-8 text-xs text-muted">
        NEOSEN LIMITED (trading as NEOSENIA) · Dublin, Irlande · contact@neosenia.com
      </footer>
    </main>
  );
}

/* ── Mockup téléphone 9:16 animé ── */
function PhoneMockup({ accent }: { accent: string }) {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20"
        style={{ background: accent === 'gold' ? 'var(--gold)' : 'var(--cyan)' }}
        aria-hidden="true"
      />
      <div className="relative w-44 rounded-[2rem] border-2 border-white/10 bg-[#0d0d18] shadow-2xl overflow-hidden" style={{ aspectRatio: '9/16' }}>
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-10 rounded-full bg-white/10" />
        {/* Screen content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
          <div className="w-full h-1.5 rounded-full bg-cyan/30 animate-pulse" />
          <div className="w-3/4 h-1.5 rounded-full bg-cyan/20" />
          <div className="mt-3 h-16 w-full rounded-xl border border-cyan/20 bg-cyan/[0.06] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          </div>
          <div className="w-full h-1 rounded-full bg-white/10" />
          <div className="w-2/3 h-1 rounded-full bg-white/10" />
          <div className="mt-2 flex gap-2 w-full">
            <div className="h-6 flex-1 rounded-lg bg-cyan/10 border border-cyan/15" />
            <div className="h-6 flex-1 rounded-lg bg-white/5 border border-white/10" />
          </div>
        </div>
        {/* Scan line animation */}
        <div className="pointer-events-none absolute inset-x-0 h-0.5 bg-cyan/30 animate-scan-line" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ── Mockup brief créatif ── */
function BriefMockup({ accent }: { accent: string }) {
  const lines = [
    { w: 'w-3/4', bright: true },
    { w: 'w-full', bright: false },
    { w: 'w-5/6', bright: false },
    { w: 'w-2/3', bright: false },
  ];
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 rounded-full blur-3xl opacity-20" style={{ background: 'var(--cyan)' }} aria-hidden="true" />
      <div className="relative w-64 rounded-2xl border border-white/10 bg-[#0d0d18] p-5 shadow-2xl">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg border border-cyan/25 bg-cyan/[0.08] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.8)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>
          <div>
            <div className="h-2 w-24 rounded-full bg-cyan/40" />
            <div className="mt-1.5 h-1.5 w-16 rounded-full bg-white/15" />
          </div>
        </div>
        <div className="space-y-2.5 mb-4">
          {lines.map(({ w, bright }, i) => (
            <div key={i} className={`h-1.5 rounded-full ${w} ${bright ? 'bg-white/30' : 'bg-white/10'}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['#00D4FF', '#D4A853', '#7C3AED'].map((color) => (
            <div key={color} className="h-8 rounded-lg border border-white/10" style={{ background: color + '22' }}>
              <div className="h-full rounded-lg" style={{ background: color + '33' }} />
            </div>
          ))}
        </div>
        <div className="h-8 w-full rounded-lg border border-cyan/20 bg-cyan/[0.06] flex items-center justify-center">
          <div className="h-1.5 w-20 rounded-full bg-cyan/50" />
        </div>
      </div>
    </div>
  );
}

/* ── Mockup livraison / timeline ── */
function DeliveryMockup({ accent }: { accent: string }) {
  const steps = [
    { label: 'Brief reçu', done: true },
    { label: 'Production', done: true },
    { label: 'Retouches', done: true },
    { label: 'Livraison MP4', done: false, active: true },
  ];
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 rounded-full blur-3xl opacity-15" style={{ background: 'var(--gold)' }} aria-hidden="true" />
      <div className="relative w-64 rounded-2xl border border-white/10 bg-[#0d0d18] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold" style={{ fontFamily: 'var(--font-heading)' }}>Suivi production</span>
          <span className="rounded-full border border-gold/25 bg-gold/10 px-2 py-0.5 text-[9px] font-semibold text-gold">J+9</span>
        </div>
        <div className="space-y-3">
          {steps.map(({ label, done, active }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`h-5 w-5 shrink-0 rounded-full border flex items-center justify-center ${done ? 'border-gold/40 bg-gold/15' : active ? 'border-gold/60 bg-gold/20 animate-pulse' : 'border-white/15 bg-white/5'}`}>
                {done && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="rgba(212,168,83,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                {active && <div className="h-2 w-2 rounded-full bg-gold" />}
              </div>
              <span className={`text-xs ${done || active ? 'text-primary' : 'text-muted'}`}>{label}</span>
              {active && <span className="ml-auto text-[9px] font-semibold text-gold">En cours</span>}
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-gold/15 bg-gold/[0.05] p-3 flex items-center gap-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(212,168,83,0.7)" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          <span className="text-xs text-muted">3 fichiers <span className="text-primary font-medium">MP4 ready</span></span>
        </div>
      </div>
    </div>
  );
}
