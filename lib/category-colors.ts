// lib/category-colors.ts

import type { CSSProperties } from "react";
import type { RecordCategory } from "@/lib/types";

export type CategoryColorMap = Record<RecordCategory, string>;
export type CategoryLabelMap = Record<RecordCategory, string>;

const COLOR_STORAGE_KEY = "beauty-record-pwa-category-colors";
const LABEL_STORAGE_KEY = "beauty-record-pwa-category-labels";
const CATEGORY_VERSION_KEY = "beauty-record-pwa-category-version";

/**
 * カテゴリ構成を変更したら、この値を変更します。
 * 古いlocalStorageの色ズレを防ぐためです。
 */
const CATEGORY_VERSION = "2026-04-category-v2";

export const CATEGORY_ITEMS: RecordCategory[] = [
  "epilation",
  "hair",
  "diet",
  "training",
  "work",
  "stretch",
  "other",
];

export const DEFAULT_CATEGORY_COLORS: CategoryColorMap = {
  epilation: "#ec4899", // 脱毛：ピンク
  hair: "#10b981", // 髪型：緑
  diet: "#f97316", // ダイエット：オレンジ
  training: "#3b82f6", // トレーニング：青
  work: "#a855f7", // 仕事：紫
  stretch: "#eab308", // ストレッチ：黄
  other: "#94a3b8", // その他：グレー
};

export const DEFAULT_CATEGORY_LABELS: CategoryLabelMap = {
  epilation: "脱毛",
  hair: "髪型",
  diet: "ダイエット",
  training: "トレーニング",
  work: "仕事",
  stretch: "ストレッチ",
  other: "その他",
};

const LEGACY_COLOR_MAP: Record<string, string> = {
  pink: "#ec4899",
  purple: "#a855f7",
  blue: "#3b82f6",
  orange: "#f97316",
  green: "#10b981",
  emerald: "#10b981",
  slate: "#64748b",
  gray: "#94a3b8",
  red: "#ef4444",
  yellow: "#eab308",
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function resetOldCategoryStorageIfNeeded() {
  if (!canUseStorage()) return;

  const currentVersion = window.localStorage.getItem(CATEGORY_VERSION_KEY);

  if (currentVersion === CATEGORY_VERSION) return;

  window.localStorage.removeItem(COLOR_STORAGE_KEY);
  window.localStorage.removeItem(LABEL_STORAGE_KEY);
  window.localStorage.setItem(CATEGORY_VERSION_KEY, CATEGORY_VERSION);
}

function normalizeColor(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;

  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return value;
  }

  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const r = value[1];
    const g = value[2];
    const b = value[3];

    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return LEGACY_COLOR_MAP[value] ?? fallback;
}

export function loadCategoryColors(): CategoryColorMap {
  if (!canUseStorage()) return DEFAULT_CATEGORY_COLORS;

  resetOldCategoryStorageIfNeeded();

  try {
    const raw = window.localStorage.getItem(COLOR_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};

    const colors = { ...DEFAULT_CATEGORY_COLORS };

    CATEGORY_ITEMS.forEach((category) => {
      colors[category] = normalizeColor(
        parsed?.[category],
        DEFAULT_CATEGORY_COLORS[category]
      );
    });

    return colors;
  } catch {
    return DEFAULT_CATEGORY_COLORS;
  }
}

export function saveCategoryColors(colors: CategoryColorMap) {
  if (!canUseStorage()) return;

  const normalized = { ...DEFAULT_CATEGORY_COLORS };

  CATEGORY_ITEMS.forEach((category) => {
    normalized[category] = normalizeColor(
      colors[category],
      DEFAULT_CATEGORY_COLORS[category]
    );
  });

  window.localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(normalized));
  window.localStorage.setItem(CATEGORY_VERSION_KEY, CATEGORY_VERSION);
}

export function loadCategoryLabels(): CategoryLabelMap {
  if (!canUseStorage()) return DEFAULT_CATEGORY_LABELS;

  resetOldCategoryStorageIfNeeded();

  try {
    const raw = window.localStorage.getItem(LABEL_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};

    const labels = { ...DEFAULT_CATEGORY_LABELS };

    CATEGORY_ITEMS.forEach((category) => {
      if (typeof parsed?.[category] === "string") {
        labels[category] = parsed[category];
      }
    });

    return labels;
  } catch {
    return DEFAULT_CATEGORY_LABELS;
  }
}

export function saveCategoryLabels(labels: CategoryLabelMap) {
  if (!canUseStorage()) return;

  const normalized = { ...DEFAULT_CATEGORY_LABELS };

  CATEGORY_ITEMS.forEach((category) => {
    normalized[category] =
      labels[category]?.trim() || DEFAULT_CATEGORY_LABELS[category];
  });

  window.localStorage.setItem(LABEL_STORAGE_KEY, JSON.stringify(normalized));
  window.localStorage.setItem(CATEGORY_VERSION_KEY, CATEGORY_VERSION);
}

export function resetCategorySettings() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(COLOR_STORAGE_KEY);
  window.localStorage.removeItem(LABEL_STORAGE_KEY);
  window.localStorage.setItem(CATEGORY_VERSION_KEY, CATEGORY_VERSION);
}

function hexToRgba(hex: string, alpha: number) {
  const color = normalizeColor(hex, "#94a3b8");
  const clean = color.replace("#", "");

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getCategoryColor(category: RecordCategory | string) {
  const colors = loadCategoryColors();

  return colors[category as RecordCategory] ?? DEFAULT_CATEGORY_COLORS.other;
}

export function getCategoryLabel(category: RecordCategory | string) {
  const labels = loadCategoryLabels();

  return labels[category as RecordCategory] ?? DEFAULT_CATEGORY_LABELS.other;
}

export function getCategoryBadgeStyle(
  category: RecordCategory | string
): CSSProperties {
  const color = getCategoryColor(category);

  return {
    color,
    backgroundColor: hexToRgba(color, 0.14),
  };
}

export function getCategoryDotStyle(
  category: RecordCategory | string
): CSSProperties {
  return {
    backgroundColor: getCategoryColor(category),
  };
}
