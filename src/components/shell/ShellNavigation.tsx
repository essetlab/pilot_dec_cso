"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/routes";
import { cx } from "@/components/ui/utils";

export type ShellNavItem = NavItem & {
  disabled?: boolean;
  exact?: boolean;
};

type ShellNavigationProps = {
  ariaLabel: string;
  items: ShellNavItem[];
  orientation?: "horizontal" | "vertical";
  tone?: "public" | "learner" | "creator" | "admin";
};

const toneClasses = {
  public: {
    active: "border-dec-blue bg-dec-blue text-white shadow-soft",
    idle: "border-transparent text-dark-ink hover:border-dec-blue/35 hover:bg-dec-blue/10 hover:text-dec-blue",
  },
  learner: {
    active: "border-dec-green bg-dec-green text-deep-navy shadow-soft",
    idle: "border-transparent text-dark-ink hover:border-dec-green/40 hover:bg-dec-green/15",
  },
  creator: {
    active: "border-dec-blue bg-dec-blue text-white shadow-soft",
    idle: "border-transparent text-dark-ink hover:border-dec-blue/35 hover:bg-dec-blue/10 hover:text-dec-blue",
  },
  admin: {
    active: "border-deep-navy bg-deep-navy text-white shadow-soft",
    idle: "border-transparent text-dark-ink hover:border-dec-blue/35 hover:bg-soft-bg hover:text-dec-blue",
  },
};

function isActive(pathname: string, item: ShellNavItem) {
  if (item.disabled) {
    return false;
  }

  if (item.href === "/") {
    return pathname === "/";
  }

  if (item.href === "/admin" || item.href === "/creator" || item.href === "/learn") {
    return pathname === item.href;
  }

  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function ShellNavigation({
  ariaLabel,
  items,
  orientation = "horizontal",
  tone = "public",
}: ShellNavigationProps) {
  const pathname = usePathname();
  const isVertical = orientation === "vertical";

  return (
    <nav
      aria-label={ariaLabel}
      className={isVertical ? "w-full" : "-mx-1 min-w-0 overflow-x-auto px-1"}
    >
      <ul
        className={cx(
          "flex gap-2",
          isVertical ? "flex-col" : "w-max min-w-full flex-nowrap pb-1",
        )}
      >
        {items.map((item) => {
          const active = isActive(pathname, item);
          const classes = cx(
            "inline-flex min-h-10 shrink-0 items-center justify-center rounded-control border px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue focus-visible:ring-4 focus-visible:ring-dec-blue/25",
            isVertical && "w-full justify-start",
            !isVertical && "whitespace-nowrap",
            active ? toneClasses[tone].active : toneClasses[tone].idle,
            item.disabled && "cursor-default border-design-border bg-soft-bg text-muted-text",
          );

          return (
            <li key={`${item.href}-${item.label}`} className={isVertical ? "w-full" : ""}>
              {item.disabled ? (
                <span aria-disabled="true" className={classes}>
                  {item.label}
                </span>
              ) : (
                <Link aria-current={active ? "page" : undefined} className={classes} href={item.href}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
