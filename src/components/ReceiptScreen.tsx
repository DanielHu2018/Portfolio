import { Fragment } from 'react';
import type { SiteVals } from '../site/renderVals';
import { parseStyle } from '../site/style';

/** The Spotify iPod's screen: Top Tracks / Top Artists lists (a row opens that track or artist), the Favorite Artists or Favorite Albums list, or one artist or album. */
export function ReceiptScreen({ v }: { v: SiteVals }) {
  return (
    <div style={{ width: '100%', boxSizing: 'border-box', border: '8px solid #23262B', borderRadius: '12px', background: '#23262B', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(180deg, #FAFBFC, #E7EAEE)', borderBottom: '1px solid #B9BFC8', padding: '3px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', font: '700 12px \'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
        <span style={{ minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {v.receiptTitle}
        </span>
        <span style={{ flexShrink: '0', fontWeight: '600', fontSize: '11px', color: '#4A4F57' }}>
          {v.receiptRange}
        </span>
      </div>
      {v.rcRanked ? (
        <div role="list" aria-label={`Daniel's ${v.receiptTitle}, last ${v.receiptRange}`} style={{ height: '260px', overflow: 'hidden', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
          {v.receiptRows.map((m: any, i0: number) => (
            <Fragment key={i0}>
              <div role="listitem">
                <button type="button" onClick={m.open} onPointerEnter={m.pick} disabled={!m.open} aria-label={m.label} style={parseStyle(m.style)}>
                  <span style={parseStyle(m.numStyle)}>
                    {m.num}
                  </span>
                  <span style={{ flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.name}
                  </span>
                  <span style={parseStyle(m.metaStyle)}>
                    {m.meta}
                  </span>
                  <span aria-hidden="true">
                    ›
                  </span>
                </button>
              </div>
            </Fragment>
          ))}
        </div>
      ) : null}
      {v.topHead ? (
        <div style={{ height: '260px', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flexShrink: '0', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'linear-gradient(180deg, #FFFFFF, #EEF1F5)' }}>
            {v.topHead.pic ? (
              <img src={v.topHead.pic} alt={v.topHead.alt} width="88" height="88" style={{ flexShrink: '0', width: '88px', height: '88px', objectFit: 'cover', borderRadius: '3px', background: '#3C4046', boxShadow: '0 2px 5px rgba(35, 38, 43, 0.35)' }} />
            ) : (
              <div aria-hidden="true" style={{ flexShrink: '0', width: '88px', height: '88px', borderRadius: '3px', background: '#3C4046', boxShadow: '0 2px 5px rgba(35, 38, 43, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A9B0BA', fontSize: '34px' }}>
                ♪
              </div>
            )}
            <div style={{ minWidth: '0', display: 'flex', flexDirection: 'column', gap: '3px', fontFamily: '\'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
              <span style={{ fontWeight: '700', fontSize: '13px', lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {v.topHead.name}
              </span>
              {v.topHead.sub ? (
                <span style={{ fontWeight: '600', fontSize: '11px', color: '#4A4F57', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {v.topHead.sub}
                </span>
              ) : null}
              <span style={{ fontWeight: '500', fontSize: '10px', color: '#5A5F67', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {v.topHead.count}
              </span>
            </div>
          </div>
          <div style={{ flexShrink: '0', padding: '3px 8px', background: 'linear-gradient(180deg, #F4F6F9, #E3E7EC)', borderTop: '1px solid #D5DAE1', borderBottom: '1px solid #D5DAE1', font: '800 10px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5A5F67' }}>
            {v.topTrack ? 'Track Info' : 'Most Played'}
          </div>
          {v.topTrack ? (
            <div className="rc-scroll" role="list" aria-label={`About ${v.topHead.name}`} style={{ flex: '1', minHeight: '0', overflowY: 'auto' }}>
              {v.topInfo.map((r: any, i0: number) => (
                <div key={i0} role="listitem" style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '26px', padding: '0 8px', borderBottom: '1px solid #EEF1F5', font: '600 12px \'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
                  <span style={{ flexShrink: '0', fontWeight: '700', fontSize: '10px', color: '#7E848D' }}>
                    {r.label}
                  </span>
                  <span style={{ flex: '1', minWidth: '0', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rc-scroll" role="list" aria-label={`Daniel's most played tracks by ${v.topHead.name}`} style={{ flex: '1', minHeight: '0', overflowY: 'auto' }}>
              {v.topSongRows.map((t: any, i0: number) => (
                <div key={i0} role="listitem" onPointerEnter={t.pick} style={parseStyle(t.style)}>
                  {t.cover ? (
                    <img src={t.cover} alt="" loading="lazy" decoding="async" width="22" height="22" style={{ flexShrink: '0', width: '22px', height: '22px', objectFit: 'cover', borderRadius: '2px', background: '#3C4046', boxShadow: '0 1px 2px rgba(35, 38, 43, 0.3)' }} />
                  ) : (
                    <span aria-hidden="true" style={{ flexShrink: '0', width: '22px', height: '22px', borderRadius: '2px', background: '#3C4046' }} />
                  )}
                  <span style={{ flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.name}
                  </span>
                  <span style={parseStyle(t.metaStyle)}>
                    {t.meta}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
      {v.rcArtists ? (
        <div className="rc-scroll" role="list" aria-label="Daniel's favorite artists" style={{ height: '260px', overflowY: 'auto', background: '#FFFFFF' }}>
          {v.artistEmpty ? (
            <div role="listitem" style={{ display: 'flex', alignItems: 'center', minHeight: '36px', padding: '3px 8px', font: '600 12px \'Helvetica Neue\', Arial, sans-serif', color: '#7E848D' }}>
              Coming soon
            </div>
          ) : null}
          {v.artistRows.map((a: any, i0: number) => (
            <div key={i0} role="listitem">
              <button type="button" onClick={a.open} onPointerEnter={a.pick} aria-label={a.label} style={parseStyle(a.style)}>
                <img src={a.cover} alt="" loading="lazy" decoding="async" width="30" height="30" style={{ flexShrink: '0', width: '30px', height: '30px', objectFit: 'cover', borderRadius: '2px', background: '#3C4046', boxShadow: '0 1px 2px rgba(35, 38, 43, 0.3)' }} />
                <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.title}
                  </span>
                  <span style={parseStyle(a.artistStyle)}>
                    {a.artist}
                  </span>
                </span>
                <span aria-hidden="true">
                  ›
                </span>
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {v.art ? (
        <div style={{ height: '260px', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flexShrink: '0', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'linear-gradient(180deg, #FFFFFF, #EEF1F5)' }}>
            <img src={v.art.pic} alt={`${v.art.name} on Spotify`} width="88" height="88" style={{ flexShrink: '0', width: '88px', height: '88px', objectFit: 'cover', borderRadius: '3px', background: '#3C4046', boxShadow: '0 2px 5px rgba(35, 38, 43, 0.35)' }} />
            <div style={{ minWidth: '0', display: 'flex', flexDirection: 'column', gap: '3px', fontFamily: '\'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
              <span style={{ fontWeight: '700', fontSize: '13px', lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {v.art.name}
              </span>
              <span style={{ fontWeight: '600', fontSize: '11px', color: '#4A4F57', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {v.art.count}
              </span>
            </div>
          </div>
          <div style={{ flexShrink: '0', padding: '3px 8px', background: 'linear-gradient(180deg, #F4F6F9, #E3E7EC)', borderTop: '1px solid #D5DAE1', borderBottom: '1px solid #D5DAE1', font: '800 10px \'Helvetica Neue\', Arial, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#5A5F67' }}>
            Favorite Tracks
          </div>
          <div className="rc-scroll" role="list" aria-label={`Daniel's favorite tracks by ${v.art.name}`} style={{ flex: '1', minHeight: '0', overflowY: 'auto' }}>
            {v.artistSongRows.map((t: any, i0: number) => (
              <div key={i0} role="listitem" onPointerEnter={t.pick} style={parseStyle(t.style)}>
                <img src={t.cover} alt="" loading="lazy" decoding="async" width="22" height="22" style={{ flexShrink: '0', width: '22px', height: '22px', objectFit: 'cover', borderRadius: '2px', background: '#3C4046', boxShadow: '0 1px 2px rgba(35, 38, 43, 0.3)' }} />
                <span style={{ flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {v.rcAlbums ? (
        <div className="rc-scroll" role="list" aria-label="Daniel's favorite albums" style={{ height: '260px', overflowY: 'auto', background: '#FFFFFF' }}>
          {v.albumRows.map((a: any, i0: number) => (
            <div key={i0} role="listitem">
              <button type="button" onClick={a.open} onPointerEnter={a.pick} aria-label={a.label} style={parseStyle(a.style)}>
                <img src={a.cover} alt="" loading="lazy" decoding="async" width="30" height="30" style={{ flexShrink: '0', width: '30px', height: '30px', objectFit: 'cover', borderRadius: '2px', background: '#3C4046', boxShadow: '0 1px 2px rgba(35, 38, 43, 0.3)' }} />
                <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.title}
                  </span>
                  <span style={parseStyle(a.artistStyle)}>
                    {a.artist}
                  </span>
                </span>
                <span aria-hidden="true">
                  ›
                </span>
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {v.alb ? (
        <div style={{ height: '260px', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flexShrink: '0', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', background: 'linear-gradient(180deg, #FFFFFF, #EEF1F5)', borderBottom: '1px solid #D5DAE1' }}>
            <img src={v.alb.cover} alt={`${v.alb.title} album cover`} width="88" height="88" style={{ flexShrink: '0', width: '88px', height: '88px', objectFit: 'cover', borderRadius: '3px', background: '#3C4046', boxShadow: '0 2px 5px rgba(35, 38, 43, 0.35)' }} />
            <div style={{ minWidth: '0', display: 'flex', flexDirection: 'column', gap: '3px', fontFamily: '\'Helvetica Neue\', Arial, sans-serif', color: '#23262B' }}>
              <span style={{ fontWeight: '700', fontSize: '13px', lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {v.alb.title}
              </span>
              <span style={{ fontWeight: '600', fontSize: '11px', color: '#4A4F57', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {v.alb.artist}
              </span>
              <span style={{ display: 'flex', flexWrap: 'wrap', columnGap: '8px', fontWeight: '500', fontSize: '10px', color: '#5A5F67' }}>
                <span style={{ whiteSpace: 'nowrap' }}><span style={{ color: '#E8A800' }}>★</span> favorite</span>
                <span style={{ whiteSpace: 'nowrap' }}><span style={{ color: '#A9B0BA' }}>★</span> second favorite</span>
              </span>
            </div>
          </div>
          <div className="rc-scroll" role="list" aria-label={`Favorite songs from ${v.alb.title}`} style={{ flex: '1', minHeight: '0', overflowY: 'auto' }}>
            {v.songRows.map((t: any, i0: number) => (
              <div key={i0} role="listitem" onPointerEnter={t.pick} aria-label={t.label} style={parseStyle(t.style)}>
                <span style={parseStyle(t.numStyle)}>
                  {t.num}
                </span>
                <span style={{ flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.name}
                </span>
                <span aria-hidden="true" style={parseStyle(t.starStyle)}>
                  {t.star}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
