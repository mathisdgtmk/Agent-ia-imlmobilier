/**
 * ─────────────────────────────────────────────────────────────
 *  VISUELS DU SITE
 *  Photos provisoires issues d'Unsplash (licence Unsplash : usage
 *  commercial autorisé, attribution non obligatoire).
 *  → Remplacez-les idéalement par vos propres photos de Martinique
 *    (ou des photos sous licence) : déposez-les dans /public/images
 *    et indiquez par exemple src: "/images/villa-hero.jpg".
 *  Si une image ne se charge pas, un fond dégradé prend le relais.
 * ─────────────────────────────────────────────────────────────
 */

const unsplash = (id: string, width = 2400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export type SiteImage = { src: string; alt: string };

export const images = {
  hero: {
    src: unsplash("photo-1613490493576-7fde63acd811"),
    alt: "Villa contemporaine avec piscine à la tombée du jour",
  },

  martinique: [
    {
      src: unsplash("photo-1520242279429-1f64b18816ef", 1800),
      alt: "Cocotier penché au-dessus d’une plage de sable clair",
    },
    {
      src: unsplash("photo-1634822776751-30aaac98bdd2", 1600),
      alt: "Baie entourée de collines verdoyantes",
    },
    {
      src: unsplash("photo-1586094332115-680788e0182f", 1400),
      alt: "Palmiers au pied d’un relief montagneux",
    },
    {
      src: unsplash("photo-1579365868106-764da8179a71", 1400),
      alt: "Îlet au milieu de la mer des Caraïbes",
    },
    {
      src: unsplash("photo-1632656837847-9ce6c4849bc0", 1600),
      alt: "Ville en bord de mer vue depuis les hauteurs",
    },
  ] satisfies SiteImage[],

  audiences: {
    independent: {
      src: unsplash("photo-1600596542815-ffad4c1539a9", 1200),
      alt: "Maison contemporaine aux larges baies vitrées",
    },
    network: {
      src: unsplash("photo-1600585154340-be6161a56a0c", 1200),
      alt: "Façade moderne d’une maison individuelle",
    },
    rental: {
      src: unsplash("photo-1540541338287-41700207dee6", 1200),
      alt: "Piscine bordée de palmiers dans une résidence",
    },
    prestige: {
      src: unsplash("photo-1512917774080-9991f1c4c750", 1200),
      alt: "Villa de prestige avec piscine",
    },
  },
} as const;
