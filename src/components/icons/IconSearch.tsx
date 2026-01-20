interface IconProps {
  className?: string;
  size?: number;
}

export default function IconSearch({ className = '', size = 20 }: IconProps) {
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
      aria-label="Search"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
