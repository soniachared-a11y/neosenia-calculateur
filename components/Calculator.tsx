'use client';

import { useMemo, useState } from 'react';
import { computeQuote, getFamilies, getFamily, num } from '@/lib/pricing';
import { QuoteResult } from './QuoteResult';
import { RoiSimulator } from './RoiSimulator';

const families = getFamilies();

/* Noms courts pour les cartes — le nom complet reste dans le devis */
const CARD_SHORT: Record<string, string> = {
  crystal_film: 'Crystal Film holographique',
  transparent_structure: 'LED Structure modulaire',
  semi_opaque: 'Semi-opaque haute luminosité',
};

const CARD_SPECS: Record<string, string> = {
  crystal_film: '86 % transparent · 4 500 nits · film adhésif sur verre',
  transparent_structure: '50 % transparent · 5 000 nits · rideau modulaire',
  semi_opaque: 'Visibilité maximale plein soleil · personnalisé sur mesure',
};

export function Calculator() {
  const [familyId, setFamilyId] = useState(families[0]?.id ?? '');
  const [widthM, setWidthM] = useState(4);
  const [heightM, setHeightM] = useState(2.4);

  const family = getFamily(familyId);
  const quote = useMemo(
    () => computeQuote(familyId, widthM, heightM),
    [familyId, widthM, heightM],
  );

  const surface = Math.round(widthM * heightM * 100) / 100;
  const chiffrable = family?.public_quote_enabled ?? false;
  const [showRoi, setShowRoi] = useState(false);

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_1.05fr]">
      {/* ── Colonne config — 2ème sur mobile, 1ère sur desktop ── */}
      <div className="order-2 space-y-4 lg:order-1">
        {/* 1 · Technologie */}
        <div
          className="rounded-2xl border border-border-card bg-card p-6"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <p
            className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-muted"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            1 · Technologie
          </p>
          <div className="space-y-3">
            {families.map((f) => {
              const active = f.id === familyId;
              const shortName = CARD_SHORT[f.id] ?? f.label;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFamilyId(f.id)}
                  className={`group w-full rounded-xl border-l-2 border-r border-t border-b p-4 text-left transition-all duration-200 ${
                    active
                      ? 'border-l-cyan border-r-border-card border-t-border-card border-b-border-card bg-cyan/[0.06]'
                      : 'border-border-card bg-bg hover:bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={`font-semibold transition-colors ${active ? 'text-primary' : 'text-muted group-hover:text-primary'}`}
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {shortName}
                    </p>
                    <Badge enabled={f.public_quote_enabled} />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {CARD_SPECS[f.id] ?? 'Configuration sur mesure'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2 · Dimensions — visible seulement si chiffrable */}
        {chiffrable && (
          <div
            className="rounded-2xl border border-border-card bg-card p-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <div className="mb-5 flex items-center justify-between">
              <p
                className="text-xs font-semibold uppercase tracking-[0.15em] text-muted"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                2 · Dimensions
              </p>
              <span className="rounded-lg border border-border-card bg-bg px-2.5 py-1 text-xs">
                <span className="text-muted">Surface&nbsp;</span>
                <span className="font-semibold text-primary tabular-nums">{surface}&nbsp;m²</span>
              </span>
            </div>

            <DimSlider
              label="Largeur"
              value={widthM}
              min={0.5}
              max={12}
              step={0.1}
              onChange={setWidthM}
            />
            <DimSlider
              label="Hauteur"
              value={heightM}
              min={0.5}
              max={6}
              step={0.1}
              onChange={setHeightM}
            />
          </div>
        )}
      </div>

      {/* ── Colonne résultat — 1ère sur mobile (devis immédiatement visible) ── */}
      <div className="order-1 space-y-4 lg:order-2">
        <QuoteResult quote={quote} family={family} />
        {quote.status === 'ok' && (
          <>
            <button
              type="button"
              onClick={() => setShowRoi((o) => !o)}
              className="btn-vaisseau flex w-full items-center justify-between rounded-xl border border-border-card bg-card px-4 py-3 text-sm text-muted transition-colors hover:text-primary"
            >
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Simulateur de rentabilité
              </span>
              <svg className={`chevron h-3.5 w-3.5 transition-transform duration-250 ${showRoi ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none">
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

/* ── Sous-composants locaux ── */

function Badge({ enabled }: { enabled: boolean }) {
  if (enabled) {
    return (
      <span className="shrink-0 rounded-full border border-cyan/20 bg-cyan/10 px-2.5 py-0.5 text-xs font-medium text-cyan">
        Chiffrable
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-full border border-gold/20 bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
      Sur devis
    </span>
  );
}

function DimSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-2.5 flex items-center justify-between text-sm">
        <label className="text-muted">{label}</label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
            className="w-16 rounded-lg border border-border-card bg-bg px-2 py-1 text-right text-sm font-medium tabular-nums text-primary outline-none transition-colors focus:border-cyan/50"
          />
          <span className="text-muted">m</span>
        </div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}
