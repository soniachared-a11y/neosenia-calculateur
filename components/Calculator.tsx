'use client';

import { useMemo, useState } from 'react';
import { computeQuote, getFamilies, getFamily } from '@/lib/pricing';
import { QuoteResult } from './QuoteResult';
import { RoiSimulator } from './RoiSimulator';

const families = getFamilies();

const PRODUCT_DATA: Record<string, {
  code: string;
  shortName: string;
  description: string;
  specs: string;
  badge: string;
  imgProduct: string;
  imgSituation: string;
}> = {
  crystal_film: {
    code: 'NS-CRYSTAL',
    shortName: 'Film transparent Crystal',
    description: 'S\'applique directement sur votre vitrine comme un film. Rendu QLED en lieu ombragé, verre lisible derrière.',
    specs: '86 % transparent · 4 500 nits · Film adhésif',
    badge: 'Idéal vitrine ombragée',
    imgProduct: '/products/tech-crystal.png',
    imgSituation: '/products/app-transparent-ombre.jpg',
  },
  transparent_structure: {
    code: 'NS-IN',
    shortName: 'Structure modulaire',
    description: 'Rideau LED sur structure démontable. S\'adapte à n\'importe quelle surface. Installation sans perçage.',
    specs: '50 % transparent · 5 000 nits · Modulaire',
    badge: 'Grande surface',
    imgProduct: '/products/tech-in-real.jpg',
    imgSituation: '/products/app-in-real.jpg',
  },
  semi_opaque: {
    code: 'NS-HOLO',
    shortName: 'Semi-opaque haute luminosité',
    description: 'Visibilité maximale même en plein soleil. Pose côté intérieur, visible de l\'extérieur. Option double-face.',
    specs: 'Plein soleil · Luminosité max · Sur mesure',
    badge: 'Résiste au plein soleil',
    imgProduct: '/products/tech-holo-real.jpg',
    imgSituation: '/products/app-semiopaque-soleil.jpg',
  },
};

export function Calculator() {
  const [familyId, setFamilyId] = useState(families[0]?.id ?? '');
  const [widthM, setWidthM] = useState(2);
  const [heightM, setHeightM] = useState(1.5);
  const [showRoi, setShowRoi] = useState(false);

  const family = getFamily(familyId);
  const quote = useMemo(
    () => computeQuote(familyId, widthM, heightM),
    [familyId, widthM, heightM],
  );

  const surface = Math.round(widthM * heightM * 100) / 100;
  const chiffrable = family?.public_quote_enabled ?? false;

  return (
    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_1fr]">

      {/* ── Colonne config ── */}
      <div className="order-1 space-y-4 lg:order-1">

        {/* Sélection produit */}
        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-muted" style={{ fontFamily: 'var(--font-heading)' }}>
            1 · Choisissez votre type d'écran
          </p>
          <div className="space-y-3">
            {families.map((f) => {
              const active = f.id === familyId;
              const pd = PRODUCT_DATA[f.id];
              if (!pd) return null;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFamilyId(f.id)}
                  className={`product-card ${active ? 'active' : ''}`}
                >
                  {/* Images dual-panel */}
                  <div className="flex h-36 overflow-hidden">
                    {/* Image produit */}
                    <div className="product-img-panel relative flex-1">
                      <img
                        src={pd.imgProduct}
                        alt={`${pd.shortName} — produit`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <span className="product-img-label">LE PRODUIT</span>
                      <span className="product-img-code">{pd.code}</span>
                    </div>
                    <div className="product-img-divider" />
                    {/* Image en situation */}
                    <div className="product-img-panel relative flex-1">
                      <img
                        src={pd.imgSituation}
                        alt={`${pd.shortName} — en situation`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <span className="product-img-label">EN SITUATION</span>
                    </div>
                  </div>

                  {/* Info carte */}
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                          {pd.shortName}
                        </h3>
                        {active && (
                          <span className="rounded-full bg-cyan/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan">
                            Sélectionné
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-snug text-muted">{pd.specs}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      {f.public_quote_enabled ? (
                        <span className="inline-block rounded-full border border-cyan/25 bg-cyan/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan">
                          Prix instantané
                        </span>
                      ) : (
                        <span className="inline-block rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold text-gold">
                          Sur devis
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dimensions */}
        {chiffrable && (
          <div className="rounded-2xl border border-border-card bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted" style={{ fontFamily: 'var(--font-heading)' }}>
                2 · Dimensions de votre vitrine
              </p>
              <span className="rounded-lg border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs">
                <span className="text-muted">Surface&nbsp;</span>
                <span className="font-bold text-cyan tabular-nums">{surface}&nbsp;m²</span>
              </span>
            </div>
            <DimSlider label="Largeur" value={widthM} min={0.5} max={12} step={0.1} onChange={setWidthM} />
            <DimSlider label="Hauteur" value={heightM} min={0.5} max={6} step={0.1} onChange={setHeightM} />

            {/* Description produit sélectionné */}
            {PRODUCT_DATA[familyId] && (
              <p className="mt-4 rounded-xl border border-border-card bg-bg px-4 py-3 text-xs leading-relaxed text-muted">
                {PRODUCT_DATA[familyId].description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Colonne résultat ── */}
      <div className="order-2 space-y-4 lg:order-2">
        <QuoteResult quote={quote} family={family} />

        {quote.status === 'ok' && (
          <>
            <button
              type="button"
              onClick={() => setShowRoi((o) => !o)}
              className="btn-vaisseau flex w-full items-center justify-between rounded-xl border border-border-card bg-card px-5 py-3.5 text-sm transition-colors hover:text-primary"
            >
              <span className="flex items-center gap-2.5 font-medium text-muted">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Simulateur de rentabilité
              </span>
              <svg
                className={`chevron h-3.5 w-3.5 text-muted transition-transform duration-250 ${showRoi ? 'rotate-180' : ''}`}
                viewBox="0 0 12 12" fill="none"
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {showRoi && <RoiSimulator prixHtEur={quote.priceHtEur} />}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Slider dimension ── */
function DimSlider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm text-muted">{label}</label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
            className="w-16 rounded-lg border border-border-card bg-bg px-2 py-1.5 text-right text-sm font-bold tabular-nums text-primary outline-none transition-colors focus:border-cyan/50"
          />
          <span className="text-sm text-muted">m</span>
        </div>
      </div>
      <input type="range" value={value} min={min} max={max} step={step}
        onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}
