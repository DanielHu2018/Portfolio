// Places on the globe in Off the clock (engine/globe.ts draws them; clicking a dot shows its name).
// lat: degrees north (negative = south), lon: degrees east (negative = west).
// The tour points at 'Columbus, OH', 'Cleveland, OH' and 'Hokkaido, Japan' by name (engine/tour.ts).
export type Place = { name: string; lat: number; lon: number };

// Gold star.
export const home: Place = { name: 'Columbus, OH', lat: 39.96, lon: -83.0 };

// Pink dots.
export const visited: Place[] = [
  // United States
  { name: 'San Francisco, CA', lat: 37.77, lon: -122.42 },
  { name: 'Berkeley, CA', lat: 37.87, lon: -122.27 },
  { name: 'Stanford, CA', lat: 37.43, lon: -122.17 },
  { name: 'Yosemite', lat: 37.87, lon: -119.54 },
  { name: 'Los Angeles, CA', lat: 34.05, lon: -118.24 },
  { name: 'Pasadena, CA', lat: 34.15, lon: -118.14 },
  { name: 'Irvine, CA', lat: 33.68, lon: -117.83 },
  { name: 'San Diego, CA', lat: 32.72, lon: -117.16 },
  { name: 'Las Vegas, NV', lat: 36.17, lon: -115.14 },
  { name: 'Grand Canyon', lat: 36.11, lon: -112.11 },
  { name: 'Dallas, TX', lat: 32.78, lon: -96.8 },
  { name: 'New Orleans, LA', lat: 29.95, lon: -90.07 },
  { name: 'Memphis, TN', lat: 35.15, lon: -90.05 },
  { name: 'Nashville, TN', lat: 36.16, lon: -86.78 },
  { name: 'Great Smoky Mountains', lat: 35.61, lon: -83.49 },
  { name: 'Atlanta, GA', lat: 33.75, lon: -84.39 },
  { name: 'Orlando, FL', lat: 28.54, lon: -81.38 },
  { name: 'Durham, NC', lat: 35.99, lon: -78.9 },
  { name: 'Chicago, IL', lat: 41.88, lon: -87.63 },
  { name: 'Ann Arbor, MI', lat: 42.28, lon: -83.74 },
  { name: 'Cleveland, OH', lat: 41.5, lon: -81.69 },
  { name: 'Cincinnati, OH', lat: 39.1, lon: -84.51 },
  { name: 'Pittsburgh, PA', lat: 40.44, lon: -80.0 },
  { name: 'Washington, DC', lat: 38.91, lon: -77.04 },
  { name: 'Philadelphia, PA', lat: 39.95, lon: -75.17 },
  { name: 'New York City', lat: 40.71, lon: -74.01 },
  { name: 'Cornell (Ithaca, NY)', lat: 42.45, lon: -76.48 },
  { name: 'Yale (New Haven, CT)', lat: 41.31, lon: -72.92 },
  { name: 'Boston, MA', lat: 42.36, lon: -71.06 },
  { name: 'Niagara Falls', lat: 43.08, lon: -79.07 },
  // Canada
  { name: 'Toronto, Canada', lat: 43.65, lon: -79.38 },
  { name: 'Banff, Canada', lat: 51.18, lon: -115.57 },
  // Europe
  { name: 'Berlin, Germany', lat: 52.52, lon: 13.4 },
  { name: 'Milan, Italy', lat: 45.46, lon: 9.19 },
  { name: 'Venice, Italy', lat: 45.44, lon: 12.32 },
  { name: 'Rome, Italy', lat: 41.9, lon: 12.5 },
  { name: 'Colosseum, Rome', lat: 41.89, lon: 12.49 },
  // China
  { name: 'Beijing, China', lat: 39.9, lon: 116.4 },
  { name: 'Great Wall of China', lat: 40.43, lon: 116.57 },
  { name: 'Shanghai, China', lat: 31.23, lon: 121.47 },
  { name: 'Fuzhou, China', lat: 26.07, lon: 119.3 },
  { name: 'Hong Kong', lat: 22.32, lon: 114.17 },
  { name: 'Chengdu, China', lat: 30.57, lon: 104.07 },
  { name: 'Sichuan, China', lat: 30.6, lon: 102.5 }
];

