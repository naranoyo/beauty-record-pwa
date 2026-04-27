// components/records/RecordImageUploader.tsx

"use client";

import { useRef, useState } from "react";
import { saveImageFile } from "@/lib/image-storage";

type Props = {
  imageIds: string[];
  onChange: (nextImageIds: string[]) => void;
  maxImages?: number;
};

export default function RecordImageUploader({
  imageIds,
  onChange,
  maxImages = 6,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSelectFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const remain = maxImages - imageIds.length;
    if (remain <= 0) {
      alert(`画像は最大${maxImages}件までです。`);
      e.target.value = "";
      return;
    }

    const targetFiles = files.slice(0, remain);

    try {
      setSaving(true);

      const newIds: string[] = [];
      for (const file of targetFiles) {
        const id = await saveImageFile(file);
        newIds.push(id);
      }

      onChange([...imageIds, ...newIds]);
    } catch (error) {
      console.error(error);
      alert("画像の保存に失敗しました。");
    } finally {
      setSaving(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700">スケジュール用画像</p>

        <p className="mt-1 text-xs leading-6 text-slate-500">
          脱毛後の状態、髪型、体型の変化などを記録できます。
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={saving || imageIds.length >= maxImages}
            className="rounded-xl bg-pink-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "保存中..." : "画像を追加"}
          </button>

          <span className="text-xs text-slate-500">
            {imageIds.length} / {maxImages} 件
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleSelectFiles}
          className="hidden"
        />
      </div>
    </div>
  );
}
