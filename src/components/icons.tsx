import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </Base>
  );
}

export function OliveIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21.5S4 18.5 4 10.5C4 5.5 7.5 3.5 12 3.5s8 2 8 7c0 8-8 11-8 11Z" />
      <circle cx="9" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="12.5" r="1.1" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 7h12l1.5 12.5a1 1 0 0 1-1 1.1H5.5a1 1 0 0 1-1-1.1L6 7Z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </Base>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Base>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Base>
  );
}

export function BrushIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m15 3 6 6L9.5 20.5a2.1 2.1 0 0 1-3 0L4.5 18.5a2.1 2.1 0 0 1 0-3L15 3Z" />
      <path d="m9.5 9.5 5 5" />
    </Base>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15Z" />
      <path d="M5 19c2-5 5-9 9-11" />
    </Base>
  );
}

export function HourglassIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6.5 3h11M6.5 21h11" />
      <path d="M7.5 3c.5 4.5 2 6.5 4.5 7s4-2.5 4.5-7M7.5 21c.5-4.5 2-6.5 4.5-7s4 2.5 4.5 7" />
    </Base>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m21 8-9-5-9 5v8l9 5 9-5V8Z" />
      <path d="M3.3 8.3 12 13l8.7-4.7" />
      <path d="M12 13v8" />
    </Base>
  );
}

export function ReturnIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 9h9a5 5 0 0 1 0 10H9" />
      <path d="M8 5 4 9l4 4" />
    </Base>
  );
}
