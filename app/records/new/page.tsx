// app/records/new/page.tsx

import { Suspense } from "react";
import NewRecordPageContent from "./NewRecordPageContent";

export default function NewRecordPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-2xl p-4 pb-24">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-slate-900">新規記録追加</h1>
            <p className="mt-2 text-sm text-slate-600">読み込み中...</p>
          </div>
        </main>
      }
    >
      <NewRecordPageContent />
    </Suspense>
  );
}
