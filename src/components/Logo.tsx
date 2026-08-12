import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="House of Merola — home"
      className={`block ${className}`}
    >
      <Image
        src="/images/logo.jpg"
        alt="House of Merola"
        width={360}
        height={289}
        priority
        className="h-auto w-full max-w-[6.5rem] mix-blend-multiply sm:max-w-[8rem]"
      />
    </Link>
  );
}
