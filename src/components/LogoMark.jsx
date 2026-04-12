export default function LogoMark({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Branches */}
      <line x1="16" y1="27" x2="8"  y2="16" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="27" x2="24" y2="16" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8"  y1="16" x2="4"  y2="6"  stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8"  y1="16" x2="16" y2="4"  stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="16" x2="16" y2="4"  stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="16" x2="28" y2="6"  stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />

      {/* Nodes */}
      <circle cx="16" cy="27" r="2.5" fill="#7c3aed" />
      <circle cx="8"  cy="16" r="2"   fill="#7c3aed" />
      <circle cx="24" cy="16" r="2"   fill="#7c3aed" />
      <circle cx="4"  cy="6"  r="2"   fill="#7c3aed" />
      <circle cx="16" cy="4"  r="2"   fill="#7c3aed" />
      <circle cx="28" cy="6"  r="2"   fill="#7c3aed" />
    </svg>
  );
}
