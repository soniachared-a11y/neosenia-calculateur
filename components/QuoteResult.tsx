'use client';

import { useState } from 'react';
import { eur, type Family, type Quote } from '@/lib/pricing';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function genererDevisPDF(quote: any) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const CYAN = [0, 212, 255] as [number, number, number];
  const DARK = [10, 10, 15] as [number, number, number];
  const GREY = [148, 148, 160] as [number, number, number];

  /* Fond */
  doc.setFillColor(...DARK);
  doc.rect(0, 0, 210, 297, 'F');

  /* Barre accent top */
  doc.setFillColor(...CYAN);
  doc.rect(0, 0, 210, 2, 'F');

  /* En-tête */
  doc.setTextColor(...CYAN);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('NEOSENIA', 20, 24);
  doc.setTextColor(...GREY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Écrans LED transparents · contact@neosenia.com', 20, 31);

  /* Titre devis */
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Devis indicatif', 20, 48);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GREY);
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Généré le ${today}`, 20, 56);

  /* Séparateur */
  doc.setDrawColor(...CYAN);
  doc.setLineWidth(0.4);
  doc.line(20, 62, 190, 62);

  /* Produit */
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(quote.label ?? 'Écran LED NEOSENIA', 20, 74);

  /* Prix */
  if (quote.status === 'ok' && quote.priceHtEur) {
    doc.setFontSize(28);
    doc.setTextColor(...CYAN);
    doc.text(`${eur(quote.priceHtEur)} HT`, 20, 90);
    doc.setFontSize(12);
    doc.setTextColor(...GREY);
    doc.text(`soit ${eur(quote.priceTtcEur)} TTC (TVA 20 % incluse)`, 20, 98);

    /* Récap specs */
    doc.setLineWidth(0.2);
    doc.setDrawColor(255, 255, 255, 0.1);
    doc.line(20, 108, 190, 108);

    const rows: [string, string][] = [
      ['Surface', `${quote.surfaceM2} m²`],
      ['Garantie', `${quote.warrantyYears} ans constructeur`],
    ];
    if (quote.transitDays) {
      rows.push(['Délai porte-à-porte', `≈ ${quote.transitDays[0]}–${quote.transitDays[1]} jours`]);
    }
    if (quote.resolution) rows.push(['Résolution', `${quote.resolution} px`]);

    let y = 118;
    rows.forEach(([k, v]) => {
      doc.setFontSize(10);
      doc.setTextColor(...GREY);
      doc.text(k, 20, y);
      doc.setTextColor(255, 255, 255);
      doc.text(v, 100, y);
      y += 9;
    });

    /* Ce qui est inclus */
    doc.setLineWidth(0.2);
    doc.line(20, y + 4, 190, y + 4);
    y += 14;
    doc.setFontSize(11);
    doc.setTextColor(...CYAN);
    doc.setFont('helvetica', 'bold');
    doc.text('Inclus dans ce prix', 20, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    const inclus = ['Fret ferroviaire Chine → France', 'Dédouanement + DDP France', 'TVA 20 %', 'Contrôleur LED + câblage', 'Support technique NEOSENIA'];
    inclus.forEach((it) => {
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`✓  ${it}`, 24, y);
      y += 7.5;
    });
  }

  /* Avertissement */
  doc.setFontSize(8.5);
  doc.setTextColor(...GREY);
  const note = 'Ce document est une estimation indicative. Votre devis ferme, établi après mesure de votre vitrine, vous est adressé sous 48 h. Sans engagement.';
  const lines = doc.splitTextToSize(note, 170);
  doc.text(lines, 20, 255);

  /* Footer */
  doc.setFillColor(...CYAN);
  doc.rect(0, 287, 210, 10, 'F');
  doc.setFontSize(8);
  doc.setTextColor(10, 10, 15);
  doc.setFont('helvetica', 'bold');
  doc.text('NEOSEN LIMITED (trading as NEOSENIA)  ·  Dublin, Irlande  ·  contact@neosenia.com', 20, 293);

  doc.save(`devis-neosenia-${Date.now()}.pdf`);
}

export function QuoteResult({ quote, family }: { quote: Quote; family?: Family }) {
  const [techOpen, setTechOpen] = useState(false);
  const [inclusOpen, setInclusOpen] = useState(false);

  /* ── Pas de produit sélectionné ── */
  if (quote.status === 'error') {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border-card bg-card p-8 text-muted">
        Sélectionnez une technologie pour commencer.
      </div>
    );
  }

  /* ── Sur devis ── */
  if (quote.status === 'sur_devis') {
    return (
      <div className="rounded-2xl border border-border-card bg-card p-6 sm:p-8">
        <span className="inline-block rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 text-xs font-semibold text-gold">
          Sur devis
        </span>
        <h2
          className="mt-4 text-xl font-semibold text-primary"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {quote.label}
        </h2>
        <p className="mt-3 leading-relaxed text-muted">
          {quote.reason
            ? `Cette configuration (${quote.reason}) dépasse notre grille standard. Nous établissons un prix sur mesure sous 48 h.`
            : (quote.note ?? 'Configuration sur mesure — prix établi sur devis personnalisé.')}
        </p>
        <CtaEtude />
      </div>
    );
  }

  /* ── Devis chiffré ── */
  const transit = quote.transitDays;

  return (
    <div className="anim-fade-in overflow-hidden rounded-2xl border border-border-card bg-card">
      {/* Barre accent cyan — marqueur visuel fort */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cyan via-cyan/60 to-transparent" />

      <div className="p-6 sm:p-8">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/10 px-3 py-0.5 text-xs font-semibold text-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
          Prix livré tout compris
        </span>
        {quote.confidence && (
          <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 text-xs font-semibold text-gold">
            À confirmer sur devis
          </span>
        )}
        {transit && (
          <span className="rounded-full border border-border-card px-3 py-0.5 text-xs text-muted">
            ≈&nbsp;{transit[0]}–{transit[1]}&nbsp;j livraison
          </span>
        )}
      </div>

      {/* Prix héros */}
      <div className="mt-5">
        <div
          className="text-5xl font-bold tabular-nums text-cyan sm:text-6xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {eur(quote.priceHtEur)}
        </div>
        <p className="mt-1 text-sm text-muted">
          HT · transport + douane + TVA 20 % inclus
        </p>
        <p className="mt-2.5 text-base">
          <span className="font-semibold text-primary">{eur(quote.priceTtcEur)}&nbsp;TTC</span>
          <span className="ml-2 text-sm text-muted">— rien à ajouter à la livraison</span>
        </p>
      </div>

      {/* Specs essentielles (surface, garantie) */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        <SpecPill label="Surface" value={`${quote.surfaceM2} m²`} />
        <SpecPill label="Garantie" value={`${quote.warrantyYears} ans`} highlight />
        {transit && (
          <SpecPill
            label="Délai porte-à-porte"
            value={`≈ ${transit[0]}–${transit[1]} j`}
            hint="Fabrication 15–20 j ouvrés + transport ferroviaire ~35 j"
          />
        )}
      </div>

      {/* Détails techniques — repliables (jargon secondaire) */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setTechOpen((o) => !o)}
          className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-primary"
        >
          <svg
            className={`chevron h-3.5 w-3.5 transition-transform duration-250 ${techOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12" fill="none"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Détails techniques
        </button>
        {techOpen && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            <TechRow label="Définition" value={`${quote.resolution} px`} />
            <TechRow label="Dalles" value={`${quote.panelCount}`} />
            <TechRow label="Contrôleur" value={quote.controller} />
          </div>
        )}
      </div>

      {/* Inclus / Non inclus — repliable */}
      {family?.livraison && (
        <div className="mt-4 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setInclusOpen((o) => !o)}
            className="flex w-full items-center justify-between text-xs text-muted transition-colors hover:text-primary"
          >
            <span className="flex items-center gap-1.5">
              <svg className={`chevron h-3.5 w-3.5 transition-transform duration-250 ${inclusOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Ce qui est inclus / non inclus
            </span>
            <span className="text-muted">{inclusOpen ? 'Réduire' : 'Voir le détail'}</span>
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
        <p className="mt-5 rounded-xl border border-border-card bg-bg px-4 py-3 text-xs text-muted">
          <span className="inline-flex items-start gap-2">
            <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {family.elec.regulation_fr}
          </span>
        </p>
      )}

      {/* CTA */}
      <CtaEtude />
      <button
        type="button"
        onClick={() => genererDevisPDF(quote)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border-card py-3 text-sm text-muted transition-colors hover:border-cyan/30 hover:text-primary"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Télécharger le devis PDF
      </button>
      <p className="mt-2 text-center text-xs text-muted">
        Devis ferme sous&nbsp;48&nbsp;h · sans engagement · mesures offertes
      </p>
      </div>{/* fin padding wrapper */}
    </div>
  );
}

/* ── Sous-composants ── */

function SpecPill({ label, value, hint, highlight }: { label: string; value: string; hint?: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-xl border border-border-card bg-bg px-3 py-2.5"
      title={hint}
    >
      <p className="truncate text-[10px] leading-tight text-muted">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold leading-tight ${highlight ? 'text-gold' : 'text-primary'}`}>
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
      <p
        className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-sm">
            <span className={`mt-0.5 shrink-0 ${positive ? 'text-cyan' : 'text-muted'}`}>
              {positive ? '✓' : '+'}
            </span>
            <span className="text-muted leading-snug">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CtaEtude() {
  return (
    <a
      href="mailto:contact@neosenia.fr?subject=Étude%20de%20vitrine%20LED&body=Bonjour%2C%20je%20souhaite%20recevoir%20mon%20devis%20ferme%20pour%20ma%20vitrine."
      className="cta-glow mt-7 flex items-center justify-center gap-3 rounded-full bg-cyan px-6 py-4 font-bold text-bg transition-opacity"
      style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}
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
