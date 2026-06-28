import type { ReactNode } from "react";
import { cx } from "./utils";

export type AlertMessageProps = {
  children: ReactNode;
  title?: string;
  tone: "info" | "success" | "warning" | "error";
};

const toneClasses = {
  info: "border-dec-blue/25 bg-dec-blue/10 text-[#1f628c]",
  success: "border-dec-green/35 bg-dec-green/15 text-[#426f1c]",
  warning: "border-orange-200 bg-orange-50 text-orange-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

export function AlertMessage({ children, title, tone }: AlertMessageProps) {
  return (
    <div className={cx("rounded-control border p-4", toneClasses[tone])} role={tone === "error" ? "alert" : "status"}>
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={cx("text-sm leading-6", title && "mt-1")}>{children}</div>
    </div>
  );
}
