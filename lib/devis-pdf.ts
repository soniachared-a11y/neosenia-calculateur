/**
 * Génération du devis PDF client (jsPDF, côté navigateur).
 * Document blanc professionnel — n'expose AUCUNE donnée sourcing.
 */
import { eur } from './pricing';

type QuoteLike = {
  status: string;
  label?: string;
  priceHtEur?: number;
  priceTtcEur?: number;
  surfaceM2?: number;
  warrantyYears?: number | null;
  transitDays?: [number, number] | null;
  resolution?: string;
  pricePerM2?: number;
};

export async function genererDevisPDF(quote: QuoteLike) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const SLATE9: [number, number, number] = [15, 23, 42];
  const SLATE5: [number, number, number] = [100, 116, 139];
  const CYAN: [number, number, number] = [0, 180, 220];
  const WHITE: [number, number, number] = [255, 255, 255];
  const LIGHT: [number, number, number] = [248, 250, 252];

  /* Fond blanc */
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, 210, 297, 'F');

  /* Barre cyan top */
  doc.setFillColor(...CYAN);
  doc.rect(0, 0, 210, 3, 'F');

  /* En-tête sombre */
  doc.setFillColor(...SLATE9);
  doc.rect(0, 3, 210, 30, 'F');
  doc.setTextColor(...WHITE);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('NEOSENIA', 20, 18);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Ecrans LED transparents · contact@neosenia.com · neosenia.com', 20, 26);

  doc.setTextColor(...WHITE);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`DEVIS INDICATIF · ${dateStr.toUpperCase()}`, 190, 18, { align: 'right' });

  /* Zone produit */
  doc.setFillColor(...LIGHT);
  doc.rect(0, 33, 210, 24, 'F');
  doc.setTextColor(...SLATE9);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const label = (quote.label ?? 'Ecran LED NEOSENIA').replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a');
  doc.text(label, 20, 47);
  if (quote.status === 'ok' && quote.priceHtEur) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE5);
    doc.text(`Surface : ${quote.surfaceM2} m2 · Garantie ${quote.warrantyYears} ans`, 20, 54);
  }

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
    doc.text(`${eur(quote.priceTtcEur ?? 0)} TTC`, 20, 95);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...SLATE5);
    doc.text('Prix verrouille 7 jours sur acompte 30 %', 20, 101);

    doc.setFillColor(226, 232, 240);
    doc.rect(20, 108, 170, 0.4, 'F');

    doc.setFontSize(9);
    const rows: [string, string][] = [
      ['Surface', `${quote.surfaceM2} m2`],
      ['Garantie constructeur', `${quote.warrantyYears} ans`],
    ];
    if (quote.pricePerM2) rows.push(['Prix au m2', `${eur(quote.pricePerM2)} HT`]);
    if (quote.transitDays) rows.push(['Delai porte-a-porte', `~ ${quote.transitDays[0]}-${quote.transitDays[1]} jours ouvres`]);
    if (quote.resolution) rows.push(['Resolution', `${quote.resolution} px`]);

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

    doc.setFillColor(...LIGHT);
    doc.roundedRect(20, y + 6, 170, 58, 3, 3, 'F');
    doc.setFillColor(...CYAN);
    doc.rect(20, y + 6, 3, 58, 'F');

    doc.setTextColor(...SLATE9);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Inclus dans ce prix', 30, y + 18);

    const inclus = [
      'Fret ferroviaire Chine -> France (DDP)',
      'Dedouanement + frais de port',
      'TVA 20 % francaise',
      'Controleur Nova TB40 + cablage',
      'Support technique NEOSENIA 5 ans',
    ];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    inclus.forEach((it, i) => {
      doc.setTextColor(0, 150, 190);
      doc.text('+', 30, y + 28 + i * 8);
      doc.setTextColor(...SLATE9);
      doc.text(it, 37, y + 28 + i * 8);
    });
    y += 72;

    doc.setFontSize(8);
    doc.setTextColor(...SLATE5);
    doc.text('Certifie : CE · RoHS · FCC · IP54', 20, y + 14);
  } else {
    /* Sur devis */
    doc.setTextColor(...SLATE9);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Sur devis personnalise', 20, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE5);
    const txt = doc.splitTextToSize(
      'Cette configuration est etablie sur mesure. Notre equipe vous transmet un devis ferme sous 48 h apres mesure de votre vitrine.',
      170,
    );
    doc.text(txt, 20, 90);
  }

  /* Avertissement légal */
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 258, 210, 24, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE5);
  const note =
    'Ce document est une estimation indicative basee sur notre grille tarifaire. Votre devis ferme - etabli apres mesure de votre vitrine - vous est remis sous 48 h. Prix en EUR HT. TVA 20 % applicable. Sans engagement.';
  doc.text(doc.splitTextToSize(note, 170), 20, 264);

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
