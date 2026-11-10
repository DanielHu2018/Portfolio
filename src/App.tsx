import { useLayoutEffect, useRef, useState } from 'react';
import { About } from './components/About';
import { Avatar } from './components/Avatar';
import { BootScreen } from './components/BootScreen';
import { Contact } from './components/Contact';
import { Experience } from './components/Experience';
import { FocusOverlay } from './components/FocusOverlay';
import { Hero } from './components/Hero';
import { IpodNav } from './components/IpodNav';
import { NowPlaying } from './components/NowPlaying';
import { OffTheClock } from './components/OffTheClock';
import { Projects } from './components/Projects';
import { Ripples } from './components/Ripples';
import { Skills } from './components/Skills';
import { SvgDefs } from './components/SvgDefs';
import { WiiCursor } from './components/WiiCursor';
import { SiteController } from './site/controller';
import { renderVals } from './site/renderVals';

export default function App() {
  const siteRef = useRef<SiteController | null>(null);
  if (!siteRef.current) siteRef.current = new SiteController();
  const site = siteRef.current;
  const [, bump] = useState(0);
  const committed = useRef(false);

  // Layout effects match the class lifecycle the site was written against: they run before first paint.
  useLayoutEffect(() => {
    const unsubscribe = site.subscribe(() => bump((n) => n + 1));
    site.mount();
    return () => {
      site.unmount();
      unsubscribe();
    };
  }, [site]);

  useLayoutEffect(() => {
    if (committed.current) site.didUpdate();
    committed.current = true;
  });

  const v = renderVals(site);
  return (
    <div aria-label="Daniel Hu portfolio">
      <div className={`rv-root ${v.navCls}`} style={{ width: '100%', overflow: 'hidden', fontFamily: "'M PLUS Rounded 1c', system-ui, sans-serif", color: '#3C4046', backgroundColor: '#FFFFFF', backgroundImage: 'repeating-linear-gradient(0deg, #F3F5F8 0px, #F3F5F8 2px, #FFFFFF 2px, #FFFFFF 6px)' }}>
        <SvgDefs />
        <FocusOverlay v={v} />
        <BootScreen v={v} />
        <Avatar />
        <Ripples />
        <WiiCursor />
        <IpodNav v={v} />
        <NowPlaying v={v} />
        <Hero v={v} />
        <About v={v} />
        <Experience v={v} />
        <Projects v={v} />
        <Skills v={v} />
        <OffTheClock v={v} />
        <Contact v={v} />
      </div>
    </div>
  );
}
