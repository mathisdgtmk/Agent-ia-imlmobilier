# Agent IA Immobilier — site vitrine

Site premium présentant un agent IA destiné aux agences immobilières de Martinique.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lucide.

---

## Lancer le site en local

Prérequis : **Node.js 20.9 ou plus récent** (`node -v` pour vérifier).

```bash
npm install
cp .env.example .env.local   # facultatif : le site fonctionne sans
npm run dev
```

Ouvrez http://localhost:3000.

Autres commandes :

| Commande            | Rôle                                           |
| ------------------- | ---------------------------------------------- |
| `npm run build`     | Build de production (à lancer avant la mise en ligne) |
| `npm start`         | Sert le build de production                    |
| `npm run lint`      | Vérification ESLint                            |
| `npm run typecheck` | Vérification TypeScript                        |

---

## Où modifier quoi

| Je veux changer…                                    | Fichier                              |
| --------------------------------------------------- | ------------------------------------ |
| Nom, coordonnées, mentions légales, secteurs, menu  | `src/config/site.ts`                 |
| Photos                                              | `src/config/images.ts`               |
| Textes des sections, avantages, FAQ, profils        | `src/content/home.ts`                |
| Conversation animée (section « Découvrez… »)        | `src/content/showcase.ts`            |
| Réponses de la démonstration interactive            | `src/lib/ai/scripted-provider.ts`    |
| Consignes de l'IA (si une API est connectée)        | `src/config/agent.ts`                |
| Couleurs, polices, animations                       | `src/app/globals.css` (bloc `@theme`) |
| Titre et description Google, Open Graph            | `src/app/layout.tsx`                 |

Les valeurs entre **[crochets]** sont à compléter (coordonnées, SIRET, hébergeur…).
Une fois vos coordonnées réelles saisies, passez `contact.isConfigured` à `true` dans `src/config/site.ts`.

### Photos

Les photos provisoires viennent d'Unsplash (licence Unsplash : usage commercial autorisé).
Pour un rendu vraiment local, remplacez-les par **vos propres photos de Martinique** ou des photos sous licence :

1. Déposez les fichiers dans `public/images/` (ex. `public/images/villa-hero.jpg`, 2400 px de large idéalement).
2. Dans `src/config/images.ts`, remplacez `src` par `"/images/villa-hero.jpg"` et adaptez le texte `alt`.

Si une image ne se charge pas, un fond dégradé s'affiche à sa place : le site reste présentable.

---

## Fonctionnement

### Démonstration interactive (`/api/chat`)

- Par défaut : **scénario prédéfini**, sans aucune IA. Il reconnaît les recherches d'achat ou de location,
  les demandes de visite, les propriétaires vendeurs, les questions sur les secteurs, et remplit une
  « fiche prospect » au fil de l'échange. Il comprend les 34 communes de Martinique, les budgets
  (« 320k », « 800 € par mois »…) et les délais (« début 2027 », « d'ici 6 mois »…).
- Le navigateur n'appelle **jamais** d'API d'IA directement : il appelle `/api/chat`, qui choisit
  le fournisseur **côté serveur**. Aucune clé n'est exposée.
- Pour relier une vraie IA : renseignez `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL` (voir `.env.example`),
  puis relancez le build. En cas d'erreur de l'API, le site bascule automatiquement sur le scénario.
- Protections : validation des messages, taille maximale, 40 messages / 10 min par IP, refus des
  appels provenant d'un autre domaine.

### Formulaire de contact (`/api/contact`)

- Validation des champs dans le navigateur **et** sur le serveur (même schéma).
- Anti-spam : champ piège invisible, délai minimal de remplissage, 5 envois / heure par IP.
- Envoi : par e-mail via **Resend** ou vers un **webhook** (Make, Zapier, n8n, CRM).
- **Sans configuration**, le formulaire affiche clairement un mode démonstration et
  n'annonce jamais un envoi qui n'a pas eu lieu.

> Le limiteur de débit est en mémoire. Sur Vercel (serverless), chaque instance a sa propre mémoire :
> pour une limite stricte, branchez un stockage partagé (Upstash Redis) dans `src/lib/rate-limit.ts`.

### SEO et accessibilité

- Métadonnées, Open Graph (image générée automatiquement), `sitemap.xml`, `robots.txt`,
  données structurées (organisation, service, FAQ).
- HTML sémantique, navigation au clavier, lien d'évitement, contrastes vérifiés,
  respect de « réduire les animations ».
- Polices auto-hébergées (aucun appel à Google Fonts).

---

## Mettre en ligne (Vercel, recommandé)

1. Créez un dépôt GitHub et poussez le projet :
   ```bash
   git add -A && git commit -m "Site Agent IA Immobilier"
   git remote add origin https://github.com/<vous>/agent-ia-immobilier.git
   git push -u origin main
   ```
2. Sur https://vercel.com → **Add New… → Project** → importez le dépôt (Next.js est détecté).
3. Dans **Settings → Environment Variables**, ajoutez au minimum `NEXT_PUBLIC_SITE_URL`,
   puis `RESEND_API_KEY` + `CONTACT_TO_EMAIL` + `CONTACT_FROM_EMAIL` (ou `CONTACT_WEBHOOK_URL`).
4. **Deploy**. Relancez un déploiement après chaque changement de variable.
5. **Domains** : ajoutez votre nom de domaine et suivez les instructions DNS.
6. Déclarez le site dans Google Search Console et soumettez `https://votre-domaine/sitemap.xml`.

Autre hébergeur Node : `npm run build` puis `npm start` (port 3000 par défaut).

---

## Avant la mise en ligne

- [ ] Coordonnées et informations légales dans `src/config/site.ts`
- [ ] Mentions légales et politique de confidentialité relues et validées
- [ ] Envoi du formulaire configuré et testé (une vraie demande reçue)
- [ ] Photos définitives (idéalement de Martinique)
- [ ] `NEXT_PUBLIC_SITE_URL` renseignée

Aucun témoignage, chiffre, partenaire ni logo client n'a été inventé : ajoutez-en uniquement
lorsque vous disposez d'éléments réels et de l'accord des personnes concernées.
