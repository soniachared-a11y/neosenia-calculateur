# Design premium — App calculateur NEOSENIA

> Objectif : l'app doit ressembler **exactement** au site neosenia-site. Même
> identité, esthétique premium et sobre. Jamais gaming/flashy. Niveau Awwwards.

## Essence
Premium, épuré, sombre, confiance. Beaucoup de respiration (whitespace). Le prix et
le CTA sont les héros. Tout le reste est calme et secondaire.

## Couleurs (tokens exacts du site)
| Rôle | Hex |
|---|---|
| Fond principal | `#0A0A0F` |
| Fond alt (cartes) | `#111118` |
| Fond clair (sections) | `#F5F5F0` |
| Texte | `#FFFFFF` / `#0A0A0F` |
| Secondaire | `#8A8A95` |
| **Accent cyan** (prix, CTA, focus) | `#00D4FF` |
| **Accent or** (badges premium) | `#D4A853` |

## Typographie
- **H1** : Clash Display — uppercase, tracking large, display.
- **H2 / H3** : Satoshi (geometric sans).
- **Corps** : Inter.
- **Mono / chiffres techniques** : JetBrains Mono.
- (Fontshare héberge Clash Display + Satoshi gratuitement.)

## Composants clés
- **CTA principal** (`Recevoir mon étude personnalisée`) : pill (border-radius 100px),
  glow cyan au hover, flèche dans un cercle cyan. Jamais un bouton plat banal.
- **CTA secondaire** : ghost pill, bordure subtile.
- **Carte prix** : fond `#111118`, prix en **cyan**, gros (Clash Display), HT au-dessus,
  TTC en secondaire en dessous. Badges « Estimation à confirmer » (or) + délai (subtil).
- **Specs** : lignes label / valeur, label secondaire (#8A8A95), valeur blanche. Sobre.
- **État « Sur devis »** : pas de prix, message clair + CTA. Jamais un faux chiffre.

## Wording (ne pas changer — validé)
« Prix livré estimé », « Estimation à confirmer », « Devis ferme sous 48 h »,
« Recevoir mon étude personnalisée ». Garantie 5 ans, livraison estimée, TVA incl.

## Règles d'animation (INTERDICTIONS)
- Easing : **power2 / power3 / expo uniquement**. Jamais bounce/elastic.
- Durées < 1,5 s. Parallaxe < 50px. Jamais de rotation 360, jamais de texte qui pulse/clignote.
- Reveals au scroll sobres (fade + translate léger). 60 fps minimum.
- Respecter `prefers-reduced-motion`.

## Qualité non négociable
- Responsive parfait (mobile portrait → grand écran). **Mobile-first** : le commerçant
  configure souvent au téléphone.
- Lighthouse > 90 mobile + desktop. LCP < 2,5 s. Fonts preload, `font-display: swap`.
- Accessibilité : contrastes AA, focus visibles, labels de formulaire.
- Garder le SEO/SSR déjà en place (H1 statique, JSON-LD, robots/sitemap).

## Priorité d'écran (mobile)
1. Titre + sous-titre courts.
2. Le configurateur (type, dimensions) — simple, gros champs.
3. **Le prix livré** (héros cyan) + badges.
4. Specs essentielles (surface, définition, garantie, délai) — le jargon technique
   (résolution px, modèle contrôleur) en second plan / repliable.
5. Ce qui est inclus / non-inclus.
6. CTA étude.
7. (Plus bas) le simulateur ROI.
