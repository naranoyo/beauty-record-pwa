// components/ui/LinkButton.tsx

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  full?: boolean;
  className?: string;
};

export default function LinkButton({
  href,
  children,
  variant = "primary",
  full = false,
  className = "",
}: Props) {
  return (
    <Link href={href} className={full ? "block" : "inline-block"}>
      <Button variant={variant} full={full} className={className}>
        {children}
      </Button>
    </Link>
  );
}
