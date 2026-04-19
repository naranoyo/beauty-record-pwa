// components/ui/Button.tsx

"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  full?: boolean;
  className?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  full = false,
  className = "",
}: Props) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-95";

  const variants = {
    primary: "bg-pink-500 text-white hover:bg-pink-600 shadow-sm",
    secondary: "bg-pink-100 text-pink-600 hover:bg-pink-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        base,
        variants[variant],
        full ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
