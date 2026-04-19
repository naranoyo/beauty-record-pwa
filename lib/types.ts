// lib/types.ts

export type RecordCategory =
  | "hair"
  | "diet"
  | "epilation"
  | "nail"
  | "skin"
  | "memo"
  | "other";

export type BeautyRecord = {
  id: string;
  date: string;
  category: RecordCategory;
  title: string;
  memo: string;
  imageIds: string[];
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
};
