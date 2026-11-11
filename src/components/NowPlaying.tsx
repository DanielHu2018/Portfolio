import type { SiteVals } from '../site/renderVals';

export function NowPlaying({ v }: { v: SiteVals }) {
  return (
    <>
      {v.npShow ? (
        <a className="np" href={v.npUrl} target="_blank" rel="noopener noreferrer" aria-label={`${v.npLive ? 'Daniel is currently listening to' : 'Daniel last listened to'} ${v.npTitle} by ${v.npArtist} on Spotify`} style={{ display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box', padding: '4px 12px 4px 4px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.9)', border: '2px solid #E3E6EB', textDecoration: 'none', color: '#4A4F57', fontFamily: '\'M PLUS Rounded 1c\', system-ui, sans-serif' }}>
          <img src={v.npArt} alt="" width="32" height="32" style={{ flexShrink: '0', width: '32px', height: '32px', borderRadius: '9px', objectFit: 'cover', background: '#3C4046' }} />
          <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '0' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', fontSize: '10px', color: '#7E848D' }}>
              {v.npLive ? (
                <span className="np-eq" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              ) : null}
              {v.npLabel}
            </span>
            <span style={{ fontSize: '12px', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <strong style={{ fontWeight: '700', color: '#3C4046' }}>
                {v.npTitle}
              </strong>
              {' '}by {v.npArtist}
            </span>
          </span>
        </a>
      ) : null}
    </>
  );
}
