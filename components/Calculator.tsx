'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { computeQuote, getFamilies, getFamily, eur, type Quote } from '@/lib/pricing';
import { genererDevisPDF } from '@/lib/devis-pdf';
import { RoiSimulator } from './RoiSimulator';

const families = getFamilies();

const PRODUCT_DATA: Record<string, {
  code: string;
  shortName: string;
  description: string;
  specs: string;
  imgProduct: string;
  imgSituation: string;
}> = {
  crystal_film: {
    code: 'NS-CRYSTAL',
    shortName: 'Film transparent Crystal',
    description: "S'applique directement sur votre vitrine comme un film. Rendu QLED en lieu ombragé, verre lisible derrière.",
    specs: '86 % transparent · 4 500 nits · Film adhésif',
    imgProduct: '/products/tech-crystal.png',
    imgSituation: '/products/app-transparent-ombre.jpg',
  },
  transparent_structure: {
    code: 'NS-IN',
    shortName: 'Structure modulaire',
    description: "Rideau LED sur structure démontable. S'adapte à n'importe quelle surface. Installation sans perçage.",
    specs: '50 % transparent · 5 000 nits · Modulaire',
    imgProduct: '/products/tech-in-real.jpg',
    imgSituation: '/products/app-in-real.jpg',
  },
  semi_opaque: {
    code: 'NS-HOLO',
    shortName: 'Semi-opaque haute luminosité',
    description: "Visibilité maximale même en plein soleil. Pose côté intérieur, visible de l'extérieur. Option double-face.",
    specs: 'Plein soleil · Luminosité max · Sur mesure',
    imgProduct: '/products/tech-holo-real.jpg',
    imgSituation: '/products/app-semiopaque-soleil.jpg',
  },
};

const STEPS = ['Type d\'écran', 'Surface', 'Estimation'];

/** Dérive largeur/hauteur d'une surface totale (ratio paysage 1.6:1). */
function dimsFromSurface(s: number) {
  const surface = Math.max(0.5, s);
  return { widthM: Math.sqrt(surface * 1.6), heightM: Math.sqrt(surface / 1.6) };
}

