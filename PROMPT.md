# Prompt à coller dans la nouvelle conversation

> Ouvre une nouvelle conversation Claude Code **dans ce dossier**, puis colle ceci :

---

Tu travailles dans ce dossier pour (re)construire l'app **calculateur + devis NEOSENIA**.

1. **Lis `README.md`** — c'est la spec complète : données réelles du fournisseur LEDFUL,
   2 produits chiffrables + 1 sur devis, la formule de prix exacte, les règles.

2. ⚠️ L'app actuelle en ligne **https://neosenia-calculateur.pplx.app/** est basée sur
   un **AUTRE fournisseur** : ses produits, prix, DDP et garantie sont **tous faux**.
   **Ne reprends AUCUN de ses chiffres** — au mieux son ergonomie/look. La seule source
   de vérité = ce kit.

3. **Implémente** :
   - Produits : `crystal_film` (Crystal Film / HIS P6.25) et `transparent_structure`
     (TGC P3.91) chiffrables ; `semi_opaque` en « sur devis ». Supprime les familles
     « Mural intérieur / extérieur » (n'existent pas).
   - Prix : la formule de `price-reference.mjs` + les données de `devis-public.json`.
   - Garantie **5 ans**, DDP TVA 20% incl., délai fabrication 15-20 j ouvrés + train ~35 j.
   - Garde un simulateur ROI (trafic → revenus pub) si tu veux, mais corrige le prix.

4. **Vérifie** : `node validate.mjs` doit afficher **6 OK**. Les prix doivent matcher le
   site : Crystal Film 9,6 m² = **15 215 € HT**, TGC 5 m² = **5 717 € HT**.

5. **Règles non négociables (§9 du README)** : jamais d'USD, de fournisseur, de
   transporteur ni de marge côté public. Ne jamais inventer un prix : si la donnée
   manque ou si l'écran dépasse le contrôleur → « sur devis ».

Quand le calcul est bon et validé, on s'occupera de l'UI/design.

---
