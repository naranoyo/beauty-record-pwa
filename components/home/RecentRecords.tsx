// components/home/RecentRecords.tsx

"use client";

import Link from "next/link";
import { useAppState } from "@/lib/state";
import { APP_TEXT } from "@/lib/constants";

function categoryLabel(category: string) {
  switch (category) {
    case "hair":
      return "髪型";
    case "diet":
      return "ダイエット";
    case "epilation":
      return "脱毛";
    case "nail":
      return "ネイル";
    case "skin":
      return "肌";
    case "memo":
      return "メモ";
    default:
      return "その他";
  }
}

export default function RecentRecords() {
  const { state } = useAppState();
  const recent = state.records.slice(0, 3);

  return (
    <section className="rounded-4xl border border-pink-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">
          {APP_TEXT.homeRecentTitle}
        </h2>

        <span className="rounded-full bg-pink-100 px-4 py-2 text-lg font-bold text-pink-600">
          {state.records.length}件
        </span>
      </div>

      {!state.initialized ? (
        <p className="mt-6 text-base text-slate-500">読み込み中...</p>
      ) : recent.length === 0 ? (
        <p className="mt-6 text-base leading-7 text-slate-600">
          {APP_TEXT.homeRecentEmpty}
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {recent.map((record) => (
            <Link
              key={record.id}
              href={`/records/${record.id}`}
              className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-pink-200 hover:bg-pink-50"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                  {categoryLabel(record.category)}
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                  {record.date}
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-900">
                {record.title}
              </p>

              <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {record.memo || "メモはありません。"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
