// Site content. Bracketed values are placeholders Daniel still needs to supply (see DESIGN.md).

export const ACCENT = '#34BEED';

export const AVATAR = { skin: '#E8B98F', hair: '#2A2522', shirt: '#34BEED' };

export const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'off', label: 'Off the clock' },
  { id: 'contact', label: 'Contact' },
];

export interface Project {
  name: string;
  href: string;
  shot: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  sub: string;
  desc: string;
  chips: string[];
  dot: string;
}

export const PROJECTS: Project[] = [
  { name: 'CLARA', href: '#clara', shot: '[CLARA SCREENSHOT]', badge: '1st place', badgeColor: '#4A3700', badgeBg: '#FFD23F', sub: 'IBM SkillsBuild × OSU FinTech Hackathon', desc: 'A Claude-powered competitive intelligence agent on AWS Bedrock, paired with Black-Scholes pricing.', chips: ['Claude', 'AWS Bedrock', 'Black-Scholes'], dot: '#E8B400' },
  { name: 'Sierra', href: '#sierra', shot: '[SIERRA SCREENSHOT]', badge: '', badgeColor: '', badgeBg: '', sub: '[YOUR ROLE]', desc: 'Routes transmission lines with multi-objective pathfinding and answers regulatory questions with RAG.', chips: ['Pathfinding', 'RAG', '[STACK]'], dot: '#3FB872' },
  { name: 'Disco', href: '#disco', shot: '[DISCO SCREENSHOT]', badge: 'HackOHI/O 2026', badgeColor: '#12452A', badgeBg: '#A9EBC2', sub: 'Think less, party more.', desc: "Turns friends' opinions into recommendations and plans group outings with agents. [FULL DETAILS COMING]", chips: ['Multi-agent', '[STACK]'], dot: '#EE5FA6' },
];

export type HobbyId = 'hb-guitar' | 'hb-drawing' | 'hb-ski' | 'hb-volley';

export const HOBBIES: { id: HobbyId; title: string; label: string; gridLabel: string; blurb: string }[] = [
  { id: 'hb-guitar', title: 'Guitar', label: '3D model of an electric guitar', gridLabel: '3D model of an electric guitar (learning guitar)', blurb: 'After seeing The Strokes live, I was inspired to learn guitar. I just started learning and am not very good (at all) but it’s a lot of fun lol. Right now, all I have is an electric guitar, but eventually want to get an acoustic as well. I also want to learn bass at some point.' },
  { id: 'hb-drawing', title: 'Drawing', label: '3D model of a pencil', gridLabel: '3D model of a pencil (drawing)', blurb: 'I’ve been drawing since before I can remember. It’s a pretty casual hobby and I don’t really do large projects, but whenever there’s a small gap in my schedule, I like to draw random stuff in my sketchbook. Sometimes, I also like to go back and look at my old sketchbooks because they’re like snapshots of things I thought were cool at some point in time.' },
  { id: 'hb-ski', title: 'Skiing', label: '3D model of a pair of skis', gridLabel: '3D model of crossed skis (skiing)', blurb: 'Skiing is my favorite winter activity. Nowadays, I tend to stick to traditional trails, but in middle/high school I was a big fan of park skiing. I like to go a couple times every year, but have never travelled outside Ohio for it. Someday, I’d love to visit France or Japan (Hokkaido specifically) for it.' },
  { id: 'hb-volley', title: 'Volleyball', label: '3D model of a volleyball', gridLabel: '3D model of a volleyball (volleyball)', blurb: 'When I first started playing volleyball, I was incredibly bad (incredibly), but I stuck with it and gradually got a lot better. I typically play 2 or 3 times a week, both indoor and sand. I would definitely say I prefer indoor over sand, but sand is still really fun. Right now, my goal is to learn how to play outside hitter before indoor intramural starts. Besides volleyball, I also really like soccer and am the striker for my IM team.' },
];

export const PLAYLIST = [
  { title: '[SONG 1]', artist: '[ARTIST]', dur: 214 },
  { title: '[SONG 2]', artist: '[ARTIST]', dur: 187 },
  { title: '[SONG 3]', artist: '[ARTIST]', dur: 243 },
  { title: '[SONG 4]', artist: '[ARTIST]', dur: 199 },
  { title: '[SONG 5]', artist: '[ARTIST]', dur: 228 },
];

/** Number of distinct concert photos in the Cover Flow (the strip shows each twice for the endless loop). */
export const CONCERT_PHOTOS = 7;

export const STICKERS: { ch: string; color: string; label: string }[] = [
  { ch: '♪', color: '#34BEED', label: 'Music note' },
  { ch: '★', color: '#FFB020', label: 'Star' },
  { ch: '♥', color: '#FF6FB5', label: 'Heart' },
  { ch: '✿', color: '#4CD07D', label: 'Flower' },
  { ch: '❄', color: '#7FB8FF', label: 'Snowflake' },
  { ch: '☀', color: '#FF9A3C', label: 'Sun' },
  { ch: '♫', color: '#A77BFF', label: 'Notes' },
  { ch: '🐯', color: '#FF8A1F', label: 'Tiger' },
];

export interface Sticker { x: number; y: number; k: number; r: number; n: string }

export const GUESTBOOK_SEED: Sticker[] = [
  [12, 28, 0, -8, 'thanks for visiting!'], [26, 60, 2, 6, '[NOTE]'], [44, 22, 1, 10, '[NOTE]'],
  [58, 66, 4, -5, ''], [73, 30, 3, -12, '[NOTE]'], [86, 62, 6, 7, ''],
].map((a) => ({ x: a[0] as number, y: a[1] as number, k: a[2] as number, r: a[3] as number, n: a[4] as string }));
