// app/settings/page.tsx

"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { useAppState } from "@/lib/state";
import type { RecordCategory } from "@/lib/types";
import {
  CATEGORY_ITEMS,
  DEFAULT_CATEGORY_COLORS,
  DEFAULT_CATEGORY_LABELS,
  loadCategoryColors,
  loadCategoryLabels,
  resetCategorySettings,
  saveCategoryColors,
  saveCategoryLabels,
  type CategoryColorMap,
  type CategoryLabelMap,
} from "@/lib/category-colors";

export default function SettingsPage() {
  const { state } = useAppState();

  const [categoryColors, setCategoryColors] = useState<CategoryColorMap>(() =>
    loadCategoryColors()
  );

  const [categoryLabels, setCategoryLabels] = useState<CategoryLabelMap>(() =>
    loadCategoryLabels()
  );

  const handleChangeColor = (category: RecordCategory, color: string) => {
    setCategoryColors((current) => ({
      ...current,
      [category]: color,
    }));
  };

  const handleChangeLabel = (category: RecordCategory, label: string) => {
    setCategoryLabels((current) => ({
      ...current,
      [category]: label,
    }));
  };

  const handleSave = () => {
    saveCategoryColors(categoryColors);
    saveCategoryLabels(categoryLabels);
    window.alert("カテゴリ設定を保存しました。");
    window.location.reload();
  };

  const handleResetCategorySettings = () => {
    setCategoryColors(DEFAULT_CATEGORY_COLORS);
    setCategoryLabels(DEFAULT_CATEGORY_LABELS);
    resetCategorySettings();
    window.alert("カテゴリ設定を初期化しました。");
    window.location.reload();
  };

  const handleResetRecords = () => {
    const ok = window.confirm(
      "保存されているスケジュールをすべて削除しますか？この操作は元に戻せません。"
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
            カテゴリ名・カテゴリ色・保存データを管理できます。
          </p>
        </section>

        <section className="rounded-4xl border border-pink-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">カテゴリ設定</h2>

          <div className="mt-5 space-y-4">
            {CATEGORY_ITEMS.map((category) => (
              <div
                key={category}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    カテゴリ名
                  </label>

                  <input
                    value={categoryLabels[category]}
                    onChange={(e) =>
                      handleChangeLabel(category, e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-pink-400"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    カテゴリ色
                  </label>

                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={categoryColors[category]}
                      onChange={(e) =>
                        handleChangeColor(category, e.target.value)
                      }
                      className="h-12 w-16 rounded-xl border border-slate-300 bg-white p-1"
                    />

                    <input
                      value={categoryColors[category]}
                      onChange={(e) =>
                        handleChangeColor(category, e.target.value)
                      }
                      className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-pink-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white! shadow-sm transition hover:bg-pink-600"
            >
              保存する
            </button>

            <button
              type="button"
              onClick={handleResetCategorySettings}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              初期化する
            </button>
          </div>
        </section>

        <section className="rounded-4xl border border-pink-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">保存データ</h2>

          <p className="mt-3 text-sm text-slate-600">
            現在のスケジュール件数:{" "}
            <span className="font-semibold">{state.records.length}件</span>
          </p>

          <button
            type="button"
            onClick={handleResetRecords}
            className="mt-5 rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white! hover:bg-red-600"
          >
            スケジュールデータを削除
          </button>
        </section>
      </div>
    </PageContainer>
  );
}
