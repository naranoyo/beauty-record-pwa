// app/records/[id]/page.tsx

"use client";

import Link from "next/link";
import LinkButton from "@/components/ui/LinkButton";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppState } from "@/lib/state";
import { deleteImagesByIds } from "@/lib/image-storage";
import RecordImagePreview from "@/components/records/RecordImagePreview";

function categoryLabel(category: string) {
  switch (category) {
    case "hair":
      return "髪型";
    case "diet":
      return "ダイエット";
    case "epilation":
      return "脱毛";
    case "nail":
      return "ネイル";
    case "skin":
      return "肌";
    case "memo":
      return "メモ";
    default:
      return "その他";
  }
}

function formatDateTime(value: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function RecordDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, deleteRecord, getRecordByIdFromState } = useAppState();
  const [deleting, setDeleting] = useState(false);

  const record = useMemo(() => {
    return getRecordByIdFromState(params.id);
  }, [getRecordByIdFromState, params.id]);

  const handleDelete = async () => {
    if (!record || deleting) return;

    const ok = window.confirm("この記録を削除しますか？");
    if (!ok) return;

    try {
      setDeleting(true);

      if (record.imageIds.length > 0) {
        await deleteImagesByIds(record.imageIds);
      }

      deleteRecord(record.id);
      router.push("/records");
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました。");
    } finally {
      setDeleting(false);
    }
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
            記録が見つかりません
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            すでに削除されたか、存在しないIDです。
          </p>

          <div className="mt-6">
            <LinkButton href="/records" variant="secondary">
              記録一覧へ戻る
            </LinkButton>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-4 pb-24">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">記録詳細</h1>
          <p className="mt-2 text-sm text-slate-600">
            保存した記録の内容を確認できます。
          </p>
        </div>

        <Link
          href="/records"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700"
        >
          一覧へ
        </Link>
      </div>

      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {categoryLabel(record.category)}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {record.date}
            </span>
            {record.imageIds.length > 0 ? (
              <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                画像 {record.imageIds.length}件
              </span>
            ) : null}
          </div>

          <h2 className="text-xl font-bold text-slate-900">{record.title}</h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="mb-1 text-sm font-medium text-slate-700">メモ</p>
              <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-800">
                {record.memo || "メモはありません。"}
              </div>
            </div>

            <div className="space-y-2">
              <p className="mb-1 text-sm font-medium text-slate-700">画像</p>
              <RecordImagePreview imageIds={record.imageIds} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">作成日時</p>
                <p className="mt-1 text-sm text-slate-800">
                  {formatDateTime(record.createdAt)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">更新日時</p>
                <p className="mt-1 text-sm text-slate-800">
                  {formatDateTime(record.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <LinkButton href={`/records/${record.id}/edit`} full>
            編集する
          </LinkButton>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 rounded-xl border border-pink-300 bg-white px-4 py-3 text-sm font-medium text-pink-600 disabled:opacity-50"
          >
            {deleting ? "削除中..." : "削除する"}
          </button>
        </div>
      </div>
    </main>
  );
}
