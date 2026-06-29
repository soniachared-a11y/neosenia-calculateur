'use client';

import { useState } from 'react';
import { eur, type Family, type Quote } from '@/lib/pricing';

async function genererDevisPDF(quote: any) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  /* Intl.NumberFormat fr-FR utilise U+00A0 comme séparateur — illisible en jsPDF */
  const pdfEur = (n: number) => eur(n).replace(/ /g, ' ');

  /* Palette — Helvetica = windows-1252 : pas de U+2248 ni U+2013 */
  const C = {
    dark:   [15, 23, 42]   as [number,number,number],
    mid:    [51, 65, 86]   as [number,number,number],
    muted:  [100, 116, 139] as [number,number,number],
    cyan:   [0, 212, 255]  as [number,number,number],
    cyanD:  [0, 165, 200]  as [number,number,number],
    white:  [255, 255, 255] as [number,number,number],
    light:  [247, 249, 252] as [number,number,number],
    border: [220, 228, 238] as [number,number,number],
  };

  const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const refNum  = `NEO-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  /* helpers */
  const fill  = (color: [number,number,number]) => doc.setFillColor(...color);
  const text  = (color: [number,number,number]) => doc.setTextColor(...color);
  const font  = (w: 'normal' | 'bold', size: number) => { doc.setFont('helvetica', w); doc.setFontSize(size); };
  const bar   = (y: number, h: number, color: [number,number,number]) => { fill(color); doc.rect(0, y, 210, h, 'F'); };

  /* ─────────────────────────────────────────────
     1. FOND BLANC
  ───────────────────────────────────────────── */
  fill(C.white); doc.rect(0, 0, 210, 297, 'F');

  /* ─────────────────────────────────────────────
     2. HEADER
     ├── barre cyan (3 mm)
     └── bandeau sombre (35 mm)
  ───────────────────────────────────────────── */
  bar(0, 3, C.cyan);
  bar(3, 35, C.dark);

  /* Logo */
  font('bold', 18); text(C.white);
  doc.text('NEOSENIA', 18, 19);

  /* Tagline */
  font('normal', 7.5); text(C.muted);
  doc.text('Ecrans LED transparents  |  contact@neosenia.com  |  neosenia.com', 18, 27);

  /* Ref + date (droite) */
  font('bold', 7.5); text(C.cyan);
  doc.text('DEVIS INDICATIF', 192, 14, { align: 'right' });
  font('normal', 7); text(C.muted);
  doc.text(`Ref. ${refNum}`, 192, 21, { align: 'right' });
  doc.text(dateStr.toUpperCase(), 192, 27, { align: 'right' });

  /* ─────────────────────────────────────────────
     3. BANDEAU PRODUIT (fond clair, 30 mm)
  ───────────────────────────────────────────── */
  bar(38, 30, C.light);
  fill(C.border); doc.rect(0, 68, 210, 0.3, 'F');

  font('bold', 13); text(C.dark);
  doc.text(quote.label ?? 'Ecran LED NEOSENIA', 18, 52);

  if (quote.status === 'ok' && quote.surfaceM2) {
    font('normal', 8); text(C.muted);
    doc.text(
      `${quote.surfaceM2} m2  ·  Garantie ${quote.warrantyYears} ans  ·  DDP livraison France tout compris`,
      18, 62,
    );
  }

  /* ─────────────────────────────────────────────
     4. BLOC PRIX (encadré, fond blanc)
        y = 74 → 122  (48 mm)
  ───────────────────────────────────────────── */
  if (quote.status === 'ok' && quote.priceHtEur) {
    fill(C.white);
    doc.setDrawColor(...C.border); doc.setLineWidth(0.25);
    doc.rect(18, 74, 174, 48, 'FD');
    fill(C.cyan); doc.rect(18, 74, 3, 48, 'F');

    /* Colonne gauche — prix HT */
    font('bold', 7.5); text(C.cyanD);
    doc.text('PRIX ESTIME HT', 28, 84);

    font('bold', 28); text(C.dark);
    doc.text(pdfEur(quote.priceHtEur), 28, 103);

    font('normal', 7.5); text(C.muted);
    doc.text('Transport + dedouanement + TVA 20 % inclus', 28, 111);
    doc.text('Prix ferme 7 jours sur acompte 30 %', 28, 117);

    /* Colonne droite — prix TTC */
    font('bold', 12); text(C.mid);
    doc.text(pdfEur(quote.priceTtcEur), 189, 94, { align: 'right' });
    font('normal', 7.5); text(C.muted);
    doc.text('TTC TVA 20 %', 189, 101, { align: 'right' });

    /* ─────────────────────────────────────────────
       5. SPECIFICATIONS
          Titre sous-ligné + tableau zébré
          y commence à 128
    ───────────────────────────────────────────── */
    let y = 130;

    font('bold', 8); text(C.dark);
    doc.text('SPECIFICATIONS', 18, y);
    fill(C.cyan); doc.rect(18, y + 1.5, 28, 0.4, 'F');
    y += 9;

    const specsRows: [string, string][] = [
      ['Surface', `${quote.surfaceM2} m2`],
      ['Garantie constructeur', `${quote.warrantyYears} ans`],
    ];
    if (quote.transitDays) specsRows.push(['Delai porte-a-porte', `${quote.transitDays[0]} - ${quote.transitDays[1]} jours ouvres`]);
    if (quote.resolution)  specsRows.push(['Resolution', `${quote.resolution} px`]);
    if (quote.controller)  specsRows.push(['Controleur', String(quote.controller)]);

    const ROW_H = 8;
    specsRows.forEach(([label, value], i) => {
      fill(i % 2 === 0 ? C.light : C.white);
      doc.rect(18, y, 174, ROW_H, 'F');

      font('normal', 8); text(C.muted);
      doc.text(label, 22, y + 5.5);

      font('bold', 8); text(C.dark);
      doc.text(value, 190, y + 5.5, { align: 'right' });

      y += ROW_H;
    });
    y += 8;

    /* ─────────────────────────────────────────────
       6. INCLUS DANS CE PRIX
          Bloc fond clair + barre cyan gauche
    ───────────────────────────────────────────── */
    font('bold', 8); text(C.dark);
    doc.text('INCLUS DANS CE PRIX', 18, y);
    fill(C.cyan); doc.rect(18, y + 1.5, 38, 0.4, 'F');
    y += 10;

    const INCLUS_ITEMS = [
      'Fret ferroviaire Chine - France (DDP, droits de douane payes)',
      'Dedouanement et frais de port nationaux',
      'TVA francaise 20 % (rien a ajouter)',
      'Controleur Nova TB40 + cablage complet',
      'Support technique NEOSENIA — 5 ans',
    ];
    const INCL_ROW = 8;
    const inclusH = INCLUS_ITEMS.length * INCL_ROW + 8;

    fill(C.light); doc.rect(18, y, 174, inclusH, 'F');
    fill(C.cyanD); doc.rect(18, y, 2.5, inclusH, 'F');

    INCLUS_ITEMS.forEach((item) => {
      font('bold', 8); text(C.cyanD);
      doc.text('+', 25, y + 5.5);
      font('normal', 8); text(C.dark);
      doc.text(item, 32, y + 5.5);
      y += INCL_ROW;
    });
    y += 12;

    /* ─────────────────────────────────────────────
       7. CERTIFICATIONS (pastilles en ligne)
    ───────────────────────────────────────────── */
    font('bold', 7); text(C.muted);
    const CERTS = ['CE', 'RoHS', 'FCC', 'IP54'];
    let cx = 18;
    CERTS.forEach((cert) => {
      fill(C.light);
      doc.setDrawColor(...C.border); doc.setLineWidth(0.25);
      doc.roundedRect(cx, y, 20, 7, 1, 1, 'FD');
      doc.text(cert, cx + 10, y + 4.8, { align: 'center' });
      cx += 24;
    });
    y += 16;

    /* ─────────────────────────────────────────────
       8. ETAPES SUIVANTES (si ça rentre)
    ───────────────────────────────────────────── */
    if (y < 246) {
      fill(C.light); doc.rect(18, y, 174, 22, 'F');
      fill(C.cyan);  doc.rect(18, y, 2.5, 22, 'F');
      font('bold', 7.5); text(C.dark);
      doc.text('ETAPES SUIVANTES', 26, y + 7);
      font('normal', 7.5); text(C.muted);
      doc.text('1. Confirmez vos dimensions exactes par email ou WhatsApp', 26, y + 14);
      doc.text('2. Devis ferme sous 48 h — Acompte 30 % a la commande', 26, y + 20);
    }
  }

  /* ─────────────────────────────────────────────
     9. MENTION LEGALE (toujours en bas de page)
     y fixe : 262 → 278
  ───────────────────────────────────────────── */
  fill([240, 244, 248] as [number,number,number]);
  doc.rect(0, 262, 210, 18, 'F');
  font('normal', 6.5); text(C.muted);
  const noteLines = doc.splitTextToSize(
    'Document estimatif etabli sur base de notre grille tarifaire. Le devis ferme est remis sous 48 h apres mesure de votre vitrine. Prix en EUR HT. TVA 20 % applicable en France. Sans engagement contractuel.',
    174,
  );
  doc.text(noteLines, 18, 268);

  /* ─────────────────────────────────────────────
     10. FOOTER
         y fixe : 280 → 297
  ───────────────────────────────────────────── */
  bar(280, 17, C.dark);
  fill(C.cyan); doc.rect(0, 280, 3, 17, 'F');
  font('normal', 7); text(C.muted);
  doc.text('NEOSEN LIMITED (trading as NEOSENIA)  |  Dublin, Irlande  |  contact@neosenia.com  |  neosenia.com', 8, 290);

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

        {/* Paiement fractionné */}
        <div className="mt-5 rounded-xl border border-border-card bg-bg p-4">
          <div className="mb-3 flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-cyan">
              <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <p className="text-xs font-bold text-primary">Payez en 3× ou 4× sans frais</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* PayPal */}
            <div className="flex items-center gap-2.5 rounded-lg border border-[#009cde]/25 bg-[#001530]/60 px-3 py-2.5">
              <LogoPayPal />
              <div>
                <p className="text-xs font-bold text-white">PayPal</p>
                <p className="text-[10px] text-[#66b0e0]">Payer en 4× sans frais</p>
              </div>
            </div>
            {/* Klarna */}
            <div className="flex items-center gap-2.5 rounded-lg border border-[#FFB3C7]/25 bg-[#1e0810]/60 px-3 py-2.5">
              <LogoKlarna />
              <div>
                <p className="text-xs font-bold text-[#FFB3C7]" style={{ fontStyle: 'italic', letterSpacing: '-0.02em' }}>klarna</p>
                <p className="text-[10px] text-[#FFB3C7]/55">Payer en 3× sans frais</p>
              </div>
            </div>
          </div>
          <p className="mt-2.5 text-[10px] text-muted">Sans intérêts · Sans justificatif · Dès 300 €</p>
        </div>

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

/* ── Logos paiement inline SVG (vrais brand marks) ── */

function LogoPayPal() {
  return (
    <svg viewBox="0 0 22 24" width="15" height="17" aria-hidden="true" fill="none">
      {/* P foncé — #003087 */}
      <path d="M2 1.5h7.5c1.5 0 2.7.5 3.3 1.4.6.9.7 2.2.4 3.7C12.8 8.8 11.3 10 9.6 10.4c-.5.1-1 .2-1.6.2H6.2L4.9 18.5H1.5z" fill="#003087"/>
      {/* P clair — #009CDE décalé */}
      <path d="M5.5 1.5H13c1.5 0 2.7.5 3.3 1.4.6.9.7 2.2.4 3.7-0.4 2.2-1.9 3.4-3.6 3.8-.5.1-1 .2-1.6.2H9.7L8.4 18.5H5z" fill="#009CDE"/>
    </svg>
  );
}

function LogoKlarna() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      {/* Carré rose arrondi — brand Klarna */}
      <rect width="20" height="20" rx="5" fill="#FFB3C7"/>
      {/* K mark */}
      <path d="M7 5v10" stroke="#17120E" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M13 5 9 10l4 5" stroke="#17120E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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
