import type { ComponentType } from "react";

type LogoComponent = ComponentType<{ className?: string }>;

const createSvg = (name: string, svg: string): LogoComponent => {
  const Component: LogoComponent = ({ className }) => (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      dangerouslySetInnerHTML={{ __html: svg }}
      role="img"
      aria-label={name}
    />
  );
  Component.displayName = `${name}Logo`;
  return Component;
};

const BBCIcon = createSvg(
  "BBC",
  `
  <svg viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="60" fill="#000"/>
    <text x="90" y="40" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="32" fill="#fff" text-anchor="middle">BBC</text>
  </svg>
`
);

const ReutersIcon = createSvg(
  "Reuters",
  `
  <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" fill="#fff"/>
    <g fill="#f37021" transform="translate(30,10)">
      ${Array.from({ length: 20 })
        .map((_, idx) => {
          const angle = (idx / 20) * Math.PI * 2;
          const radius = 18 + (idx % 2 === 0 ? 2 : 0);
          const cx = 45 + Math.cos(angle) * radius;
          const cy = 20 + Math.sin(angle) * radius;
          return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3" />`;
        })
        .join("")}
    </g>
    <text x="150" y="38" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="28" fill="#f37021" text-anchor="middle">REUTERS</text>
  </svg>
`
);

const APIcon = createSvg(
  "Associated Press",
  `
  <svg viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="60" fill="#fff"/>
    <text x="70" y="40" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="36" fill="#111" text-anchor="middle">AP</text>
    <rect x="95" y="42" width="50" height="8" fill="#e21c2a" rx="4"/>
  </svg>
`
);

const PolitiFactIcon = createSvg(
  "PolitiFact",
  `
  <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" fill="#004a99"/>
    <text x="100" y="38" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="32" fill="#fff" text-anchor="middle">PolitiFact</text>
    <circle cx="162" cy="18" r="8" fill="#f7b500"/>
  </svg>
`
);

const SnopesIcon = createSvg(
  "Snopes",
  `
  <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" fill="#ffd400"/>
    <text x="100" y="38" font-family="Georgia, serif" font-weight="700" font-size="32" fill="#222" text-anchor="middle">Snopes</text>
    <path d="M35 18 l15 -12 6 8 -18 10z" fill="#222"/>
  </svg>
`
);

const GuardianIcon = createSvg(
  "The Guardian",
  `
  <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" fill="#052962"/>
    <text x="100" y="36" font-family="'Times New Roman', serif" font-weight="700" font-size="30" fill="#fff" text-anchor="middle">The Guardian</text>
  </svg>
`
);

const AFPIcon = createSvg(
  "AFP",
  `
  <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" fill="#0082c6"/>
    <text x="100" y="38" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="34" fill="#fff" text-anchor="middle">AFP</text>
  </svg>
`
);

const FactCheckIcon = createSvg(
  "FactCheck.org",
  `
  <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" fill="#0f172a"/>
    <text x="100" y="38" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="30" fill="#4ade80" text-anchor="middle">FactCheck.org</text>
  </svg>
`
);

export const trustedSourceLogos = [
  { name: "BBC", id: 1, img: BBCIcon },
  { name: "Reuters", id: 2, img: ReutersIcon },
  { name: "Associated Press", id: 3, img: APIcon },
  { name: "AFP", id: 4, img: AFPIcon },
  { name: "PolitiFact", id: 5, img: PolitiFactIcon },
  { name: "Snopes", id: 6, img: SnopesIcon },
  { name: "The Guardian", id: 7, img: GuardianIcon },
  { name: "FactCheck.org", id: 8, img: FactCheckIcon },
];
