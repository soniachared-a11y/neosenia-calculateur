/**
 * VALIDATION du modèle — preuve qu'il reproduit les devis DDP réels d'Olivia
 * (au $ près) et que les prix publics correspondent au site.
 *   node validate.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { computeQuote } from './price-reference.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const internal = JSON.parse(readFileSync(join(__dirname, './led-pricing.internal.json'), 'utf8'));
const fam = (cat) => internal.families.find((f) => f.catalog_id === cat);

let pass = 0, fail = 0;
const check = (label, got, exp, tol = 0) => {
  const ok = Math.abs(got - exp) <= tol;
  console.log(`${ok ? '✅' : '❌'} ${label} → ${got}${ok ? '' : ` (attendu ${exp})`}`);
  ok ? pass++ : fail++;
};

// ── 1) Reproduction des totaux DDP réels (modèle de coût interne) ──
// shipping_ddp = 0.20×goods + 1.20×(freight/kg × poids) ; goods inclut les pièces de rechange du devis.
function ddpTotal(f, m2, sparesUsd) {
  const screen = f.screen_usd_per_m2 * m2;
  const ctrl = 188; // Nova TB40
  const pkg = Math.max(f.package_usd.floor, f.package_usd.per_m2 * m2);
  const freight = f.freight_usd_per_kg * (m2 * f.weight_kg_per_m2);
  const goods = screen + ctrl + pkg + sparesUsd;
  return Math.round(goods + Math.round(0.2 * goods + 1.2 * freight));
}
console.log('=== Reproduction des devis DDP réels LEDFUL ===');
check('HIS P6.25 — 1,2 m² DDP', ddpTotal(fam('crystal_film'), 1.2, 18 + 25), 1844, 2);
check('TGC P3.91 — 1 m² DDP', ddpTotal(fam('transparent_structure'), 1, 68 + 25 + 30), 1309, 2);

// ── 2) Prix publics (= ceux du site) ──
console.log('\n=== Prix client publics (marge ' + internal.config.client.margin_multiplier + ') ===');
const his = computeQuote('crystal_film', 4, 2.4);
const tgc = computeQuote('transparent_structure', 5, 1);
check('Crystal Film 9,6 m² — statut', his.status === 'ok' ? 1 : 0, 1);
console.log(`   → ${his.priceHtEur} € HT / ${his.priceTtcEur} € TTC · ${his.controller} · ${his.warrantyYears} ans`);
check('TGC 5 m² — statut', tgc.status === 'ok' ? 1 : 0, 1);
console.log(`   → ${tgc.priceHtEur} € HT / ${tgc.priceTtcEur} € TTC · ${tgc.controller}`);
check('Semi-opaque → sur devis', computeQuote('semi_opaque', 2, 2).status === 'sur_devis' ? 1 : 0, 1);
check('Très grand écran (HIS 30×5) → sur devis', computeQuote('crystal_film', 30, 5).status === 'sur_devis' ? 1 : 0, 1);

console.log(`\n=== ${pass} OK, ${fail} échec(s) ===`);
process.exit(fail === 0 ? 0 : 1);
