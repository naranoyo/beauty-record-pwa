// app/records/[id]/edit/page.tsx

"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import RecordForm from "@/components/records/RecordForm";
import { useAppState } from "@/lib/state";
import type { RecordFormValues } from "@/lib/types";

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
      category: values.category,
      title: values.title,
      memo: values.memo,
      imageIds: values.imageIds,
      updatedAt: new Date().toISOString(),
    });

    router.push(`/records/${record.id}`);
  };

  if (!state.initialized) {
    return (
      <main className="mx-auto w-full max-w-2xl p-4 pb-24">
        <p className="text-sm text-slate-600">読み込み中...</p>
      </main>
    );
  }

  if (!record) {
    return (
      <main className="mx-auto w-full max-w-2xl p-4 pb-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            編集対象の記録が見つかりません
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            すでに削除されたか、存在しないIDです。
          </p>

          <div className="mt-6">
            <Link
              href="/records"
              className="inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
            >
              記録一覧へ戻る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">記録編集</h1>
        <p className="mt-2 text-sm text-slate-600">
          既存の記録内容を更新します。
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <RecordForm
          initialValues={{
            date: record.date,
            category: record.category,
            title: record.title,
            memo: record.memo,
            imageIds: record.imageIds,
          }}
          submitLabel="更新する"
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/records/${record.id}`)}
        />
      </div>
    </main>
  );
}
