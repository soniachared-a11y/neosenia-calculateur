'use client';

import { useState } from 'react';
import { eur, type Family, type Quote } from '@/lib/pricing';

async function genererDevisPDF(quote: any) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  /* Palette — jsPDF Helvetica = windows-1252 : eviter U+2248 et U+2013 */
  const SLATE9: [number,number,number] = [15, 23, 42];
  const SLATE7: [number,number,number] = [51, 65, 86];
  const SLATE5: [number,number,number] = [100, 116, 139];
  const CYAN: [number,number,number] = [0, 212, 255];
  const CYAN_D: [number,number,number] = [0, 180, 220];
  const WHITE: [number,number,number] = [255, 255, 255];
  const LIGHT: [number,number,number] = [248, 250, 252];
  const BORDER: [number,number,number] = [226, 232, 240];

  const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const refNum = `NEO-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  /* ── Fond blanc ── */
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, 210, 297, 'F');

  /* ── Barre top cyan ── */
  doc.setFillColor(...CYAN);
  doc.rect(0, 0, 210, 4, 'F');

  /* ── En-tete dark ── */
  doc.setFillColor(...SLATE9);
  doc.rect(0, 4, 210, 34, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('NEOSENIA', 20, 22);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Ecrans LED transparents  |  contact@neosenia.com  |  neosenia.com', 20, 30);

  doc.setTextColor(...CYAN);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DEVIS INDICATIF', 190, 16, { align: 'right' });
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Ref. ${refNum}`, 190, 22, { align: 'right' });
  doc.text(dateStr.toUpperCase(), 190, 28, { align: 'right' });

  /* ── Zone produit ── */
  doc.setFillColor(...LIGHT);
  doc.rect(0, 38, 210, 28, 'F');
  doc.setFillColor(...BORDER);
  doc.rect(0, 66, 210, 0.4, 'F');

  doc.setTextColor(...SLATE9);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(quote.label ?? 'Ecran LED NEOSENIA', 20, 52);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE5);
  if (quote.status === 'ok' && quote.surfaceM2) {
    doc.text(`Surface : ${quote.surfaceM2} m2  |  Garantie : ${quote.warrantyYears} ans constructeur  |  Livraison DDP tout compris`, 20, 61);
  }

  /* ── Prix heros ── */
  if (quote.status === 'ok' && quote.priceHtEur) {

    doc.setFillColor(...WHITE);
    doc.rect(20, 74, 170, 48, 'F');
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.rect(20, 74, 170, 48);
    doc.setFillColor(...CYAN);
    doc.rect(20, 74, 3, 48, 'F');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...CYAN_D);
    doc.text('PRIX ESTIME HT', 30, 85);

    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...SLATE9);
    doc.text(eur(quote.priceHtEur), 30, 103);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...SLATE7);
    doc.text(`${eur(quote.priceTtcEur)} TTC`, 155, 85, { align: 'right' });
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE5);
    doc.text('TVA 20 % incluse', 155, 91, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(...SLATE5);
    doc.text('Transport DDP + dedouanement + TVA 20 % inclus  |  Prix ferme 7 j sur acompte 30 %', 30, 113);

    /* ── Specifications ── */
    let y = 136;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...SLATE9);
    doc.text('SPECIFICATIONS', 20, y);
    doc.setFillColor(...CYAN);
    doc.rect(20, y + 2, 30, 0.5, 'F');
    y += 10;

    const rows: [string, string][] = [
      ['Surface', `${quote.surfaceM2} m2`],
      ['Garantie constructeur', `${quote.warrantyYears} ans`],
    ];
    if (quote.transitDays) rows.push(['Delai porte-a-porte', `${quote.transitDays[0]} - ${quote.transitDays[1]} jours ouvres`]);
    if (quote.resolution) rows.push(['Resolution', `${quote.resolution} px`]);
    if (quote.controller) rows.push(['Controleur', quote.controller]);

    rows.forEach(([k, v], idx) => {
      const bg = idx % 2 === 0 ? LIGHT : WHITE;
      doc.setFillColor(...bg);
      doc.rect(20, y - 4, 170, 9, 'F');
      doc.setTextColor(...SLATE5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(k, 24, y + 1);
      doc.setTextColor(...SLATE9);
      doc.setFont('helvetica', 'bold');
      doc.text(v, 120, y + 1);
      y += 9;
    });
    y += 6;

    /* ── Inclus ── */
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...SLATE9);
    doc.text('CE QUI EST INCLUS', 20, y);
    doc.setFillColor(...CYAN);
    doc.rect(20, y + 2, 36, 0.5, 'F');
    y += 12;

    const inclus = [
      'Fret ferroviaire Chine - France (DDP)',
      'Dedouanement + frais de port nationaux',
      'TVA 20 % francaise',
      'Controleur Nova TB40 + cablage complet',
      'Support technique NEOSENIA 5 ans',
    ];
    const blocH = inclus.length * 9 + 8;
    doc.setFillColor(...LIGHT);
    doc.rect(20, y - 4, 170, blocH, 'F');
    doc.setFillColor(...CYAN_D);
    doc.rect(20, y - 4, 2.5, blocH, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    inclus.forEach((it) => {
      doc.setTextColor(...CYAN_D);
      doc.text('+', 27, y + 1);
      doc.setTextColor(...SLATE9);
      doc.text(it, 34, y + 1);
      y += 9;
    });
    y += 8;

    /* Certifications */
    const certs = ['CE', 'RoHS', 'FCC', 'IP54'];
    let cx = 20;
    certs.forEach((cert) => {
      doc.setFillColor(...LIGHT);
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.3);
      doc.rect(cx, y, 18, 8);
      doc.setTextColor(...SLATE5);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(cert, cx + 9, y + 5.5, { align: 'center' });
      cx += 22;
    });
  }

  /* ── Prochaines etapes ── */
  const psY = 240;
  doc.setFillColor(...LIGHT);
  doc.rect(20, psY, 170, 28, 'F');
  doc.setFillColor(...CYAN);
  doc.rect(20, psY, 2.5, 28, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...SLATE9);
  doc.text('PROCHAINES ETAPES', 28, psY + 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...SLATE5);
  doc.text('1. Contactez-nous pour confirmer vos dimensions definitives', 28, psY + 17);
  doc.text('2. Devis ferme sous 48 h apres mesure  |  Acompte 30 % a la commande', 28, psY + 24);

  /* ── Disclaimer ── */
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 270, 210, 18, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...SLATE5);
  doc.setFont('helvetica', 'normal');
  const note = 'Ce document est une estimation indicative basee sur notre grille tarifaire. Votre devis ferme est etabli apres mesure precise de votre vitrine. Prix en EUR HT. TVA 20 % applicable. Sans engagement.';
  const lines = doc.splitTextToSize(note, 170);
  doc.text(lines, 20, 276);

  /* ── Footer ── */
  doc.setFillColor(...SLATE9);
  doc.rect(0, 287, 210, 10, 'F');
  doc.setFillColor(...CYAN);
  doc.rect(0, 287, 3, 10, 'F');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('NEOSEN LIMITED (trading as NEOSENIA)  |  Dublin, Irlande  |  contact@neosenia.com  |  neosenia.com', 8, 293.5);

  doc.save(`devis-neosenia-${refNum}.pdf`);
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
      <div className="overflow-hidden rounded-2xl border border-border-card bg-card">
        <div className="h-1.5 bg-gradient-to-r from-gold via-gold/60 to-transparent" />
        <div className="p-6 sm:p-8">
          <span className="inline-block rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-gold">
            Sur devis personnalisé
          </span>
          <h2 className="mt-4 text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            {quote.label}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {quote.reason
              ? `Cette configuration (${quote.reason}) dépasse notre grille standard. Votre devis ferme est établi sous 48 h.`
              : (quote.note ?? 'Configuration sur mesure — nous établissons votre prix sous 48 h.')}
          </p>
          <CtaDevis />
          <p className="mt-3 text-center text-xs text-muted">Sans engagement · mesures offertes · réponse sous 48 h</p>
        </div>
      </div>
    );
  }

  /* ── Devis chiffré ── */
  const transit = quote.transitDays;

  return (
    <div className="anim-fade-in overflow-hidden rounded-2xl border border-border-card bg-card">
      {/* Barre accent cyan */}
      <div className="h-1.5 bg-gradient-to-r from-cyan via-cyan/60 to-transparent" />

      <div className="p-6 sm:p-8">
        {/* Header badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/10 px-3 py-0.5 text-xs font-semibold text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            Prix livré DDP tout compris
          </span>
          {quote.confidence && (
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 text-xs font-semibold text-gold">
              À confirmer sur devis
            </span>
          )}
          {transit && (
            <span className="rounded-full border border-border-card px-3 py-0.5 text-xs text-muted">
              ≈ {transit[0]}–{transit[1]} j livraison
            </span>
          )}
        </div>

        {/* Prix héros */}
        <div className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">Prix HT estimé</p>
          <div
            className="mt-1 text-5xl font-bold tabular-nums text-cyan sm:text-6xl"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
          >
            {eur(quote.priceHtEur)}
          </div>
          <p className="mt-1.5 text-sm text-muted">
            Transport DDP + douane + TVA 20 % inclus
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">{eur(quote.priceTtcEur)}</span>
            <span className="text-sm text-muted">TTC · rien à ajouter à la livraison</span>
          </div>
        </div>

        {/* Séparateur */}
        <div className="my-6 border-t border-border" />

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
            <span key={cert} className="rounded-md border border-border-card bg-bg px-2 py-0.5 text-[10px] font-bold tracking-widest text-muted">
              {cert}
            </span>
          ))}
        </div>

        {/* Détails techniques */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setTechOpen(o => !o)}
            className="flex cursor-pointer items-center gap-1.5 text-xs text-muted transition-colors hover:text-primary"
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
          <div className="mt-4 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setInclusOpen(o => !o)}
              className="flex w-full cursor-pointer items-center justify-between text-xs text-muted transition-colors hover:text-primary"
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
          <div className="mt-4 rounded-xl border border-border-card bg-bg px-4 py-3 text-xs text-muted">
            <span className="inline-flex items-start gap-2">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {family.elec.regulation_fr}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 border-t border-border pt-6">
          <CtaDevis />
          <button
            type="button"
            onClick={() => genererDevisPDF(quote)}
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border-card py-3 text-sm font-medium text-muted transition-colors hover:border-cyan/30 hover:text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Télécharger ce devis en PDF
          </button>
          <p className="mt-3 text-center text-xs text-muted">
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
    <div className="rounded-xl border border-border-card bg-bg px-3 py-2.5" title={hint}>
      <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-0.5 text-sm font-bold leading-tight ${accent ? 'text-gold' : 'text-primary'}`}>
        {value}
      </p>
    </div>
  );
}

function TechRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border-card bg-bg px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 font-mono text-xs text-primary">{value}</p>
    </div>
  );
}

function IncludeList({ title, items, positive }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-sm">
            <span className={`mt-0.5 shrink-0 font-bold ${positive ? 'text-cyan' : 'text-muted'}`}>
              {positive ? '✓' : '+'}
            </span>
            <span className="text-muted leading-snug">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CtaDevis() {
  return (
    <a
      href="mailto:contact@neosenia.com?subject=Devis%20écran%20LED%20NEOSENIA&body=Bonjour%2C%20je%20souhaite%20recevoir%20mon%20devis%20ferme%20pour%20mon%20projet%20d%27écran%20LED."
      className="cta-glow mt-6 flex items-center justify-center gap-3 rounded-full bg-cyan px-6 py-4 font-bold text-bg"
      style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}
    >
      <span>Obtenir mon devis ferme — 48 h</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bg/15">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M2 6.5h9M7.5 2l4 4.5-4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}
