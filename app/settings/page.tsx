// app/settings/page.tsx

"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import {
  getAllCategories,
  getCategoryColors,
  getCategoryLabels,
  saveCategoryColors,
  saveCategoryLabels,
  addCategory,
  resetCategorySettings,
} from "@/lib/category-colors";
import type { CategoryColorMap, CategoryLabelMap } from "@/lib/category-colors";

function createCategoryId(label: string) {
  return label.toLowerCase().replace(/\s+/g, "_");
}

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);

  const [categories, setCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<CategoryColorMap>(
    {} as CategoryColorMap
  );
  const [labels, setLabels] = useState<CategoryLabelMap>(
    {} as CategoryLabelMap
  );

  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("#ec4899");
  const [message, setMessage] = useState("");

  const loadCategories = () => {
    setCategories(getAllCategories());
    setColors(getCategoryColors());
    setLabels(getCategoryLabels());
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadCategories();
      setMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  const handleChangeLabel = (category: string, value: string) => {
    const next = {
      ...labels,
      [category]: value,
    };

    setLabels(next);
    saveCategoryLabels(next);
    showMessage("カテゴリ名を変更しました");
  };

  const handleChangeColor = (category: string, value: string) => {
    const next = {
      ...colors,
      [category]: value,
    };

    setColors(next);
    saveCategoryColors(next);
    showMessage("色を変更しました");
  };

  const handleAddCategory = () => {
    const label = newLabel.trim();

    if (!label) {
      showMessage("カテゴリ名を入力してください");
      return;
    }

    const id = createCategoryId(label);
    addCategory(id, label, newColor);

    setNewLabel("");
    setNewColor("#ec4899");

    loadCategories();
    showMessage("カテゴリを追加しました");
  };

  const handleReset = () => {
    resetCategorySettings();
    loadCategories();
    showMessage("初期化しました");
  };

  if (!mounted) {
    return (
      <PageContainer title="設定" description="カテゴリ名や色を変更できます。">
        <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-500">読み込み中...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
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
                    onChange={(e) =>
                      handleChangeLabel(category, e.target.value)
                    }
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-pink-400"
                  />

                  <input
                    type="color"
                    value={colors[category] ?? "#94a3b8"}
                    onChange={(e) =>
                      handleChangeColor(category, e.target.value)
                    }
                    className="h-12 w-full rounded-2xl border border-slate-300 bg-white p-2"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </PageContainer>

      {message && (
        <div className="fixed bottom-20 left-1/2 z-9999 -translate-x-1/2 rounded-xl bg-black/80 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {message}
        </div>
      )}
    </>
  );
}
