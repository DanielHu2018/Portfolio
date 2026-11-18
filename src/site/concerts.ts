// Concerts, oldest first. The Cover Flow and the focus view's arrows step through them in this order.
// A concert with a photo has `src`; one without shows a ticket stub (components/ConcertTicket.tsx) built
// from `venue`, `tour` and `lineup` (other acts on the bill) instead.
export type Concert = {
  artist: string;
  date: string;
  city: string;
  src?: string;
  venue?: string;
  lineup?: string[];
  tour?: string;
};

export const CONCERTS: Concert[] = [
  { artist: "Moon Man's Landing", date: 'September 17, 2022', city: 'Cleveland', venue: 'West Bank of the Flats', lineup: ['Pusha T', 'Don Toliver', 'Dominic Fike', 'Haim', '070 Shake', 'Playboi Carti'] },
  { artist: 'Kid Cudi', date: 'September 17, 2022', city: 'Cleveland', src: '/assets/web/Kid_Cudi_09172022_Cleveland.jpg' },
  { artist: 'Destroy Lonely', date: 'February 11, 2023', city: 'Columbus', venue: 'The King of Clubs' },
  { artist: 'Travis Scott', date: 'January 24, 2024', city: 'Columbus', venue: 'Schottenstein Center', tour: 'Utopia: Circus Maximus Tour' },
  { artist: 'Ken Carson', date: 'August 8, 2024', city: 'Columbus', venue: 'KEMBA Live!', lineup: ['2hollis'] },
  { artist: 'JPEGMAFIA', date: 'September 20, 2024', city: 'Columbus', src: '/assets/web/jpegmafia_9202024_Columbus.jpg' },
  { artist: 'Baby Keem', date: 'June 10, 2026', city: 'Columbus', src: '/assets/web/Baby_Keem_06102026_Columbus.jpg' },
  { artist: 'The Strokes', date: 'July 14, 2026', city: 'Cincinnati', src: '/assets/web/The_Strokes_07142026_Cincinnati.jpg' },
  { artist: 'Slayr', date: 'September 5, 2026', city: 'Columbus', src: '/assets/web/slayr_09052026_Columbus.jpg' },
  { artist: 'Jane Remover', date: 'September 18, 2026', city: 'Columbus', src: '/assets/web/Jane_Remover_09182026_Columbus.jpg' },
  { artist: 'Ninajirachi', date: 'September 22, 2026', city: 'Columbus', src: '/assets/web/Ninajirachi_099222026_Columbus.jpg' },
  { artist: 'Glaive', date: 'October 4, 2026', city: 'Columbus', src: '/assets/web/Glaive_10042026_Columbus.jpg' },
  { artist: 'Tiffany Day', date: 'October 4, 2026', city: 'Columbus', src: '/assets/web/Tiffany_Day_10042026_Columbus.jpg' },
  { artist: 'Wynton Marsalis', date: 'October 6, 2026', city: 'Columbus', src: '/assets/web/Wynton_Marsalis_10062026_Columbus.jpg' },
  { artist: 'Frost Children', date: 'November 13, 2026', city: 'Cleveland', src: '/assets/web/Frost_Children_11132026_Cleveland.jpg' }
];
