interface IconProps {
  className?: string;
  size?: number;
}

export default function IconArrowLeft({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      role="img"
      className={className}
      width={size}
      height={size}
      aria-label="Back"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
