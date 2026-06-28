/**
 * Génère la projection PUBLIQUE des prix à partir des données sourcing internes.
 *   node scripts/build-public-pricing.mjs
 *
 * Entrée  : src/data/led-pricing.json   (USD, EXW, fournisseur, marge — INTERNE)
 * Sortie  : src/data/devis-public.json  (€ de vente only — sûr pour le bundle client)
 *
 * RÈGLE : la sortie ne doit contenir AUCUN USD, nom de fournisseur/transporteur,
 * coût EXW ni coefficient de marge. Coût + marge sont fondus dans des prix € de vente.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, './led-pricing.internal.json');
const OUT = join(__dirname, './devis-public.json');

const data = JSON.parse(readFileSync(SRC, 'utf8'));
const { fx, client, ddp } = data.config;
const fxm = fx.usd_to_eur;
const margin = client.margin_multiplier;
const vat = ddp.vat_pct;

// coût USD → prix de vente € (taux de change × marge), arrondi à l'euro
const toSaleEur = (usd) => (usd == null ? null : Math.round(usd * fxm * margin));

// Transporteur par défaut associé à un fournisseur (rendu anonyme dans la sortie)
const carrierFor = (family) =>
  data.logistics_options.find((c) => c.supplier === family.supplier) || data.logistics_options[0];

const families = data.families.map((f) => {
  // Famille définitive non chiffrable publiquement → fiche "sur devis", aucun prix.
  // Les warnings internes (consignes dev) ne sont PAS exposés : note publique à la place.
  if (!f.public_quote_enabled) {
    return {
      id: f.catalog_id,
      family: f.family,
      label: f.label,
      selected_for_catalog: f.selected_for_catalog === true,
      public_quote_enabled: false,
      status: f.status,
      note: 'Configuration sur mesure — prix établi sur devis personnalisé.',
    };
  }

  return {
    id: f.catalog_id,
    family: f.family,
    label: f.label,
    selected_for_catalog: f.selected_for_catalog === true,
    public_quote_enabled: true,
    status: f.status,
    specs: {
      pitch_mm: f.pitch_mm,
      panel_mm: { w: f.panel_mm.w, h: f.panel_mm.h },
      brightness_nits: f.brightness_nits,
      transparency_pct: f.transparency_pct,
      pixel_density_m2: f.pixel_density_m2,
      ip_rating: f.ip_rating,
      weight_kg_per_m2: f.weight_kg_per_m2,
    },
    // Prix de vente € (coût DDP livré + marge fondus) — écran + package + freight + contrôleur
    screen_per_m2_eur: toSaleEur(f.screen_usd_per_m2),
    package_eur: { floor: toSaleEur(f.package_usd.floor), per_m2: toSaleEur(f.package_usd.per_m2) },
    freight_eur: { per_kg: toSaleEur(f.freight_usd_per_kg), weight_kg_per_m2: f.weight_kg_per_m2 },
    // Échelle de contrôleurs : modèle + capacité (pas de coût brut, prix € de vente)
    controllers: data.controllers.map((c) => ({
      model: c.model,
      max_pixels: c.max_pixels,
      price_eur: toSaleEur(c.cost_usd),
    })),
    transit_days: f.livraison ? f.livraison.delai_livraison_jours : null,
    delivered_estimate: true,
    confidence: 'medium',
    // Données électriques (safe — aucune info sourcing/prix)
    ...(f.elec ? {
      elec: {
        tension_input_v: f.elec.tension_input_v,
        freq_hz: f.elec.freq_hz,
        max_w_m2: f.power_w_m2?.max ?? null,
        avg_w_m2: f.power_w_m2?.avg ?? null,
        alim_type: f.elec.alim_type,
        circuit_dedie: f.elec.circuit_dedie,
        regulation_fr: f.elec.regulation_fr,
      },
    } : {}),
    // Transparence livraison (safe — informations client)
    ...(f.livraison ? {
      livraison: {
        inclus: f.livraison.inclus,
        non_inclus: f.livraison.non_inclus,
        delai_livraison_jours: f.livraison.delai_livraison_jours,
        garantie_ans: f.livraison.garantie_ans,
      },
    } : {}),
  };
});

const out = {
  _meta: {
    generated: new Date().toISOString().slice(0, 10),
    note: 'Fichier généré par scripts/build-public-pricing.mjs. NE PAS éditer à la main.',
    source: 'projection publique de led-pricing.json (données internes)',
  },
  vat_pct: vat,
  families,
};

writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');

// Garde-fou anti-fuite : la sortie ne doit contenir aucun terme sensible
const raw = JSON.stringify(out).toLowerCase();
const leaks = ['usd', 'ledful', 'olivia', 'fullsea', 'reapled', 'taya', 'maersk', 'fly logistics', 'exw', 'margin', '985', '462'].filter(
  (term) => raw.includes(term)
);
if (leaks.length) {
  console.error(`❌ FUITE détectée dans devis-public.json : ${leaks.join(', ')}`);
  process.exit(1);
}
console.log(`✅ devis-public.json généré — ${families.length} familles, aucune donnée sensible exposée.`);
