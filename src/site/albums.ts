// Daniel's favorite albums for the Spotify iPod, in display order (rank 1-5 are the top five).
// Songs are separated by | and marked ★ (favorite) or ☆ (second favorite).
// Covers are 300px JPEGs in public/assets/albums/<slug>.jpg.
const ALBUMS: [number, string, string, string, string][] = [
  [1, 'miseducation', 'The Miseducation of Lauryn Hill', 'Ms. Lauryn Hill', `Tell Him | Can't Take My Eyes Off of You ★ | Forgive Them Father | I Used to Love Him | Superstar | To Zion ☆ | Ex-Factor`],
  [2, 'is-this-it', 'Is This It', 'The Strokes', `Is This It ☆ | Barely Legal | Someday | Last Nite | Hard to Explain ★ | Take It or Leave It`],
  [3, 'i-love-my-computer', 'I Love My Computer', 'Ninajirachi', `iPod Touch ★ | Fuck My Computer | CSIRAC | Delete ☆ | All I Am | Infohazard | It's You`],
  [4, 'fete-de-la-vanille', 'Fête de la Vanille', 'Lucy Bedroque', `I Am, She Is, We Are | How to Pretend ☆ | Mimosa | Knot Me ★ | Pretty Peach`],
  [5, 'gkmc', 'good kid, m.A.A.d city', 'Kendrick Lamar', `Bitch, Don't Kill My Vibe | Backseat Freestyle | Money Trees ★ | good kid | m.A.A.d city ☆ | Swimming Pools (Drank) | Sing About Me, I'm Dying of Thirst`],
  [0, 'everybody-else', "Everybody Else Is Doing It, So Why Can't We?", 'The Cranberries', `Dreams | Sunday ★ | Linger ☆`],
  [0, 'live-love-asap', 'LIVE.LOVE.A$AP', 'A$AP Rocky', `Palace | Peso ★ | Wassup | Purple Swag | Houston Old Head | Demons | Sandman ☆`],
  [0, 'blonde', 'Blonde', 'Frank Ocean', `Nikes | Ivy | Pink + White | Solo | Self Control ★ | Nights | White Ferrari | Godspeed ☆`],
  [0, 'room-on-fire', 'Room on Fire', 'The Strokes', `What Ever Happened? ☆ | Reptilia ★ | 12:51 | I Can't Win`],
  [0, 'u', 'U', 'underscores', `Tell Me | Music | The Peace ★ | Innuendo (I Get U) | Lovefield | Do It | Bodyfeeling | Wish U Well ☆`],
  [0, 'heaven-or-las-vegas', 'Heaven or Las Vegas', 'Cocteau Twins', `Cherry-coloured Funk ☆ | Heaven or Las Vegas ★ | Frou-frou Foxes in Midsummer Fires`],
  [0, 'channel-orange', 'channel ORANGE', 'Frank Ocean', `Thinkin Bout You | Sweet Life | Super Rich Kids | Pyramids ☆ | Lost | Bad Religion ★ | Pink Matter | Forrest Gump`],
  [0, 'playboi-carti', 'Playboi Carti', 'Playboi Carti', `Location ☆ | Magnolia | wokeuplikethis* ★ | New Choppa | Flex | Had 2 | Kelly K`],
  [0, 'brand-new-eyes', 'Brand New Eyes', 'Paramore', `Ignorance | The Only Exception ★ | All I Wanted ☆`],
  [0, 'submarine', 'Submarine', 'The Marías', `Echo | Run Your Mouth | Real Life | Paranoia ☆ | Lejos de Ti | Love You Anyway | No One Noticed | Sienna ★`],
  [0, 'man-on-the-moon', 'Man on the Moon: The End of Day', 'Kid Cudi', `Soundtrack 2 My Life ☆ | Solo Dolo (Nightmare) | Day 'n' Nite (Nightmare) | Cudi Zone | Make Her Say | Pursuit of Happiness ★ | Up Up & Away`],
  [0, 'die-lit', 'Die Lit', 'Playboi Carti', `Long Time ☆ | R.I.P. | Shoota ★ | Fell In Luv | Foreign | FlatBed Freestyle | R.I.P. Fredo`],
  [0, 'igor', 'IGOR', 'Tyler, The Creator', `IGOR'S THEME | EARFQUAKE | I THINK | RUNNING OUT OF TIME | NEW MAGIC WAND | PUPPET | WHAT'S GOOD | GONE, GONE / THANK YOU ★ | ARE WE STILL FRIENDS? ☆`],
  [0, 'long-live-asap', 'LONG.LIVE.A$AP', 'A$AP Rocky', `Goldie | PMW (All I Really Need) | LVL ☆ | Fuckin' Problems | 1Train | Fashion Killa ★`],
  [0, 'madvillainy', 'Madvillainy', 'MF DOOM, Madlib', `Accordion | Meat Grinder | Raid | Curls | Figaro ★ | Fancy Clown | All Caps ☆`],
  [0, 'ctrl', 'Ctrl', 'SZA', `Supermodel | Love Galore | Doves in the Wind | Drew Barrymore | The Weekend | Broken Clocks ★ | Normal Girl ☆`],
  [0, 'choke-enough', 'choke enough', 'Oklou', `endless | family and friends | choke enough | take me by the hand | harvest sky ☆ | blade bird ★`],
  [0, 'nostylist', 'NOSTYLIST', 'Destroy Lonely', `JETLGGD ★ | BERGDORF | NOSTYLIST ☆ | VTMNTSCOAT | TURNINUP | VETERAN`],
  [0, 'stankonia', 'Stankonia', 'OutKast', `Gasoline Dreams | So Fresh, So Clean | Ms. Jackson ★ | B.O.B. (Bombs Over Baghdad) ☆`],
  [0, 'introvert', 'Sometimes I Might Be Introvert', 'Little Simz', `Introvert ★ | Woman ☆ | Two Worlds Apart | I Love You, I Hate You | Standing Ovation | Point and Kill | Fear No Man | How Did You Get Here | Miss Understood`]
];

export type Album = { rank: number; title: string; artist: string; cover: string; songs: { name: string; fav: 0 | 1 | 2 }[] };

export const albums: Album[] = ALBUMS.map(([rank, slug, title, artist, songs]) => ({
  rank, title, artist, cover: '/assets/albums/' + slug + '.jpg',
  songs: songs.split('|').map((t) => t.trim()).map((t) => ({ name: t.replace(/\s*[★☆]$/, ''), fav: t.endsWith('★') ? 1 : t.endsWith('☆') ? 2 : 0 }))
}));
