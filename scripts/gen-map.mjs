// Génère src/data/martinique.ts : contour de la Martinique (Natural Earth 10m, domaine public) + positions des lieux.
// Usage : node scripts/gen-map.mjs
import {createRequire} from 'node:module';
import fs from 'node:fs';
import {geoMercator, geoPath} from 'd3-geo';

const require = createRequire(import.meta.url);
const topo = require('world-atlas/countries-10m.json');
const tc = require('topojson-client');
const fc = tc.feature(topo, topo.objects.countries);

const inBox = (c) => c[0] > -61.5 && c[0] < -60.6 && c[1] > 14.3 && c[1] < 15.0;
let polygon = null;
for (const f of fc.features) {
  const g = f.geometry;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  for (const p of polys) if (inBox(p[0][0])) polygon = {type: 'Feature', geometry: {type: 'Polygon', coordinates: p}};
}
if (!polygon) throw new Error('Martinique introuvable');

const W = 420;
const H = 600;
const proj = geoMercator().fitExtent([[16, 16], [W - 16, H - 16]], polygon);
const path = geoPath(proj)(polygon);

// lon, lat
const places = {
  fortDeFrance: {name: 'Fort-de-France', ll: [-61.0588, 14.6161]},
  troisIlets: {name: 'Les Trois-Îlets', ll: [-61.0333, 14.5333]},
  lamentin: {name: 'Le Lamentin', ll: [-60.9967, 14.61]},
  littoral: {name: 'Le littoral', ll: [-60.9, 14.49]},
  villas: {name: 'Villas', ll: [-60.93, 14.7]},
};
const out = {};
for (const [k, v] of Object.entries(places)) {
  const [x, y] = proj(v.ll);
  out[k] = {name: v.name, x: +x.toFixed(1), y: +y.toFixed(1)};
}

const ts = `// Fichier généré par scripts/gen-map.mjs — ne pas modifier à la main.
export const MAP_W = ${W};
export const MAP_H = ${H};
export const MARTINIQUE_PATH = ${JSON.stringify(path)};
export const PLACES = ${JSON.stringify(out, null, 2)} as const;
`;
fs.writeFileSync(new URL('../src/data/martinique.ts', import.meta.url), ts);
console.log('OK', path.length, 'caractères', out);
