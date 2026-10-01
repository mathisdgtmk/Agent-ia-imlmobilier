# Version « Noir & Blanc » — refonte complète, très animée, sans voix off

Nouvelle réalisation de la publicité (60 s, 16:9 et 9:16), pensée comme un clip : **noir et blanc strict**, typographie qui bouge à chaque
temps, transitions sur le rythme, un bruitage à chaque animation, **aucune voix off, aucun sous‑titre**. Le message tient dans les textes à l'écran.

Fichiers : `out/noir-et-blanc-16x9.mp4` (1920 × 1080) et `out/noir-et-blanc-9x16.mp4` (1080 × 1920), 30 i/s, H.264 + AAC, ≈ 14 Mo chacun. Aperçus : `docs/apercu-noir-*.png`.

## Principe de montage

* **Tempo 100 BPM** : 1 temps = 0,6 s, 1 mesure = 2,4 s, 25 mesures = 60 s pile. Chaque coupe, chaque impact, chaque apparition de texte tombe sur un temps.
* **Source unique** : `data/noir.json` liste les scènes et les repères sonores *en temps de musique*. L'image (`src/noir/`) et le son (`audio/noir_*.py`)
  lisent le même fichier : déplacer un repère le déplace à la fois dans l'image et dans le son.
* **Noir et blanc garanti** : toute la composition est passée en niveaux de gris (`filter: grayscale(1)`), rien ne peut « fuir » en couleur.
* Alternance fond noir / fond blanc d'une scène à l'autre (et d'une fonction à l'autre) pour que chaque coupe claque.

## Découpage (temps d'écran → mesures)

| Scène | Temps | Ce qui se passe |
|---|---|---|
| 1 · Accroche | 0 – 7,2 s | un trait traverse l'écran, impact, la question se révèle ligne par ligne ; une villa se dessine au trait derrière ; flashs blancs |
| 2 · Le constat | 7,2 – 14,4 s | « APPELS. MESSAGES. VISITES. QUESTIONS. » claquent à chaque temps (fond blanc/noir en alternance) avec une notification ; compteur qui s'emballe jusqu'à 12 (*simulation illustrative*) ; tout s'effondre en un point, silence |
| 3 · La solution | 14,4 – 21,6 s | onde de choc, logo tracé, téléphone et conversation (bulles, « en train d'écrire »), cadran 24 h qui tourne, « Votre agence, disponible 24 h/24. » |
| 4 · Les fonctions | 21,6 – 36 s | quatre plans de 3,6 s séparés par des volets : Répondre (conversation) · Qualifier (profil qui se coche) · Organiser (calendrier, curseur qui clique) · Gagner du temps (suivi des demandes) |
| 5 · Ancrage local | 36 – 43,2 s | la Martinique se dessine, quatre repères sonnent comme des sonars (Fort‑de‑France, Trois‑Îlets, Lamentin, littoral), bandeau défilant |
| 6 · Le bénéfice | 43,2 – 50,4 s | deux cercles (l'humain, l'IA) se rejoignent ; « L'intelligence artificielle au service de l'humain. » ; stroboscope final |
| 7 · Appel à l'action | 50,4 – 60 s | logo, « Et si vous découvriez ce que l'IA peut apporter à votre agence ? », bouton « DEMANDEZ VOTRE DÉMONSTRATION » cliqué par un curseur, coordonnées provisoires, cadre qui se referme |

Éléments éditoriaux constants (HUD) : nom de la solution, chapitre en cours, barre de progression, code temps, coordonnées de la Martinique (14°36′N 61°04′O).

## Musique et bruitages (100 % originaux, synthétisés)

* `audio/noir_music.py` : électronique cinématographique rythmée en la mineur — nappes, basses, piano, arpèges en écho, kick « four‑on‑the‑floor »,
  claps, charleys, risers ; la dynamique suit le récit (accroche sobre → tension → éclosion → groove → respiration → émotion → drop final).
* `audio/noir_sfx.py` : ≈ 120 effets (27 types : swish de révélation de texte, impacts, claquements de coupe, pops de bulles, ticks, clics,
  sonars, cloche, bégaiement numérique, risers, etc.), tous posés par `data/noir.json`.
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
| Durée / format | 60,05 s, 1 800 images à 30 i/s ; 1920 × 1080 et 1080 × 1920, H.264 High, yuv420p, BT.709, AAC stéréo 48 kHz |
| Loudness | −14,0 LUFS intégré, crête −1,9 dBFS (mesuré sur la piste audio des MP4) |
| Calage image ↔ rythme | les 14 coupes principales (sur les temps de musique) tombent à 0 – 33 ms du saut d'image correspondant (≤ 1 image), volets compris |
| Lisibilité | titres mesurés et réduits automatiquement pour rester dans la zone de sécurité ; images clés de chaque scène vérifiées dans les deux formats |

## Honnêteté

Pas de photos ni de prises de vue : tout est du motion design vectoriel (dessin au trait, interfaces simulées, carte tracée depuis les données publiques Natural Earth).
Les conversations, noms, créneaux et le compteur sont des **exemples illustratifs**, signalés à l'écran (« Simulation illustrative. Fonctionnalités selon configuration. »).
Aucun faux avis, aucune fausse statistique. Nom, logo, site web et téléphone sont **provisoires**.
