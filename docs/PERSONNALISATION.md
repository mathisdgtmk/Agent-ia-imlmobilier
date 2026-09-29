# Personnaliser la vidéo (logo, nom, coordonnées, voix, musique)

Tout ce qui est « provisoire » est regroupé dans **`src/config/brand.ts`**. Modifiez ce fichier, puis relancez le rendu
(`npm run render`) — ou visualisez en direct avec `npm run studio`.

## 1. Nom de la solution, bouton, signature, coordonnées

```ts
// src/config/brand.ts
productName: ['VOTRE AGENT IA', 'IMMOBILIER'],   // scène 3 (titre) et scène 7 (logo) — 2 lignes
agencyName: 'VOTRE AGENCE',                       // enseigne de l'agence, scène 5
tagline: 'Agent IA immobilier | Martinique',      // sous le bouton, scène 7
ctaLabel: 'DEMANDEZ VOTRE DÉMONSTRATION',         // texte du bouton
ctaPrompt: "Et si vous découvriez ce que l’IA peut apporter à votre agence ?",              
contact: { show: true, website: 'www.votre-site.fr', phone: '+596 6XX XX XX XX' },  // show:false pour masquer
disclaimer: 'Simulation illustrative. Fonctionnalités selon configuration.',
```

> Les coordonnées fournies (`www.votre-site.fr`, `+596 6XX XX XX XX`) sont **volontairement factices** : remplacez‑les avant toute diffusion.

## 2. Logo

* **Logo provisoire** : un monogramme « toit + étincelle IA » dessiné en SVG (`src/components/Logo.tsx`, fonction `LogoMark`) et un nom en deux lignes.
* **Votre logo** : déposez un PNG ou SVG à fond transparent dans `public/brand/` (ex. `public/brand/logo.png`) puis mettez
  `logoImage: 'brand/logo.png'` dans `brand.ts`. Il remplace le monogramme (scènes 3, 5 et 7) ; le nom en lettres reste modifiable via `productName`.
* Pour un logo qui contient déjà le nom, mettez `productName: ['', '']` et ajustez la taille dans `Logo.tsx` (`markSize`).

## 3. Couleurs et polices

* Couleurs : `src/theme.ts` (`C` et `goldGradient`). Noir profond `#04060B`, blanc `#F8F5EE`, doré champagne `#DCC182`, bleu nuit `#0B1733`.
* Polices (licence SIL OFL, incluses dans `public/fonts/`) : *Cormorant Garamond* (titres), *Montserrat* (marque), *Inter* (interfaces, sous‑titres).
  Pour en changer : ajoutez les `.woff2` dans `public/fonts/` et déclarez‑les dans `src/lib/fonts.ts` et `src/theme.ts`.

## 4. Textes à l'écran et sous‑titres

* Textes de chaque scène : dans le fichier de la scène (`src/scenes/SceneXxx.tsx`), balise `HeroText` (`lines=[[{t:'…', gold:true}]]`).
* Sous‑titres : générés depuis `data/timeline.source.json` (champ `captions` de chaque ligne de voix) — voir `docs/SCRIPT-VOIX-OFF.md`.
  Après modification : `python audio/build_voice.py` (régénère aussi la voix), puis re‑rendez.

## 5. Voix off

Deux options :

1. **Synthèse (par défaut)** — `python audio/build_voice.py` (modèle Kokoro, voix `ff_siwis`). Vitesse : `data/timeline.source.json` → `voice.speed`.
2. **Enregistrement humain** — voir la fin de `docs/SCRIPT-VOIX-OFF.md` : remplacez `public/audio/voice_dry.wav` (60 s, mono, 48 kHz) puis `python audio/mix.py`.

## 6. Musique et effets sonores

* Musique originale synthétisée : `python audio/build_music.py` (tempo, accords et sections dans le fichier — commentés).
  Pour utiliser un morceau sous licence commerciale : remplacez `audio/stems/music.flac` (48 kHz stéréo, 60 s) puis `python audio/mix.py`.
* Effets : `python audio/build_sfx.py` (calés sur `data/cues.json` ; chaque repère nomme un effet et un instant).
* Mixage : `python audio/mix.py` (voix traitée + musique avec « ducking » + effets → `public/audio/soundtrack.wav`, −16 LUFS).

## 7. Passer des illustrations à de vraies images

Sans accès à une banque d'images ni à un générateur vidéo, la vidéo est réalisée en **motion design vectoriel original**
(paysages, villa, bureau, personnages, interfaces). Pour la remplacer par de vraies prises de vue :

1. Placez des photos/vidéos libres de droits commerciaux dans `public/media/` (ex. `public/media/villa-aerienne.mp4`).
2. Renseignez‑les dans `src/config/media.ts` (voir les commentaires) : elles remplacent l'illustration de fond de la scène
   correspondante ; les textes, interfaces et sous‑titres restent au‑dessus.

Sources de médias gratuits pour usage commercial : Pexels, Pixabay, Unsplash (vérifiez la licence de chaque fichier).
