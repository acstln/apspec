interface IconProps {
  className?: string;
  size?: number;
}

export default function IconChevronDown({ className = '', size = 20 }: IconProps) {
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
      aria-label="Chevron down"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
