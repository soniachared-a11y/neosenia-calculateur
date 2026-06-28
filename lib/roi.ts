/**
 * Simulateur ROI — trafic vitrine → valeur média publicitaire estimée.
 *
 * Modèle volontairement simple et transparent (chaque hypothèse est éditable et
 * affichée). Sert d'aide à la décision, PAS d'engagement : tout est « estimation ».
 * Aucune donnée sourcing n'intervient ici.
 */
export interface RoiInputs {
  /** Passages piétons / véhicules devant la vitrine, par jour. */
  passagesParJour: number;
  /** Part des passants qui regardent réellement l'écran (mémorisation). */
  tauxRegard: number; // 0..1
  /** Valeur média pour 1000 contacts visuels (équivalent CPM affichage). */
  cpmEur: number;
  /** Prix HT de l'écran (issu du devis) pour le calcul d'amortissement. */
  prixHtEur: number;
}

export interface RoiResult {
  contactsParMois: number;
  valeurMediaMensuelleEur: number;
  valeurMediaAnnuelleEur: number;
  moisAmortissement: number | null;
}

/** Valeurs par défaut prudentes (affichées comme hypothèses modifiables). */
export const ROI_DEFAULTS = {
  passagesParJour: 1500,
  tauxRegard: 0.35,
  cpmEur: 8,
};

export function computeRoi({ passagesParJour, tauxRegard, cpmEur, prixHtEur }: RoiInputs): RoiResult {
  const contactsParJour = passagesParJour * tauxRegard;
  const contactsParMois = Math.round(contactsParJour * 30);
  const valeurMediaMensuelleEur = Math.round((contactsParMois / 1000) * cpmEur);
  const valeurMediaAnnuelleEur = valeurMediaMensuelleEur * 12;
  const moisAmortissement =
    valeurMediaMensuelleEur > 0 ? Math.ceil(prixHtEur / valeurMediaMensuelleEur) : null;

  return { contactsParMois, valeurMediaMensuelleEur, valeurMediaAnnuelleEur, moisAmortissement };
}
