import { useCallback, useEffect, useState } from 'react';
import { PLAYLIST } from '../data/content';

/** Simulated music player: advances one second per tick while playing, then rolls to the next track. */
export function usePlayer() {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState({ track: 0, elapsed: 0 });

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setPos((p) => {
        const el = p.elapsed + 1;
        return el >= PLAYLIST[p.track].dur ? { track: (p.track + 1) % PLAYLIST.length, elapsed: 0 } : { track: p.track, elapsed: el };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing]);

  const skip = useCallback((dir: number) => {
    setPos((p) => {
      if (dir < 0 && p.elapsed > 3) return { track: p.track, elapsed: 0 };
      return { track: (p.track + dir + PLAYLIST.length) % PLAYLIST.length, elapsed: 0 };
    });
  }, []);

  const trk = PLAYLIST[pos.track % PLAYLIST.length];
  const elapsed = Math.min(pos.elapsed, trk.dur);
  const fmt = (sec: number) => Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  return {
    playing,
    togglePlay: () => setPlaying((p) => !p),
    skip,
    title: trk.title,
    artist: trk.artist,
    elapsedText: fmt(elapsed),
    remainText: fmt(trk.dur - elapsed),
    pct: (elapsed / trk.dur * 100).toFixed(1),
  };
}

export type Player = ReturnType<typeof usePlayer>;
