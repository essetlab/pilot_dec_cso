import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
  titleClassName?: string;
  logoGlow?: boolean;
  logoMode?: "mark" | "full";
};

export function BrandMark({
  compact = false,
  logoMode = "mark",
  titleClassName,
  logoGlow = false,
}: BrandMarkProps) {
  const logoSize = logoMode === "full"
    ? compact
      ? "h-9 w-[76px]"
      : "h-11 w-[92px]"
    : compact
      ? "h-9 w-9"
      : "h-10 w-10";
  const titleClasses = compact ? "text-sm" : "text-[15px]";

  return (
    <Link href="/" className="flex min-w-0 items-center gap-2.5 group">
      {/* Rounded white container for the DEC logo — matches reference design */}
      <div
        className={`${logoSize} relative shrink-0 overflow-hidden rounded-xl bg-white ${
          logoMode === "full" ? "p-1.5" : "p-1"
        } ${
          logoGlow 
            ? "shadow-[0_0_20px_rgba(255,255,255,0.3)] ring-1 ring-white/15" 
            : "shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
        }`}
      >
        <Image
          alt="Development Expertise Center logo"
          className="object-contain"
          fill
          priority
          sizes={compact ? "36px" : "40px"}
          src="/logos/dec-logo.png"
        />
      </div>
      <div className="min-w-0">
        <p className={`truncate ${titleClasses} font-bold leading-tight tracking-tight ${titleClassName || "text-slate-800"}`}>
          CSO Learning Hub
        </p>
      </div>
    </Link>
  );
}
