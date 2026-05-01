// components/calendar/CalendarMonth.tsx

"use client";

import { useEffect, useRef, useState } from "react";
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
  onDateClick?: (date: string, startTime?: string) => void;
  onOpenDayView?: (date: string) => void;
};

type BeautyRecordWithLegacyTime = BeautyRecord & {
  time?: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function hourToTime(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function formatHour(hour: number) {
  if (hour === 0) return "午前0時";
  if (hour < 12) return `午前${hour}時`;
  if (hour === 12) return "午後12時";
  return `午後${hour - 12}時`;
}

function getRecordStartTime(record: BeautyRecord) {
  const legacyRecord = record as BeautyRecordWithLegacyTime;
  return record.startTime ?? legacyRecord.time ?? "09:00";
}

function getStartHour(record: BeautyRecord) {
  const hour = Number(getRecordStartTime(record).split(":")[0]);
  return Number.isFinite(hour) ? hour : 9;
}

function getStartMinute(record: BeautyRecord) {
  const minute = Number(getRecordStartTime(record).split(":")[1]);
  return Number.isFinite(minute) ? minute : 0;
}

export default function CalendarMonth({
  records,
  selectedDate,
  onSelectDate,
  viewMode,
  onChangeViewMode,
  onDateClick,
  onOpenDayView,
}: Props) {
  const [bgMap, setBgMap] = useState<Record<string, string>>({});

  const selected = new Date(`${selectedDate}T00:00:00`);
  const year = selected.getFullYear();
  const month = selected.getMonth();

  const openNewRecord = (dateKey: string, startTime = "09:00") => {
    onSelectDate(dateKey);
    onDateClick?.(dateKey, startTime);
  };

  const openDayView = (dateKey: string) => {
    onSelectDate(dateKey);
    onOpenDayView?.(dateKey);
  };

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
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onSelectDate(toDateKey(new Date()))}
            className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-slate-800 shadow-sm active:scale-[0.98]"
          >
            今日
          </button>

          <div className="flex flex-1 items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => moveDate(-1)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm active:scale-95"
              aria-label="前へ"
            >
              ‹
            </button>

            <h2 className="min-w-0 text-center text-2xl font-bold leading-tight tracking-tight text-slate-950">
              {viewMode === "year"
                ? `${year}年`
                : viewMode === "month"
                  ? `${year}年 ${month + 1}月`
                  : viewMode === "week"
                    ? weekFirst.getFullYear() === weekLast.getFullYear() &&
                      weekFirst.getMonth() === weekLast.getMonth()
                      ? `${weekFirst.getFullYear()}年 ${
                          weekFirst.getMonth() + 1
                        }月`
                      : `${weekFirst.getFullYear()}年 ${
                          weekFirst.getMonth() + 1
                        }月〜${weekLast.getMonth() + 1}月`
                    : `${year}年 ${month + 1}月 ${selected.getDate()}日`}
            </h2>

            <button
              type="button"
              onClick={() => moveDate(1)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm active:scale-95"
              aria-label="次へ"
            >
              ›
            </button>
          </div>
        </div>

        <p className="text-xs font-medium text-slate-500">
          日・週は時間マスをタップで追加、月は長押しで日表示に移動します
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
        <DayView
          records={records}
          selectedDate={selectedDate}
          onAddDate={openNewRecord}
        />
      ) : viewMode === "week" ? (
        <WeekView
          records={records}
          selectedDate={selectedDate}
          weekDays={weekDays}
          onSelectDate={onSelectDate}
          onAddDate={openNewRecord}
        />
      ) : viewMode === "year" ? (
        <YearView
          year={year}
          selectedDate={selectedDate}
          onOpenDayView={openDayView}
        />
      ) : (
        <CalendarGrid
          days={monthDays}
          records={records}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onOpenDayView={openDayView}
          currentMonth={month}
          bgMap={bgMap}
        />
      )}

      <button
        type="button"
        onClick={() => openNewRecord(selectedDate, "09:00")}
        className="block w-full rounded-2xl bg-pink-500 py-3 text-center text-sm font-bold text-white! shadow-sm active:scale-[0.98]"
      >
        {APP_TEXT.scheduleAddButton}
      </button>
    </div>
  );
}

