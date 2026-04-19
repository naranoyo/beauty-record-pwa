// app/records/new/NewRecordPageContent.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import RecordForm from "@/components/records/RecordForm";
import { useAppState } from "@/lib/state";
import type { BeautyRecord, RecordFormValues } from "@/lib/types";

function createId() {
  return `record_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, "0");
  const d = `${now.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isValidDateString(value: string | null) {
  if (!value) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export default function NewRecordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addRecord } = useAppState();

  const dateParam = searchParams.get("date");

  const initialDate =
    isValidDateString(dateParam) && dateParam ? dateParam : getTodayString();

  const handleSubmit = (values: RecordFormValues) => {
    const now = new Date().toISOString();

    const newRecord: BeautyRecord = {
      id: createId(),
      date: values.date,
      category: values.category,
      title: values.title,
      memo: values.memo,
      imageIds: values.imageIds,
      createdAt: now,
      updatedAt: now,
    };

    addRecord(newRecord);
    router.push(`/records/${newRecord.id}`);
  };

  return (
    <main className="mx-auto w-full max-w-2xl p-4 pb-24">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900">新規記録追加</h1>
        <p className="mt-2 text-sm text-slate-600">
          美容記録を新しく追加します。
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <RecordForm
          initialValues={{
            date: initialDate,
          }}
          submitLabel="保存する"
          onSubmit={handleSubmit}
          onCancel={() => router.push("/records")}
        />
      </div>
    </main>
  );
}
