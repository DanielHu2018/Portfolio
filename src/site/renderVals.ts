import type { SiteController } from './controller';
import { albums } from './albums';
import { experience } from './experience';
import { censor } from './censor';

declare const window: any;
declare const document: any;

export function renderVals(site: SiteController) {
  const accent = site.props.accent ?? '#34BEED';
  const s = site.st();
  const reduced = !!s.reduced;
  const sel = s.sel ?? 0;
  if (site._bootInit === undefined) {
    site._bootInit = 'on';
  }
  const bootState = s.boot || site._bootInit;
  const projData = [
    { name: 'CLARA', href: 'https://github.com/DanielHu2018/CLARA', media: '/assets/clara.jpeg', isVideo: false, isImage: true, hasBadge: true, badge: '1st place', badgeStyle: 'color: #4A3700; background: #FFD23F; border-radius: 999px; padding: 0 9px', sub: '1st place · IBM x OSU Hackathon', desc: 'A decision-support agent that turns live global events into portfolio risk signals, stress-tests positions, and recommends optimized hedges before markets move.', chips: [{ ch: 'IBM Granite' }, { ch: 'Black-Scholes' }] },
    { name: 'Sierra', href: 'https://github.com/DanielHu2018/Sierra', media: '/assets/web/sierra.jpg', isVideo: false, isImage: true, hasBadge: false, badge: '', badgeStyle: '', sub: 'AI platform for transmission planning', desc: 'Routes transmission lines with multi-objective pathfinding and answers regulatory questions with RAG.', chips: [{ ch: 'TypeScript' }, { ch: 'React' }, { ch: 'Node.js' }, { ch: 'Claude API' }] },
    { name: 'Disco', href: 'https://github.com/ricky-he2006/hackio', media: '/assets/disco-demo.mp4', isVideo: true, isImage: false, hasBadge: false, badge: '', badgeStyle: '', sub: 'Multi-agent social planning platform', desc: 'A multi-agent social planning system that combines friend-vouched recommendations with agent-to-agent negotiation to turn a natural-language idea into an approved group plan that works for everyone.', chips: [{ ch: 'Multi-agent systems' }, { ch: 'Friend-powered recommendations' }] }
  ];
  const hobData: any = {
    'hb-guitar': { title: 'Guitar', label: '3D model of an electric guitar', blurb: 'I was inspired to learn guitar after seeing The Strokes perform live. I just started learning and am not very good (at all) but it’s a lot of fun lol. Right now, all I have is an electric guitar, but eventually want to get an acoustic as well. I also want to learn bass at some point.' },
    'hb-drawing': { title: 'Drawing', label: '3D model of a pencil', blurb: 'I’ve been drawing since before I can remember. It’s a pretty casual hobby and I don’t really do large projects, but whenever there’s a small gap in my schedule, I like to draw random stuff in my sketchbook. Sometimes, I also like to go back and look at my old sketchbooks.' },
    'hb-ski': { title: 'Skiing', label: '3D model of a pair of skis', blurb: 'Skiing is my favorite winter activity. Nowadays, I tend to stick to traditional trails, but in middle/high school I was a big fan of park skiing. I like to go a couple times every year, but have never travelled outside Ohio for it. Someday, I’d love to visit France or Japan (Hokkaido specifically) for it.' },
    'hb-volley': { title: 'Volleyball', label: '3D model of a volleyball', blurb: 'When I first started playing volleyball, I was incredibly bad, but I stuck with it and gradually got a lot better. I typically play 2 or 3 times a week, both indoor and sand. I would definitely say I prefer indoor over sand, but sand is still really fun. Right now, my goal is to learn how to play in a rotation before indoor intramural starts.' }
  };
  const concertData = [
    { artist: 'Baby Keem', date: 'June 10, 2026', city: 'Columbus', src: '/assets/web/Baby_Keem_06102026_Columbus.jpg' },
    { artist: 'Glaive', date: 'October 4, 2026', city: 'Columbus', src: '/assets/web/Glaive_10042026_Columbus.jpg' },
    { artist: 'Jane Remover', date: 'September 18, 2026', city: 'Columbus', src: '/assets/web/Jane_Remover_09182026_Columbus.jpg' },
    { artist: 'JPEGMAFIA', date: 'September 20, 2024', city: 'Columbus', src: '/assets/web/jpegmafia_9202024_Columbus.jpg' },
    { artist: 'Kid Cudi', date: 'September 17, 2022', city: 'Cleveland', src: '/assets/web/Kid_Cudi_09172022_Cleveland.jpg' },
    { artist: 'Ninajirachi', date: 'September 22, 2026', city: 'Columbus', src: '/assets/web/Ninajirachi_099222026_Columbus.jpg' },
    { artist: 'Slayr', date: 'September 5, 2026', city: 'Columbus', src: '/assets/web/slayr_09052026_Columbus.jpg' },
    { artist: 'The Strokes', date: 'July 14, 2026', city: 'Cincinnati', src: '/assets/web/The_Strokes_07142026_Cincinnati.jpg' },
    { artist: 'Tiffany Day', date: 'October 4, 2026', city: 'Columbus', src: '/assets/web/Tiffany_Day_10042026_Columbus.jpg' },
    { artist: 'Wynton Marsalis', date: 'October 6, 2026', city: 'Columbus', src: '/assets/web/Wynton_Marsalis_10062026_Columbus.jpg' }
  ];
  const f = s.focus;
  const ph = s.fPhase;
  const shown = f && ph === 'open';
  let fCard = '';
  let fBlurb = '';
  let fExpPrev = '';
  let fExpNext = '';
  const Z = site.pageZoom || 1;
  const fr: any = f ? { x: f.rect.x / Z, y: f.rect.y / Z, w: f.rect.w / Z, h: f.rect.h / Z } : null;
  if (f && (f.kind === 'proj' || f.kind === 'skills' || f.kind === 'spotify' || f.kind === 'exp')) {
    const vw0 = typeof window !== 'undefined' ? window.innerWidth / Z : 1440;
    const vh0 = typeof window !== 'undefined' ? window.innerHeight / Z : 900;
    let k = Math.max(0.5, Math.min(1.5, (vh0 - 110) / fr.h, (vw0 - 48) / fr.w));
    const ccx = vw0 / 2; let ccy = vh0 / 2;
    if (f.kind === 'exp') {
      // Prev/next arrows sit beside the card, or below it when the screen is too narrow.
      const side = (vw0 - fr.w * k) / 2 >= 84;
      if (!side) { k = Math.max(0.5, Math.min(1.5, (vh0 - 180) / fr.h, (vw0 - 48) / fr.w)); ccy = vh0 / 2 - 36; }
      const hw = fr.w * k / 2; const hh = fr.h * k / 2;
      const arrow = (x: number, y: number) => 'position: fixed; z-index: 3; left: ' + x.toFixed(1) + 'px; top: ' + y.toFixed(1) + 'px; width: 52px; height: 52px; border-radius: 50%; border: 3px solid #D5DAE1; background: linear-gradient(180deg, #FFFFFF, #EDF0F4); box-shadow: inset 0 2px 0 #FFFFFF; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; opacity: ' + (shown ? 1 : 0) + '; transition: opacity 0.3s ease';
      fExpPrev = side ? arrow(ccx - hw - 24 - 52, ccy - 26) : arrow(ccx - 52 - 10, ccy + hh + 14);
      fExpNext = side ? arrow(ccx + hw + 24, ccy - 26) : arrow(ccx + 10, ccy + hh + 14);
    }
    const dx0 = fr.x + fr.w / 2 - ccx; const dy0 = fr.y + fr.h / 2 - ccy;
    const xf0 = shown ? 'translate(-50%, -50%) scale(' + k.toFixed(3) + ')' : 'translate(-50%, -50%) translate(' + dx0.toFixed(1) + 'px, ' + dy0.toFixed(1) + 'px)';
    fCard = 'position: fixed; z-index: 2; left: ' + ccx.toFixed(1) + 'px; top: ' + ccy.toFixed(1) + 'px; width: ' + fr.w.toFixed(1) + 'px; height: ' + (f.kind === 'proj' || f.kind === 'skills' || f.kind === 'exp' ? fr.h.toFixed(1) + 'px' : 'auto') + '; transform: ' + xf0 + '; opacity: ' + (shown ? 1 : (ph === 'from' ? 0.6 : 0)) + '; transition: transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1), opacity ' + (ph === 'closing' ? '0.5s ease-in' : '0.25s ease');
  } else if (f) {
    const T = site.focusTarget(f.kind);
    const rcx = fr.x + fr.w / 2;
    const rcy = fr.y + fr.h / 2;
    const sc = Math.max(0.05, fr.w / T.w);
    const xf = shown ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) translate(' + (rcx - T.cx).toFixed(1) + 'px, ' + (rcy - T.cy).toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')';
    fCard = 'position: fixed; z-index: 2; left: ' + T.cx.toFixed(1) + 'px; top: ' + T.cy.toFixed(1) + 'px; width: ' + T.w.toFixed(1) + 'px; transform: ' + xf + '; opacity: ' + (shown ? 1 : (ph === 'from' ? 0.6 : 0)) + '; transition: transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1), opacity ' + (ph === 'closing' ? '0.5s ease-in' : '0.25s ease');
    const vw = typeof window !== 'undefined' ? window.innerWidth / Z : 1440;
    const bw = Math.min(400, vw * 0.38);
    fBlurb = 'position: fixed; z-index: 2; top: 50%; left: ' + (vw / 2 - 20 - bw).toFixed(1) + 'px; width: ' + bw.toFixed(1) + 'px; display: flex; flex-direction: column; gap: 16px; transform: translateY(-50%) translateX(' + (shown ? 0 : -40) + 'px); opacity: ' + (shown ? 1 : 0) + '; transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ' + (shown ? '0.18s' : '0s') + ', opacity 0.4s ease ' + (shown ? '0.18s' : '0s');
  }
  const fh = f && f.kind === 'hobby' ? hobData[f.idx] : { title: '', label: '', blurb: '' };
  const fp = f && f.kind === 'proj' ? projData[f.idx] : projData[0];
  const fc = f && f.kind === 'concert' ? concertData[f.idx] : concertData[0];
  const fe = f && f.kind === 'exp' ? experience[f.idx] : experience[0];
  const opener = (kind: any, idx: any) => (e: any) => site.openFocus(kind, idx, e);
  const focusVals = {
    fOpen: !!f,
    fIsPhoto: !!f && f.kind === 'photo',
    fIsResume: !!f && f.kind === 'resume',
    fIsConcert: !!f && f.kind === 'concert',
    fIsProj: !!f && f.kind === 'proj',
    fIsSpotify: !!f && f.kind === 'spotify',
    fIsSkills: !!f && f.kind === 'skills',
    fIsHobby: !!f && f.kind === 'hobby',
    fIsExp: !!f && f.kind === 'exp',
    fe: fe,
    fExpPrev: fExpPrev,
    fExpNext: fExpNext,
    expPrev: () => site.expStep(-1),
    expNext: () => site.expStep(1),
    openExp: experience.map((_, i) => opener('exp', i)),
    fLabel: f ? (f.kind === 'exp' ? fe.company : f.kind === 'hobby' ? fh.title : (f.kind === 'proj' ? fp.name : (f.kind === 'resume' ? 'Resume' : (f.kind === 'spotify' ? 'Music player' : f.kind === 'skills' ? 'Skills' : (f.kind === 'concert' ? 'Concert photo' : 'Photo of Daniel'))))) : '',
    fp: fp,
    fc: fc,
    fh: fh,
    fCard: fCard,
    fBlurb: fBlurb,
    fBackdrop: 'position: absolute; inset: 0; background: rgba(244, 247, 251, 0.72); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); opacity: ' + (shown ? 1 : 0) + '; transition: opacity 0.4s ease; cursor: zoom-out',
    fCloseBtn: 'position: fixed; z-index: 3; top: 20px; right: 20px; width: 52px; height: 52px; border-radius: 50%; border: 3px solid #D5DAE1; background: linear-gradient(180deg, #FFFFFF, #EDF0F4); box-shadow: inset 0 2px 0 #FFFFFF; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; opacity: ' + (shown ? 1 : 0) + '; transform: scale(' + (shown ? 1 : 0.7) + '); transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
    fClose: () => site.closeFocus(),
    fKey: (e: any) => {
      if (e.key === 'Escape') { e.preventDefault(); site.closeFocus(); }
      else if (f && f.kind === 'exp' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); site.sfx('skip'); site.expStep(e.key === 'ArrowLeft' ? -1 : 1); }
    },
    openPhoto: opener('photo', 0),
    openResume: (e: any) => { if (e && e.preventDefault) e.preventDefault(); site.openFocus('resume', 0, e); },
    projectRepo: (e: any) => { if (e && e.stopPropagation) e.stopPropagation(); },
    concertPrev: () => site.concertMove(-1),
    concertNext: () => site.concertMove(1),
    projPrev: () => site.projStep(-1),
    projNext: () => site.projStep(1),
    openProj0: opener('proj', 0),
    openProj1: opener('proj', 1),
    openProj2: opener('proj', 2),
    openSpotify: opener('spotify', 0),
    openSkills: opener('skills', 0),
    openHob_hb_guitar: opener('hobby', 'hb-guitar'),
    openHob_hb_drawing: opener('hobby', 'hb-drawing'),
    openHob_hb_ski: opener('hobby', 'hb-ski'),
    openHob_hb_volley: opener('hobby', 'hb-volley')
  };
  // @ts-expect-error unused, kept verbatim
  const seen = s.seen || {};
  const labels = ['Home', 'About', 'Experience', 'Projects', 'Skills', 'Off the clock', 'Contact'];
  const ids = site.sectionIds();
  const base = "display: flex; justify-content: space-between; align-items: center; min-height: 30px; padding: 0 9px; text-decoration: none; font: 600 13px 'Helvetica Neue', Arial, sans-serif; ";
  const rows = ids.map((id, i) => ({
    label: labels[i],
    href: '#' + id,
    current: i === sel ? 'true' : 'false',
    style: base + (i === sel ? 'color: #FFFFFF; background: linear-gradient(180deg, #6EC3F5 0%, #2A8BD8 100%)' : 'color: #23262B; background: #FFFFFF'),
    go: (e: any) => { if (e && e.preventDefault) e.preventDefault(); site.go(i); if (site.st().navOpen) site.setState({ navOpen: false }); }
  }));
  // @ts-expect-error unused, kept verbatim
  const rv = (id: any) => 'reveal';
  const PHOTOS = concertData.length;
  const M = PHOTOS * 2;
  const center = s.flow ?? 0;
  const flow = Array.from({ length: M }, (_, i) => {
    let d = ((i - center) % M + M) % M;
    if (d >= M / 2) d -= M;
    const ad = Math.abs(d);
    const ry = d < 0 ? 58 : (d > 0 ? -58 : 0);
    const z = d === 0 ? 90 : 0;
    const fk = (typeof window !== 'undefined' && window.innerWidth < 700) ? 0.5 : 1;
    const x = d === 0 ? 0 : Math.sign(d) * (134 + (ad - 1) * 74) * fk;
    const shown = ad <= 3;
    return {
      photo: i % PHOTOS,
      src: concertData[i % PHOTOS].src,
      artist: concertData[i % PHOTOS].artist,
      city: concertData[i % PHOTOS].city,
      date: concertData[i % PHOTOS].date,
      style: 'position: absolute; top: 44px; left: 50%; width: 170px; margin-left: -85px; perspective: 700px; cursor: pointer; z-index: ' + (20 - ad) + '; opacity: ' + (shown ? 1 : 0) + '; pointer-events: ' + (shown ? 'auto' : 'none') + '; transform: translateX(' + x + 'px) rotateY(' + ry + 'deg) translateZ(' + z + 'px); transition: transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.45s ease',
      open: (e: any) => site.openFocus('concert', i % PHOTOS, e)
    };
  });
  const flowCurrent = concertData[((center % PHOTOS) + PHOTOS) % PHOTOS];
  const skillData = [
    { name: 'AI Development', items: 'Agentic System Design · LLM Orchestration · MCP · AI Coding Assistants', uses: [
      { proj: 1, line: 'Orchestrated a Claude agentic loop with 4 domain tools and MCP search to surface permit timelines.' },
      { exp: 'hackathon', line: 'Built a Claude-powered competitive intelligence agent on AWS Bedrock at the internal Enterprise Hackathon.' },
      { proj: 0, line: 'An agent that turns live global events into quantitative risk factors and triggers stop-loss alerts.' },
      { proj: 2, line: 'A multi-agent system where agents negotiate to turn a natural-language idea into a group plan.' }] },
    { name: 'Frameworks & Data', items: 'PyTorch · Scikit-learn · Pandas · OpenCV · Streamlit · React · Angular · Node.js · PostgreSQL', uses: [
      { exp: 'nationwide', line: 'Designed PostgreSQL tables, REST APIs and an Angular/TypeScript UI for a module with 18 features and 22 endpoints.' },
      { exp: 'hackathon', line: 'Built a Black-Scholes pricing engine in Streamlit that cut a 2 to 3 day actuarial pricing process to under a minute.' },
      { exp: 'robotics', line: 'Integrated a VLA policy through OpenCV and trained a CNN behavior-cloning model from wrist-camera input.' },
      { proj: 1, line: 'React front end and Node.js back end around a multi-objective A* pathfinder over a 560-node graph.' }] },
    { name: 'Tools & Platforms', items: 'Git · Docker · Linux · AWS (S3, Bedrock, DynamoDB) · ROS · Weights & Biases · Vercel · Jupyter', uses: [
      { exp: 'robotics', line: 'Ran manipulation on ROS and tracked training runs in Weights & Biases, raising task completion by 62.5%.' },
      { exp: 'hackathon', line: 'Ran the competitive intelligence agent on Claude through AWS Bedrock.' },
      { exp: 'site', line: 'Serverless API routes on Vercel and a GitHub Actions job that refreshes Spotify listening stats every 6 hours.' }] },
    { name: 'Languages', items: 'Python · TypeScript · JavaScript · Java · C++ · C · SQL', uses: [
      { exp: 'robotics', line: 'Diagnosed and patched Python and C++ hardware drivers, fixing a 100% task failure rate.' },
      { exp: 'nationwide', line: 'TypeScript for the Angular UI and SQL for the PostgreSQL tables behind 22 endpoints.' },
      { proj: 1, line: 'TypeScript across the React front end and Node.js back end.' },
      { proj: 0, line: 'Python agent with VaR/ES monitoring and Black-Scholes hedge optimization.' }] }
  ];
  const expData: any = {
    nationwide: { title: 'Nationwide Mutual Insurance Company', tag: 'Internship', mono: 'NW', media: '/assets/nationwide.png', isImage: true, band: 'linear-gradient(180deg, #E9F8FE, #BDEBFB)', pill: '#BDEBFB', fg: '#0B3550' },
    hackathon: { title: 'Nationwide Hackathon', tag: 'Hackathon', mono: 'NW', media: '/assets/nationwide.png', isImage: true, band: 'linear-gradient(180deg, #FFF6D6, #FFE58A)', pill: '#FFE58A', fg: '#4A3700' },
    robotics: { title: 'Design Innovation & Simulation Lab', tag: 'Research', mono: 'OSU', media: '/assets/The-Ohio-State-University-Logo.png', isImage: true, band: 'linear-gradient(180deg, #F1ECFF, #CDBDFF)', pill: '#CDBDFF', fg: '#2E1F70' },
    site: { title: 'This site', tag: 'Project', mono: 'DH', band: 'linear-gradient(180deg, #FFE3F0, #FFB8DA)', pill: '#FFB8DA', fg: '#5C1236', to: 'hero' }
  };
  const skillSel = ((s.skillSel || 0) % skillData.length + skillData.length) % skillData.length;
  const skillRows = skillData.map((c, i) => {
    const on = i === skillSel;
    return {
      name: c.name,
      items: c.items,
      current: on ? 'true' : 'false',
      pick: () => { if (site.st().skillSel !== i) site.setState({ skillSel: i }); },
      style: 'display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 12px 16px; ' + (i < skillData.length - 1 ? 'border-bottom: 1px solid #E3E6EB; ' : '') + (on ? 'color: #FFFFFF; background: linear-gradient(180deg, #6EC3F5 0%, #2A8BD8 100%)' : 'color: #23262B; background: #FFFFFF'),
      itemsStyle: 'font-size: 14px; color: ' + (on ? '#FFFFFF' : '#4A4F57')
    };
  });
  const tagStyle = (bg: any, fg: any) => 'font-weight: 700; font-size: 12px; border-radius: 999px; padding: 4px 12px; background: ' + bg + '; color: ' + fg;
  const useCount = skillData[skillSel].uses.length;
  const skillUses = skillData[skillSel].uses.map((u, i) => {
    const rowStyle = 'display: flex; gap: 14px; align-items: center; width: 100%; box-sizing: border-box; text-align: left; padding: 11px 10px; border: 0; border-radius: 18px; ' + 'background: ' + (i < useCount - 1 ? 'linear-gradient(#EEF1F5, #EEF1F5) 50% 100% / calc(100% - 20px) 2px no-repeat' : 'transparent') + '; cursor: pointer; font: inherit; color: inherit';
    if (u.proj !== undefined) {
      const pd = projData[u.proj];
      return { title: pd.name, tag: 'Project', tagStyle: tagStyle('#FFB8DA', '#5C1236'), rowStyle: rowStyle, line: u.line, media: pd.media, isImage: !!pd.isImage, isVideo: !!pd.isVideo, isMono: false, mono: '', monoStyle: '',
        open: (e: any) => site.openFocus('proj', u.proj, { currentTarget: e.currentTarget, target: null, stopPropagation: () => e.stopPropagation() }) };
    }
    const ed = expData[u.exp];
    return { title: ed.title, tag: ed.tag, tagStyle: tagStyle(ed.pill, ed.fg), rowStyle: rowStyle, line: u.line, media: ed.media || '', isImage: !!ed.isImage, isVideo: false, isMono: !ed.isImage, isExperience: !!ed.isImage, mono: ed.mono,
      monoStyle: 'flex-shrink: 0; width: 76px; height: 56px; box-sizing: border-box; border-radius: 12px; border: 3px solid #D5DAE1; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; background: ' + ed.band + '; color: ' + ed.fg,
      open: () => site.go(site.sectionIds().indexOf(ed.to || 'experience')) };
  });
  const receiptViews = [
    { type: 'tracks', range: '1m' },
    { type: 'tracks', range: '6m' },
    { type: 'artists', range: '1m' },
    { type: 'artists', range: '6m' },
    { type: 'albums', range: '' }
  ];
  const receiptIndex = ((s.receiptView || 0) % receiptViews.length + receiptViews.length) % receiptViews.length;
  const receiptView = receiptViews[receiptIndex];
  const isAlbums = receiptView.type === 'albums';
  const openAlbum = isAlbums && s.album != null ? albums[s.album] : null;
  const receiptItems = isAlbums ? albums : (s.receipts && s.receipts.views && s.receipts.views[receiptView.type + '-' + receiptView.range]) || [{ name: s.receipts ? 'Nothing here yet' : 'Loading…', secondary: '' }];
  const receiptSel = Math.min(s.receiptSel || 0, receiptItems.length - 1);
  // Opening an album remembers the list's scroll position; going back restores it.
  const showAlbum = (i: number, e: any) => {
    const host = e && e.currentTarget && e.currentTarget.closest ? e.currentTarget.closest('.slab3d') : null;
    const list = host ? host.querySelector('.rc-scroll') : null;
    site.rcScroll = list ? list.scrollTop : 0;
    site.setState({ album: i, receiptSel: i, songSel: 0 });
  };
  const closeAlbum = () => {
    site.setState({ album: null });
    const top = site.rcScroll || 0;
    requestAnimationFrame(() => document.querySelectorAll('.rc-scroll').forEach((el: any) => { el.scrollTop = top; }));
  };
  const rowFont = "font: 600 12px 'Helvetica Neue', Arial, sans-serif; ";
  const rowColors = (on: boolean) => on ? 'color: #FFFFFF; background: linear-gradient(180deg, #6EC3F5 0%, #2A8BD8 100%)' : 'color: #23262B; background: #FFFFFF';
  const albumRows = isAlbums ? albums.map((al, i) => {
    const on = i === receiptSel;
    return {
      cover: al.cover,
      title: al.title,
      artist: al.artist,
      label: al.title + ' by ' + al.artist,
      open: (e: any) => showAlbum(i, e),
      pick: () => { if (site.st().receiptSel !== i) site.setState({ receiptSel: i }); },
      style: 'display: flex; align-items: center; gap: 8px; width: 100%; min-height: 36px; padding: 3px 8px; box-sizing: border-box; border: 0; border-radius: 0; cursor: pointer; ' + rowFont + rowColors(on),
      artistStyle: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; font-size: 10px; color: ' + (on ? 'rgba(255, 255, 255, 0.9)' : '#5A5F67')
    };
  }) : [];
  const songSel = openAlbum ? Math.min(s.songSel || 0, openAlbum.songs.length - 1) : 0;
  const songRows = openAlbum ? openAlbum.songs.map((sg, i) => {
    const on = i === songSel;
    return {
      num: String(i + 1).padStart(2, '0'),
      name: sg.name,
      star: sg.fav === 3 ? '♥' : sg.fav ? '★' : '',
      label: sg.name + (sg.fav === 1 ? ', favorite' : sg.fav === 2 ? ', second favorite' : sg.fav === 3 ? ', loved' : ''),
      pick: () => { if (site.st().songSel !== i) site.setState({ songSel: i }); },
      style: 'display: flex; align-items: center; gap: 7px; min-height: 26px; padding: 0 8px; ' + rowFont + rowColors(on),
      numStyle: 'flex-shrink: 0; width: 15px; font-weight: 700; font-size: 10px; color: ' + (on ? 'rgba(255, 255, 255, 0.85)' : '#7E848D'),
      starStyle: 'flex-shrink: 0; font-size: 12px; color: ' + (sg.fav === 1 ? (on ? '#FFE58A' : '#E8A800') : sg.fav === 3 ? (on ? '#FFD1E8' : '#FF6FB5') : (on ? '#FFFFFF' : '#A9B0BA'))
    };
  }) : [];
  const receiptRows = (isAlbums ? [] : receiptItems).map((item: any, i: any) => {
    const on = i === receiptSel;
    return {
      num: String(i + 1).padStart(2, '0'),
      name: censor(item.name),
      meta: item.secondary,
      pick: () => { if (site.st().receiptSel !== i) site.setState({ receiptSel: i }); },
      style: "display: flex; align-items: center; gap: 7px; min-height: 26px; padding: 0 8px; font: 600 12px 'Helvetica Neue', Arial, sans-serif; " + (on ? 'color: #FFFFFF; background: linear-gradient(180deg, #6EC3F5 0%, #2A8BD8 100%)' : 'color: #23262B; background: #FFFFFF'),
      numStyle: 'flex-shrink: 0; width: 15px; font-weight: 700; font-size: 10px; color: ' + (on ? 'rgba(255, 255, 255, 0.85)' : '#7E848D'),
      metaStyle: 'flex-shrink: 0; font-weight: 500; font-size: 10px; color: ' + (on ? 'rgba(255, 255, 255, 0.9)' : '#5A5F67')
    };
  });
  return {
    accent: accent,
    rows: rows,
    bootShow: bootState === 'on' || bootState === 'loading' || bootState === 'leaving',
    bootIdle: bootState === 'on',
    bootLoading: bootState === 'loading' || bootState === 'leaving',
    bootTime: (() => { const d = new Date(); const h = d.getHours() % 12 || 12; return h + ':' + String(d.getMinutes()).padStart(2, '0'); })(),
    bootDate: (() => { const d = new Date(); return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] + ' ' + (d.getMonth() + 1) + '/' + d.getDate(); })(),
    bootStyle: 'position: fixed; inset: 0; z-index: 9990; display: flex; align-items: center; justify-content: center; background: #FFFFFF; cursor: ' + (bootState === 'on' ? 'pointer' : 'default') + '; outline: none; opacity: ' + (bootState === 'leaving' ? 0 : 1) + '; transform: scale(' + (bootState === 'leaving' ? 1.06 : 1) + '); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
    bootStart: (e: any) => { if (e && e.stopPropagation) e.stopPropagation(); site.bootGo(); },
    bootKey: (e: any) => { if (e.key === 'Tab') return; e.preventDefault(); site.bootGo(); },
    waveMii: (e: any) => { if (e && e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return; if (site.miiReact) site.miiReact('wave'); },
    navCls: s.navOpen ? 'nav-open' : '',
    navOpenAttr: s.navOpen ? 'true' : 'false',
    toggleNav: () => site.setState({ navOpen: !s.navOpen }),
    sfxOn: !s.sfxMuted,
    sfxOff: !!s.sfxMuted,
    sfxOnAttr: s.sfxMuted ? 'false' : 'true',
    toggleSfx: () => {
      site.sfxMuted = !site.sfxMuted;
      try { window.localStorage.setItem('dh-sfx', site.sfxMuted ? 'off' : 'on'); } catch (e) { /* storage unavailable */ }
      site.setState({ sfxMuted: site.sfxMuted });
      site.sfx('click');
    },
    gbList: (s.gb || site.gbSeed()).map((g) => {
      const D = site.gbStickerDefs()[g.k] || site.gbStickerDefs()[0];
      return {
        ch: D[0], name: g.n || '', hasNote: !!(g.n && g.n.trim()),
        mine: !!g.mine,
        removeLabel: 'Remove your ' + String(D[2]).toLowerCase() + ' sticker' + (g.n && g.n.trim() ? ' that says ' + g.n.trim() : ''),
        // The board itself places a sticker on click and Enter, so keep these from reaching it.
        remove: (e: any) => { e.stopPropagation(); site.gbRemove(g); },
        removeKey: (e: any) => { e.stopPropagation(); },
        wrap: 'position: absolute; left: ' + g.x + '%; top: ' + g.y + '%; display: flex; flex-direction: column; align-items: center; gap: 4px; transform: translate(-50%, -32%); pointer-events: none',
        tag: 'display: block; max-width: 130px; text-align: center; overflow-wrap: anywhere; font-weight: 700; font-size: 11px; line-height: 1.3; color: #3C4046; background: #FFFFFF; border: 2px solid #D5DAE1; border-radius: 10px; padding: 3px 8px',
        style: 'position: relative; display: block; width: clamp(48px, 13vw, 66px); height: clamp(48px, 13vw, 66px); background: ' + site.stickerUri(g.k) + ' center / contain no-repeat; filter: drop-shadow(0 2px 0 rgba(60, 64, 70, 0.1)) drop-shadow(0 5px 6px rgba(60, 64, 70, 0.18)); transform: rotate(' + g.r + 'deg)'
      };
    }),
    gbCount: (s.gb || site.gbSeed()).length + ' stickers',
    gbStatus: s.gbStatus || '',
    gbMsgColor: s.gbErr ? '#C2410C' : '#1677A8',
    gbBoardLabel: 'Sticker board. Press Enter to place the selected ' + site.gbStickerDefs()[s.gbSk || 0][2].toLowerCase() + ' sticker.',
    gbPlace: (e: any) => {
      const r = e.currentTarget.getBoundingClientRect();
      const px = Math.min(12, 8000 / r.width); const x = Math.max(px, Math.min(100 - px, (e.clientX - r.left) / r.width * 100));
      const y = Math.max(10, Math.min(90, (e.clientY - r.top) / r.height * 100));
      site.gbAdd(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
    },
    gbKey: (e: any) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); site.gbAdd(Math.round(10 + Math.random() * 80), Math.round(15 + Math.random() * 70)); } },
    gbStickers: site.gbStickerDefs().map((k, i) => {
      const on = (s.gbSk || 0) === i;
      return {
        ch: k[0], label: k[2], on: on ? 'true' : 'false',
        pick: () => site.setState({ gbSk: i }),
        style: 'width: 54px; height: 54px; border-radius: 16px; cursor: pointer; padding: 0; background: ' + site.stickerUri(i) + ' center / 44px 44px no-repeat, ' + (on ? '#E6F7FD' : '#FFFFFF') + '; border: 3px solid ' + (on ? '#34BEED' : '#D5DAE1') + '; box-shadow: ' + (on ? '0 0 0 3px #BDEBFB' : 'none') + '; transition: transform 0.15s; transform: scale(' + (on ? 1.08 : 1) + ') rotate(' + (on ? -6 : 0) + 'deg)'
      };
    }),
    ...focusVals,
    receiptTitle: openAlbum ? openAlbum.title : isAlbums ? 'Favorite Albums' : receiptView.type === 'artists' ? 'Top Artists' : 'Top Tracks',
    receiptRange: openAlbum ? (s.album! + 1) + ' of ' + albums.length : isAlbums ? albums.length + ' albums' : receiptView.range === '6m' ? '6 months' : '4 weeks',
    receiptRows: receiptRows,
    rcRanked: !isAlbums,
    rcAlbums: isAlbums && !openAlbum,
    albumRows: albumRows,
    songRows: songRows,
    alb: openAlbum ? { title: openAlbum.title, artist: openAlbum.artist, cover: openAlbum.cover } : null,
    rcPrevLabel: openAlbum ? 'Previous: back to albums' : 'Previous receipt',
    rcMenuLabel: openAlbum ? 'Menu: back to albums' : 'Menu: back to top',
    rcMenu: () => { if (site.st().album != null) closeAlbum(); else { site.setState({ receiptView: 0, receiptSel: 0, album: null }); site.go(0); } },
    rcCenterLabel: isAlbums && !openAlbum ? 'Open ' + albums[receiptSel].title : 'Daniel on Spotify',
    rcCenter: (e: any) => { if (isAlbums && !openAlbum) { e.preventDefault(); showAlbum(receiptSel, e); } },
    spotifyProfile: 'https://open.spotify.com/user/rudda_rudda',
    npShow: !!s.np,
    npLive: !!(s.np && s.np.playing),
    npLabel: s.np && s.np.playing ? 'Currently listening to' : 'Last listened to',
    npTitle: s.np ? censor(s.np.title) : '',
    npArtist: s.np ? censor(s.np.artist) : '',
    npArt: s.np ? s.np.art : '',
    npUrl: s.np ? s.np.url : '',
    skillRows: skillRows,
    skillName: skillData[skillSel].name,
    skillCount: useCount + (useCount === 1 ? ' example' : ' examples'),
    skillUses: skillUses,
    skillPrev: () => site.setState({ skillSel: skillSel - 1 }),
    skillNext: () => site.setState({ skillSel: skillSel + 1 }),
    trackPrev: () => { if (openAlbum) closeAlbum(); else site.setState({ receiptView: receiptIndex - 1, receiptSel: 0, album: null }); },
    trackNext: () => site.setState({ receiptView: receiptIndex + 1, receiptSel: 0, album: null }),
    flowPrev: () => site.setState({ flow: center - 1 }),
    flowNext: () => site.setState({ flow: center + 1 }),
    flowCurrent: flowCurrent,
    slabThin: Array.from({ length: 4 }, (_, i) => ({ style: 'inset: -3px; transform: translateZ(-' + ((i + 1) * 1.5).toFixed(1) + 'px); background: ' + (i === 3 ? '#D3D9E1' : 'rgb(' + (236 - i * 8) + ', ' + (239 - i * 8) + ', ' + (244 - i * 7) + ')') })),
    slab: Array.from({ length: 12 }, (_, i) => {
      const d = (i + 1) * 2;
      const f = i / 11;
      const c = [221 - Math.round(48 * f), 226 - Math.round(44 * f), 232 - Math.round(36 * f)];
      const bg = i === 11 ? 'linear-gradient(135deg, #FFFFFF 0%, #C9CED6 30%, #F4F6F9 50%, #9AA2AD 75%, #E6E9EE 100%)' : 'rgb(' + c.join(', ') + ')';
      return { style: 'transform: translateZ(-' + d + 'px); background: ' + bg };
    }),
    projMove: (e: any) => site.projMove(e),
    projLeave: (e: any) => site.projLeave(e),
    photoOut: (e: any) => site.photoOut(e),
    stripLeave: (e: any) => site.stripLeave(e),
    ipodStyle: s.pos ? 'left: ' + s.pos.x + 'px; top: ' + s.pos.y + 'px; right: auto; bottom: auto; transform-origin: top left; transform: ' + (site.isSmall() ? 'scale(0.54)' : 'scale(0.84)') : '',
    dragStart: (e: any) => site.dragStart(e),
    resetPos: (e: any) => site.resetPos(e),
    anim: !s.rm,
    menu: () => { site.setState({ receiptView: 0, receiptSel: 0, album: null }); site.go(0); },
    prev: () => site.go(sel - 1),
    next: () => site.go(sel + 1),
    center: () => site.go(sel),
    reduced: reduced ? 'true' : 'false',
    motionLabel: reduced ? 'Motion off' : 'Reduce motion',
    toggleMotion: () => site.setState({ reduced: !reduced }),
    rv_about: rv('about'),
    rv_experience: rv('experience'),
    rv_work: rv('work'),
    rv_skills: rv('skills'),
    rv_off: rv('off'),
    rv_contact: rv('contact'),
    flow: flow
  };
}

export type SiteVals = ReturnType<typeof renderVals>;
