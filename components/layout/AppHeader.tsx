// components/layout/AppHeader.tsx

"use client";

import { APP_TEXT } from "@/lib/constants";

export default function AppHeader() {
  return (
    <header className="border-b border-pink-100 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-5">
        <p className="text-sm font-semibold tracking-wide text-pink-500">
          {APP_TEXT.brand}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {APP_TEXT.appTitle}
        </h1>
      </div>
    </header>
  );
}
