interface IconProps {
  className?: string;
  size?: number;
}

export default function IconCheck({ className = '', size = 20 }: IconProps) {
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
      aria-label="Check"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
