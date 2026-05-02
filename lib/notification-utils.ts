// lib/notification-utils.ts

import type { BeautyRecord, ReminderSetting } from "@/lib/types";

const timers = new Map<string, number>();
const MAX_TIMEOUT = 2147483647;

export async function registerNotificationServiceWorker() {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;

  try {
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
}

export async function requestNotificationPermission() {
  if (typeof window === "undefined") return "denied";
  if (!("Notification" in window)) return "denied";

  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";

  return await Notification.requestPermission();
}

function getRecordStartDate(record: BeautyRecord) {
  const time = record.startTime ?? record.time ?? "09:00";
  return new Date(`${record.date}T${time}:00`);
}

function getReminderDate(record: BeautyRecord, reminder: ReminderSetting) {
  const start = getRecordStartDate(record);
  const remindAt = new Date(start);

  if (reminder.unit === "分") {
    remindAt.setMinutes(remindAt.getMinutes() - reminder.amount);
  }

  if (reminder.unit === "時間") {
    remindAt.setHours(remindAt.getHours() - reminder.amount);
  }

  if (reminder.unit === "日") {
    remindAt.setDate(remindAt.getDate() - reminder.amount);

    if (reminder.time) {
      const [h, m] = reminder.time.split(":").map(Number);
      remindAt.setHours(h, m, 0, 0);
    }
  }

  if (reminder.unit === "週") {
    remindAt.setDate(remindAt.getDate() - reminder.amount * 7);

    if (reminder.time) {
      const [h, m] = reminder.time.split(":").map(Number);
      remindAt.setHours(h, m, 0, 0);
    }
  }

  return remindAt;
}

function getReminderText(reminder: ReminderSetting) {
  if (reminder.unit === "日" || reminder.unit === "週") {
    return `${reminder.amount}${reminder.unit}前の${reminder.time ?? "09:00"}`;
  }

  return `${reminder.amount}${reminder.unit}前`;
}

async function showNotification(
  record: BeautyRecord,
  reminder: ReminderSetting
) {
  const registration = await registerNotificationServiceWorker();

  const title = "B-RECO リマインド";
  const body = `${record.title}（${getReminderText(reminder)}）`;

  if (registration?.showNotification) {
    await registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: {
        url: `/records/${record.id}`,
      },
    });
    return;
  }

  new Notification(title, {
    body,
    icon: "/icons/icon-192.png",
    data: {
      url: `/records/${record.id}`,
    },
  });
}

export function cancelRecordNotifications(recordId: string) {
  for (const [key, timerId] of timers.entries()) {
    if (key.startsWith(`${recordId}_`)) {
      window.clearTimeout(timerId);
      timers.delete(key);
    }
  }
}

export async function scheduleRecordNotifications(record: BeautyRecord) {
  if (typeof window === "undefined") return;
  if (!record.reminderEnabled) return;

  const permission = await requestNotificationPermission();
  if (permission !== "granted") return;

  cancelRecordNotifications(record.id);

  const reminders = record.reminders ?? [];
  const now = Date.now();

  reminders.forEach((reminder, index) => {
    const remindAt = getReminderDate(record, reminder);
    const delay = remindAt.getTime() - now;

    if (delay <= 0) return;
    if (delay > MAX_TIMEOUT) return;

    const key = `${record.id}_${index}`;

    const timerId = window.setTimeout(() => {
      showNotification(record, reminder);
      timers.delete(key);
    }, delay);

    timers.set(key, timerId);
  });
}

export async function scheduleAllRecordNotifications(records: BeautyRecord[]) {
  for (const record of records) {
    await scheduleRecordNotifications(record);
  }
}
