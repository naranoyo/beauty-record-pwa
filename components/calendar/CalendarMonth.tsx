// components/calendar/CalendarMonth.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BeautyRecord } from "@/lib/types";
import { getCategoryColor } from "@/lib/category-colors";
import { getImagesByIds } from "@/lib/image-storage";
import { getHolidayName } from "@/lib/calendar-holidays";
import { APP_TEXT } from "@/lib/constants";

type CalendarViewMode = "day" | "week" | "month" | "year";

type Props = {
  records: BeautyRecord[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  viewMode: CalendarViewMode;
  onChangeViewMode: (mode: CalendarViewMode) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatHour(hour: number) {
  if (hour === 0) return "午前0時";
  if (hour < 12) return `午前${hour}時`;
  if (hour === 12) return "午後12時";
  return `午後${hour - 12}時`;
}

function getStartHour(record: BeautyRecord) {
  const hour = Number((record.time ?? "09:00").split(":")[0]);
  return Number.isFinite(hour) ? hour : 9;
}

function getStartMinute(record: BeautyRecord) {
  const minute = Number((record.time ?? "09:00").split(":")[1]);
  return Number.isFinite(minute) ? minute : 0;
}

export default function CalendarMonth({
  records,
  selectedDate,
  onSelectDate,
  viewMode,
  onChangeViewMode,
}: Props) {
  const [bgMap, setBgMap] = useState<Record<string, string>>({});

  const selected = new Date(`${selectedDate}T00:00:00`);
  const year = selected.getFullYear();
  const month = selected.getMonth();

  useEffect(() => {
    const loadImages = async () => {
      const map: Record<string, string> = {};

      for (const record of records) {
        if (record.imageIds.length > 0 && !map[record.date]) {
          const images = await getImagesByIds(record.imageIds);
          if (images[0]) map[record.date] = images[0].dataUrl;
        }
      }

      setBgMap(map);
    };

    loadImages();
  }, [records]);

  const moveDate = (amount: number) => {
    const next = new Date(`${selectedDate}T00:00:00`);

    if (viewMode === "day") next.setDate(next.getDate() + amount);
    if (viewMode === "week") next.setDate(next.getDate() + amount * 7);
    if (viewMode === "month") next.setMonth(next.getMonth() + amount);
    if (viewMode === "year") next.setFullYear(next.getFullYear() + amount);

    onSelectDate(toDateKey(next));
  };

  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  const monthDays = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  const weekStart = new Date(selected);
  weekStart.setDate(selected.getDate() - selected.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const weekFirst = weekDays[0];
  const weekLast = weekDays[6];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onSelectDate(toDateKey(new Date()))}
            className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-slate-800 shadow-sm active:scale-[0.98]"
          >
            今日
          </button>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => moveDate(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95"
              aria-label="前へ"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            <h2 className="min-w-45 text-center text-2xl font-medium tracking-tight text-slate-950">
              {viewMode === "year"
                ? `${year}年`
                : viewMode === "month"
                  ? `${year}年 ${month + 1}月`
                  : viewMode === "week"
                    ? weekFirst.getFullYear() === weekLast.getFullYear() &&
                      weekFirst.getMonth() === weekLast.getMonth()
                      ? `${weekFirst.getFullYear()}年 ${weekFirst.getMonth() + 1}月`
                      : `${weekFirst.getFullYear()}年 ${weekFirst.getMonth() + 1}月 ～ ${weekLast.getMonth() + 1}月`
                    : `${year}年 ${month + 1}月 ${selected.getDate()}日`}
            </h2>

            <button
              type="button"
              onClick={() => moveDate(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95"
              aria-label="次へ"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="m8.59 16.59 1.41 1.41L16 12 10 6 8.59 7.41 13.17 12z" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-xs font-medium text-slate-500">
          Googleカレンダー風のスケジュール表示
        </p>
      </div>

      <div className="grid grid-cols-4 rounded-2xl bg-slate-100 p-1">
        {(["day", "week", "month", "year"] as CalendarViewMode[]).map(
          (mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onChangeViewMode(mode)}
              className={[
                "rounded-xl py-2 text-sm font-bold",
                viewMode === mode
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-slate-500",
              ].join(" ")}
            >
              {mode === "day" && "日"}
              {mode === "week" && "週"}
              {mode === "month" && "月"}
              {mode === "year" && "年"}
            </button>
          )
        )}
      </div>

      {viewMode === "day" ? (
        <DayView records={records} selectedDate={selectedDate} bgMap={bgMap} />
      ) : viewMode === "week" ? (
        <WeekView
          records={records}
          selectedDate={selectedDate}
          weekDays={weekDays}
        />
      ) : viewMode === "year" ? (
        <YearView
          year={year}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onChangeViewMode={onChangeViewMode}
        />
      ) : (
        <CalendarGrid
          days={monthDays}
          records={records}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          currentMonth={month}
          bgMap={bgMap}
        />
      )}

      <Link
        href={`/records/new?date=${selectedDate}`}
        className="block rounded-2xl bg-pink-500 py-3 text-center text-sm font-bold text-white! shadow-sm active:scale-[0.98]"
      >
        {APP_TEXT.scheduleAddButton}
      </Link>
    </div>
  );
}

function DayView({
  records,
  selectedDate,
}: {
  records: BeautyRecord[];
  selectedDate: string;
  bgMap: Record<string, string>;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {HOURS.map((hour) => {
        const hourRecords = records.filter(
          (record) =>
            record.date === selectedDate && getStartHour(record) === hour
        );

        return (
          <div
            key={hour}
            className="grid min-h-18 grid-cols-[72px_1fr] border-b border-slate-100"
          >
            <div className="border-r border-slate-100 px-2 pt-2 text-right text-xs font-bold text-slate-500">
              {formatHour(hour)}
            </div>

            <div className="bg-pink-50/30 p-2">
              {hourRecords.map((record) => (
                <Link
                  key={record.id}
                  href={`/records/${record.id}`}
                  className="mb-1 block rounded-xl px-3 py-2 text-xs font-bold text-white!"
                  style={{
                    backgroundColor: getCategoryColor(record.category),
                  }}
                >
                  {record.title}
                  <br />
                  {record.time ?? "09:00"}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WeekView({
  records,
  selectedDate,
  weekDays,
}: {
  records: BeautyRecord[];
  selectedDate: string;
  weekDays: Date[];
}) {
  const hourHeight = 72;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-slate-100">
        <div className="flex items-end justify-center bg-white pb-3 text-[11px] font-bold text-slate-500">
          GMT+09
        </div>

        {weekDays.map((date) => {
          const dateKey = toDateKey(date);
          const day = date.getDay();
          const holiday = getHolidayName(dateKey);
          const isSelected = dateKey === selectedDate;

          return (
            <button
              key={dateKey}
              type="button"
              className={[
                "min-h-20 border-l border-slate-100 p-2 text-center",
                day === 0 || holiday
                  ? "bg-red-50/50"
                  : day === 6
                    ? "bg-blue-50/50"
                    : isSelected
                      ? "bg-green-50"
                      : "bg-white",
              ].join(" ")}
            >
              <div
                className={[
                  "text-xs font-bold",
                  day === 0 || holiday
                    ? "text-red-500"
                    : day === 6
                      ? "text-blue-500"
                      : "text-slate-600",
                ].join(" ")}
              >
                {["日", "月", "火", "水", "木", "金", "土"][day]}
              </div>

              <div
                className={[
                  "mx-auto mt-1 flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold",
                  isSelected
                    ? "bg-green-500 text-white!"
                    : day === 0 || holiday
                      ? "text-red-500"
                      : day === 6
                        ? "text-blue-500"
                        : "text-slate-900",
                ].join(" ")}
              >
                {date.getDate()}
              </div>

              {holiday ? (
                <div className="mt-1 truncate rounded-md bg-emerald-600 px-1 py-1 text-[10px] font-bold text-white!">
                  {holiday}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="relative grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
        <div>
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="h-18 border-b border-slate-100 px-2 pt-2 text-right text-xs font-bold text-slate-500"
            >
              {formatHour(hour)}
            </div>
          ))}
        </div>

        {weekDays.map((date) => {
          const dateKey = toDateKey(date);
          const day = date.getDay();
          const holiday = getHolidayName(dateKey);

          const dayRecords = records.filter(
            (record) => record.date === dateKey
          );

          return (
            <div
              key={dateKey}
              className={[
                "relative border-l border-slate-100",
                day === 0 || holiday
                  ? "bg-red-50/30"
                  : day === 6
                    ? "bg-blue-50/40"
                    : dateKey === selectedDate
                      ? "bg-green-50/40"
                      : "bg-white",
              ].join(" ")}
              style={{ height: `${hourHeight * 24}px` }}
            >
              {HOURS.map((hour) => (
                <div key={hour} className="h-18 border-b border-slate-100" />
              ))}

              {dayRecords.map((record) => {
                const hour = getStartHour(record);
                const minute = getStartMinute(record);
                const top = hour * hourHeight + (minute / 60) * hourHeight;

                return (
                  <Link
                    key={record.id}
                    href={`/records/${record.id}`}
                    className="absolute left-1 right-1 z-10 rounded-lg px-2 py-1 text-[11px] font-bold text-white! shadow-sm"
                    style={{
                      top: `${top + 4}px`,
                      minHeight: "42px",
                      backgroundColor: getCategoryColor(record.category),
                    }}
                  >
                    <span className="line-clamp-1">{record.title}</span>
                    <span className="line-clamp-1 text-[10px]">
                      {record.time ?? "09:00"}
                    </span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarGrid({
  days,
  records,
  selectedDate,
  onSelectDate,
  currentMonth,
  bgMap,
}: {
  days: Date[];
  records: BeautyRecord[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  currentMonth: number;
  bgMap: Record<string, string>;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 text-center text-xs font-bold">
        {["日", "月", "火", "水", "木", "金", "土"].map((day, i) => (
          <div
            key={day}
            className={[
              "py-2",
              i === 0
                ? "text-red-500"
                : i === 6
                  ? "text-blue-500"
                  : "text-slate-500",
            ].join(" ")}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((date) => {
          const dateKey = toDateKey(date);
          const dayRecords = records.filter(
            (record) => record.date === dateKey
          );
          const isSelected = dateKey === selectedDate;
          const isCurrentMonth = date.getMonth() === currentMonth;
          const day = date.getDay();
          const holiday = getHolidayName(dateKey);

          const dateColor =
            day === 0 || holiday
              ? "text-red-500"
              : day === 6
                ? "text-blue-500"
                : "text-slate-900";

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(dateKey)}
              className={[
                "relative min-h-24 border-r border-b border-slate-100 p-2 text-left",
                isSelected ? "bg-pink-50" : "bg-white",
                !isCurrentMonth ? "opacity-45" : "",
              ].join(" ")}
            >
              {bgMap[dateKey] ? (
                <div
                  className="absolute inset-1 rounded-2xl bg-cover bg-center opacity-25"
                  style={{ backgroundImage: `url(${bgMap[dateKey]})` }}
                />
              ) : null}

              <div
                className={[
                  "relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold",
                  isSelected ? "bg-pink-500 text-white!" : dateColor,
                ].join(" ")}
              >
                {date.getDate()}
              </div>

              {holiday ? (
                <div className="relative z-10 mt-1 truncate text-[10px] font-bold text-red-400">
                  {holiday}
                </div>
              ) : null}

              <div className="relative z-10 mt-2 flex flex-wrap gap-1">
                {dayRecords.slice(0, 5).map((record) => (
                  <span
                    key={record.id}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: getCategoryColor(record.category),
                    }}
                  />
                ))}

                {dayRecords.length > 5 ? (
                  <span className="text-[10px] font-bold text-slate-500">
                    +{dayRecords.length - 5}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function YearView({
  year,
  selectedDate,
  onSelectDate,
  onChangeViewMode,
}: {
  year: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onChangeViewMode: (mode: CalendarViewMode) => void;
}) {
  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }, (_, monthIndex) => (
          <MiniMonth
            key={monthIndex}
            year={year}
            month={monthIndex}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            onChangeViewMode={onChangeViewMode}
          />
        ))}
      </div>
    </div>
  );
}

function MiniMonth({
  year,
  month,
  selectedDate,
  onSelectDate,
  onChangeViewMode,
}: {
  year: number;
  month: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onChangeViewMode: (mode: CalendarViewMode) => void;
}) {
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          onSelectDate(toDateKey(new Date(year, month, 1)));
          onChangeViewMode("month");
        }}
        className="mb-3 text-left text-xl font-bold text-slate-950"
      >
        {month + 1}月
      </button>

      <div className="grid grid-cols-7 gap-y-2 text-center text-sm font-bold">
        {["日", "月", "火", "水", "木", "金", "土"].map((day, i) => (
          <div
            key={day}
            className={
              i === 0
                ? "text-red-500"
                : i === 6
                  ? "text-blue-500"
                  : "text-slate-500"
            }
          >
            {day}
          </div>
        ))}

        {days.map((date) => {
          const dateKey = toDateKey(date);
          const isCurrentMonth = date.getMonth() === month;
          const isSelected = dateKey === selectedDate;
          const day = date.getDay();
          const holiday = getHolidayName(dateKey);

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => {
                onSelectDate(dateKey);
                onChangeViewMode("day");
              }}
              className={[
                "mx-auto flex h-7 w-7 items-center justify-center rounded-full text-sm",
                isSelected ? "bg-pink-300 text-white!" : "",
                !isCurrentMonth ? "opacity-25" : "",
                day === 0 || holiday
                  ? "text-red-500"
                  : day === 6
                    ? "text-blue-500"
                    : "text-slate-900",
              ].join(" ")}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
