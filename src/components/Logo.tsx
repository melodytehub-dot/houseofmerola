import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="House of Merola home"
      className={`block ${className}`}
    >
      <Image
        src="/images/logo.png"
        alt="House of Merola"
        width={684}
        height={532}
        priority
        className="h-12 w-auto"
      />
    </Link>
  );
}
