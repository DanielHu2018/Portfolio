import type { Player } from '../hooks/usePlayer';
import { NextIcon, PrevIcon, ProgressBar } from './ipod';

interface Props {
  player: Player;
  sfxOn: boolean;
  onToggleSfx: () => void;
  navOpen: boolean;
  onToggleNav: () => void;
}

/** Bottom mini player, plus the sound-effects mute and (on phones) the navigator toggle. */
export default function MiniPlayer({ player, sfxOn, onToggleSfx, navOpen, onToggleNav }: Props) {
  return (
    <div className="mini" role="region" aria-label="Music player">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px 8px 8px", borderRadius: "999px", background: "linear-gradient(180deg, #FFFFFF 0%, #F2F4F7 55%, #E6E9EE 100%)", border: "3px solid #D5DAE1", boxShadow: "inset 0 2px 0 #FFFFFF" }}>
        <div aria-hidden="true" style={{ width: "40px", height: "40px", flexShrink: "0", borderRadius: "50%", background: "linear-gradient(135deg, #BDEBFB, #FFB8DA)", border: "2px solid #D5DAE1" }} />
        <div style={{ display: "flex", flexDirection: "column", minWidth: "0", width: "132px", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
          <span style={{ fontWeight: "700", fontSize: "13px", color: "#23262B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{player.title}</span>
          <span style={{ fontSize: "12px", color: "#4A4F57", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{player.artist}</span>
        </div>
        <div className="mini-progress" style={{ display: "flex", alignItems: "center", gap: "8px", font: "600 11px 'Helvetica Neue', Arial, sans-serif", color: "#4A4F57" }}>
          <span style={{ width: "32px", textAlign: "right" }}>{player.elapsedText}</span>
          <ProgressBar span pct={player.pct} height={6} width={150} />
          <span style={{ width: "34px" }}>-{player.remainText}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button type="button" className="sfx-btn" aria-label="Sound effects" aria-pressed={sfxOn} title="Sound effects" onClick={onToggleSfx} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "0", background: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
              <path d="M4 9h4l5-4v14l-5-4H4z" fill="#5A6170" stroke="#5A6170" strokeWidth="1.5" strokeLinejoin="round" />
              {sfxOn && (
                  <path d="M16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10" fill="none" stroke="#5A6170" strokeWidth="2" strokeLinecap="round" />
              )}
              {!sfxOn && (
                  <path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="#5A6170" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
          <button type="button" className="nav-btn" aria-label="Site menu" aria-expanded={navOpen} onClick={onToggleNav} style={{ width: "44px", height: "44px", borderRadius: "50%", border: "3px solid #D5DAE1", background: "linear-gradient(180deg, #FFFFFF, #EDF0F4)", cursor: "pointer", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
              <circle cx="12" cy="12" r="9" fill="none" stroke="#5A6170" strokeWidth="2" />
              <circle cx="12" cy="12" r="3.4" fill="#5A6170" />
            </svg>
          </button>
          <button type="button" aria-label="Previous track" onClick={() => player.skip(-1)} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "0", background: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <PrevIcon color="#5A6170" size={16} />
          </button>
          <button type="button" aria-label="Play or pause music" aria-pressed={player.playing} onClick={player.togglePlay} style={{ width: "44px", height: "44px", borderRadius: "50%", border: "3px solid #D5DAE1", background: "linear-gradient(180deg, #F4F6F9, #DDE1E7)", boxShadow: "inset 0 2px 0 #FFFFFF", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {player.playing && (
                <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="#5A6170" />
                </svg>
            )}
            {!player.playing && (
                <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M8 5l11 7-11 7z" fill="#5A6170" stroke="#5A6170" strokeWidth="2" strokeLinejoin="round" />
                </svg>
            )}
          </button>
          <button type="button" aria-label="Next track" onClick={() => player.skip(1)} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "0", background: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <NextIcon color="#5A6170" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
