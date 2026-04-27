// app/records/page.tsx

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import RecordSummaryCard from "@/components/records/RecordSummaryCard";
import { CATEGORY_ITEMS } from "@/lib/category-colors";
import { categoryLabel } from "@/lib/record-utils";
import { useAppState } from "@/lib/state";
import type { BeautyRecord, RecordCategory } from "@/lib/types";
import { APP_TEXT } from "@/lib/constants";

export default function RecordsPage() {
  const { state, updateRecord } = useAppState();
  const [category, setCategory] = useState<"all" | RecordCategory>("all");

  const records = useMemo<BeautyRecord[]>(() => {
    return [...state.records]
      .filter((record) => category === "all" || record.category === category)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [state.records, category]);

  return (
    <PageContainer>
      <div className="space-y-5">
        <section className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-950">
            スケジュール一覧
          </h1>

          <p className="text-sm text-slate-600">
            保存したスケジュールを一覧で確認できます。
          </p>
        </section>

        <Link
          href="/records/new"
          className="inline-flex rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white! shadow-sm active:scale-[0.98]"
        >
          {APP_TEXT.scheduleAddButton}
        </Link>
        <section className="rounded-3xl border border-pink-100 bg-white px-4 py-4 shadow-sm">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-800">カテゴリ</span>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "all" | RecordCategory)
              }
              className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none"
            >
              <option value="all">すべて</option>

              {CATEGORY_ITEMS.map((item) => (
                <option key={item} value={item}>
                  {categoryLabel(item)}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="space-y-3">
          {records.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-pink-200 bg-white px-5 py-8 text-center text-sm text-slate-500">
              スケジュールはまだありません。
            </div>
          ) : (
            records.map((record) => (
              <RecordSummaryCard
                key={record.id}
                record={record}
                allRecords={state.records}
                showActions
                onDone={(target) =>
                  updateRecord({
                    ...target,
                    status: "done",
                  })
                }
              />
            ))
          )}
        </section>
      </div>
    </PageContainer>
  );
}