function DayView({
  records,
  selectedDate,
  onAddDate,
}: {
  records: BeautyRecord[];
  selectedDate: string;
  onAddDate: (date: string, startTime?: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {HOURS.map((hour) => {
        const startTime = hourToTime(hour);
        const hourRecords = records.filter(
          (record) =>
            record.date === selectedDate && getStartHour(record) === hour
        );

        return (
          <div
            key={hour}
            role="button"
            tabIndex={0}
            onClick={() => onAddDate(selectedDate, startTime)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onAddDate(selectedDate, startTime);
            }}
            className="grid min-h-18 cursor-pointer grid-cols-[72px_1fr] border-b border-slate-100 text-left active:bg-pink-50"
          >
            <div className="border-r border-slate-100 px-2 pt-2 text-right text-xs font-bold text-slate-500">
              {formatHour(hour)}
            </div>

            <div className="min-h-18 bg-pink-50/30 p-2">
              {hourRecords.map((record) => (
                <Link
                  key={record.id}
                  href={`/records/${record.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mb-1 block rounded-xl px-3 py-2 text-xs font-bold text-white!"
                  style={{
                    backgroundColor: getCategoryColor(record.category),
                  }}
                >
                  {record.title}
                  <br />
                  {getRecordStartTime(record)}
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
  onSelectDate,
  onAddDate,
}: {
  records: BeautyRecord[];
  selectedDate: string;
  weekDays: Date[];
  onSelectDate: (date: string) => void;
  onAddDate: (date: string, startTime?: string) => void;
}) {
  const hourHeight = 72;

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="min-w-160">
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
                onClick={() => onSelectDate(dateKey)}
                className={[
                  "min-h-20 border-l border-slate-100 p-2 text-center active:bg-pink-50",
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
                role="button"
                tabIndex={0}
                onClick={() => onSelectDate(dateKey)}
                className={[
                  "relative border-l border-slate-100 text-left",
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
                {HOURS.map((hour) => {
                  const startTime = hourToTime(hour);

                  return (
                    <div
                      key={hour}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddDate(dateKey, startTime);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation();
                          onAddDate(dateKey, startTime);
                        }
                      }}
                      className="h-18 cursor-pointer border-b border-slate-100 active:bg-pink-50"
                    />
                  );
                })}

                {dayRecords.map((record) => {
                  const hour = getStartHour(record);
                  const minute = getStartMinute(record);
                  const top = hour * hourHeight + (minute / 60) * hourHeight;

                  return (
                    <Link
                      key={record.id}
                      href={`/records/${record.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-1 right-1 z-10 rounded-lg px-2 py-1 text-[11px] font-bold text-white! shadow-sm"
                      style={{
                        top: `${top + 4}px`,
                        minHeight: "42px",
                        backgroundColor: getCategoryColor(record.category),
                      }}
                    >
                      <span className="line-clamp-1">{record.title}</span>
                      <span className="line-clamp-1 text-[10px]">
                        {getRecordStartTime(record)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CalendarGrid({
  days,
  records,
  selectedDate,
  onSelectDate,
  onOpenDayView,
  currentMonth,
  bgMap,
}: {
  days: Date[];
  records: BeautyRecord[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenDayView: (date: string) => void;
  currentMonth: number;
  bgMap: Record<string, string>;
}) {
  const longPressTimer = useRef<number | null>(null);

  const clearLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const startLongPress = (dateKey: string) => {
    clearLongPress();

    longPressTimer.current = window.setTimeout(() => {
      onOpenDayView(dateKey);
      longPressTimer.current = null;
    }, 550);
  };

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
              onDoubleClick={() => onOpenDayView(dateKey)}
              onPointerDown={() => startLongPress(dateKey)}
              onPointerUp={clearLongPress}
              onPointerLeave={clearLongPress}
              onPointerCancel={clearLongPress}
              className={[
                "relative min-h-24 touch-manipulation border-r border-b border-slate-100 p-2 text-left active:bg-pink-50",
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
  onOpenDayView,
}: {
  year: number;
  selectedDate: string;
  onOpenDayView: (date: string) => void;
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
            onOpenDayView={onOpenDayView}
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
  onOpenDayView,
}: {
  year: number;
  month: number;
  selectedDate: string;
  onOpenDayView: (date: string) => void;
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
      <h3 className="mb-3 text-left text-xl font-bold text-slate-950">
        {month + 1}月
      </h3>

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
              onClick={() => onOpenDayView(dateKey)}
              className={[
                "mx-auto flex h-7 w-7 items-center justify-center rounded-full text-sm active:bg-pink-100",
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
