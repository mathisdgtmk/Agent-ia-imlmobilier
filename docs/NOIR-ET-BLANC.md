# Version « Noir & Blanc » — refonte complète, très animée, sans voix off

Nouvelle réalisation de la publicité (**64,8 s**, 16:9 et 9:16), pensée comme un clip : **noir et blanc strict**, typographie qui bouge à chaque
temps, transitions sur le rythme, un bruitage à chaque animation, **aucune voix off, aucun sous‑titre**. Le message tient dans les textes à l'écran.

Fichiers : `out/noir-et-blanc-16x9.mp4` (1920 × 1080) et `out/noir-et-blanc-9x16.mp4` (1080 × 1920), 30 i/s, H.264 + AAC, ≈ 21 Mo chacun. Aperçus : `docs/apercu-noir-*.png`.

## Principe de montage

* **Tempo 100 BPM** : 1 temps = 0,6 s, 1 mesure = 2,4 s, 27 mesures = 64,8 s pile. Chaque coupe, chaque impact, chaque apparition de texte tombe sur un temps.
* **Source unique** : `data/noir.json` liste les scènes et les repères sonores *en temps de musique*. L'image (`src/noir/`) et le son (`audio/noir_*.py`)
  lisent le même fichier : déplacer un repère le déplace à la fois dans l'image et dans le son.
* **Noir et blanc garanti** : toute la composition est passée en niveaux de gris (`filter: grayscale(1)`), rien ne peut « fuir » en couleur.
* Alternance fond noir / fond blanc d'une scène à l'autre (et d'une fonction à l'autre) pour que chaque coupe claque.

## Polices

* **Arial Black** → titres, mots‑chocs, chiffres, bouton. **MACHINE** → étiquettes, bandeaux, légendes, code temps. Interfaces simulées : Arial.
* Arial Black (Microsoft) et MACHINE (ITC) sont des polices **commerciales** : elles ne peuvent pas être embarquées dans ce dépôt ni dans une vidéo livrée sans licence.
  La vidéo utilise donc leurs **équivalents libres les plus proches** (licence SIL OFL, dans `public/fonts/`) : **Archivo Black** (≈ Arial Black), **Krona One** (≈ MACHINE, même esprit
  techno large et géométrique), **Arimo** (≈ Arial).
* Si vous possédez les vraies polices : déposez les fichiers dans `public/fonts/`, déclarez‑les dans `src/lib/fonts.ts` et mettez leur nom en tête des piles de `src/noir/type.ts`
  (un seul fichier à modifier, tout le film suit).

## Découpage (temps d'écran → mesures)

