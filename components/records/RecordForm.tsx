// components/records/RecordForm.tsx

"use client";

import { useState } from "react";
import type { RecordCategory, RecordFormValues } from "@/lib/types";
import { CATEGORY_ITEMS } from "@/lib/category-colors";
import { categoryLabel } from "@/lib/record-utils";
import RecordImageUploader from "@/components/records/RecordImageUploader";
import RecordImagePreview from "@/components/records/RecordImagePreview";

type Props = {
  initialValues?: Partial<RecordFormValues>;
  submitLabel: string;
  onSubmit: (values: RecordFormValues) => void;
};

function getTodayKey() {
  const date = new Date();
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function RecordForm({
  initialValues,
  submitLabel,
  onSubmit,
}: Props) {
  const [date, setDate] = useState(initialValues?.date ?? getTodayKey());

  const [category, setCategory] = useState<RecordCategory>(
    initialValues?.category ?? CATEGORY_ITEMS[0]
  );

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [memo, setMemo] = useState(initialValues?.memo ?? "");
  const [status, setStatus] = useState(initialValues?.status ?? "planned");

  const [imageIds, setImageIds] = useState<string[]>(
    initialValues?.imageIds ?? []
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      title: title.trim() || "タイトルなし",
      date,
      category,
      memo,
      status,
      imageIds,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="grid gap-2">
        <span className="text-sm font-bold text-slate-700">日付</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-slate-700">カテゴリ</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as RecordCategory)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-pink-400"
        >
          {CATEGORY_ITEMS.map((item) => (
            <option key={item} value={item}>
              {categoryLabel(item)}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-slate-700">タイトル</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400"
          placeholder="例：脱毛、髪型、トレーニングなど"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-bold text-slate-700">メモ</span>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={5}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-pink-400"
          placeholder="メモを入力"
        />
      </label>

      <div className="grid gap-3">
        <span className="text-sm font-bold text-slate-700">画像</span>

        <RecordImageUploader imageIds={imageIds} onChange={setImageIds} />

        <RecordImagePreview
          imageIds={imageIds}
          editable
          onChange={setImageIds}
        />
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-bold text-slate-700">状態</span>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setStatus("planned")}
            className={[
              "rounded-2xl px-4 py-3 text-sm font-bold",
              status === "planned"
                ? "bg-yellow-400 text-white!"
                : "bg-slate-100 text-slate-700",
            ].join(" ")}
          >
            予定
          </button>

          <button
            type="button"
            onClick={() => setStatus("done")}
            className={[
              "rounded-2xl px-4 py-3 text-sm font-bold",
              status === "done"
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
