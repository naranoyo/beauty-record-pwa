// components/home/UpcomingCard.tsx

"use client";

import { APP_TEXT } from "@/lib/constants";

export default function UpcomingCard() {
  return (
    <section className="rounded-4xl border border-pink-100 bg-white p-6 shadow-sm">
      <p className="text-xl font-bold text-violet-500">
        {APP_TEXT.homeUpcomingTitle}
      </p>

      <p className="mt-5 text-base leading-7 text-slate-600">
        {APP_TEXT.homeUpcomingDescription}
      </p>
    </section>
  );
}