| Scène | Temps | Ce qui se passe |
|---|---|---|
| 1 · Accroche | 0 – 7,2 s | un trait traverse l'écran, la question se révèle lettre par lettre (les lettres arrivent de partout en 3D), une villa se dessine au trait derrière |
| 2 · Le constat (**ralenti : 12 s**) | 7,2 – 19,2 s | **chaque « chose » a 1,8 s et sa propre mise en scène** : **APPELS.** (fond blanc, combiné qui vibre au rythme de la sonnerie, ondes, les lettres tombent et rebondissent avec poussière) · **MESSAGES.** (fond noir, tunnel de bulles lancées vers la caméra, mot tapé touche par touche, pastille de notifications) · **VISITES.** (panneau d'aéroport à lamelles : les lettres défilent puis se figent, créneaux proposés) · **QUESTIONS.** (tunnel de mots en 3D qui freine, verrouillage, onde de choc) ; puis compteur qui s'emballe jusqu'à 12 avec pluie de notifications (*simulation illustrative*), « Répondre à chacun peut vite devenir un défi. », effondrement en un point et silence |
| 3 · La solution | 19,2 – 26,4 s | onde de choc, logo tracé, téléphone et conversation, cadran 24 h, « Votre agence, disponible 24 h/24. » |
| 4 · Les fonctions | 26,4 – 40,8 s | quatre plans de 3,6 s séparés par des volets : Répondre · Qualifier · Organiser (curseur qui clique) · Gagner du temps |
| 5 · Ancrage local | 40,8 – 48 s | la Martinique se dessine, quatre repères sonnent comme des sonars, bandeau défilant |
| 6 · Le bénéfice | 48 – 55,2 s | deux cercles (l'humain, l'IA) se rejoignent ; « L'intelligence artificielle au service de l'humain. » ; stroboscope final |
| 7 · Appel à l'action | 55,2 – 64,8 s | logo, « Et si vous découvriez ce que l'IA peut apporter à votre agence ? », bouton « DEMANDEZ VOTRE DÉMONSTRATION » cliqué par un curseur, coordonnées provisoires, cadre qui se referme |

Éléments éditoriaux constants (HUD) : nom de la solution, chapitre en cours, barre de progression, code temps, coordonnées de la Martinique (14°36′N 61°04′O).
Tous les titres sont animés **lettre par lettre en 3D** (chute avec rebond, vol 3D, zoom caméra, bascule, écrasement) ; les effets partagés (lettres, éclats, lignes de vitesse, panneau à lamelles, trame) sont dans `src/noir/fx.tsx`.

## Musique et bruitages (100 % originaux, synthétisés)

* `audio/noir_music.py` : électronique cinématographique rythmée en la mineur — nappes, basses, piano, arpèges en écho, kick « four‑on‑the‑floor »,
  claps, charleys, risers ; la dynamique suit le récit (accroche sobre → tension → éclosion → groove → respiration → émotion → drop final).
* `audio/noir_sfx.py` : ≈ 170 effets (29 types : swish de révélation de texte, impacts, claquements de coupe, pops de bulles, ticks, clics,
  sonars, cloche, bégaiement numérique, risers, **claquement de lamelles, frappe de clavier, roulement de panneau d'affichage**, etc.), tous posés par `data/noir.json`.
* `audio/noir_mix.py` : mixage (la musique se creuse sous les gros impacts), −14 LUFS, crête ≤ −1,5 dBFS → `public/audio/noir_soundtrack.wav`.

> Comme pour les versions précédentes, le son a été validé par des mesures (niveaux, équilibre graves/médiums/aigus, alignement des effets sur les images)
> mais **n'a pas pu être écouté** lors de la création automatique : écoutez‑le avant diffusion.

## Régénérer / modifier

```bash
cd audio && python noir_music.py && python noir_sfx.py && python noir_mix.py   # bande‑son
cd .. && bash scripts/render.sh noir                                          # rend les deux MP4 (≈ 7 min par format sur 4 cœurs)
npx remotion still src/index.ts Noir-16x9 img.png --frame=900                 # contrôle d'une image
```

* Textes : dans les fichiers `src/noir/N*.tsx` (balises `Headline` / `Caps`).
* Nom, slogan, bouton, coordonnées (provisoires) : `src/config/brand.ts`.
* Timing d'un événement : champ `b` (en temps de musique) dans `data/noir.json`, puis relancer `noir_sfx.py` et `noir_mix.py`.

## Contrôles effectués sur les fichiers finaux

| Contrôle | Résultat |
|---|---|
| Durée / format | 64,85 s, 1 944 images à 30 i/s ; 1920 × 1080 et 1080 × 1920, H.264 High, yuv420p, BT.709, AAC stéréo 48 kHz |
| Loudness | −14,0 LUFS intégré, crête −1,8 dBFS (mesuré sur la piste audio des MP4) |
| Calage image ↔ rythme | les coupes principales (sur les temps de musique) tombent à 0 – 33 ms du saut d'image correspondant (≤ 1 image), volets compris ; chaque nouvelle « chose » de l'intro (APPELS, MESSAGES, VISITES, QUESTIONS, compteur) a sa coupe sur un temps |
| Lisibilité | titres mesurés et réduits automatiquement pour rester dans la zone de sécurité ; images clés de chaque scène vérifiées dans les deux formats |

## Honnêteté

Pas de photos ni de prises de vue : tout est du motion design vectoriel (dessin au trait, interfaces simulées, carte tracée depuis les données publiques Natural Earth).
Les conversations, noms, créneaux et le compteur sont des **exemples illustratifs**, signalés à l'écran (« Simulation illustrative. Fonctionnalités selon configuration. »).
Aucun faux avis, aucune fausse statistique. Nom, logo, site web et téléphone sont **provisoires**.
