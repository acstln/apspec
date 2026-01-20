interface IconProps {
  className?: string;
  size?: number;
  direction?: 'up' | 'down';
}

export default function IconSort({ className = '', size = 20, direction }: IconProps) {
  if (direction === 'up') {
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
        aria-label="Sort ascending"
      >
        <path d="m3 8 4-4 4 4" />
        <path d="M7 4v16" />
        <path d="M11 12h10" />
        <path d="M11 16h7" />
        <path d="M11 20h4" />
      </svg>
    );
  }

  if (direction === 'down') {
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
        aria-label="Sort descending"
      >
        <path d="m3 16 4 4 4-4" />
        <path d="M7 20V4" />
        <path d="M11 4h10" />
        <path d="M11 8h7" />
        <path d="M11 12h4" />
      </svg>
    );
  }

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
      aria-label="Sort"
    >
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  );
}
