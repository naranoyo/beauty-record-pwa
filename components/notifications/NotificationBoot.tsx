// components/notifications/NotificationBoot.tsx

"use client";

import { useEffect } from "react";
import { useAppState } from "@/lib/state";
import {
  registerNotificationServiceWorker,
  scheduleAllRecordNotifications,
} from "@/lib/notification-utils";

export default function NotificationBoot() {
  const { state } = useAppState();

  useEffect(() => {
    registerNotificationServiceWorker();
  }, []);

  useEffect(() => {
    if (!state.initialized) return;

    scheduleAllRecordNotifications(state.records);
  }, [state.initialized, state.records]);

  return null;
}
