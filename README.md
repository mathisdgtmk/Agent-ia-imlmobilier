# Publicité vidéo premium — « Votre agent IA immobilier » (Martinique)

Publicité de **60 secondes** présentant un agent IA aux agences immobilières de Martinique, en deux formats :

| Fichier | Format | Usage |
|---|---|---|
| `out/agent-ia-immobilier-16x9.mp4` | 16:9 — 1920 × 1080, 30 i/s | site web, YouTube, présentation commerciale, Facebook |
| `out/agent-ia-immobilier-9x16.mp4` | 9:16 — 1080 × 1920, 30 i/s | TikTok, Instagram Reels, stories |
| `out/agent-ia-immobilier-16x9-sans-voix.mp4` | 16:9, sans voix off ni sous‑titres | mêmes images, **musique et effets seulement** |
| `out/agent-ia-immobilier-9x16-sans-voix.mp4` | 9:16, sans voix off ni sous‑titres | idem, format vertical |

Voix off française, musique électronique cinématographique originale, effets sonores discrets, sous‑titres français synchronisés.
Le projet est **entièrement modifiable** : Remotion (React + TypeScript) pour l'image, Python pour le son, FFmpeg (intégré à Remotion) pour l'encodage.

Aperçus : `docs/apercu-16x9.png` et `docs/apercu-9x16.png` (une image toutes les 3–4 s).

## Ce que la vidéo est (et n'est pas) — en toute honnêteté

