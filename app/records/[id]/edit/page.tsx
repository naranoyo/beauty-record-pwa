// app/records/[id]/edit/page.tsx

"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import RecordForm from "@/components/records/RecordForm";
import { useAppState } from "@/lib/state";
import { APP_TEXT } from "@/lib/constants";
import type { RecordFormValues, ReminderSetting } from "@/lib/types";

const DEFAULT_REMINDERS: ReminderSetting[] = [
  {
    amount: 1,
    unit: "日",
    time: "09:00",
  },
];

export default function EditRecordPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, getRecordByIdFromState, updateRecord } = useAppState();

  const record = useMemo(() => {
    return getRecordByIdFromState(params.id);
  }, [getRecordByIdFromState, params.id]);

  const handleSubmit = (values: RecordFormValues) => {
    if (!record) return;

    updateRecord({
      ...record,
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

      updatedAt: new Date().toISOString(),
    });

    router.push(`/records/${record.id}`);
  };

  if (!state.initialized) {
    return (
      <PageContainer title={APP_TEXT.scheduleEditTitle}>
        <p className="text-sm text-slate-600">{APP_TEXT.loading}</p>
      </PageContainer>
    );
  }

  if (!record) {
    return (
      <PageContainer title={APP_TEXT.scheduleEditTitle}>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            編集対象のスケジュールが見つかりません
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            すでに削除されたか、存在しないIDです。
          </p>

          <div className="mt-6">
            <Link
              href="/records"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              スケジュール一覧へ戻る
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={APP_TEXT.scheduleEditTitle}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <RecordForm
          initialValues={{
            date: record.date,
            time: record.startTime ?? record.time ?? "09:00",
            startTime: record.startTime ?? record.time ?? "09:00",
            endTime: record.endTime ?? "10:00",
            category: record.category,
            title: record.title,
            memo: record.memo,
            imageIds: record.imageIds,
            status: record.status ?? "planned",

            reminderEnabled: record.reminderEnabled ?? true,
            reminders: record.reminders ?? DEFAULT_REMINDERS,
            reminderMinutes: record.reminderMinutes,
          }}
          submitLabel={APP_TEXT.scheduleSaveButton}
          onSubmit={handleSubmit}
        />
      </div>
    </PageContainer>
  );
}
