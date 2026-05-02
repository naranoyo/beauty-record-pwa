// components/records/RecordForm.tsx

"use client";

import { useMemo, useState } from "react";
import type { RecordFormValues, ReminderSetting } from "@/lib/types";
import { getAllCategories, getCategoryLabel } from "@/lib/category-colors";
import RecordImageUploader from "@/components/records/RecordImageUploader";
import RecordImagePreview from "@/components/records/RecordImagePreview";
import ReminderField from "@/components/records/ReminderField";

type Props = {
  initialValues?: Partial<RecordFormValues>;
  submitLabel?: string;
  onSubmit: (values: RecordFormValues) => void;
};

const DEFAULT_REMINDERS: ReminderSetting[] = [
  {
    amount: 1,
    unit: "日",
    time: "09:00",
  },
];

function getTodayKey() {
  const date = new Date();
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function convertOldReminderMinutes(minutes?: number[]): ReminderSetting[] {
  if (!minutes || minutes.length === 0) return DEFAULT_REMINDERS;

  return minutes.map((minute) => {
    if (minute % 10080 === 0) {
      return {
        amount: minute / 10080,
        unit: "週",
        time: "09:00",
      };
    }

    if (minute % 1440 === 0) {
      return {
        amount: minute / 1440,
        unit: "日",
        time: "09:00",
      };
    }

    if (minute % 60 === 0) {
      return {
        amount: minute / 60,
        unit: "時間",
      };
    }

    return {
      amount: minute,
      unit: "分",
    };
  });
}

export default function RecordForm({
  initialValues,
  submitLabel = "保存",
  onSubmit,
}: Props) {
  const categories = useMemo(() => getAllCategories(), []);

  const [form, setForm] = useState<RecordFormValues>({
    date: initialValues?.date ?? getTodayKey(),
    time: initialValues?.time ?? initialValues?.startTime ?? "09:00",
    startTime: initialValues?.startTime ?? initialValues?.time ?? "09:00",
    endTime: initialValues?.endTime ?? "10:00",
    category: initialValues?.category ?? "epilation",
    title: initialValues?.title ?? "",
    memo: initialValues?.memo ?? "",
    imageIds: initialValues?.imageIds ?? [],
    status: initialValues?.status ?? "planned",
    reminderEnabled: initialValues?.reminderEnabled ?? true,
    reminders:
      initialValues?.reminders ??
      convertOldReminderMinutes(initialValues?.reminderMinutes),
  });

  const duration = useMemo(() => {
    const [sh, sm] = form.startTime.split(":").map(Number);
    const [eh, em] = form.endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
    if (end <= start) return 0;

    return end - start;
  }, [form.startTime, form.endTime]);

  const durationLabel =
    duration > 0 ? `${Math.floor(duration / 60)}時間${duration % 60}分` : "-";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        onSubmit({
          ...form,
          title: form.title.trim() || "タイトルなし",
          time: form.startTime,
          reminders: form.reminderEnabled ? form.reminders : [],
          reminderMinutes: undefined,
        });
      }}
      className="space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-700">日付</span>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">開始</span>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  startTime: e.target.value,
                  time: e.target.value,
                })
              }
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">終了</span>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400"
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl bg-pink-50 px-4 py-3 text-sm font-bold text-pink-600">
        使用時間：{durationLabel}
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-slate-700">カテゴリ</span>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-pink-400"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {getCategoryLabel(category)}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-slate-700">タイトル</span>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400"
          placeholder="例：脱毛、髪型、トレーニングなど"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-slate-700">メモ</span>
        <textarea
          value={form.memo}
          onChange={(e) => setForm({ ...form, memo: e.target.value })}
          rows={5}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400"
          placeholder="メモを入力"
        />
      </label>

      <ReminderField
        enabled={form.reminderEnabled}
        reminders={form.reminders}
        onChangeEnabled={(reminderEnabled) =>
          setForm({
            ...form,
            reminderEnabled,
            reminders:
              reminderEnabled && form.reminders.length === 0
                ? DEFAULT_REMINDERS
                : form.reminders,
          })
        }
        onChangeReminders={(reminders) => setForm({ ...form, reminders })}
      />

      <div className="grid gap-3">
        <span className="text-sm font-bold text-slate-700">画像</span>

        <RecordImageUploader
          imageIds={form.imageIds}
          onChange={(imageIds) => setForm({ ...form, imageIds })}
        />

        <RecordImagePreview
          imageIds={form.imageIds}
          editable
          onChange={(imageIds) => setForm({ ...form, imageIds })}
        />
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-bold text-slate-700">状態</span>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, status: "planned" })}
            className={[
              "rounded-2xl px-4 py-3 text-sm font-bold",
              form.status === "planned"
                ? "bg-yellow-400 text-white!"
                : "bg-slate-100 text-slate-700",
            ].join(" ")}
          >
            予定
          </button>

          <button
            type="button"
            onClick={() => setForm({ ...form, status: "done" })}
            className={[
              "rounded-2xl px-4 py-3 text-sm font-bold",
              form.status === "done"
                ? "bg-emerald-500 text-white!"
                : "bg-slate-100 text-slate-700",
            ].join(" ")}
          >
            完了
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white! shadow-sm active:scale-[0.98]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
