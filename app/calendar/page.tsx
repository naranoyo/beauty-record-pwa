// app/calendar/page.tsx

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import CalendarMonth from "@/components/calendar/CalendarMonth";
import PageContainer from "@/components/layout/PageContainer";
import RecordForm from "@/components/records/RecordForm";
import RecordSummaryCard from "@/components/records/RecordSummaryCard";
import { useAppState } from "@/lib/state";
import { APP_TEXT } from "@/lib/constants";
import type {
  BeautyRecord,
  RecordFormValues,
  ReminderSetting,
} from "@/lib/types";

type CalendarViewMode = "year" | "month" | "week" | "day";

const DEFAULT_REMINDERS: ReminderSetting[] = [
  {
    amount: 1,
    unit: "日",
    time: "09:00",
  },
];

function createId() {
  return `record_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

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

function addOneHour(time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return "10:00";
  }

  const nextHour = Math.min(hour + 1, 23);
  return `${String(nextHour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}`;
}

export default function CalendarPage() {
  const { state, addRecord, updateRecord } = useAppState();

  const todayKey = toDateKey(new Date());

  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(todayKey);
  const [modalStartTime, setModalStartTime] = useState("09:00");
  const [modalEndTime, setModalEndTime] = useState("10:00");

  const [message, setMessage] = useState("");

  const selectedRecords = useMemo(() => {
    return state.records.filter((record) => record.date === selectedDate);
  }, [state.records, selectedDate]);

  const showMessage = (text: string) => {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  const openAddModal = (date: string, startTime = "09:00") => {
    setSelectedDate(date);
    setModalDate(date);
    setModalStartTime(startTime);
    setModalEndTime(addOneHour(startTime));
    setIsModalOpen(true);
  };

  const openDayView = (date: string) => {
    setSelectedDate(date);
    setViewMode("day");
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (values: RecordFormValues) => {
    const now = new Date().toISOString();

    const newRecord: BeautyRecord = {
      id: createId(),
      date: values.date,
      time: values.startTime,
      startTime: values.startTime,
      endTime: values.endTime,
      category: values.category,
      title: values.title,
      memo: values.memo,
      imageIds: values.imageIds,
      status: values.status,

      reminderEnabled: values.reminderEnabled,
      reminders: values.reminderEnabled ? values.reminders : [],
      reminderMinutes: undefined,

      createdAt: now,
      updatedAt: now,
    };

    addRecord(newRecord);
    setSelectedDate(values.date);
    setIsModalOpen(false);
    showMessage("スケジュールを保存しました");
  };

  return (
    <>
      <PageContainer>
        <CalendarMonth
          records={state.records}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onDateClick={openAddModal}
          onOpenDayView={openDayView}
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

            <button
              type="button"
              onClick={() => openAddModal(selectedDate)}
              className="inline-flex rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white! shadow-sm active:scale-[0.98]"
            >
              {APP_TEXT.scheduleAddButton}
            </button>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  スケジュール追加
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {formatDateLabel(modalDate)} {modalStartTime}〜
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddModal}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 active:scale-95"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            <RecordForm
              initialValues={{
                date: modalDate,
                time: modalStartTime,
                startTime: modalStartTime,
                endTime: modalEndTime,
                status: "planned",
                reminderEnabled: true,
                reminders: DEFAULT_REMINDERS,
              }}
              submitLabel={APP_TEXT.scheduleSaveButton}
              onSubmit={handleSubmit}
            />

            <div className="mt-3">
              <Link
                href={`/records/new?date=${modalDate}`}
                className="block rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-bold text-slate-700 shadow-sm active:scale-[0.98]"
              >
                通常画面で追加する
              </Link>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed bottom-20 left-1/2 z-9999 -translate-x-1/2 rounded-xl bg-black/80 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {message}
        </div>
      )}
    </>
  );
}
