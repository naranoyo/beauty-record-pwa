// components/home/RecentRecords.tsx

"use client";

import { useAppState } from "@/lib/state";
import { APP_TEXT } from "@/lib/constants";
import RecordSummaryCard from "@/components/records/RecordSummaryCard";

export default function RecentRecords() {
  const { state, updateRecord } = useAppState();

  const recent = [...state.records]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <section className="rounded-4xl border border-pink-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">
          {APP_TEXT.homeRecentTitle}
        </h2>

        <span className="rounded-full bg-pink-100 px-4 py-2 text-lg font-bold text-pink-600">
          {state.records.length}件
        </span>
      </div>

      {!state.initialized ? (
        <p className="mt-6 text-base text-slate-500">{APP_TEXT.loading}</p>
      ) : recent.length === 0 ? (
        <p className="mt-6 text-base leading-7 text-slate-600">
          {APP_TEXT.homeRecentEmpty}
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {recent.map((record) => (
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
          ))}
        </div>
      )}
    </section>
  );
}
