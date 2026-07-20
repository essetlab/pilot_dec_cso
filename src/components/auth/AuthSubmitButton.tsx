"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ActionButton } from "@/components/ui";

export function AuthSubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <ActionButton disabled={pending} loading={pending} size="lg" type="submit">
      {children}
    </ActionButton>
  );
}
