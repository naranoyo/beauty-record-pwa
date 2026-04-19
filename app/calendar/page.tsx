// app/calendar/page.tsx

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import CalendarMonth from "@/components/calendar/CalendarMonth";
import { useAppState } from "@/lib/state";

function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatSelectedDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

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

export default function CalendarPage() {
  const { state } = useAppState();

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(() =>
    toDateString(new Date())
  );

  const selectedRecords = useMemo(() => {
    return state.records.filter((record) => record.date === selectedDate);
  }, [state.records, selectedDate]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
    });
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <section className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">カレンダー</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            日付ごとの記録を確認できます。記録がある日は件数が表示されます。
          </p>
        </section>

        <div className="relative z-10">
          <CalendarMonth
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            records={state.records}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onSelectDate={setSelectedDate}
          />
        </div>

        <section className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900">
              {formatSelectedDate(selectedDate)}
            </h2>

            <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-600">
              {selectedRecords.length}件
            </span>
          </div>

          {!state.initialized ? (
            <p className="mt-4 text-sm text-slate-500">読み込み中...</p>
          ) : selectedRecords.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm leading-7 text-slate-600">
                この日の記録はまだありません。
              </p>

              <Link
                href={`/records/new?date=${selectedDate}`}
                className="mt-4 inline-flex rounded-2xl bg-pink-500 px-4 py-3 text-sm font-medium !text-white"
              >
                記録を追加する
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {selectedRecords.map((record) => (
                <Link
                  key={record.id}
                  href={`/records/${record.id}`}
                  className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-pink-200 hover:bg-pink-50"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-700">
                      {categoryLabel(record.category)}
                    </span>

                    {record.imageIds.length > 0 ? (
                      <span className="rounded-full bg-pink-100 px-3 py-1 text-[11px] font-medium text-pink-600">
                        画像 {record.imageIds.length}件
                      </span>
                    ) : null}
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
      </div>
    </PageContainer>
  );
}
