// components/records/RecordForm.tsx

"use client";

import { useState } from "react";
import type { RecordCategory, RecordFormValues } from "@/lib/types";
import RecordImageUploader from "@/components/records/RecordImageUploader";
import RecordImagePreview from "@/components/records/RecordImagePreview";

type Props = {
  initialValues?: Partial<RecordFormValues>;
  submitLabel?: string;
  onSubmit: (values: RecordFormValues) => void;
  onCancel?: () => void;
};

const CATEGORY_OPTIONS: { value: RecordCategory; label: string }[] = [
  { value: "hair", label: "髪型" },
  { value: "diet", label: "ダイエット" },
  { value: "epilation", label: "脱毛" },
  { value: "nail", label: "ネイル" },
  { value: "skin", label: "肌" },
  { value: "memo", label: "メモ" },
  { value: "other", label: "その他" },
];

function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, "0");
  const d = `${now.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function RecordForm({
  initialValues,
  submitLabel = "保存する",
  onSubmit,
  onCancel,
}: Props) {
  const [date, setDate] = useState(initialValues?.date ?? getTodayString());
  const [category, setCategory] = useState<RecordCategory>(
    initialValues?.category ?? "memo"
  );
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [memo, setMemo] = useState(initialValues?.memo ?? "");
  const [imageIds, setImageIds] = useState<string[]>(
    initialValues?.imageIds ?? []
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedMemo = memo.trim();

    if (!trimmedTitle) {
      alert("タイトルを入力してください。");
      return;
    }

    onSubmit({
      date,
      category,
      title: trimmedTitle,
      memo: trimmedMemo,
      imageIds,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">日付</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-pink-400"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          カテゴリ
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as RecordCategory)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-pink-400"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          タイトル
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：脱毛3回目 / 体重メモ / 髪型メモ"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-pink-400"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">メモ</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={6}
          placeholder="気づいたことや状態を入力"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-pink-400"
        />
      </div>

      <RecordImageUploader imageIds={imageIds} onChange={setImageIds} />

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">画像プレビュー</p>
        <RecordImagePreview
          imageIds={imageIds}
          editable
          onChange={setImageIds}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-pink-500 px-4 py-3 text-sm font-medium text-white hover:bg-pink-600"
        >
          {submitLabel}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700"
          >
            キャンセル
          </button>
        ) : null}
      </div>
    </form>
  );
}
