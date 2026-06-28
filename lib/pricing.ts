/**
 * Moteur de prix client — port TypeScript FIDÈLE de `price-reference.mjs`.
 * Source de vérité du calcul : `price-reference.mjs` + `validate.mjs` (6 OK) à la racine.
 *
 * ⚠️ Ce module ne consomme QUE `devis-public.json` (coefficients de vente €).
 * AUCUNE donnée sourcing (USD, fournisseur, transporteur, marge) n'est importée ici.
 * Ne JAMAIS importer `led-pricing.internal.json` dans le bundle client.
 */
import pricingData from '@/devis-public.json';

// ── Types publics (reflètent devis-public.json) ──────────────────────────────
export interface PanelMm {
  w: number;
  h: number;
}

export interface FamilySpecs {
  pitch_mm: number;
  panel_mm: PanelMm;
  brightness_nits: number;
  transparency_pct: number;
  pixel_density_m2: number;
  ip_rating: string;
  weight_kg_per_m2: number;
}

export interface Controller {
  model: string;
  max_pixels: number;
  price_eur: number | null;
}

export interface Livraison {
  inclus: string[];
  non_inclus: string[];
  delai_livraison_jours: [number, number];
  garantie_ans: number;
}

export interface Elec {
  tension_input_v: number;
  freq_hz: number;
  max_w_m2: number;
  avg_w_m2: number;
  alim_type: string;
  circuit_dedie: string;
  regulation_fr: string;
}

export interface Family {
  id: string;
  family: string;
  label: string;
  selected_for_catalog: boolean;
  public_quote_enabled: boolean;
  status: string;
  note?: string;
  specs?: FamilySpecs;
  screen_per_m2_eur?: number;
  package_eur?: { floor: number; per_m2: number };
  freight_eur?: { per_kg: number; weight_kg_per_m2: number };
  controllers?: Controller[];
  transit_days?: [number, number];
  delivered_estimate?: boolean;
  confidence?: string;
  elec?: Elec;
  livraison?: Livraison;
}

interface PricingFile {
  vat_pct: number;
  families: Family[];
}

const pricing = pricingData as unknown as PricingFile;

export const VAT_PCT = pricing.vat_pct;

/** Liste des familles du catalogue (ordre stable : chiffrables puis sur devis). */
export function getFamilies(): Family[] {
  return [...pricing.families].sort(
    (a, b) => Number(b.public_quote_enabled) - Number(a.public_quote_enabled),
  );
}

export function getFamily(id: string): Family | undefined {
  return pricing.families.find((f) => f.id === id);
}

// ── Géométrie ────────────────────────────────────────────────────────────────
export interface Geometry {
  surfaceM2: number;
  resW: number;
  resH: number;
  totalPixels: number;
  panelCount: number;
}

/** Surface, panneaux, résolution (résolution = dimensions / pitch). */
export function computeGeometry(
  { widthM, heightM }: { widthM: number; heightM: number },
  specs: FamilySpecs,
): Geometry {
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
export function pickController(
  totalPixels: number,
  controllers: Controller[],
): Controller & { over_capacity: boolean } {
  const sorted = [...controllers].sort((a, b) => a.max_pixels - b.max_pixels);
  const c = sorted.find((x) => x.max_pixels >= totalPixels) || sorted[sorted.length - 1];
  return { ...c, over_capacity: c.max_pixels < totalPixels };
}

// ── Devis ────────────────────────────────────────────────────────────────────
export type Quote =
  | { status: 'error' }
  | { status: 'sur_devis'; label: string; note?: string; reason?: string }
  | {
      status: 'ok';
      label: string;
      surfaceM2: number;
      panelCount: number;
      resolution: string;
      controller: string;
      priceHtEur: number;
      priceTtcEur: number;
      transitDays: [number, number] | null;
      warrantyYears: number | null;
      confidence: string | null;
    };

/**
 * Devis pour une famille + dimensions (en mètres).
 *
 * FORMULE (identique à price-reference.mjs, la seule à reproduire) :
 *   ht  = screen_per_m2_eur × m²
 *       + controller.price_eur
 *       + max(package.floor, package.per_m2 × m²)
 *       + freight.per_kg × (m² × weight_kg_per_m2)
 *   ttc = ht × (1 + vat_pct/100)
 */
export function computeQuote(familyId: string, widthM: number, heightM: number): Quote {
  const fam = getFamily(familyId);
  if (!fam) return { status: 'error' };
  if (!fam.public_quote_enabled) {
    return { status: 'sur_devis', label: fam.label, note: fam.note };
  }
  // Garde-fous : ces champs existent forcément quand public_quote_enabled = true.
  if (!fam.specs || !fam.package_eur || !fam.freight_eur || !fam.controllers || fam.screen_per_m2_eur == null) {
    return { status: 'sur_devis', label: fam.label, reason: 'données de prix incomplètes' };
  }

  const geo = computeGeometry({ widthM, heightM }, fam.specs);
  const ctrl = pickController(geo.totalPixels, fam.controllers);
  if (ctrl.price_eur == null || ctrl.over_capacity) {
    return { status: 'sur_devis', label: fam.label, reason: 'taille > contrôleur documenté' };
  }

  const pkg = Math.max(fam.package_eur.floor, fam.package_eur.per_m2 * geo.surfaceM2);
  const freight = fam.freight_eur.per_kg * (geo.surfaceM2 * fam.freight_eur.weight_kg_per_m2);
  const ht = Math.round(fam.screen_per_m2_eur * geo.surfaceM2 + ctrl.price_eur + pkg + freight);
  const ttc = Math.round(ht * (1 + VAT_PCT / 100));

  return {
    status: 'ok',
    label: fam.label,
    surfaceM2: geo.surfaceM2,
    panelCount: geo.panelCount,
    resolution: `${geo.resW}×${geo.resH}`,
    controller: ctrl.model,
    priceHtEur: ht,
    priceTtcEur: ttc,
    transitDays: fam.transit_days ?? null,
    warrantyYears: fam.livraison?.garantie_ans ?? null,
    confidence: fam.confidence ?? null,
  };
}

// ── Helpers d'affichage ──────────────────────────────────────────────────────
export const eur = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export const num = (n: number) => new Intl.NumberFormat('fr-FR').format(n);
