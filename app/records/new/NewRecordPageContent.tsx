// app/records/new/NewRecordPageContent.tsx

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import RecordForm from "@/components/records/RecordForm";
import { useAppState } from "@/lib/state";
import { APP_TEXT } from "@/lib/constants";
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

  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const dateParam = searchParams.get("date");

  const initialDate =
    isValidDateString(dateParam) && dateParam ? dateParam : getTodayString();

  const handleSubmit = (values: RecordFormValues) => {
    if (isSaving) return;

    setIsSaving(true);

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
      createdAt: now,
      updatedAt: now,
    };

    addRecord(newRecord);

    setMessage("スケジュールを保存しました");

    setTimeout(() => {
      router.push("/calendar");
    }, 1200);
  };

  return (
    <>
      <PageContainer
        title={APP_TEXT.scheduleAddTitle}
        description="美容スケジュールを新しく追加します。"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <RecordForm
            initialValues={{
              date: initialDate,
              time: "09:00",
              startTime: "09:00",
              endTime: "10:00",
              status: "planned",
            }}
            submitLabel={isSaving ? "保存中..." : APP_TEXT.scheduleSaveButton}
            onSubmit={handleSubmit}
          />
        </div>
      </PageContainer>

      {message && (
        <div className="fixed bottom-20 left-1/2 z-9999 -translate-x-1/2 rounded-xl bg-black/80 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {message}
        </div>
      )}
    </>
  );
}
