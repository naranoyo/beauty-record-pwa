// app/settings/page.tsx

"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import {
  addCategory,
  getAllCategories,
  getCategoryColors,
  getCategoryLabels,
  resetCategorySettings,
  saveCategoryColors,
  saveCategoryLabels,
  type CategoryColorMap,
  type CategoryLabelMap,
} from "@/lib/category-colors";

function createCategoryId(label: string) {
  return `custom_${label.trim().replace(/\s+/g, "_")}_${Date.now()}`;
}

export default function SettingsPage() {
  const [categories, setCategories] = useState<string[]>(() =>
    getAllCategories()
  );

  const [colors, setColors] = useState<CategoryColorMap>(() =>
    getCategoryColors()
  );

  const [labels, setLabels] = useState<CategoryLabelMap>(() =>
    getCategoryLabels()
  );
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("#ec4899");

  const loadCategories = () => {
    setCategories(getAllCategories());
    setColors(getCategoryColors());
    setLabels(getCategoryLabels());
  };

  const handleChangeLabel = (category: string, value: string) => {
    const next = {
      ...labels,
      [category]: value,
    };

    setLabels(next);
    saveCategoryLabels(next);
  };

  const handleChangeColor = (category: string, value: string) => {
    const next = {
      ...colors,
      [category]: value,
    };

    setColors(next);
    saveCategoryColors(next);
  };

  const handleAddCategory = () => {
    const label = newLabel.trim();
    if (!label) return;

    const id = createCategoryId(label);
    addCategory(id, label, newColor);

    setNewLabel("");
    setNewColor("#ec4899");
    loadCategories();
  };

  const handleReset = () => {
    if (!confirm("カテゴリ設定を初期状態に戻しますか？")) return;

    resetCategorySettings();
    loadCategories();
  };

  return (
    <PageContainer title="設定" description="カテゴリ名や色を変更できます。">
      <div className="space-y-6">
        <section className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">カテゴリ追加</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_120px_auto]">
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="例：ネイル、肌、病院など"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400"
            />

            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-300 bg-white p-2"
            />

            <button
              type="button"
              onClick={handleAddCategory}
              className="rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white! shadow-sm active:scale-[0.98]"
            >
              追加
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-950">
              カテゴリ名・色変更
            </h2>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm active:scale-[0.98]"
            >
              初期化
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category}
                className="grid gap-3 rounded-2xl bg-slate-50 p-3 sm:grid-cols-[120px_1fr_120px]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{
                      backgroundColor: colors[category] ?? "#94a3b8",
                    }}
                  />
                  <span className="truncate text-xs font-bold text-slate-500">
                    {category}
                  </span>
                </div>

                <input
                  value={labels[category] ?? category}
                  onChange={(e) => handleChangeLabel(category, e.target.value)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-pink-400"
                />

                <input
                  type="color"
                  value={colors[category] ?? "#94a3b8"}
                  onChange={(e) => handleChangeColor(category, e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white p-2"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
