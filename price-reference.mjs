/**
 * RÉFÉRENCE CANONIQUE du calcul de prix client — à RÉPLIQUER dans l'app externe.
 * Identique à la logique du site neosenia-site (src/js/pages/calculateur.js).
 *
 * Consomme UNIQUEMENT devis-public.json (coefficients de vente €).
 * AUCUNE donnée sourcing (USD, fournisseur, marge) n'est touchée ici.
 *
 *   node price-reference.mjs   (démo)
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pricing = JSON.parse(readFileSync(join(__dirname, './devis-public.json'), 'utf8'));

/** Géométrie : surface, panneaux, résolution (résolution = dimensions / pitch). */
export function computeGeometry({ widthM, heightM }, specs) {
  const widthMm = widthM * 1000;
  const heightMm = heightM * 1000;
  const surfaceM2 = Math.round(widthM * heightM * 100) / 100;
  const resW = Math.round(widthMm / specs.pitch_mm);
  const resH = Math.round(heightMm / specs.pitch_mm);
  const cols = Math.ceil(widthMm / specs.panel_mm.w);
  const rows = Math.ceil(heightMm / specs.panel_mm.h);
  return { surfaceM2, resW, resH, totalPixels: resW * resH, panelCount: cols * rows };
}

/** Contrôleur selon la résolution. over_capacity = au-delà du contrôleur documenté. */
export function pickController(totalPixels, controllers) {
  const sorted = [...controllers].sort((a, b) => a.max_pixels - b.max_pixels);
  const c = sorted.find((x) => x.max_pixels >= totalPixels) || sorted[sorted.length - 1];
  return { ...c, over_capacity: c.max_pixels < totalPixels };
}

/**
 * Devis pour une famille + dimensions.
 * → { status:'ok', priceHtEur, priceTtcEur, specs… } | { status:'sur_devis' }
 *
 * FORMULE (la seule à reproduire) :
 *   ht  = screen_per_m2_eur × m²
 *       + controller.price_eur
 *       + max(package.floor, package.per_m2 × m²)
 *       + freight.per_kg × (m² × weight_kg_per_m2)
 *   ttc = ht × (1 + vat_pct/100)
 */
export function computeQuote(familyId, widthM, heightM) {
  const fam = pricing.families.find((f) => f.id === familyId);
  if (!fam) return { status: 'error' };
  if (!fam.public_quote_enabled) return { status: 'sur_devis', label: fam.label, note: fam.note };

  const geo = computeGeometry({ widthM, heightM }, fam.specs);
  const ctrl = pickController(geo.totalPixels, fam.controllers);
  if (ctrl.price_eur == null || ctrl.over_capacity) {
    return { status: 'sur_devis', label: fam.label, reason: 'taille > contrôleur documenté' };
  }

  const pkg = Math.max(fam.package_eur.floor, fam.package_eur.per_m2 * geo.surfaceM2);
  const freight = fam.freight_eur.per_kg * (geo.surfaceM2 * fam.freight_eur.weight_kg_per_m2);
  const ht = Math.round(fam.screen_per_m2_eur * geo.surfaceM2 + ctrl.price_eur + pkg + freight);
  const ttc = Math.round(ht * (1 + pricing.vat_pct / 100));

  return {
    status: 'ok',
    label: fam.label,
    surfaceM2: geo.surfaceM2,
    panelCount: geo.panelCount,
    resolution: `${geo.resW}×${geo.resH}`,
    controller: ctrl.model,
    priceHtEur: ht,
    priceTtcEur: ttc,
    transitDays: fam.transit_days,
    warrantyYears: fam.livraison?.garantie_ans ?? null,
    confidence: fam.confidence,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const [f, w, h] of [['crystal_film', 4, 2.4], ['transparent_structure', 5, 1], ['semi_opaque', 2, 2]]) {
    console.log(`${f}  ${w}×${h} m →`, JSON.stringify(computeQuote(f, w, h)));
  }
}
