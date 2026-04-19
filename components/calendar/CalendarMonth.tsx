// components/calendar/CalendarMonth.tsx

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BeautyRecord } from "@/lib/types";
import { getImagesByIds } from "@/lib/image-storage";
import LinkButton from "@/components/ui/LinkButton";

type Props = {
  currentMonth: Date;
  selectedDate: string;
  records: BeautyRecord[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: string) => void;
};

const WEEK_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

const CATEGORY_COLOR: Record<string, string> = {
  epilation: "bg-pink-400",
  hair: "bg-purple-400",
  diet: "bg-blue-400",
  nail: "bg-yellow-400",
  skin: "bg-green-400",
  memo: "bg-slate-400",
  other: "bg-slate-400",
};

function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildCalendarDays(currentMonth: Date) {
  const first = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const last = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  const end = new Date(last);
  end.setDate(last.getDate() + (6 - last.getDay()));

  const days: Date[] = [];
  const cur = new Date(start);

  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  return days;
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
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

export default function CalendarMonth({
  currentMonth,
  selectedDate,
  records,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: Props) {
  const router = useRouter();
  const days = useMemo(() => buildCalendarDays(currentMonth), [currentMonth]);
  const today = toDateString(new Date());

  const recordMap = useMemo(() => {
    return records.reduce<Record<string, BeautyRecord[]>>((acc, r) => {
      if (!acc[r.date]) acc[r.date] = [];
      acc[r.date].push(r);
      return acc;
    }, {});
  }, [records]);

  const [thumbMap, setThumbMap] = useState<Record<string, string>>({});
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const map: Record<string, string> = {};

      for (const date of Object.keys(recordMap)) {
        const recs = recordMap[date];
        const target = recs.find((r) => r.imageIds?.length > 0);
        if (!target) continue;

        try {
          const imgs = await getImagesByIds(target.imageIds);
          if (imgs[0]?.dataUrl) {
            map[date] = imgs[0].dataUrl;
          }
        } catch {
          // 読み込み失敗時は無視
        }
      }

      if (alive) {
        setThumbMap(map);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [recordMap]);

  const handleDayClick = (date: string) => {
    onSelectDate(date);

    const dayRecords = recordMap[date] ?? [];

    if (dayRecords.length === 1) {
      router.push(`/records/${dayRecords[0].id}`);
      return;
    }

    if (dayRecords.length >= 2) {
      setExpandedDate(date);
      return;
    }

    setExpandedDate(null);
  };

  const expandedRecords = expandedDate ? (recordMap[expandedDate] ?? []) : [];

  return (
    <section className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onPrevMonth}
          className="touch-manipulation rounded-xl bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600 active:scale-[0.98]"
        >
          前月
        </button>

        <h2 className="text-base font-bold text-slate-900">
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
        </h2>

        <button
          type="button"
          onClick={onNextMonth}
          className="touch-manipulation rounded-xl bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600 active:scale-[0.98]"
        >
          次月
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEK_LABELS.map((d) => (
          <div
            key={d}
            className="pb-1 text-center text-[11px] font-medium text-slate-500"
          >
            {d}
          </div>
        ))}

        {days.map((day) => {
          const date = toDateString(day);
          const recs = recordMap[date] ?? [];
          const isToday = date === today;
          const isSelected = date === selectedDate;
          const inCurrentMonth = isSameMonth(day, currentMonth);
          const categories = [...new Set(recs.map((r) => r.category))];
          const isExpanded = expandedDate === date;

          return (
            <button
              key={date}
              type="button"
              onClick={() => handleDayClick(date)}
              className={[
                "touch-manipulation relative min-h-16 overflow-hidden rounded-2xl border p-2 text-left transition active:scale-[0.98]",
                inCurrentMonth
                  ? "border-slate-300 bg-white"
                  : "border-slate-200 bg-slate-50",
                isSelected ? "ring-2 ring-pink-300" : "",
                isExpanded ? "bg-pink-50" : "",
              ].join(" ")}
            >
              {thumbMap[date] ? (
                <div className="pointer-events-none absolute inset-0 opacity-20">
                  <Image
                    src={thumbMap[date]}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="relative z-10 flex items-start justify-between gap-1">
                <span
                  className={[
                    "text-xs font-bold",
                    inCurrentMonth ? "text-slate-900" : "text-slate-400",
                    isToday ? "text-pink-600" : "",
                  ].join(" ")}
                >
                  {day.getDate()}
                </span>

                {recs.length > 0 ? (
                  <span className="text-[10px] font-bold text-slate-700">
                    {recs.length}
                  </span>
                ) : null}
              </div>

              <div className="relative z-10 mt-1.5 flex gap-1">
                {categories.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className={`h-1.5 w-1.5 rounded-full ${
                      CATEGORY_COLOR[c] ?? "bg-slate-300"
                    }`}
                  />
                ))}
              </div>

              {recs.some((r) => r.imageIds?.length > 0) ? (
                <div className="pointer-events-none absolute bottom-1 right-1 text-[10px]">
                  📷
                </div>
              ) : null}

              {isToday ? (
                <div className="relative z-10 mt-1 text-[10px] font-medium text-pink-500">
                  今日
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      {expandedDate && expandedRecords.length >= 2 ? (
        <div className="mt-4 rounded-3xl border border-pink-100 bg-pink-50/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {formatSelectedDate(expandedDate)}
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                この日は複数の記録があります。開きたい記録を選んでください。
              </p>
            </div>

            <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-600">
              {expandedRecords.length}件
            </span>
          </div>

          <div className="space-y-3">
            {expandedRecords.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => router.push(`/records/${record.id}`)}
                className="touch-manipulation block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition active:scale-[0.98]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
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
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <LinkButton href="/records/new">記録を追加する</LinkButton>
      </div>
    </section>
  );
}
