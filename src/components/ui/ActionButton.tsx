import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./utils";

type ActionButtonBaseProps = {
  children: ReactNode;
  className?: string;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "warning";
};

type ActionButtonLinkProps = ActionButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
    disabled?: boolean;
    href: string;
  };

type ActionButtonElementProps = ActionButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: never;
  };

export type ActionButtonProps = ActionButtonLinkProps | ActionButtonElementProps;

const variantClasses = {
  primary:
    "border-dec-blue bg-dec-blue text-white shadow-[0_10px_24px_rgb(59_153_212_/_0.26)] hover:border-[#237fb8] hover:bg-[#237fb8]",
  secondary:
    "border-design-border bg-white text-[#111827] shadow-soft hover:border-dec-blue hover:text-[#216f9d]",
  outline:
    "border-dec-blue bg-transparent text-[#216f9d] hover:bg-dec-blue/10 hover:text-[#145a85]",
  ghost:
    "border-transparent bg-transparent text-current hover:border-dec-blue/25 hover:bg-dec-blue/10",
  danger:
    "border-[#fecaca] bg-[#dc2626] text-white shadow-soft hover:bg-[#b91c1c]",
  success:
    "border-[#5d8a2f] bg-[#5d8a2f] text-white shadow-[0_10px_24px_rgb(93_138_47_/_0.25)] hover:bg-[#4a7024]",
  warning:
    "border-[#c2410c] bg-[#f97316] text-white shadow-[0_10px_24px_rgb(249_115_22_/_0.22)] hover:border-[#9a3412] hover:bg-[#c2410c]",
};

const sizeClasses = {
  sm: "min-h-9 px-3 py-2 text-sm",
  md: "min-h-11 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-5 py-3 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-control border font-semibold leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dec-blue focus-visible:ring-4 focus-visible:ring-dec-blue/25 disabled:cursor-not-allowed disabled:border-design-border disabled:bg-soft-bg disabled:text-muted-text disabled:shadow-none";

function getActionButtonClasses({
  className,
  loading,
  size,
  variant,
}: Required<Pick<ActionButtonBaseProps, "loading" | "size" | "variant">> &
  Pick<ActionButtonBaseProps, "className">) {
  return cx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading && "cursor-wait",
    className,
  );
}

function ActionButtonLink({
  children,
  className,
  disabled = false,
  href,
  loading = false,
  size = "md",
  variant = "primary",
  ...anchorProps
}: ActionButtonLinkProps) {
  const classes = getActionButtonClasses({ className, loading, size, variant });

  return (
    <Link
      {...anchorProps}
      aria-disabled={disabled || loading}
      className={cx(
        classes,
        (disabled || loading) &&
          "pointer-events-none border-design-border bg-soft-bg text-muted-text shadow-none",
      )}
      href={href}
      tabIndex={disabled || loading ? -1 : anchorProps.tabIndex}
    >
      {loading ? "Working..." : children}
    </Link>
  );
}

function ActionButtonElement({
  children,
  className,
  disabled,
  loading = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...buttonProps
}: ActionButtonElementProps) {
  const classes = getActionButtonClasses({ className, loading, size, variant });

  return (
    <button
      {...buttonProps}
      className={classes}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? "Working..." : children}
    </button>
  );
}

export function ActionButton(props: ActionButtonProps) {
  if ("href" in props && props.href) {
    return <ActionButtonLink {...props} />;
  }

  return <ActionButtonElement {...(props as ActionButtonElementProps)} />;
}
