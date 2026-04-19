// lib/storage.ts

import type { BeautyRecord } from "@/lib/types";

const STORAGE_KEY = "beauty-record-pwa-records";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getRecords(): BeautyRecord[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as BeautyRecord[];
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (error) {
    console.error("getRecords error:", error);
    return [];
  }
}

export function saveRecords(records: BeautyRecord[]) {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("saveRecords error:", error);
  }
}

export function getRecordById(id: string): BeautyRecord | null {
  const records = getRecords();
  return records.find((record) => record.id === id) ?? null;
}

export function addRecord(record: BeautyRecord) {
  const records = getRecords();
  const next = [record, ...records];
  saveRecords(next);
  return next;
}

export function updateRecord(updatedRecord: BeautyRecord) {
  const records = getRecords();
  const next = records.map((record) =>
    record.id === updatedRecord.id ? updatedRecord : record
  );
  saveRecords(next);
  return next;
}

export function deleteRecord(id: string) {
  const records = getRecords();
  const next = records.filter((record) => record.id !== id);
  saveRecords(next);
  return next;
}
