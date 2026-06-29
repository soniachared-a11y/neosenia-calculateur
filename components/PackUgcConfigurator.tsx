'use client';

import { useState } from 'react';
import { eur } from '@/lib/pricing';

const PRIX_UNITAIRE = 400;        // € HT / vidéo
const SEUIL_REMISE = 5;           // à partir de 5 vidéos
const TAUX_REMISE = 0.10;         // -10 %

export function PackUgcConfigurator() {
  const [nbVideos, setNbVideos] = useState(5);

  const prixPlein = nbVideos * PRIX_UNITAIRE;
  const remiseActive = nbVideos >= SEUIL_REMISE;
  const remise = remiseActive ? Math.round(prixPlein * TAUX_REMISE) : 0;
  const total = prixPlein - remise;
  const prixVideoEffectif = Math.round(total / nbVideos);

  return (
    <div className="overflow-hidden rounded-2xl border border-cyan/20 bg-card">
      <div className="h-1.5 bg-gradient-to-r from-cyan via-cyan/60 to-transparent" />
      <div className="p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-cyan" style={{ fontFamily: 'var(--font-heading)' }}>
            Configurez votre pack
          </h2>
          <span className="shrink-0 rounded-full border border-border-card px-2.5 py-0.5 text-xs text-muted">tarif client NEOSENIA</span>
        </div>
        <p className="mt-1.5 text-sm text-muted">
          Choisissez le nombre de vidéos. La remise pack s'applique automatiquement dès 5 vidéos.
        </p>

        {/* Jauge nombre de vidéos */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted">Nombre de vidéos</span>
            <span className="font-bold tabular-nums text-cyan">{nbVideos} vidéo{nbVideos > 1 ? 's' : ''}</span>
          </div>
          <input
            type="range"
            value={nbVideos}
            min={1}
            max={10}
            step={1}
            onChange={(e) => setNbVideos(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-1.5 flex justify-between text-[10px] text-muted">
            <span>1</span><span>5 (pack)</span><span>10</span>
          </div>
        </div>

        {/* Résultat héros */}
        <div className="mt-7 rounded-2xl border border-cyan/25 bg-cyan/[0.05] p-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan">Total HT</p>
          <div className="mt-1 flex items-baseline justify-center gap-3">
            {remiseActive && (
              <span className="text-xl font-semibold text-muted line-through tabular-nums">{eur(prixPlein)}</span>
            )}
            <span className="text-5xl font-bold tabular-nums text-cyan sm:text-6xl" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              {eur(total)}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-muted">
            soit <span className="font-semibold text-primary">{eur(prixVideoEffectif)} / vidéo</span>
          </p>
          {remiseActive && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Remise pack −{eur(remise)} appliquée
            </div>
          )}
        </div>

        {/* Détail */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat label="Prix / vidéo" value={eur(PRIX_UNITAIRE)} />
          <Stat label="Vidéos" value={`${nbVideos}`} />
          <Stat label="Économie" value={remise > 0 ? `−${eur(remise)}` : '—'} accent={remise > 0} />
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Tarif réservé aux clients ayant commandé ou en cours de commande d'un écran NEOSENIA.
          Chaque vidéo : brief créatif, motion design, 2 retouches incluses, livraison 7–10 jours.
        </p>

        <a
          href="mailto:contact@neosenia.com?subject=Pack%20vidéos%20UGC&body=Bonjour%2C%20je%20souhaite%20commander%20un%20pack%20vidéos%20UGC%20NEOSENIA."
          className="cta-glow mt-6 flex items-center justify-center gap-2 rounded-full bg-cyan px-6 py-3.5 font-bold text-bg"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Commander mon pack →
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border-card bg-bg p-3.5 text-center">
      <p className={`text-base font-bold tabular-nums ${accent ? 'text-gold' : 'text-primary'}`}>{value}</p>
      <p className="mt-1 text-[11px] leading-snug text-muted">{label}</p>
    </div>
  );
}
