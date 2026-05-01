// components/layout/BottomNav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  match?: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "ホーム",
    match: (pathname) => pathname === "/",
  },
  {
    href: "/calendar",
    label: "カレンダー",
    match: (pathname) => pathname.startsWith("/calendar"),
  },
  {
    href: "/records/new",
    label: "スケジュール追加",
    match: (pathname) => pathname === "/records/new",
  },
  {
    href: "/records",
    label: "スケジュール",
    match: (pathname) =>
      pathname === "/records" ||
      /^\/records\/[^/]+$/.test(pathname) ||
      /^\/records\/[^/]+\/edit$/.test(pathname),
  },
  {
    href: "/settings",
    label: "設定",
    match: (pathname) => pathname.startsWith("/settings"),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-pink-100 bg-white/95 backdrop-blur">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-5 gap-2 px-3 py-3">
        {NAV_ITEMS.map((item) => {
          const active = item.match
            ? item.match(pathname)
            : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex min-h-12 items-center justify-center rounded-2xl px-2 text-[13px] font-semibold transition",
                active
                  ? "bg-pink-100 text-pink-600"
                  : "bg-white text-slate-700 hover:bg-pink-50 hover:text-pink-500",
              ].join(" ")}
            >
              <span className="text-center leading-5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
