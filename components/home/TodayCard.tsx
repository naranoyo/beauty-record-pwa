// components/home/TodayCard.tsx

"use client";

import { APP_TEXT } from "@/lib/constants";

function formatTodayJa() {
  const now = new Date();

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(now);
}

export default function TodayCard() {
  return (
    <section className="rounded-4xl border border-pink-100 bg-white p-6 shadow-sm">
      <p className="text-xl font-bold text-pink-500">
        {APP_TEXT.homeTodayTitle}
      </p>

      <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
        {formatTodayJa()}
      </h2>

      <p className="mt-6 text-base leading-7 text-slate-600">
        {APP_TEXT.homeTodayDescription}
      </p>
    </section>
  );
}
