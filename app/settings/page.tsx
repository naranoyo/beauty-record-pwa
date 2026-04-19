// app/settings/page.tsx

"use client";

import PageContainer from "@/components/layout/PageContainer";
import { useAppState } from "@/lib/state";

export default function SettingsPage() {
  const { state } = useAppState();

  const handleResetRecords = () => {
    const ok = window.confirm(
      "保存されている記録をすべて削除しますか？この操作は元に戻せません。"
    );

    if (!ok) return;

    window.localStorage.removeItem("beauty-record-pwa-records");
    window.location.reload();
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <section className="rounded-4xl border border-pink-100 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">設定</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            アプリのデータ確認や初期化ができます。
          </p>
        </section>

        <section className="rounded-4xl border border-pink-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">保存データ</h2>
          <p className="mt-3 text-sm text-slate-600">
            現在の記録件数:{" "}
            <span className="font-semibold">{state.records.length}件</span>
          </p>

          <button
            type="button"
            onClick={handleResetRecords}
            className="mt-5 rounded-2xl bg-pink-500 px-5 py-3 text-sm font-medium text-white hover:bg-pink-600"
          >
            記録データを削除
          </button>
        </section>
      </div>
    </PageContainer>
  );
}
