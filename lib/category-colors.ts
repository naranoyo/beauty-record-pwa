// lib/category-colors.ts

import type { CSSProperties } from "react";
import type { RecordCategory } from "@/lib/types";

export type CategoryColorMap = Record<string, string>;
export type CategoryLabelMap = Record<string, string>;

const COLOR_STORAGE_KEY = "beauty-record-pwa-category-colors";
const LABEL_STORAGE_KEY = "beauty-record-pwa-category-labels";

export const CATEGORY_ITEMS: RecordCategory[] = [
  "epilation",
  "hair",
  "diet",
  "training",
  "work",
  "stretch",
  "hospital",
  "shopping",
  "pachi",
  "other",
];

export const DEFAULT_CATEGORY_COLORS: CategoryColorMap = {
  epilation: "#ec4899",
  hair: "#10b981",
  diet: "#f97316",
  training: "#3b82f6",
  work: "#a855f7",
  stretch: "#facc15",
  hospital: "#f08080",
  shopping: "#00ffff",
  pachi: "#bdb76b",
  other: "#94a3b8",
};

export const DEFAULT_CATEGORY_LABELS: CategoryLabelMap = {
  epilation: "脱毛",
  hair: "髪型",
  diet: "ダイエット",
  training: "トレーニング",
  work: "仕事",
  stretch: "ストレッチ",
  hospital: "病院",
  shopping: "買い物",
  pachi: "パチ",
  other: "その他",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCategoryColors(): CategoryColorMap {
  return {
    ...DEFAULT_CATEGORY_COLORS,
    ...readJson<CategoryColorMap>(COLOR_STORAGE_KEY, {}),
  };
}

export function getCategoryLabels(): CategoryLabelMap {
  return {
    ...DEFAULT_CATEGORY_LABELS,
    ...readJson<CategoryLabelMap>(LABEL_STORAGE_KEY, {}),
  };
}

export function saveCategoryColors(colors: CategoryColorMap) {
  writeJson(COLOR_STORAGE_KEY, colors);
}

export function saveCategoryLabels(labels: CategoryLabelMap) {
  writeJson(LABEL_STORAGE_KEY, labels);
}

export function getCategoryColor(category: string) {
  return getCategoryColors()[category] ?? DEFAULT_CATEGORY_COLORS.other;
}

export function getCategoryLabel(category: string) {
  return getCategoryLabels()[category] ?? category;
}

export function getAllCategories(): string[] {
  const colors = getCategoryColors();
  const labels = getCategoryLabels();

  return Array.from(
    new Set([...CATEGORY_ITEMS, ...Object.keys(colors), ...Object.keys(labels)])
  );
}

export function addCategory(categoryId: string, label: string, color: string) {
  const id = categoryId.trim();
  if (!id) return;

  const colors = getCategoryColors();
  const labels = getCategoryLabels();

  colors[id] = color;
  labels[id] = label.trim() || id;

  saveCategoryColors(colors);
  saveCategoryLabels(labels);
}

export function categoryBadgeStyle(category: string): CSSProperties {
  const color = getCategoryColor(category);

  return {
    backgroundColor: `${color}22`,
    color,
  };
}

export function getCategoryBadgeStyle(category: string): CSSProperties {
  return categoryBadgeStyle(category);
}

export function resetCategorySettings() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(COLOR_STORAGE_KEY);
  window.localStorage.removeItem(LABEL_STORAGE_KEY);
}
