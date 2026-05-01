// lib/types.ts

// 固定＋カスタム対応
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

// ステータス
export type RecordStatus = "planned" | "done";

// メインデータ
export type BeautyRecord = {
  id: string;
  date: string;

  /**
   * 旧：単一時刻（互換用）
   * → startTime と同じ扱いにする
   */
  time: string;

  /**
   * 新：開始・終了
   */
  startTime?: string;
  endTime?: string;

  category: RecordCategory;
  title: string;
  memo: string;
  imageIds: string[];

  status?: RecordStatus;
  createdAt: string;
  updatedAt: string;
};

// アプリ状態
export type AppState = {
  records: BeautyRecord[];
  initialized: boolean;
};

// フォーム用
export type RecordFormValues = {
  date: string;

  /**
   * 旧：そのまま残す
   */
  time: string;

  /**
   * 新：入力用
   */
  startTime: string;
  endTime: string;

  category: RecordCategory;
  title: string;
  memo: string;
  imageIds: string[];
  status: RecordStatus;
};

// カスタムカテゴリ（新規追加用）
export type CustomCategory = {
  id: string;
  label: string;
  color: string;
};
