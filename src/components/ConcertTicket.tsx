import type { Concert } from '../site/concerts';

// Ticket colors, picked by artist name so a ticket keeps its color wherever it is shown.
const TICKET_COLORS = ['#BDEBFB', '#CDBDFF', '#FFD3E8', '#FFE58A'];

function ticketColor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TICKET_COLORS[h % TICKET_COLORS.length];
}

// 'September 17, 2022' -> 'SEP 17, 2022'
function shortDate(date: string) {
  const i = date.indexOf(' ');
  return (i < 0 ? date : date.slice(0, 3) + date.slice(i)).toUpperCase();
}

// The square art for a concert card: its photo, or a ticket stub when there is no photo.
// `cardBg` is the color behind the square, used for the stub's punched notches.
export function ConcertArt({ c, radius, cardBg = '#FFFFFF' }: { c: Concert; radius: string; cardBg?: string }) {
  if (c.src) {
    return <img src={c.src} alt={`${c.artist} concert photo`} style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', background: '#3C4046', borderRadius: radius }} />;
  }
  const bg = ticketColor(c.artist);
  const notch = (side: 'top' | 'bottom') => (
    <span aria-hidden="true" style={{ position: 'absolute', left: '22%', [side]: '-4cqw', width: '8cqw', height: '8cqw', marginLeft: '-4cqw', borderRadius: '50%', background: cardBg }} />
  );
  const label = `Ticket stub: ${c.artist}${c.lineup && c.lineup.length ? ' with ' + c.lineup.join(', ') : ''}, ${c.venue ? c.venue + ', ' : ''}${c.city}, ${c.date}`;
  return (
    <div role="img" aria-label={label} style={{ containerType: 'inline-size', width: '100%' }}>
      <div style={{ position: 'relative', display: 'flex', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', background: bg, borderRadius: radius, color: '#3C4046', fontFamily: '\'M PLUS Rounded 1c\', system-ui, sans-serif', textAlign: 'left' }}>
        <div aria-hidden="true" style={{ width: '22%', flexShrink: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '0.9cqw dashed rgba(60, 64, 70, 0.35)' }}>
          <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', fontWeight: '800', fontSize: '5.2cqw', letterSpacing: '0.12em' }}>ADMIT ONE</span>
        </div>
        {notch('top')}
        {notch('bottom')}
        <div aria-hidden="true" style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', padding: '7cqw 6cqw 6cqw' }}>
          <span style={{ fontWeight: '800', fontSize: '4.2cqw', letterSpacing: '0.14em', opacity: '0.7' }}>{c.tour ? c.tour.toUpperCase() : 'LIVE'}</span>
          <span style={{ marginTop: '2.5cqw', fontWeight: '800', fontSize: c.artist.length > 14 ? '8.6cqw' : '10.5cqw', lineHeight: '1.05', overflowWrap: 'anywhere' }}>{c.artist}</span>
          {c.lineup && c.lineup.length ? (
            <span style={{ marginTop: '2.5cqw', fontWeight: '700', fontSize: c.lineup.length > 2 ? '4.4cqw' : '5.6cqw', lineHeight: '1.3' }}>
              {c.lineup.length > 2 ? c.lineup.map((n) => n.replace(/ /g, ' ')).join(' · ') : 'with ' + c.lineup.join(' & ')}
            </span>
          ) : null}
          <span style={{ marginTop: 'auto', fontWeight: '700', fontSize: '4.8cqw', lineHeight: '1.3' }}>
            {c.venue ? <>{c.venue}<br /></> : null}
            {c.city.toUpperCase()} · {shortDate(c.date)}
          </span>
          <span style={{ marginTop: '3cqw', height: '7cqw', background: 'repeating-linear-gradient(90deg, #3C4046 0 0.8cqw, transparent 0.8cqw 1.6cqw, #3C4046 1.6cqw 3.2cqw, transparent 3.2cqw 4cqw, #3C4046 4cqw 4.5cqw, transparent 4.5cqw 6cqw)', opacity: '0.75' }} />
        </div>
      </div>
    </div>
  );
}
