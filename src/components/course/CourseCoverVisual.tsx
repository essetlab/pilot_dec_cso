import { StatusBadge } from "@/components/ui";
import { cx } from "@/components/ui/utils";
import type { CourseTone } from "@/lib/course-types";

const coverToneClasses: Record<CourseTone, string> = {
  blue: "from-dec-blue via-[#2475a9] to-deep-navy",
  gold: "from-amber-300 via-[#d69b30] to-deep-navy",
  green: "from-dec-green via-[#549a47] to-deep-navy",
  navy: "from-deep-navy via-[#17405f] to-dec-blue",
};

const badgeToneByCourseTone: Record<CourseTone, "blue" | "green" | "gold"> = {
  blue: "blue",
  gold: "gold",
  green: "green",
  navy: "blue",
};

function safeBackgroundUrl(imageUrl: string | null | undefined) {
  const value = imageUrl?.trim();
  if (!value) {
    return undefined;
  }

  return {
    backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.48)), url("${value.replaceAll('"', "%22")}")`,
  };
}

export function CourseCoverVisual({
  capacityArea,
  compact = false,
  imageAlt,
  imageUrl,
  title,
  tone,
}: {
  capacityArea: string;
  compact?: boolean;
  imageAlt: string;
  imageUrl?: string | null;
  title: string;
  tone: CourseTone;
}) {
  const imageStyle = safeBackgroundUrl(imageUrl);

  return (
    <div
      aria-label={imageUrl ? imageAlt : `${title} course cover`}
      className={cx(
        "relative overflow-hidden bg-gradient-to-br bg-cover bg-center p-5 text-white",
        compact ? "aspect-[16/10]" : "min-h-[320px] lg:min-h-full",
        coverToneClasses[tone],
      )}
      role="img"
      style={imageStyle}
    >
      {!imageUrl ? (
        <>
          <div className="absolute right-4 top-10 h-32 w-32 rounded-full border border-white/20 bg-white/10 sm:h-40 sm:w-40" />
          <div className="absolute bottom-10 left-8 h-24 w-40 rotate-[-7deg] rounded-[28px] border border-white/25 bg-white/10" />
          <div className="absolute bottom-20 right-10 h-28 w-44 rotate-[8deg] rounded-[28px] border border-white/25 bg-white/15" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/70 via-deep-navy/10 to-transparent" />
      )}
      <div className="relative z-10 flex h-full flex-col justify-between gap-16">
        <StatusBadge label={capacityArea} tone={badgeToneByCourseTone[tone]} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
            CSO Learning
          </p>
          <p
            className={cx(
              "mt-3 font-semibold leading-tight text-white",
              compact ? "text-xl" : "max-w-md text-3xl",
            )}
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
