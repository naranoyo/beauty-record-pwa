// components/home/UpcomingCard.tsx

"use client";

import Link from "next/link";
import { APP_TEXT } from "@/lib/constants";
import type { BeautyRecord } from "@/lib/types";
import { categoryLabel, statusLabel } from "@/lib/record-utils";

type Props = {
  records: BeautyRecord[];
};

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);
  const week = ["日", "月", "火", "水", "木", "金", "土"];

  return `${date.getMonth() + 1}/${date.getDate()}(${week[date.getDay()]})`;
}

export default function UpcomingCard({ records }: Props) {
  const todayKey = toDateKey(new Date());

  const upcomingRecords = records
    .filter((record) => {
      return record.status !== "done" && record.date >= todayKey;
    })
    .sort((a, b) => {
      return a.date.localeCompare(b.date);
    })
    .slice(0, 3);

  return (
    <section className="rounded-4xl border border-pink-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xl font-bold text-violet-500">
          {APP_TEXT.homeUpcomingTitle}
        </p>

        <Link
          href="/records/new"
          className="rounded-full bg-pink-500 px-4 py-2 text-xs font-bold text-white! shadow-sm active:scale-95"
        >
          ＋追加
        </Link>
      </div>

      {upcomingRecords.length === 0 ? (
        <p className="mt-5 text-base leading-7 text-slate-600">
          {APP_TEXT.homeUpcomingDescription}
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {upcomingRecords.map((record) => (
            <Link
              key={record.id}
              href={`/records/${record.id}`}
              className="block rounded-3xl border border-slate-100 bg-slate-50 p-4 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                  {formatDate(record.date)}
                </span>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                  {statusLabel(record.status ?? "planned")}
                </span>
              </div>

              <p className="mt-3 text-base font-bold text-slate-900">
                {record.title}
              </p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-pink-500">
                  {categoryLabel(record.category)}
                </span>

                {record.imageIds.length > 0 ? (
                  <span className="text-xs font-bold text-slate-400">
                    画像 {record.imageIds.length}枚
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
