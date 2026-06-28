'use client';

import { useState } from 'react';
import { eur, type Family, type Quote } from '@/lib/pricing';

async function genererDevisPDF(quote: any) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  /* Palette */
  const SLATE9: [number,number,number] = [15, 23, 42];
  const SLATE5: [number,number,number] = [100, 116, 139];
  const CYAN: [number,number,number] = [0, 212, 255];
  const WHITE: [number,number,number] = [255, 255, 255];
  const LIGHT: [number,number,number] = [248, 250, 252];

  /* Fond blanc */
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, 210, 297, 'F');

  /* Barre cyan top */
  doc.setFillColor(...CYAN);
  doc.rect(0, 0, 210, 3, 'F');

  /* En-tête */
  doc.setFillColor(...SLATE9);
  doc.rect(0, 3, 210, 30, 'F');
  doc.setTextColor(...WHITE);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('NEOSENIA', 20, 18);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Écrans LED transparents · contact@neosenia.com · neosenia.com', 20, 26);

  /* Badge DEVIS INDICATIF */
  doc.setTextColor(...WHITE);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`DEVIS INDICATIF · ${dateStr.toUpperCase()}`, 130, 18, { align: 'right' });

  /* Zone produit */
  doc.setFillColor(...LIGHT);
  doc.rect(0, 33, 210, 24, 'F');
  doc.setTextColor(...SLATE9);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(quote.label ?? 'Écran LED NEOSENIA', 20, 47);
  if (quote.status === 'ok' && quote.priceHtEur) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE5);
    doc.text(`Surface : ${quote.surfaceM2} m² · Garantie ${quote.warrantyYears} ans`, 20, 54);
  }

  /* Prix */
  if (quote.status === 'ok' && quote.priceHtEur) {
    doc.setFillColor(...CYAN);
    doc.rect(0, 57, 210, 0.5, 'F');

    doc.setTextColor(...SLATE9);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text(`${eur(quote.priceHtEur)}`, 20, 78);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE5);
    doc.text('HT · transport + douane + TVA 20 % inclus', 20, 86);

    doc.setFontSize(12);
    doc.setTextColor(...SLATE9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${eur(quote.priceTtcEur)} TTC`, 20, 95);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...SLATE5);
    doc.text('Prix verrouillé 7 jours sur acompte 30 %', 20, 101);

    /* Séparateur */
    doc.setFillColor(226, 232, 240);
    doc.rect(20, 108, 170, 0.4, 'F');

    /* Détails */
    doc.setFontSize(9);
    const rows: [string, string][] = [
      ['Surface', `${quote.surfaceM2} m²`],
      ['Garantie constructeur', `${quote.warrantyYears} ans`],
    ];
    if (quote.transitDays) rows.push(['Délai porte-à-porte', `≈ ${quote.transitDays[0]}–${quote.transitDays[1]} jours ouvrés`]);
    if (quote.resolution) rows.push(['Résolution', `${quote.resolution} px`]);

    let y = 118;
    rows.forEach(([k, v]) => {
      doc.setTextColor(...SLATE5);
      doc.setFont('helvetica', 'normal');
      doc.text(k, 20, y);
      doc.setTextColor(...SLATE9);
      doc.setFont('helvetica', 'bold');
      doc.text(v, 110, y);
      y += 9;
    });

    /* Ce qui est inclus */
    doc.setFillColor(...LIGHT);
    doc.roundedRect(20, y + 6, 170, 58, 3, 3, 'F');
    doc.setFillColor(...CYAN);
    doc.rect(20, y + 6, 3, 58, 'F');

    doc.setTextColor(...SLATE9);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Inclus dans ce prix', 30, y + 18);

    const inclus = [
      'Fret ferroviaire Chine → France (DDP)',
      'Dédouanement + frais de port',
      'TVA 20 % française',
      'Contrôleur Nova TB40 + câblage',
      'Support technique NEOSENIA 5 ans',
    ];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    inclus.forEach((it, i) => {
      doc.setTextColor(0, 180, 220);
      doc.text('✓', 30, y + 28 + i * 8);
      doc.setTextColor(...SLATE9);
      doc.text(it, 37, y + 28 + i * 8);
    });
    y += 72;

    /* Certifications */
    doc.setFontSize(8);
    doc.setTextColor(...SLATE5);
    doc.text('Certifié : CE · RoHS · FCC · IP54', 20, y + 14);
  }

  /* Avertissement légal */
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 258, 210, 24, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE5);
  const note = 'Ce document est une estimation indicative basée sur notre grille tarifaire. Votre devis ferme — établi après mesure de votre vitrine — vous est remis sous 48 h. Prix en €HT. TVA 20 % applicable. Sans engagement.';
  const lines = doc.splitTextToSize(note, 170);
  doc.text(lines, 20, 264);

  /* Footer */
  doc.setFillColor(...SLATE9);
  doc.rect(0, 284, 210, 13, 'F');
  doc.setFillColor(...CYAN);
  doc.rect(0, 284, 3, 13, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('NEOSEN LIMITED (trading as NEOSENIA)  ·  Dublin, Irlande  ·  contact@neosenia.com  ·  neosenia.com', 8, 292);

  doc.save(`devis-neosenia-${Date.now()}.pdf`);
}

export function QuoteResult({ quote, family }: { quote: Quote; family?: Family }) {
  const [techOpen, setTechOpen] = useState(false);
  const [inclusOpen, setInclusOpen] = useState(false);

  /* ── Pas de produit ── */
  if (quote.status === 'error') {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border-card bg-card p-8 text-sm text-muted">
        Sélectionnez un type d'écran pour voir le prix.
      </div>
    );
  }

  /* ── Sur devis ── */
  if (quote.status === 'sur_devis') {
    return (
      <div className="quote-light p-6 sm:p-8">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-gold via-gold/60 to-transparent -mx-6 -mt-6 mb-6 w-[calc(100%+3rem)]" />
        <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-gold">
          Sur devis personnalisé
        </span>
        <h2 className="mt-4 text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
          {quote.label}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          {quote.reason
            ? `Cette configuration (${quote.reason}) dépasse notre grille standard. Votre devis ferme est établi sous 48 h.`
            : (quote.note ?? 'Configuration sur mesure — nous établissons votre prix sous 48 h.')}
        </p>
        <CtaDevis light />
        <p className="mt-3 text-center text-xs text-slate-400">Sans engagement · mesures offertes · réponse sous 48 h</p>
      </div>
    );
  }

  /* ── Devis chiffré ── */
  const transit = quote.transitDays;

  return (
    <div className="quote-light">
      {/* Barre accent cyan pleine largeur */}
      <div className="h-1.5 bg-gradient-to-r from-cyan via-cyan/70 to-transparent" />

      <div className="p-6 sm:p-8">
        {/* Header badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Prix livré DDP tout compris
          </span>
          {quote.confidence && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-700">
              À confirmer sur devis
            </span>
          )}
          {transit && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs text-slate-500">
              ≈ {transit[0]}–{transit[1]} j livraison
            </span>
          )}
        </div>

        {/* Prix héros */}
        <div className="mt-6">
          <p className="quote-light-label mb-1">Prix HT estimé</p>
          <div
            className="quote-light-price text-5xl font-bold tabular-nums sm:text-6xl"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
          >
            {eur(quote.priceHtEur)}
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Transport DDP + douane + TVA 20 % inclus
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-800">{eur(quote.priceTtcEur)}</span>
            <span className="text-sm text-slate-500">TTC · rien à ajouter à la livraison</span>
          </div>
        </div>

        {/* Séparateur */}
        <div className="quote-light-divider my-6 border-t" />

        {/* Specs grid */}
        <div className="grid grid-cols-3 gap-2">
          <SpecPill label="Surface" value={`${quote.surfaceM2} m²`} />
          <SpecPill label="Garantie" value={`${quote.warrantyYears} ans`} accent />
          {transit ? (
            <SpecPill label="Délai" value={`≈ ${transit[0]}–${transit[1]} j`} hint="Fabrication + fret ferroviaire" />
          ) : (
            <SpecPill label="Livraison" value="Sur devis" />
          )}
        </div>

        {/* Certifications */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['CE', 'RoHS', 'FCC', 'IP54'].map(cert => (
            <span key={cert} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold tracking-widest text-slate-400">
              {cert}
            </span>
          ))}
        </div>

        {/* Détails techniques */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setTechOpen(o => !o)}
            className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-slate-700"
          >
            <svg className={`chevron h-3.5 w-3.5 transition-transform duration-200 ${techOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Détails techniques
          </button>
          {techOpen && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <TechRow label="Définition" value={`${quote.resolution} px`} />
              <TechRow label="Dalles" value={`${quote.panelCount}`} />
              <TechRow label="Contrôleur" value={quote.controller} />
            </div>
          )}
        </div>

        {/* Inclus / Non inclus */}
        {family?.livraison && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setInclusOpen(o => !o)}
              className="flex w-full cursor-pointer items-center justify-between text-xs text-slate-400 transition-colors hover:text-slate-700"
            >
              <span className="flex items-center gap-1.5">
                <svg className={`chevron h-3.5 w-3.5 transition-transform duration-200 ${inclusOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Ce qui est inclus / non inclus
              </span>
              <span>{inclusOpen ? 'Réduire' : 'Voir le détail'}</span>
            </button>
            {inclusOpen && (
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <IncludeList title="Inclus" items={family.livraison.inclus} positive />
                <IncludeList title="En option / sur devis" items={family.livraison.non_inclus} />
              </div>
            )}
          </div>
        )}

        {/* Réglementation */}
        {family?.elec?.regulation_fr && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <span className="inline-flex items-start gap-2">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {family.elec.regulation_fr}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="quote-light-divider mt-6 border-t pt-6">
          <CtaDevis light />
          <button
            type="button"
            onClick={() => genererDevisPDF(quote)}
            className="quote-light-secondary mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Télécharger ce devis en PDF
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            Devis ferme sous 48 h · sans engagement · mesures offertes
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Sous-composants ── */

function SpecPill({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className="quote-light-pill" title={hint}>
      <p className="quote-light-label truncate">{label}</p>
      <p className={`mt-0.5 text-sm font-bold leading-tight ${accent ? 'text-emerald-600' : 'text-slate-800'}`}>
        {value}
      </p>
    </div>
  );
}

function TechRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 font-mono text-xs font-medium text-slate-700">{value}</p>
    </div>
  );
}

function IncludeList({ title, items, positive }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-sm">
            <span className={`mt-0.5 shrink-0 font-bold ${positive ? 'text-emerald-500' : 'text-slate-400'}`}>
              {positive ? '✓' : '+'}
            </span>
            <span className="text-slate-600 leading-snug">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CtaDevis({ light }: { light?: boolean }) {
  return (
    <a
      href="mailto:contact@neosenia.com?subject=Devis%20écran%20LED%20NEOSENIA&body=Bonjour%2C%20je%20souhaite%20recevoir%20mon%20devis%20ferme%20pour%20mon%20projet%20d%27écran%20LED."
      className="quote-light-cta mt-6 flex items-center justify-center gap-3 rounded-full px-6 py-4 font-bold"
      style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}
    >
      <span>Obtenir mon devis ferme — 48 h</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M2 6.5h9M7.5 2l4 4.5-4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}
