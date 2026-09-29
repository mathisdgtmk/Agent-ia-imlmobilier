/** « Le Lamentin » → « au Lamentin », « Les Trois-Îlets » → « aux Trois-Îlets », « Ducos » → « à Ducos ». */
export function withPreposition(place: string) {
  if (place.startsWith("Le ")) return `au ${place.slice(3)}`;
  if (place.startsWith("Les ")) return `aux ${place.slice(4)}`;
  return `à ${place}`;
}
