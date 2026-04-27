// components/records/RecordSummaryCard.tsx

import Link from "next/link";
import type { BeautyRecord } from "@/lib/types";
import { APP_TEXT } from "@/lib/constants";
import {
  categoryBadgeStyle,
  categoryLabel,
  getDaysFromPreviousSameCategory,
  statusBadgeClassName,
  statusLabel,
} from "@/lib/record-utils";

type Props = {
  record: BeautyRecord;
  allRecords: BeautyRecord[];
  showActions?: boolean;
  onDone?: (record: BeautyRecord) => void;
};

export default function RecordSummaryCard({
  record,
  allRecords,
  showActions = false,
  onDone,
}: Props) {
  const daysFromPrevious = getDaysFromPreviousSameCategory(record, allRecords);
  const isDone = record.status === "done";

  return (
    <article
      className={[
        "rounded-2xl border px-4 py-3 shadow-sm",
        isDone
          ? "border-emerald-200 bg-emerald-50"
          : "border-pink-100 bg-white",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
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

            {daysFromPrevious !== null ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {daysFromPrevious}日後（前回の
                {categoryLabel(record.category)}より）
              </span>
            ) : null}
          </div>

          <h3 className="truncate text-base font-bold text-slate-950">
            {record.title}
          </h3>

          <p className="mt-1 line-clamp-1 whitespace-pre-wrap text-sm text-slate-500">
            {record.memo || APP_TEXT.noMemo}
          </p>

          {record.imageIds.length > 0 ? (
            <p className="mt-2 text-xs font-bold text-pink-600">
              画像 {record.imageIds.length}件
            </p>
          ) : null}
        </div>

        {showActions ? (
          <div className="flex shrink-0 flex-col gap-2">
            <Link
              href={`/records/${record.id}`}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-xs font-bold text-slate-800 active:scale-[0.98]"
            >
              詳細
            </Link>

            {record.status === "planned" ? (
              <button
                type="button"
                onClick={() => onDone?.(record)}
                className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white! shadow-sm active:scale-[0.98]"
              >
                完了
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
