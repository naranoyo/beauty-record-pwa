// app/calendar/page.tsx

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import CalendarMonth from "@/components/calendar/CalendarMonth";
import PageContainer from "@/components/layout/PageContainer";
import RecordSummaryCard from "@/components/records/RecordSummaryCard";
import { useAppState } from "@/lib/state";
import { APP_TEXT } from "@/lib/constants";

type CalendarViewMode = "year" | "month" | "week" | "day";

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateLabel(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);
  const week = ["日", "月", "火", "水", "木", "金", "土"];

  return `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日(${week[date.getDay()]})`;
}

export default function CalendarPage() {
  const { state, updateRecord } = useAppState();
  const today = new Date();
  const todayKey = toDateKey(today);

  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

  const selectedRecords = useMemo(() => {
    return state.records.filter((record) => record.date === selectedDate);
  }, [state.records, selectedDate]);

  return (
    <PageContainer>
      <CalendarMonth
        records={state.records}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />

      <section className="mt-6 rounded-4xl border border-pink-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-950">
              {formatDateLabel(selectedDate)}
            </h2>

            <span className="rounded-full bg-pink-100 px-4 py-1 text-sm font-bold text-pink-600">
              {selectedRecords.length}件
            </span>
          </div>

          <Link
            href={`/records/new?date=${selectedDate}`}
            className="inline-flex rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white! shadow-sm active:scale-[0.98]"
          >
            {APP_TEXT.scheduleAddButton}
          </Link>
        </div>

        {selectedRecords.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-6 text-center text-sm text-slate-500">
            この日のスケジュールはありません。
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="space-y-3">
              {selectedRecords.map((record) => (
                <RecordSummaryCard
                  key={record.id}
                  record={record}
                  allRecords={state.records}
                  showActions
                  onDone={(target) =>
                    updateRecord({
                      ...target,
                      status: "done",
                    })
                  }
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </PageContainer>
  );
}