* **Motion design vectoriel original.** Aucun générateur vidéo ni banque d'images n'était accessible dans l'environnement de création :
  les « plans » (villa en Martinique, bureau d'agence, Fort‑de‑France, Trois‑Îlets, Lamentin, littoral, poignée de main…) sont des
  **illustrations animées** (parallaxe, lumière, particules, caméra), pas des prises de vue réelles. Les interfaces (chat, fiche prospect,
  calendrier, suivi des demandes) sont animées en HTML/CSS. La carte de la Martinique est tracée depuis les données publiques Natural Earth.
  → Pour passer à des images réelles, voir `docs/PERSONNALISATION.md` § 7 (`src/config/media.ts`).
* **Voix de synthèse masculine** (Kokoro : mélange de deux voix d'homme, grave et posée, débit fluide) : la plus naturelle qu'il était possible de produire sans service en ligne, mais une voix humaine restera plus chaleureuse. Remplacement simple, sans rien recaler (voir `docs/SCRIPT-VOIX-OFF.md`).
* **Musique et effets 100 % originaux** (synthétisés dans `audio/`) : aucun droit à acquitter.
* **Aucun faux avis, aucune fausse statistique.** Les conversations, prénoms, budgets et créneaux affichés sont des **exemples illustratifs**,
  signalés à l'écran (« Simulation illustrative. Fonctionnalités selon configuration. ») ; les fonctionnalités d'organisation sont annoncées
  « selon les outils connectés à votre agent ».
* **Éléments provisoires** à remplacer avant diffusion : nom de la marque, logo, site web et téléphone (`www.votre-site.fr`, `+596 6XX XX XX XX`) — voir `docs/PERSONNALISATION.md`.
* La voix off a été **légèrement resserrée** par rapport au brief (≈ 990 signes ne tiennent pas dans 60 s avec des pauses naturelles) : détail dans `docs/SCRIPT-VOIX-OFF.md`.

## Contrôles effectués sur les fichiers finaux

| Contrôle | Résultat |
|---|---|
| Durée | 60,05 s (60 s d'image + fin d'audio) — 1 800 images à 30 i/s |
| 16:9 | 1920 × 1080, H.264 High, yuv420p, BT.709, AAC stéréo 48 kHz — 31 Mo |
| 9:16 | 1080 × 1920, mêmes réglages — 31 Mo |
| Loudness | −16,3 LUFS intégré, crête −1,5 dBFS (niveau adapté aux réseaux sociaux), mesuré sur la piste audio des MP4 finaux |
| Voix ↔ musique | pendant la voix : voix ≈ −17,6 dB, musique ≈ −26,6 dB (écart ≈ 9 dB) : la musique ne couvre jamais la voix |
| Voix dit bien le script | transcription Whisper de chaque ligne : 4 lignes sur 10 reconnues mot pour mot ; les 6 autres avec de petits écarts de transcription (homophones ou mots voisins : « agence est » / « agent s'est », « dès » / « de », « gagnez » / « gagner », « ce qui » / « ceux qui », « futurs » / « futures », « visites » / « visite ») ; aucune phrase perdue ni déformée |
| Sous‑titres synchronisés | 10 changements de sous‑titre tombent sur les vraies pauses de la voix (à ±0,05 s) ; sur les 19 changements de sous‑titre à l'intérieur d'une phrase, le nombre de mots déjà prononcés (transcription Whisper) correspond à ±1 mot dans 17 cas, les 2 autres étant des artefacts de transcription sur audio coupé (contre‑vérifiés à la main) |
| Lisibilité | textes, interfaces et sous‑titres vérifiés sur des images clés de chaque scène, dans les deux formats (sous‑titres remontés en 9:16 pour rester au‑dessus de l'interface du bas de TikTok/Reels) ; tous les titres sont mesurés et réduits automatiquement pour rester dans la zone de sécurité — les planches `docs/apercu-*.png` permettent de revoir l'ensemble d'un coup d'œil |

> **À faire par vous** : écouter le rendu avant diffusion. La voix, la musique et les effets ont été validés par des mesures
> (transcription, spectrogrammes, niveaux) mais **n'ont pas pu être écoutés** lors de la création automatique.

## Démarrage rapide

```bash
bash scripts/setup.sh          # 1 fois : npm install + environnement Python + modèle de voix (≈ 350 Mo)
bash scripts/build-audio.sh    # voix + sous‑titres + musique + effets + mixage  (déjà fait : fichiers fournis)
npm run studio                 # prévisualisation interactive (Remotion Studio)
bash scripts/render.sh         # rend les deux MP4 dans out/   (≈ 10 à 15 min par format sur 4 cœurs)
```

Rendre un seul format : `bash scripts/render.sh 16x9` ou `bash scripts/render.sh 9x16`.
Versions **sans voix off ni sous‑titres** : `bash scripts/render.sh sans-voix` (ou `16x9-sans-voix` / `9x16-sans-voix`) ; la bande‑son correspondante (`public/audio/soundtrack_sans_voix.wav`, musique + effets, −16 LUFS) se régénère avec `python audio/mix.py --sans-voix` (depuis le dossier `audio/`).
Les textes à l'écran sont identiques dans toutes les versions ; seuls la voix, les sous‑titres et le mixage changent (la mention « Simulation illustrative… » reste affichée dans les scènes 3 et 4).
Une image fixe (contrôle rapide) : `npx remotion still src/index.ts Ad-16x9 img.png --frame=300`.

> Sur votre machine, Remotion télécharge lui‑même son navigateur. `remotion.config.ts` n'utilise le Chromium local de l'environnement de création que s'il existe.

## Organisation du projet

```
├── README.md
├── package.json · tsconfig.json · remotion.config.ts
├── data/
│   ├── timeline.source.json     scènes, lignes de voix (texte, début), sous‑titres      ← à éditer
│   └── cues.json                repères d'événements + effets sonores associés          ← à éditer
├── src/                         PROJET VIDÉO (Remotion)
│   ├── Root.tsx                 déclare les compositions : Ad-16x9, Ad-9x16 et leurs variantes *-sans-voix
│   ├── Ad.tsx                   montage : 7 scènes + transitions + sous‑titres + son (option `voix` : false = sans voix ni sous‑titres)
│   ├── config/brand.ts          nom, logo, coordonnées, CTA (provisoires)               ← à éditer
│   ├── config/media.ts          remplacer une illustration par une photo/vidéo réelle
│   ├── data/timeline.json       généré (voix + sous‑titres + repères) — ne pas éditer à la main
│   ├── scenes/                  Scene1Hook … Scene7Cta (séquences animées)
│   ├── illustrations/           paysage, villa, bureau, personnages, agence, carte…
│   ├── ui/                      interfaces : chat, smartphone, ordinateur, calendrier, notifications
│   └── components/              sous‑titres, titres animés, logo, transitions, grain de pellicule
├── audio/                       PROJET SON (Python)
│   ├── build_voice.py           voix off (Kokoro, mélange de voix masculines) + minutage des sous‑titres
│   ├── build_music.py           musique originale 96 BPM, la mineur
│   ├── build_sfx.py             effets sonores calés sur data/cues.json
│   ├── mix.py                   mixage, ducking, normalisation −16 LUFS (option --sans-voix)
│   └── qa_asr.py                contrôle : la voix dit‑elle bien le script ? (Whisper)
├── public/                      polices (OFL), textures, audio final (soundtrack.wav)
├── docs/                        SCRIPT-VOIX-OFF.md · PERSONNALISATION.md
└── out/                         MP4 finaux
```

## Structure de la vidéo (60 s)

| Scène | Temps | Contenu |
|---|---|---|
| 1 · Accroche | 0 – 7 s | villa au crépuscule sur la mer des Caraïbes, caméra qui avance ; « Et si votre agence immobilière ne manquait plus aucune opportunité ? » |
| 2 · Problème | 7 – 15 s | agent en rendez‑vous, notifications qui s'empilent (appel, message, visite, question) ; ralenti puis noir |
| 3 · Solution | 15 – 24 s | lumière dorée, « VOTRE AGENT IA IMMOBILIER », conversation sur ordinateur et smartphone, fiche prospect ; « Votre agence, disponible 24 h/24 » |
| 4 · Fonctionnalités | 24 – 39 s | Répondre · Qualifier · Organiser · Gagner du temps |
| 5 · Ancrage local | 39 – 47 s | Fort‑de‑France, Trois‑Îlets, Lamentin, littoral, villas, carte de l'île, façade d'agence |
| 6 · Bénéfice | 47 – 54,4 s | accueil d'un couple, poignée de main, suivi des demandes ; « L'intelligence artificielle au service de l'humain » |
| 7 · Appel à l'action | 54,4 – 60 s | ligne dorée, logo, « Et si vous découvriez… ? », bouton « DEMANDEZ VOTRE DÉMONSTRATION » |

Les bornes de scènes sont dans `data/timeline.source.json` ; elles ont été ajustées de ±1 s par rapport au brief là où la narration l'exigeait (scène 4 : 24 – 39 s au lieu de 24 – 38 s).

## Crédits et licences

* Code : ce dépôt. Remotion (licence Remotion — gratuite pour les particuliers et les petites équipes ; voir remotion.pro/license pour un usage en entreprise).
* Polices : Playfair Display (titres), Cinzel (marque et libellés), Montserrat (sous‑titres), Inter (interfaces) — SIL Open Font License (fichiers et licences dans `public/fonts/`).
* Voix de synthèse : Kokoro‑82M (Apache 2.0), mélange des voix `pm_alex` et `im_nicola`.
* Contour de la Martinique : Natural Earth via `world-atlas` (domaine public).
* Musique, effets, illustrations, interfaces : créations originales générées pour ce projet.
