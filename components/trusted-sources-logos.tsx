import { type SVGProps } from "react";

// Trusted fact-checking and news source logos

export function BBCIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" fill="#000" />
      <text x="50" y="60" fontSize="36" fontWeight="bold" fill="#fff" textAnchor="middle">BBC</text>
    </svg>
  );
}

export function ReutersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" fill="#FF8000" />
      <text x="50" y="45" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">REUTERS</text>
    </svg>
  );
}

export function APNewsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" fill="#E41E20" />
      <text x="50" y="60" fontSize="32" fontWeight="bold" fill="#fff" textAnchor="middle">AP</text>
    </svg>
  );
}

export function FactCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="45" fill="#4CAF50" />
      <path d="M30 50 L45 65 L70 35" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WHOIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="45" fill="#0093D5" />
      <text x="50" y="60" fontSize="26" fontWeight="bold" fill="#fff" textAnchor="middle">WHO</text>
    </svg>
  );
}

export function SNopesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" fill="#2C5F2D" />
      <text x="50" y="55" fontSize="22" fontWeight="bold" fill="#fff" textAnchor="middle">Snopes</text>
    </svg>
  );
}

export function GuardianIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" fill="#052962" />
      <text x="50" y="45" fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">The</text>
      <text x="50" y="65" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">Guardian</text>
    </svg>
  );
}

export function PolitiFactIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" fill="#0055A4" />
      <text x="50" y="45" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">Politi</text>
      <text x="50" y="65" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">Fact</text>
    </svg>
  );
}

export const trustedSourceLogos = [
  { name: "BBC", id: 1, img: BBCIcon },
  { name: "Reuters", id: 2, img: ReutersIcon },
  { name: "AP News", id: 3, img: APNewsIcon },
  { name: "FactCheck.org", id: 4, img: FactCheckIcon },
  { name: "WHO", id: 5, img: WHOIcon },
  { name: "Snopes", id: 6, img: SNopesIcon },
  { name: "The Guardian", id: 7, img: GuardianIcon },
  { name: "PolitiFact", id: 8, img: PolitiFactIcon },
];
