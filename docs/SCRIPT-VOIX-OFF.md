# Script de la voix off — « Votre agent IA immobilier » (60 s)

Ton : posé, chaleureux, assuré. Débit naturel (≈ 5 syllabes/s), pauses aux virgules et entre les scènes.
Les horaires ci‑dessous sont ceux **mesurés** sur la voix synthétique fournie (`public/audio/voice_dry.wav`) ;
ils servent aussi de repères si vous enregistrez la narration avec un comédien ou une comédienne.

| Scène | Fenêtre image | Début → fin de la voix | Texte dit |
|---|---|---|---|
| 1 · L'accroche | 0 – 7 s | 1,00 → 4,81 | « Dans l'immobilier, chaque demande compte. Mais toutes ne peuvent pas attendre. » |
| 2 · Le problème | 7 – 15 s | 7,30 → 13,55 | « Entre les appels, les messages et les demandes de visites, répondre à chaque prospect peut vite devenir un défi. » |
| 3 · La solution | 15 – 24 s | 15,20 → 23,43 | « Découvrez votre agent IA : il accompagne vos prospects, répond à leurs premières questions et recueille leurs besoins, même lorsque votre agence est fermée. » |
| 4 · Fonctionnalités (1 – Répondre) | 24 – 28 s | 24,30 → 27,83 | « Offrez une première réponse rapide à vos prospects, à tout moment. » |
| 4 (2 – Qualifier) | 28 – 32 s | 28,30 → 31,55 | « Identifiez les besoins de vos futurs acheteurs et locataires. » |
| 4 (3 – Organiser) | 32 – 35,8 s | 32,20 → 35,78 | « Facilitez vos rendez‑vous, selon les outils connectés à votre agent. » |
| 4 (4 – Gagner du temps) | 35,8 – 39 s | 36,00 → 38,66 | « Et gagnez du temps pour ce qui compte vraiment : vos clients. » |
| 5 · L'ancrage local | 39 – 47 s | 39,60 → 46,67 | « Une solution personnalisable pour répondre aux besoins des agences immobilières martiniquaises et aux réalités de leur marché. » |
| 6 · Le bénéfice | 47 – 54,4 s | 47,50 → 53,66 | « L'intelligence artificielle ne remplace pas votre expertise. Elle vous aide à mieux accompagner vos clients. » |
| 7 · Appel à l'action | 54,4 – 60 s | 55,10 → 58,38 | « Demandez dès maintenant votre démonstration personnalisée. » |

Prononciation : « IA » se dit *i‑a* (dans le fichier de synthèse on écrit « I.A. »).

## Ce qui a été ajusté par rapport au texte de départ (et pourquoi)

Le script d'origine contient ≈ 990 caractères, soit ≈ 54 s de parole continue avant toute pause : impossible à faire tenir
dans 60 s avec des respirations naturelles. Le sens, les précautions de vocabulaire (« selon les outils connectés »,
« selon configuration ») et l'ordre des idées sont conservés ; seuls des mots ont été resserrés :

| Scène | Texte d'origine | Texte de la vidéo |
|---|---|---|
| 3 | « Découvrez votre **nouvel** agent IA, **capable d'accompagner** vos prospects, **de répondre** à leurs premières questions et **de recueillir** leurs besoins, même lorsque votre agence est fermée. » | « Découvrez votre agent IA **: il accompagne** vos prospects, **répond** à leurs premières questions et **recueille** leurs besoins, même lorsque votre agence est fermée. » |
| 4 (1) | « Offrez une première réponse rapide à vos prospects, à tout moment. » | inchangé |
| 4 (2) | « … de vos futurs acheteurs et locataires. » | inchangé |
| 4 (3) | « Facilitez **l'organisation de** vos rendez‑vous, selon les outils connectés à votre agent. » | « Facilitez vos rendez‑vous, selon les outils connectés à votre agent. » |
| 4 (4) | « Et **consacrez davantage de temps à** ce qui compte vraiment : vos clients **et votre activité**. » | « Et **gagnez du temps pour** ce qui compte vraiment : vos clients. » |
| 7 | « **Découvrez votre futur agent IA.** Demandez dès maintenant votre démonstration personnalisée. » | « Demandez dès maintenant votre démonstration personnalisée. » (la phrase « Découvrez votre futur agent IA » reste à l'écran : « Et si vous découvriez ce que l'IA peut apporter à votre agence ? ») |

Les scènes 1, 2, 5 et 6 sont dites **mot pour mot** comme dans votre brief.

## Si vous préférez enregistrer la narration vous‑même

1. Enregistrez chaque ligne du tableau (mono, 48 kHz, WAV) en respectant les débuts indiqués (± 0,3 s).
2. Assemblez‑les dans **un seul fichier de 60 s** (silence entre les lignes) et enregistrez‑le sous `public/audio/voice_dry.wav`.
3. Lancez `python audio/mix.py` (voir README) : la musique, les effets et le « ducking » (la musique baisse sous la voix) se recalent automatiquement.
4. Si vos débits diffèrent, ajustez les horaires dans `data/timeline.source.json` (champ `at` de chaque ligne) puis relancez
   `python audio/build_voice.py` **uniquement pour régénérer les sous‑titres** (ou éditez `src/data/timeline.json`).

## Voix de synthèse utilisée

Kokoro‑82M (licence Apache 2.0), voix française `ff_siwis` (entraînée sur le corpus SIWIS, CC BY 4.0 — mention conseillée :
« Voix de synthèse : Kokoro / SIWIS »). Aucun droit de voix à acquitter, mais le rendu reste une voix de synthèse :
un enregistrement humain donnera un résultat plus chaleureux pour une diffusion payante.
