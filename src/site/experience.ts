// The "Where I've worked" cards, in display order. The focus overlay cycles through them in this order.
export type ExperienceItem = {
  logo: string;
  headerBg: string;
  logoSize: 'contain' | 'cover';
  body: string;
  dot: string; // dotted shadow color: a deeper shade of the card's body color
  meta: string;
  company: string;
  role: string;
  tag: string;
  dates: string;
  wrapDates?: boolean;
  blurb: string;
  chips: string[];
};

export const experience: ExperienceItem[] = [
  {
    logo: '/assets/nationwide.png', headerBg: '#FFFFFF', logoSize: 'contain',
    body: 'linear-gradient(180deg, #E9F8FE, #BDEBFB)', dot: '#9AD9F0', meta: '#0B3550',
    company: 'Nationwide Mutual Insurance Company',
    role: 'Software Engineering Intern · Nationwide Financial, Project Fulcrum',
    tag: 'Internship', dates: 'May 2026 — Present',
    blurb: 'Owned and built a business-critical module end to end with 18 features and 22 endpoints, designing PostgreSQL tables, REST APIs, and an Angular/TypeScript UI.',
    chips: ['PostgreSQL', 'REST', 'Angular']
  },
  {
    logo: '/assets/The-Ohio-State-University-Logo.png', headerBg: '#FFFFFF', logoSize: 'contain',
    body: 'linear-gradient(180deg, #F1ECFF, #CDBDFF)', dot: '#AF98F6', meta: '#2E1F70',
    company: 'Intelligent Design and Robotics Laboratory',
    role: 'Undergraduate AI/ML Researcher',
    tag: 'Research', dates: 'Mar 2024 — May 2026', wrapDates: true,
    blurb: "Integrated a VLA policy through OpenCV for autonomous robot manipulation, trained a CNN-based behavior-cloning model from wrist-camera input for a 6-DOF UR5e arm, and reproduced Stanford's UMI environment.",
    chips: ['VLA policies', 'Behavior cloning']
  },
  {
    logo: '/assets/bdaa.png', headerBg: '#A96F5A', logoSize: 'cover',
    body: 'linear-gradient(180deg, #E6FAEE, #A9EBC2)', dot: '#8BDBA9', meta: '#12452A',
    company: 'Big Data & Analytics Association',
    role: 'Foundations of AI Track Lead',
    tag: 'Leadership', dates: 'Nov 2025 — Present',
    blurb: 'Led the Foundations of AI track for a 300+ member organization, overseeing teams building AI-powered products and mentoring students on scoping, AI integration, and presentation.',
    chips: ['Teaching', 'Workshops']
  }
];
