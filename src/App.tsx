import { useEffect, useRef } from 'react';
import mockupDocument from '../mockup/index.html?raw';
import mockupRuntime from '../mockup/support.js?raw';

function sourceParts() {
  const doc = new DOMParser().parseFromString(mockupDocument, 'text/html');
  const template = doc.querySelector('x-dc');
  const logic = doc.querySelector('script[data-dc-script]');
  if (!template || !logic) throw new Error('The mockup document is missing its x-dc template or logic script.');
  return { template: template.cloneNode(true), logic: logic.cloneNode(true) as HTMLScriptElement };
}

/** Mount the original mockup runtime so localhost matches the mockup exactly. */
export default function App() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const { template, logic } = sourceParts();
    host.replaceChildren(template, logic);

    const runtime = document.createElement('script');
    runtime.textContent = mockupRuntime;
    document.body.appendChild(runtime);

    return () => {
      runtime.remove();
      host.replaceChildren();
      document.querySelectorAll('style[data-dc-canvas], style#dc-root').forEach(node => node.remove());
      document.documentElement.removeAttribute('data-wii');
    };
  }, []);

  return (
    <>
      <div ref={hostRef} aria-label="Daniel Hu portfolio" />
      <div
        id="spotify-embed-root"
        style={{
          position: 'fixed',
          left: '0',
          top: '0',
          width: '320px',
          height: '352px',
          opacity: 0.01,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 2,
        }}
      />
    </>
  );
}
