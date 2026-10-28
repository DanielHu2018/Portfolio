import { useEffect, useRef, useState, type PointerEvent } from 'react';
import About from './components/About';
import BootScreen, { type BootState } from './components/BootScreen';
import Contact from './components/Contact';
import Experience from './components/Experience';
import FocusOverlay from './components/FocusOverlay';
import Hero from './components/Hero';
import IpodNav from './components/IpodNav';
import MiniPlayer from './components/MiniPlayer';
import OffTheClock from './components/OffTheClock';
import Overlays from './components/Overlays';
import Projects from './components/Projects';
import Skills from './components/Skills';
import SvgDefs from './components/SvgDefs';
import { startCursor } from './engine/cursor';
import { startMii, type MiiHandle } from './engine/mii';
import { startScene } from './engine/scene';
import { attachUiSounds, isMuted, setMuted, sfx } from './engine/sfx';
import { useFocus } from './hooks/useFocus';
import { usePlayer } from './hooks/usePlayer';
import { useReveal } from './hooks/useReveal';
import { useSections } from './hooks/useSections';

export default function App() {
  const player = usePlayer();
  const mii = useRef<MiiHandle | null>(null);
  const focus = useFocus(mii);
  const { sel, go } = useSections();
  const [boot, setBoot] = useState<BootState>('on');
  const [navOpen, setNavOpen] = useState(false);
  const [sfxOn, setSfxOn] = useState(() => !isMuted());
  const playingRef = useRef(player.playing);
  playingRef.current = player.playing;
  useReveal();

  // Canvas engines read the latest React state through refs, so they start once.
  useEffect(() => {
    const stopScene = startScene(() => focus.focusRef.current);
    const stopSounds = attachUiSounds();
    const bootFocus = setTimeout(() => document.querySelector<HTMLElement>('.boot')?.focus(), 50);
    const stopCursor = startCursor();
    mii.current = startMii({ isPlaying: () => playingRef.current, hasFocus: () => !!focus.focusRef.current });
    return () => {
      stopScene();
      stopSounds();
      clearTimeout(bootFocus);
      stopCursor?.();
      mii.current?.stop();
      mii.current = null;
    };
  }, [focus.focusRef]);

  const bootTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => bootTimers.current.forEach(clearTimeout), []);
  const bootGo = () => {
    if (boot !== 'on') return;
    sfx('boot');
    setBoot('loading');
    bootTimers.current.push(setTimeout(() => setBoot('leaving'), 1650), setTimeout(() => setBoot('done'), 2300));
  };

  const toggleSfx = () => {
    setMuted(sfxOn);
    setSfxOn(!sfxOn);
    sfx('click');
  };

  const wave = (e: PointerEvent) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    mii.current?.react('wave');
  };

  const menu = () => go(0);

  return (
    <div className={'rv-root ' + (navOpen ? 'nav-open' : '')} style={{ width: '100%', overflow: 'hidden', fontFamily: "'M PLUS Rounded 1c', system-ui, sans-serif", color: '#3C4046', backgroundColor: '#FFFFFF', backgroundImage: 'repeating-linear-gradient(0deg, #F3F5F8 0px, #F3F5F8 2px, #FFFFFF 2px, #FFFFFF 6px)' }}>
      <SvgDefs />
      <MiniPlayer player={player} sfxOn={sfxOn} onToggleSfx={toggleSfx} navOpen={navOpen} onToggleNav={() => setNavOpen((o) => !o)} />
      {focus.focus && <FocusOverlay focus={focus.focus} phase={focus.phase} onClose={focus.close} player={player} onMenu={menu} />}
      {boot !== 'done' && <BootScreen state={boot} onStart={bootGo} />}
      <Overlays />
      <IpodNav sel={sel} go={go} player={player} onPicked={() => setNavOpen(false)} />
      <Hero onWave={wave} />
      <About onOpenPhoto={(e) => focus.open('photo', 0, e)} />
      <Experience />
      <Projects openFocus={focus.open} />
      <Skills />
      <OffTheClock openFocus={focus.open} player={player} onMenu={menu} />
      <Contact />
    </div>
  );
}
