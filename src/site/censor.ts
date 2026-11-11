// Masks slurs and strong profanity in song, album and artist names shown on the site (Spotify data,
// the now-playing badge and the favorite albums). Keeps the first letter of the matched root and
// stars the rest, so "Fuck" -> "F***" and "dothatshit!" -> "dothats***!".
// Roots are matched inside words too ("dothatshit!", "FAKENGGAS"), except where that would catch innocent
// words: "Shitake", "Scunthorpe", "Snigger", "niggle".
const ROOTS = /fuck|shit(?!a?ke)|bitch|\bcunt|\bnigg(?!l)|ngga/gi;

export function censor(text: string): string {
  return String(text || '').replace(ROOTS, (m) => m[0] + '*'.repeat(m.length - 1));
}
