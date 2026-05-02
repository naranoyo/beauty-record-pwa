// lib/types.ts

export type RecordCategory =
  | "epilation"
  | "hair"
  | "diet"
  | "training"
  | "work"
  | "stretch"
  | "hospital"
  | "shopping"
  | "pachi"
  | "other"
  | string;

export type RecordStatus = "planned" | "done";

export type ReminderUnit = "分" | "時間" | "日" | "週";

export type ReminderSetting = {
  amount: number;
  unit: ReminderUnit;
  time?: string;
};

export type BeautyRecord = {
  id: string;
  date: string;

  time: string;

  startTime?: string;
  endTime?: string;

  category: RecordCategory;
  title: string;
  memo: string;
  imageIds: string[];

  status?: RecordStatus;

  reminderEnabled?: boolean;

  /**
   * 新：通知設定
   * 例：1日前の9:00
   */
  reminders?: ReminderSetting[];

  /**
   * 旧：互換用
   */
  reminderMinutes?: number[];

  createdAt: string;
  updatedAt: string;
};

export type AppState = {
  records: BeautyRecord[];
  initialized: boolean;
};

export type RecordFormValues = {
  date: string;
  time: string;

  startTime: string;
  endTime: string;

  category: RecordCategory;
  title: string;
  memo: string;
  imageIds: string[];
  status: RecordStatus;

  reminderEnabled: boolean;
  reminders: ReminderSetting[];

  /**
   * 旧：互換用
   */
  reminderMinutes?: number[];
};

export type CustomCategory = {
  id: string;
  label: string;
  color: string;
};
