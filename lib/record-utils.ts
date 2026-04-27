// lib/record-utils.ts

import type { BeautyRecord, RecordCategory } from "@/lib/types";
import { getCategoryBadgeStyle, getCategoryLabel } from "@/lib/category-colors";

export function categoryLabel(category: RecordCategory | string) {
  return getCategoryLabel(category);
}

export function categoryBadgeStyle(category: RecordCategory | string) {
  return getCategoryBadgeStyle(category);
}

export function statusLabel(status: BeautyRecord["status"]) {
  return status === "done" ? "完了" : "予定";
}

export function statusBadgeClassName(status: BeautyRecord["status"]) {
  return status === "done"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-yellow-100 text-yellow-700";
}

export function getDaysFromPreviousSameCategory(
  record: BeautyRecord,
  records: BeautyRecord[]
) {
  const previous = records
    .filter(
      (item) =>
        item.id !== record.id &&
        item.category === record.category &&
        item.date < record.date
    )
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  if (!previous) return null;

  const diffDays = Math.round(
    (new Date(record.date).getTime() - new Date(previous.date).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return diffDays > 0 ? diffDays : null;
}