export function Calculator() {
  const [step, setStep] = useState(1);
  const [familyId, setFamilyId] = useState('');
  const [mode, setMode] = useState<'dim' | 'total'>('dim');
  const [widthM, setWidthM] = useState(4);
  const [heightM, setHeightM] = useState(2.4);
  const [totalSurface, setTotalSurface] = useState(6);
  const [addWarranty, setAddWarranty] = useState(false);
  const [showRoi, setShowRoi] = useState(false);

  const dims = mode === 'dim' ? { widthM, heightM } : dimsFromSurface(totalSurface);
  const family = getFamily(familyId);
  const quote = useMemo<Quote>(
    () => (familyId ? computeQuote(familyId, dims.widthM, dims.heightM) : { status: 'error' }),
    [familyId, dims.widthM, dims.heightM],
  );
  const surface = Math.round(dims.widthM * dims.heightM * 100) / 100;

  const canNext = step === 1 ? !!familyId : true;
  const goNext = () => setStep((s) => Math.min(3, s + 1));
  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="overflow-hidden rounded-2xl border border-border-card bg-card">
      {/* ── Barre de progression ── */}
      <div className="border-b border-border px-5 py-4 sm:px-7">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
            Étape {step} / 3
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted" style={{ fontFamily: 'var(--font-heading)' }}>
            {STEPS[step - 1]}
          </span>
        </div>
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-border-card">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan to-cyan/60 transition-all duration-500"
                style={{ width: i < step ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Contenu de l'étape ── */}
      <div className="p-5 sm:p-7">
        {step === 1 && <StepType familyId={familyId} onSelect={setFamilyId} />}
        {step === 2 && (
          <StepSurface
            mode={mode}
            setMode={setMode}
            widthM={widthM}
            heightM={heightM}
            setWidthM={setWidthM}
            setHeightM={setHeightM}
            totalSurface={totalSurface}
            setTotalSurface={setTotalSurface}
            surface={surface}
            quote={quote}
            chiffrable={family?.public_quote_enabled ?? false}
          />
        )}
        {step === 3 && (
          <StepEstimation
            quote={quote}
            family={family}
            surface={surface}
            addWarranty={addWarranty}
            setAddWarranty={setAddWarranty}
            showRoi={showRoi}
            setShowRoi={setShowRoi}
          />
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-7">
        <button
          type="button"
          onClick={goPrev}
          disabled={step === 1}
          className="flex items-center gap-2 rounded-full border border-border-card px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Précédent
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext}
            className="cta-glow flex items-center gap-2 rounded-full bg-cyan px-7 py-2.5 text-sm font-bold text-bg transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Continuer
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        ) : (
          <span className="flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-5 py-2.5 text-sm font-bold text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Terminé
          </span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ ÉTAPE 1 — Type d'écran ═══════════════ */
function StepType({ familyId, onSelect }: { familyId: string; onSelect: (id: string) => void }) {
  return (
    <div className="anim-fade-up">
      <h2 className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
        Quel type d'écran ?
      </h2>
      <p className="mt-1 text-sm text-muted">Sélectionnez la famille la plus proche de votre besoin.</p>

      <div className="mt-5 space-y-3">
        {families.map((f) => {
          const active = f.id === familyId;
          const pd = PRODUCT_DATA[f.id];
          if (!pd) return null;
          return (
            <button key={f.id} type="button" onClick={() => onSelect(f.id)} className={`product-card ${active ? 'active' : ''}`}>
              <div className="flex h-32 overflow-hidden sm:h-36">
                <div className="product-img-panel relative flex-1">
                  <img src={pd.imgProduct} alt={`${pd.shortName} — produit`} className="h-full w-full object-cover" loading="lazy" />
                  <span className="product-img-label">LE PRODUIT</span>
                  <span className="product-img-code">{pd.code}</span>
                </div>
                <div className="product-img-divider" />
                <div className="product-img-panel relative flex-1">
                  <img src={pd.imgSituation} alt={`${pd.shortName} — en situation`} className="h-full w-full object-cover" loading="lazy" />
                  <span className="product-img-label">EN SITUATION</span>
                </div>
              </div>
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{pd.shortName}</h3>
                    {active && <span className="rounded-full bg-cyan/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan">Sélectionné</span>}
                  </div>
                  <p className="mt-1 text-xs leading-snug text-muted">{pd.specs}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${f.public_quote_enabled ? 'border-cyan/25 bg-cyan/10 text-cyan' : 'border-gold/25 bg-gold/10 text-gold'}`}>
                  {f.public_quote_enabled ? 'Prix instantané' : 'Sur devis'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════ ÉTAPE 2 — Surface ═══════════════ */
function StepSurface({
  mode, setMode, widthM, heightM, setWidthM, setHeightM, totalSurface, setTotalSurface, surface, quote, chiffrable,
}: {
  mode: 'dim' | 'total'; setMode: (m: 'dim' | 'total') => void;
  widthM: number; heightM: number; setWidthM: (n: number) => void; setHeightM: (n: number) => void;
  totalSurface: number; setTotalSurface: (n: number) => void; surface: number; quote: Quote; chiffrable: boolean;
}) {
  return (
    <div className="anim-fade-up">
      <h2 className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Quelle surface ?</h2>
      <p className="mt-1 text-sm text-muted">Saisissez la surface totale, ou les dimensions exactes de l'écran.</p>

      {/* Toggle mode */}
      <div className="mt-5 inline-flex rounded-xl border border-border-card bg-bg p-1">
        {(['dim', 'total'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${mode === m ? 'bg-cyan/15 text-cyan' : 'text-muted hover:text-primary'}`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {m === 'dim' ? 'Largeur × Hauteur' : 'Surface totale'}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {mode === 'dim' ? (
          <div className="space-y-1">
            <DimSlider label="Largeur" value={widthM} min={0.5} max={12} step={0.1} onChange={setWidthM} />
            <DimSlider label="Hauteur" value={heightM} min={0.5} max={6} step={0.1} onChange={setHeightM} />
          </div>
        ) : (
          <div>
            <label className="text-sm text-muted">Surface totale</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number" min={0.5} max={72} step={0.5} value={totalSurface}
                onChange={(e) => setTotalSurface(Math.max(0.5, Math.min(72, Number(e.target.value) || 0.5)))}
                className="w-28 rounded-xl border border-border-card bg-bg px-3 py-2.5 text-lg font-bold tabular-nums text-primary outline-none transition-colors focus:border-cyan/50"
              />
              <span className="text-sm text-muted">m²</span>
            </div>
          </div>
        )}
      </div>

      {/* Récap surface + prix live */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border-card bg-bg px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Surface calculée</p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-primary">{surface} m²</p>
        </div>
        <div className="rounded-xl border border-cyan/20 bg-cyan/[0.06] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Estimation HT</p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-cyan">
            {quote.status === 'ok' ? eur(quote.priceHtEur) : chiffrable ? '—' : 'Sur devis'}
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">Estimation mise à jour en direct. Le détail complet s'affiche à l'étape suivante.</p>
    </div>
  );
}

function DimSlider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm text-muted">{label}</label>
        <div className="flex items-center gap-1.5">
          <input
            type="number" value={value} min={min} max={max} step={step}
            onChange={(e) => { const v = Number(e.target.value); onChange(Number.isNaN(v) ? min : Math.min(max, Math.max(min, v))); }}
            className="w-16 rounded-lg border border-border-card bg-bg px-2 py-1.5 text-right text-sm font-bold tabular-nums text-primary outline-none transition-colors focus:border-cyan/50"
          />
          <span className="text-sm text-muted">m</span>
        </div>
      </div>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}

/* ═══════════════ ÉTAPE 3 — Estimation ═══════════════ */
function StepEstimation({
  quote, family, surface, addWarranty, setAddWarranty, showRoi, setShowRoi,
}: {
  quote: Quote; family: ReturnType<typeof getFamily>; surface: number;
  addWarranty: boolean; setAddWarranty: (b: boolean) => void; showRoi: boolean; setShowRoi: (b: boolean) => void;
}) {
  /* Sur devis */
  if (quote.status !== 'ok') {
    return (
      <div className="anim-fade-up">
        <div className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-6 text-center">
          <span className="inline-block rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-gold">Sur devis personnalisé</span>
          <h2 className="mt-4 text-xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>{quote.status === 'sur_devis' ? quote.label : 'Configuration sur mesure'}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Cette configuration est établie sur mesure. Nous vous transmettons un devis ferme sous 48 h après mesure de votre vitrine.
          </p>
          <a href="mailto:contact@neosenia.com?subject=Devis%20sur%20mesure%20NEOSENIA" className="cta-glow mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-bold text-bg" style={{ fontFamily: 'var(--font-heading)' }}>
            Demander mon devis — 48 h
          </a>
        </div>
        <CrossSell />
      </div>
    );
  }

  const pricePerM2 = surface > 0 ? Math.round(quote.priceHtEur / surface) : 0;
  const warrantyCost = Math.round(quote.priceHtEur * 0.05);
  const finalHt = quote.priceHtEur + (addWarranty ? warrantyCost : 0);
  const pdfQuote = {
    ...quote,
    priceHtEur: finalHt,
    priceTtcEur: Math.round(finalHt * 1.2),
    surfaceM2: surface,
    pricePerM2,
    warrantyYears: addWarranty ? (quote.warrantyYears ?? 5) + 1 : quote.warrantyYears,
  };

  return (
    <div className="anim-fade-up space-y-5">
      <div>
        <h2 className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Votre estimation</h2>
        <p className="mt-1 text-sm text-muted">Clé en main, transparent. Pas de mauvaise surprise.</p>
      </div>

      {/* Tout est inclus */}
      <div className="rounded-2xl border border-cyan/20 bg-cyan/[0.04] p-5">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Tout est inclus dans le prix
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {['Dalle LED haute durée', 'Transport DDP Chine → France', 'Dédouanement & TVA 20 %', 'Contrôleur Nova TB40 + câblage', 'Support technique 5 ans'].map((it) => (
            <span key={it} className="flex items-center gap-2 text-xs text-muted">
              <span className="text-cyan">✓</span>{it}
            </span>
          ))}
        </div>
      </div>

      {/* Prix héros */}
      <div className="overflow-hidden rounded-2xl border border-border-card bg-bg">
        <div className="h-1 bg-gradient-to-r from-cyan via-cyan/60 to-transparent" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/10 px-3 py-0.5 text-xs font-semibold text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />Prix livré DDP tout compris
            </span>
            {quote.transitDays && <span className="rounded-full border border-border-card px-3 py-0.5 text-xs text-muted">≈ {quote.transitDays[0]}–{quote.transitDays[1]} j livraison</span>}
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">Estimation HT</p>
          <div className="mt-1 text-5xl font-bold tabular-nums text-cyan sm:text-6xl" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            {eur(quote.priceHtEur + (addWarranty ? warrantyCost : 0))}
          </div>
          <p className="mt-1.5 text-sm text-muted">Transport DDP + douane + TVA 20 % inclus</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">{eur(Math.round((quote.priceHtEur + (addWarranty ? warrantyCost : 0)) * 1.2))}</span>
            <span className="text-sm text-muted">TTC · rien à ajouter à la livraison</span>
          </div>

          {/* Récap config */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 sm:grid-cols-4">
            <RecapCell label="Produit" value={PRODUCT_DATA[family?.id ?? '']?.shortName ?? quote.label} />
            <RecapCell label="Surface" value={`${surface} m²`} />
            <RecapCell label="Prix au m²" value={`${eur(pricePerM2)}`} />
            <RecapCell label="Garantie" value={`${quote.warrantyYears} ans`} accent />
          </div>

          {/* Certifs */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {['CE', 'RoHS', 'FCC', 'IP54'].map((c) => (
              <span key={c} className="rounded-md border border-border-card bg-card px-2 py-0.5 text-[10px] font-bold tracking-widest text-muted">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Garantie option */}
      <button
        type="button"
        onClick={() => setAddWarranty(!addWarranty)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border-card bg-bg p-5 text-left transition-colors hover:border-gold/30"
      >
        <div>
          <p className="text-sm font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Étendre la garantie à 6 ans</p>
          <p className="mt-0.5 text-xs text-muted">+1 an de couverture pièces & main d'œuvre — <span className="text-gold">+{eur(warrantyCost)} HT</span></p>
        </div>
        <span className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${addWarranty ? 'bg-gold' : 'bg-border-card'}`}>
          <span className={`h-5 w-5 rounded-full bg-white transition-transform ${addWarranty ? 'translate-x-5' : ''}`} />
        </span>
      </button>

      {/* CTA PDF + devis */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => genererDevisPDF(pdfQuote)}
          className="cta-glow flex w-full items-center justify-center gap-3 rounded-full bg-cyan px-6 py-4 font-bold text-bg"
          style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Générer mon devis personnalisé (PDF)
        </button>
        <a
          href="mailto:contact@neosenia.com?subject=Devis%20ferme%20écran%20LED&body=Bonjour%2C%20je%20souhaite%20recevoir%20mon%20devis%20ferme."
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border-card py-3.5 text-sm font-medium text-muted transition-colors hover:border-cyan/30 hover:text-primary"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Parler à un expert → devis ferme sous 48 h
        </a>
      </div>

      {/* ROI teaser */}
      <button
        type="button"
        onClick={() => setShowRoi(!showRoi)}
        className="btn-vaisseau flex w-full items-center justify-between rounded-xl border border-border-card bg-bg px-5 py-3.5 text-sm transition-colors hover:text-primary"
      >
        <span className="flex items-center gap-2.5 font-medium text-muted">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          Simuler ce que mon écran rapporte
        </span>
        <svg className={`chevron h-3.5 w-3.5 text-muted transition-transform duration-250 ${showRoi ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {showRoi && <RoiSimulator prixHtEur={quote.priceHtEur} />}

      <CrossSell />
    </div>
  );
}

function RecapCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-0.5 text-sm font-bold leading-tight ${accent ? 'text-gold' : 'text-primary'}`}>{value}</p>
    </div>
  );
}

function CrossSell() {
  return (
    <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
      <Link href="/regie-publicitaire" className="card-hover rounded-xl border border-border-card bg-bg p-4 no-underline">
        <p className="text-xs font-bold uppercase tracking-wider text-gold" style={{ fontFamily: 'var(--font-heading)' }}>Régie publicitaire</p>
        <p className="mt-1.5 text-sm text-muted">Monétisez votre écran — 65 % reversés. <span className="text-primary">En savoir plus →</span></p>
      </Link>
      <Link href="/pack-ugc" className="card-hover rounded-xl border border-border-card bg-bg p-4 no-underline">
        <p className="text-xs font-bold uppercase tracking-wider text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>Pack vidéos UGC</p>
        <p className="mt-1.5 text-sm text-muted">5 vidéos pro pour votre vitrine. <span className="text-primary">En savoir plus →</span></p>
      </Link>
    </div>
  );
}