// Green dots.
export const wantToVisit: Place[] = [
  // North America
  { name: 'Seattle, WA', lat: 47.61, lon: -122.33 },
  { name: 'Aspen, CO', lat: 39.19, lon: -106.82 },
  { name: 'Denver, CO', lat: 39.74, lon: -104.99 },
  { name: 'Miami, FL', lat: 25.76, lon: -80.19 },
  { name: 'Hawaii (Honolulu)', lat: 21.31, lon: -157.86 },
  { name: 'Maui, HI', lat: 20.8, lon: -156.33 },
  { name: 'Kauai, HI', lat: 22.07, lon: -159.5 },
  { name: 'Mexico City, Mexico', lat: 19.43, lon: -99.13 },
  // South America
  { name: 'Lima, Peru', lat: -12.05, lon: -77.04 },
  { name: 'Machu Picchu, Peru', lat: -13.16, lon: -72.55 },
  { name: 'Rio de Janeiro, Brazil', lat: -22.91, lon: -43.17 },
  { name: 'Christ the Redeemer, Rio', lat: -22.95, lon: -43.21 },
  // Europe
  { name: 'Reykjavík, Iceland', lat: 64.15, lon: -21.94 },
  { name: 'Aurora Borealis (Tromsø, Norway)', lat: 69.65, lon: 18.96 },
  { name: 'Dublin, Ireland', lat: 53.35, lon: -6.26 },
  { name: 'London, UK', lat: 51.51, lon: -0.13 },
  { name: 'Paris, France', lat: 48.86, lon: 2.35 },
  { name: 'Eiffel Tower, Paris', lat: 48.86, lon: 2.29 },
  { name: 'Amsterdam, Netherlands', lat: 52.37, lon: 4.9 },
  { name: 'Copenhagen, Denmark', lat: 55.68, lon: 12.57 },
  { name: 'Stockholm, Sweden', lat: 59.33, lon: 18.07 },
  { name: 'Prague, Czechia', lat: 50.08, lon: 14.44 },
  { name: 'Vienna, Austria', lat: 48.21, lon: 16.37 },
  { name: 'Lisbon, Portugal', lat: 38.72, lon: -9.14 },
  { name: 'Madrid, Spain', lat: 40.42, lon: -3.7 },
  { name: 'Barcelona, Spain', lat: 41.39, lon: 2.17 },
  { name: 'Athens, Greece', lat: 37.98, lon: 23.73 },
  { name: 'Istanbul, Türkiye', lat: 41.01, lon: 28.98 },
  // Africa and the Middle East
  { name: 'Pyramids of Giza, Egypt', lat: 29.98, lon: 31.13 },
  // Asia
  { name: 'Taj Mahal, India', lat: 27.18, lon: 78.04 },
  { name: 'Chongqing, China', lat: 29.56, lon: 106.55 },
  { name: 'Zhangjiajie, China', lat: 29.12, lon: 110.48 },
  { name: 'Guangzhou, China', lat: 23.13, lon: 113.26 },
  { name: 'Shenzhen, China', lat: 22.54, lon: 114.06 },
  { name: 'Taipei, Taiwan', lat: 25.03, lon: 121.57 },
  { name: 'Hanoi, Vietnam', lat: 21.03, lon: 105.85 },
  { name: 'Bangkok, Thailand', lat: 13.76, lon: 100.5 },
  { name: 'Singapore', lat: 1.35, lon: 103.82 },
  { name: 'Seoul, South Korea', lat: 37.57, lon: 126.98 },
  { name: 'Incheon, South Korea', lat: 37.46, lon: 126.71 },
  { name: 'Busan, South Korea', lat: 35.18, lon: 129.08 },
  { name: 'Hiroshima, Japan', lat: 34.39, lon: 132.46 },
  { name: 'Osaka, Japan', lat: 34.69, lon: 135.5 },
  { name: 'Kyoto, Japan', lat: 35.01, lon: 135.77 },
  { name: 'Mount Fuji, Japan', lat: 35.36, lon: 138.73 },
  { name: 'Tokyo, Japan', lat: 35.68, lon: 139.69 },
  { name: 'Hokkaido, Japan', lat: 43.06, lon: 141.35 },
  // Oceania
  { name: 'Great Barrier Reef, Australia', lat: -18.29, lon: 147.7 },
  { name: 'Sydney, Australia', lat: -33.87, lon: 151.21 }
];

export const PLACE_COLORS = { home: '#FFB020', visited: '#FF6FB5', want: '#4CD07D' };
