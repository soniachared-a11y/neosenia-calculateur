'use client';

import { useState } from 'react';
import { eur, num } from '@/lib/pricing';

/** Part reversée au propriétaire de l'écran. */
const PART_PROPRIO = 0.65;

export function RegieSimulator() {
  const [annonceurs, setAnnonceurs] = useState(4);
  const [prixAnnonceur, setPrixAnnonceur] = useState(700);

  const caBrutMois = annonceurs * prixAnnonceur;
  const revenuProprioMois = Math.round(caBrutMois * PART_PROPRIO);
  const commissionMois = caBrutMois - revenuProprioMois;
  const revenuProprioAn = revenuProprioMois * 12;

  return (
    <div className="overflow-hidden rounded-2xl border border-gold/20 bg-card">
      <div className="h-1.5 bg-gradient-to-r from-gold via-gold/60 to-transparent" />
      <div className="p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gold" style={{ fontFamily: 'var(--font-heading)' }}>
            Simulateur de revenus
          </h2>
          <span className="shrink-0 rounded-full border border-border-card px-2.5 py-0.5 text-xs text-muted">estimation</span>
        </div>
        <p className="mt-1.5 text-sm text-muted">
          Combien votre écran peut vous rapporter chaque mois en régie publicitaire locale.
        </p>

        {/* Jauges */}
        <div className="mt-6 space-y-5">
          <Slider
            label="Annonceurs locaux signés"
            value={annonceurs}
            min={1}
            max={8}
            step={1}
            display={`${annonceurs}`}
            accent="gold"
            onChange={setAnnonceurs}
          />
          <Slider
            label="Prix moyen / annonceur / mois"
            value={prixAnnonceur}
            min={200}
            max={1500}
            step={50}
            display={eur(prixAnnonceur)}
            accent="gold"
            onChange={setPrixAnnonceur}
          />
        </div>

        {/* Résultat héros */}
        <div className="mt-7 rounded-2xl border border-gold/25 bg-gold/[0.06] p-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold">Votre revenu net mensuel</p>
          <div className="mt-1 text-5xl font-bold tabular-nums text-gold sm:text-6xl" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            {eur(revenuProprioMois)}
          </div>
          <p className="mt-1.5 text-sm text-muted">
            soit <span className="font-semibold text-primary">{eur(revenuProprioAn)}</span> / an · part 65 % versée chaque mois
          </p>
        </div>

        {/* Répartition visuelle 65/35 */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold text-gold">Vous — 65 %</span>
            <span className="text-muted">NEOSENIA — 35 %</span>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full border border-border-card">
            <div className="bg-gold transition-all duration-300" style={{ width: '65%' }} />
            <div className="bg-muted/40 transition-all duration-300" style={{ width: '35%' }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Stat label="CA brut annonceurs / mois" value={eur(caBrutMois)} />
            <Stat label="Commission NEOSENIA / mois" value={eur(commissionMois)} muted />
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Estimation indicative — varie selon zone, trafic, format d'écran et qualité de l'emplacement.
          NEOSENIA démarche les annonceurs, gère la diffusion et la facturation. Vous n'avez rien à prospecter.
        </p>

        <a
          href="mailto:contact@neosenia.com?subject=Programme%20régie%20publicitaire&body=Bonjour%2C%20je%20souhaite%20activer%20la%20régie%20publicitaire%20sur%20mon%20écran%20NEOSENIA."
          className="cta-glow mt-6 flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-bold text-bg"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Activer ma régie — rappel sous 24 h →
        </a>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, display, accent, onChange }: {
  label: string; value: number; min: number; max: number; step: number; display: string; accent: 'gold' | 'cyan'; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className={`font-bold tabular-nums ${accent === 'gold' ? 'text-gold' : 'text-cyan'}`}>{display}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${accent === 'gold' ? 'slider-gold' : ''}`}
      />
    </div>
  );
}

function Stat({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="rounded-xl border border-border-card bg-bg p-3.5 text-center">
      <p className={`text-lg font-bold tabular-nums ${muted ? 'text-muted' : 'text-primary'}`}>{value}</p>
      <p className="mt-1 text-xs leading-snug text-muted">{label}</p>
    </div>
  );
}
