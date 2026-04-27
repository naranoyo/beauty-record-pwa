// lib/types.ts

export type RecordCategory =
  | "epilation"
  | "hair"
  | "diet"
  | "training"
  | "work"
  | "stretch"
  | "other";

export type RecordStatus = "planned" | "done";

export type BeautyRecord = {
  id: string;
  date: string;
  category: RecordCategory;
  title: string;
  memo: string;
  imageIds: string[];
  status?: RecordStatus;
  createdAt: string;
  updatedAt: string;
};

export type AppState = {
  records: BeautyRecord[];
  initialized: boolean;
};

export type RecordFormValues = {
  date: string;
  category: RecordCategory;
  title: string;
  memo: string;
  imageIds: string[];
  status: RecordStatus;
};
