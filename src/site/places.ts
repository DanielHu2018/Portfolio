// Places on the globe in Off the clock (engine/globe.ts draws them, components/Places.tsx lists them).
// lat: degrees north (negative = south), lon: degrees east (negative = west).
export type Place = { name: string; lat: number; lon: number };

// Gold star.
export const home: Place = { name: 'Columbus, OH', lat: 39.96, lon: -83.0 };

// Pink dots. So far just the concert cities; add the rest of the places Daniel has been.
export const visited: Place[] = [
  { name: 'Cleveland, OH', lat: 41.5, lon: -81.69 },
  { name: 'Cincinnati, OH', lat: 39.1, lon: -84.51 }
];

// Green dots. From the skiing blurb: France or Japan (Hokkaido specifically).
export const wantToVisit: Place[] = [
  { name: 'Hokkaido, Japan', lat: 43.06, lon: 141.35 },
  { name: 'French Alps', lat: 45.92, lon: 6.87 }
];

export const PLACE_COLORS = { home: '#FFB020', visited: '#FF6FB5', want: '#4CD07D' };
