'use client';

import { useState } from 'react';
import { computeRoi, ROI_DEFAULTS } from '@/lib/roi';
import { eur, num } from '@/lib/pricing';

export function RoiSimulator({ prixHtEur }: { prixHtEur: number }) {
  const [passagesParJour, setPassages] = useState(ROI_DEFAULTS.passagesParJour);
  const [tauxRegard, setTaux] = useState(ROI_DEFAULTS.tauxRegard);
  const [cpmEur, setCpm] = useState(ROI_DEFAULTS.cpmEur);

  const roi = computeRoi({ passagesParJour, tauxRegard, cpmEur, prixHtEur });

  return (
    <section
      className="rounded-2xl border border-border-card bg-card p-6 sm:p-8"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* En-tête */}
      <div className="flex items-baseline justify-between gap-3">
        <h2
          className="text-xs font-semibold uppercase tracking-[0.15em] text-muted"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Simulateur de rentabilité
        </h2>
        <span className="shrink-0 rounded-full border border-border-card px-2.5 py-0.5 text-xs text-muted">
          estimation
        </span>
      </div>
      <p className="mt-1.5 text-sm text-muted">
        Valeur média générée par votre vitrine selon votre flux de passage.
      </p>

      {/* Sliders */}
      <div className="mt-6 space-y-5">
        <RoiSlider
          label="Passages / jour devant la vitrine"
          value={passagesParJour}
          min={100}
          max={10000}
          step={100}
          display={num(passagesParJour)}
          onChange={setPassages}
        />
        <RoiSlider
          label="Taux de mémorisation estimé"
          value={tauxRegard}
          min={0.1}
          max={0.8}
          step={0.05}
          display={`${Math.round(tauxRegard * 100)} %`}
          onChange={setTaux}
        />
        <RoiSlider
          label="Valeur média / 1 000 contacts (CPM)"
          value={cpmEur}
          min={2}
          max={25}
          step={1}
          display={eur(cpmEur)}
          onChange={setCpm}
        />
      </div>

      {/* Stats résultat */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <RoiStat
          label="Contacts / mois"
          value={num(roi.contactsParMois)}
        />
        <RoiStat
          label="Valeur média / mois"
          value={eur(roi.valeurMediaMensuelleEur)}
          highlight
        />
        <RoiStat
          label="Amorti en"
          value={roi.moisAmortissement ? `${roi.moisAmortissement} mois` : '—'}
        />
      </div>

      <p className="mt-4 text-xs text-muted">
        Hypothèses indicatives, hors valeur d'image et trafic en boutique. Non contractuel.
      </p>
    </section>
  );
}

function RoiSlider({
  label, value, min, max, step, display, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; display: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold tabular-nums text-primary">{display}</span>
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

function RoiStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border-card bg-bg p-3.5 text-center">
      <p
        className={`text-lg font-bold tabular-nums ${highlight ? 'text-cyan' : 'text-primary'}`}
        style={{ fontFamily: highlight ? 'var(--font-display)' : 'var(--font-body)' }}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
