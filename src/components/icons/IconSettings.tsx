interface IconProps {
  className?: string;
  size?: number;
}

export default function IconSettings({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      fill="currentcolor"
      viewBox="0 0 512 512"
      role="img"
      className={className}
      width={size}
      height={size}
      aria-label="Settings"
    >
      <g>
        <path d="M32,376h283.35c6.186-14.112,20.281-24,36.65-24s30.465,9.888,36.65,24H480v32h-91.35c-6.186,14.112-20.281,24-36.65,24 s-30.465-9.888-36.65-24H32" />
        <path d="M32,240h91.35c6.186-14.112,20.281-24,36.65-24s30.465,9.888,36.65,24H480v32H196.65c-6.186,14.112-20.281,24-36.65,24 s-30.465-9.888-36.65-24H32" />
        <path d="M32,104h283.35c6.186-14.112,20.281-24,36.65-24s30.465,9.888,36.65,24H480v32h-91.35c-6.186,14.112-20.281,24-36.65,24 s-30.465-9.888-36.65-24H32" />
      </g>
    </svg>
  );
}
