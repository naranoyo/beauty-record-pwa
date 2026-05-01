// app/records/new/NewRecordPageContent.tsx

"use client";

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

  const dateParam = searchParams.get("date");

  const initialDate =
    isValidDateString(dateParam) && dateParam ? dateParam : getTodayString();

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
      createdAt: now,
      updatedAt: now,
    };

    addRecord(newRecord);
    router.push(`/records/${newRecord.id}`);
  };

  return (
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
          submitLabel={APP_TEXT.scheduleSaveButton}
          onSubmit={handleSubmit}
        />
      </div>
    </PageContainer>
  );
}
