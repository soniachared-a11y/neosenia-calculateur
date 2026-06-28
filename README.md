# Handoff — App calculateur+devis externe NEOSENIA

> **Pour la nouvelle conversation (à froid, dans le dossier de l'app externe).**
> Objectif : l'app externe doit produire **exactement les mêmes prix et produits
> que le calculateur du site neosenia-site**. Ce kit contient les données et la
> logique de référence, déjà validées (reproduit les devis réels LEDFUL au $ près).

---

## 0. Mission

L'app externe a aujourd'hui **les mauvais produits / le mauvais calcul**. Il faut :
1. Reprendre **les 2 produits définitifs** (§2) + la famille « sur devis » (§2).
2. Implémenter **la formule de prix de référence** (§3) — identique au site.
3. Vérifier avec `node validate.mjs` (doit afficher **6 OK**).

Ne pas réinventer : répliquer `price-reference.mjs`. C'est du JS pur, sans dépendance,
adaptable à n'importe quel stack.

---

## 1. Données confirmées (LEDFUL / Olivia, DDP)

- **DDP** livré Paris 75008 — **TVA 20% INCLUSE**, douane + fret inclus.
- Transporteur **Fullsea**, **train ~35 jours**. Fabrication **15-20 jours ouvrés**.
  → délai total porte-à-porte ≈ **50-65 jours** (c'est ce que stocke `delai_livraison_jours` ;
  le « 35 j » d'Olivia = leg transport seul, hors fabrication).
- **Garantie 5 ans** · **MOQ 1 m²** · devis fournisseur valable **3 semaines**.

---

## 2. Les 3 familles (2 chiffrables, 1 sur devis)

| catalog_id | Produit | Série LEDFUL | Public |
|---|---|---|---|
| `crystal_film` | Écran holographique transparent (Crystal Film) | HIS P6.25 | ✅ chiffrable |
| `transparent_structure` | LED transparent sur structure métallique démontable | TGC P3.91 | ✅ chiffrable |
| `semi_opaque` | Autocollant semi-opaque | — | ❌ sur devis (pas de grille) |

Gate : un produit est chiffrable **ssi `public_quote_enabled === true`**. Ne JAMAIS
chiffrer `semi_opaque` ni fusionner les familles.

---

## 3. Formule de prix (LA SEULE à reproduire)

À partir de `devis-public.json` (coefficients de vente €, coût+marge déjà fondus) :

```
geo:  surfaceM2 = w × h
      resW = round(w_mm / pitch) ; resH = round(h_mm / pitch)
      panneaux = ceil(w_mm / panel.w) × ceil(h_mm / panel.h)
contrôleur: le 1er dont max_pixels ≥ resW×resH ; si dépassé → SUR DEVIS

ht  = screen_per_m2_eur × surfaceM2
    + controller.price_eur
    + max(package.floor, package.per_m2 × surfaceM2)
    + freight.per_kg × (surfaceM2 × weight_kg_per_m2)
ttc = ht × (1 + vat_pct/100)
```

Implémentation exacte : **`price-reference.mjs > computeQuote(familyId, w, h)`**.

---

## 4. Constantes (dans `led-pricing.internal.json > config`)

| | Valeur | Sens |
|---|---|---|
| `fx.usd_to_eur` | `0.92` | taux USD→EUR |
| `client.margin_multiplier` | **`1.6`** | coût livré ex-TVA → prix de vente (validé Sonia) |
| `vat_pct` (via `ddp.vat_pct`) | `20` | TVA France (sortie client) |

Modèle coût (interne, USD) : `écran×m² + contrôleur + package + freight(/kg)`, puis
`× fx × marge` = HT, `× 1.20` = TTC. NEOSENIA récupère la TVA import (à valider comptable).

---

## 5. Séparation INTERNE / PUBLIC (règle absolue)

- **`led-pricing.internal.json`** = USD, fournisseur (LEDFUL/Olivia), transporteur (Fullsea),
  marge. **Serveur/build uniquement. JAMAIS dans le bundle client.**
- **`build-public-pricing.mjs`** projette → **`devis-public.json`** = prix de vente € only
  (garde-fou anti-fuite intégré : échoue si un terme sensible apparaît).
- Le front ne consomme QUE `devis-public.json`.

---

## 6. Sortie devis (ce que voit le client)

Specs utiles + **prix livré € (HT/TTC)** + délai + garantie + warnings + CTA étude.
Jamais : USD, fournisseur, transporteur (le nom Fullsea reste interne), marge.
Si `public_quote_enabled = false` ou taille > contrôleur → **« Sur devis »**, aucun prix.

Wording validé : « Prix livré estimé », « Estimation à confirmer », devis ferme sous 48 h.

---

## 7. Cas de validation (`node validate.mjs` → 6 OK)

| Cas | Attendu |
|---|---|
| HIS P6.25 — 1,2 m² (devis DDP réel) | **1 844 $** |
| TGC P3.91 — 1 m² (devis DDP réel) | **1 309 $** (±1, arrondi fret) |
| Crystal Film 9,6 m² (prix site) | **15 215 € HT** / 18 258 TTC |
| TGC 5 m² (prix site) | **5 717 € HT** / 6 860 TTC |
| Semi-opaque, et écran > contrôleur | **sur devis** |

---

## 8. Fichiers du kit

| Fichier | Rôle |
|---|---|
| `led-pricing.internal.json` | données sourcing INTERNES (2 produits, modèle DDP) |
| `build-public-pricing.mjs` | projette interne → public (`node build-public-pricing.mjs`) |
| `devis-public.json` | sortie publique (prix de vente € only) — ce que consomme le front |
| `price-reference.mjs` | **formule de prix de référence à répliquer** |
| `validate.mjs` | preuve : reproduit LEDFUL + prix site (`node validate.mjs`) |
| `README.md` | ce document |

---

## 9. Interdictions

1. Exposer côté public : USD, coût, fournisseur (LEDFUL/Olivia), transporteur (Fullsea), marge.
2. Fusionner les familles (même « transparentes », grilles/contrôleurs/affichage distincts).
3. Chiffrer `semi_opaque` ou un écran > contrôleur documenté → « sur devis ».
4. Inventer un prix quand la donnée manque.

---

## 10. Soft spots (assumés « estimation »)

- **Fret** calibré sur 1 devis DDP réel par produit → exact aux tailles documentées, estimé
  ailleurs ; le **prix ferme = re-devis Olivia** (validité 3 semaines).
- **> ~10 m²** (au-delà du Nova TB40) → sur devis (grille contrôleur par taille en attente d'Olivia).
- **TGC transparence 50% (PDF) vs 70% (e-mail)** → affiché 50% (conservateur), à confirmer.
- **TVA en revente** : modèle = coût ex-TVA × marge +20% client — à valider par le comptable.

---

## 11. État actuel de l'app à corriger

App en ligne : **https://neosenia-calculateur.pplx.app/**

> ⚠️ **L'app actuelle est basée sur un AUTRE fournisseur.** TOUTES ses données sont
> fausses : produits, prix, **DDP**, garantie. **Ne reprendre AUCUN chiffre de l'app
> existante.** La seule source de vérité = ce kit (fournisseur LEDFUL). On peut garder
> son ergonomie / son look, jamais ses données.

**À REMPLACER (faux aujourd'hui) :**
- 4 familles erronées (« Autocollant transparent », « Autocollant semi-opaque »,
  « Mural intérieur », « Mural extérieur étanche ») → remplacer par les **2 produits
  chiffrables** (`crystal_film`, `transparent_structure`) + `semi_opaque` sur devis (§2).
  Supprimer « Mural intérieur/extérieur » (pas de famille LEDFUL).
- Garantie **« 1 an » → 5 ans**.
- « Structure alu de pose incluse » → **pose/structure = sur devis selon site** (cf. `livraison.non_inclus`).
- Modèle de prix maison → **formule §3** (DDP, marge 1.6).
- Délai : afficher fabrication 15-20 j ouvrés + train ~35 j (total ~50-65 j), cf. §1.

**À GARDER :** le simulateur ROI (trafic → revenus pub), la mention DDP Chine→France,
le prix/m² non affiché brut.

---

*Snapshot extrait de neosenia-site (repo source) le 2026-06-28. En cas de doute, le
calculateur du site fait foi. Garder l'app externe sur un repo privé.*
