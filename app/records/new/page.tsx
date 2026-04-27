// app/records/new/page.tsx

import { Suspense } from "react";
import NewRecordPageContent from "./NewRecordPageContent";
import { APP_TEXT } from "@/lib/constants";

export default function NewRecordPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-2xl p-4 pb-24">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-slate-900">
              {APP_TEXT.scheduleAddTitle}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{APP_TEXT.loading}</p>
          </div>
        </main>
      }
    >
      <NewRecordPageContent />
    </Suspense>
  );
}
