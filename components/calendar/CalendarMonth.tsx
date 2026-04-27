// components/calendar/CalendarMonth.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import type { BeautyRecord, RecordCategory } from "@/lib/types";
import { getHolidayName } from "@/lib/calendar-holidays";
import { getCategoryDotStyle } from "@/lib/category-colors";
import { getImagesByIds } from "@/lib/image-storage";

type CalendarViewMode = "day" | "week" | "month" | "year";

type Props = {
  records: BeautyRecord[];
  selectedDate: string;
  displayDate: Date;
  onSelectDate: (dateKey: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getWeekStart(date: Date) {
  return addDays(date, -date.getDay());
}

export default function CalendarMonth({
  records,
  selectedDate,
  displayDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const monthDays = useMemo(() => {
    const firstDate = new Date(year, month, 1);
    const startDate = addDays(firstDate, -firstDate.getDay());

    return Array.from({ length: 42 }, (_, index) => addDays(startDate, index));
  }, [year, month]);

  const weekDays = useMemo(() => {
    const selected = new Date(`${selectedDate}T00:00:00`);
    const startDate = getWeekStart(selected);

    return Array.from({ length: 7 }, (_, index) => addDays(startDate, index));
  }, [selectedDate]);

  const selectedDateObject = new Date(`${selectedDate}T00:00:00`);

  return (
    <section className="rounded-4xl border border-pink-100 bg-white p-5 shadow-sm">
      <div className="mb-5 grid grid-cols-4 gap-2 rounded-3xl bg-slate-100 p-1">
        {[
          { key: "day", label: "日" },
          { key: "week", label: "週" },
          { key: "month", label: "月" },
          { key: "year", label: "年" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setViewMode(item.key as CalendarViewMode)}
            className={[
              "rounded-2xl px-3 py-2 text-sm font-bold transition",
              viewMode === item.key
                ? "bg-white text-pink-600 shadow-sm"
                : "text-slate-500",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-8 flex items-center justify-center gap-10">
        <button
          type="button"
          onClick={onPrevMonth}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-slate-100 active:scale-95"
        >
          <span className="text-3xl font-bold text-slate-700">‹</span>
        </button>

        <h2 className="min-w-40 text-center text-2xl font-bold text-slate-950">
          {viewMode === "year" ? `${year}年` : `${year}年${month + 1}月`}
        </h2>

        <button
          type="button"
          onClick={onNextMonth}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-slate-100 active:scale-95"
        >
          <span className="text-3xl font-bold text-slate-700">›</span>
        </button>
      </div>

      {viewMode === "month" ? (
        <CalendarGrid
          days={monthDays}
          records={records}
          selectedDate={selectedDate}
          displayMonth={month}
          onSelectDate={onSelectDate}
        />
      ) : null}

      {viewMode === "week" ? (
        <CalendarGrid
          days={weekDays}
          records={records}
          selectedDate={selectedDate}
          displayMonth={month}
          onSelectDate={onSelectDate}
        />
      ) : null}

      {viewMode === "day" ? (
        <div className="grid gap-2">
          <CalendarCell
            date={selectedDateObject}
            records={records.filter((record) => record.date === selectedDate)}
            active
            currentMonth
            onClick={() => onSelectDate(selectedDate)}
          />
        </div>
      ) : null}

      {viewMode === "year" ? (
        <YearCalendarView
          year={year}
          records={records}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
      ) : null}
    </section>
  );
}

function CalendarGrid({
  days,
  records,
  selectedDate,
  displayMonth,
  onSelectDate,
}: {
  days: Date[];
  records: BeautyRecord[];
  selectedDate: string;
  displayMonth: number;
  onSelectDate: (dateKey: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {["日", "月", "火", "水", "木", "金", "土"].map((week, index) => (
        <div
          key={week}
          className={[
            "pb-3 text-center text-sm font-bold",
            index === 0 ? "text-red-500" : "",
            index === 6 ? "text-blue-500" : "",
            index !== 0 && index !== 6 ? "text-slate-500" : "",
          ].join(" ")}
        >
          {week}
        </div>
      ))}

      {days.map((date) => {
        const dateKey = toDateKey(date);
        const dayRecords = records.filter((record) => record.date === dateKey);

        return (
          <CalendarCell
            key={dateKey}
            date={date}
            records={dayRecords}
            active={selectedDate === dateKey}
            currentMonth={date.getMonth() === displayMonth}
            onClick={() => onSelectDate(dateKey)}
          />
        );
      })}
    </div>
  );
}

function CalendarCell({
  date,
  records,
  active,
  currentMonth,
  onClick,
}: {
  date: Date;
  records: BeautyRecord[];
  active: boolean;
  currentMonth: boolean;
  onClick: () => void;
}) {
  const [bgImage, setBgImage] = useState<string | null>(null);

  const dateKey = toDateKey(date);
  const holidayName = getHolidayName(dateKey);
  const day = date.getDay();

  const categories = Array.from(
    new Set(records.map((record) => record.category))
  ) as RecordCategory[];

  const firstImageId = records.find((record) => record.imageIds.length > 0)
    ?.imageIds[0];

  useEffect(() => {
    let activeFlag = true;

    const run = async () => {
      if (!firstImageId) {
        setBgImage(null);
        return;
      }

      try {
        const images = await getImagesByIds([firstImageId]);
        if (!activeFlag) return;

        setBgImage(images[0]?.dataUrl ?? null);
      } catch {
        if (!activeFlag) return;
        setBgImage(null);
      }
    };

    run();

    return () => {
      activeFlag = false;
    };
  }, [firstImageId]);

  return (
    <button
      type="button"
      onClick={onClick}
      title={holidayName ?? undefined}
      className={[
        "relative min-h-28 overflow-hidden rounded-2xl border p-3 text-left transition active:scale-[0.98]",
        active
          ? "border-pink-400 bg-pink-50 shadow-sm"
          : "border-slate-200 bg-white",
        !currentMonth ? "opacity-40" : "",
        currentMonth && day === 0 ? "bg-red-50" : "",
        currentMonth && day === 6 ? "bg-blue-50" : "",
      ].join(" ")}
    >
      {bgImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      ) : null}

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-1">
          <span
            className={[
              "text-base font-bold",
              day === 0 || holidayName ? "text-red-500" : "",
              day === 6 ? "text-blue-500" : "",
              day !== 0 && day !== 6 && !holidayName ? "text-slate-950" : "",
            ].join(" ")}
          >
            {date.getDate()}
          </span>

          {records.length > 0 ? (
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-700 shadow-sm">
              {records.length}
            </span>
          ) : null}
        </div>

        {holidayName ? (
          <p className="mt-1 truncate text-[10px] font-bold text-red-500">
            {holidayName}
          </p>
        ) : null}

        {categories.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1">
            {categories.slice(0, 5).map((category) => (
              <span
                key={category}
                className="h-3 w-3 rounded-full"
                style={getCategoryDotStyle(category)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </button>
  );
}

function YearCalendarView({
  year,
  records,
  selectedDate,
  onSelectDate,
}: {
  year: number;
  records: BeautyRecord[];
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }, (_, monthIndex) => (
        <MiniMonth
          key={monthIndex}
          year={year}
          month={monthIndex}
          records={records}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
      ))}
    </div>
  );
}

function MiniMonth({
  year,
  month,
  records,
  selectedDate,
  onSelectDate,
}: {
  year: number;
  month: number;
  records: BeautyRecord[];
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}) {
  const firstDate = new Date(year, month, 1);
  const startDate = addDays(firstDate, -firstDate.getDay());

  const days = Array.from({ length: 42 }, (_, index) =>
    addDays(startDate, index)
  );

  const todayKey = toDateKey(new Date());

  return (
    <div>
      <h3 className="mb-3 text-lg font-bold text-slate-900">{month + 1}月</h3>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["日", "月", "火", "水", "木", "金", "土"].map((week, index) => (
          <div
            key={week}
            className={[
              "text-xs font-bold",
              index === 0 ? "text-red-500" : "",
              index === 6 ? "text-blue-500" : "",
              index !== 0 && index !== 6 ? "text-slate-500" : "",
            ].join(" ")}
          >
            {week}
          </div>
        ))}

        {days.map((date) => {
          const dateKey = toDateKey(date);
          const currentMonth = date.getMonth() === month;

          const dayRecords = records.filter(
            (record) => record.date === dateKey
          );

          const isSelected = selectedDate === dateKey;
          const isToday = todayKey === dateKey;
          const isSunday = date.getDay() === 0;
          const isSaturday = date.getDay() === 6;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(dateKey)}
              className={[
                "relative flex h-8 items-center justify-center rounded-full text-xs font-bold transition active:scale-95",
                !currentMonth ? "opacity-20" : "",
                isSelected ? "bg-pink-500 text-white!" : "",
                !isSelected && isToday ? "bg-emerald-500 text-white!" : "",
                !isSelected && !isToday && isSunday ? "text-red-500" : "",
                !isSelected && !isToday && isSaturday ? "text-blue-500" : "",
                !isSelected && !isToday && !isSunday && !isSaturday
                  ? "text-slate-800"
                  : "",
              ].join(" ")}
            >
              {date.getDate()}

              {dayRecords.length > 0 ? (
                <span
                  className={[
                    "absolute bottom-0 h-1 w-1 rounded-full",
                    isSelected ? "bg-white" : "bg-pink-500",
                  ].join(" ")}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
