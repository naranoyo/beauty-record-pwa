// app/records/[id]/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import RecordImagePreview from "@/components/records/RecordImagePreview";
import { useAppState } from "@/lib/state";
import { APP_TEXT } from "@/lib/constants";
import {
  categoryBadgeStyle,
  categoryLabel,
  getDaysFromPreviousSameCategory,
  statusBadgeClassName,
  statusLabel,
} from "@/lib/record-utils";

export default function RecordDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, updateRecord, deleteRecord } = useAppState();

  const record = state.records.find((r) => r.id === params.id);

  if (!record) {
    return (
      <PageContainer>
        <p className="text-center text-slate-500">データが見つかりません</p>
      </PageContainer>
    );
  }

  const daysFromPrevious = getDaysFromPreviousSameCategory(
    record,
    state.records
  );

  return (
    <PageContainer>
      <div className="space-y-4">
        <section
          className={[
            "rounded-4xl border p-6 shadow-sm",
            record.status === "done"
              ? "border-emerald-200 bg-emerald-50"
              : "border-pink-100 bg-white",
          ].join(" ")}
        >
          <h1 className="text-xl font-bold text-slate-900">{record.title}</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              style={categoryBadgeStyle(record.category)}
              className="rounded-full px-3 py-1 text-xs font-bold"
            >
              {categoryLabel(record.category)}
            </span>

            <span
              className={[
                "rounded-full px-3 py-1 text-xs font-bold",
                statusBadgeClassName(record.status),
              ].join(" ")}
            >
              {statusLabel(record.status)}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              {record.date}
            </span>

            {daysFromPrevious !== null && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {daysFromPrevious}日後（前回の
                {categoryLabel(record.category)}より）
              </span>
            )}
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">
            {record.memo || APP_TEXT.noMemo}
          </p>

          {record.imageIds.length > 0 ? (
            <div className="mt-5">
              <p className="mb-3 text-sm font-bold text-pink-600">
                画像 {record.imageIds.length}件
              </p>

              <RecordImagePreview imageIds={record.imageIds} />
            </div>
          ) : null}
        </section>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => updateRecord({ ...record, status: "done" })}
            className="flex-1 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white!"
          >
            完了にする
          </button>

          <button
            type="button"
            onClick={() => router.push(`/records/${record.id}/edit`)}
            className="flex-1 rounded-2xl bg-pink-500 py-3 text-sm font-bold text-white!"
          >
            編集
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm("削除しますか？")) {
              deleteRecord(record.id);
              router.push("/records");
            }
          }}
          className="w-full rounded-2xl bg-red-500 py-3 text-sm font-bold text-white!"
        >
          削除
        </button>
      </div>
    </PageContainer>
  );
}
