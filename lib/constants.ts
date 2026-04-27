// lib/constants.ts

export const APP_TEXT = {
  brand: "B-RECO",
  appTitle: "スケジュール記録",

  homeTodayTitle: "今日",
  homeTodayDescription: "日ごとのスケジュールを残して、あとで見返せます。",

  homeUpcomingTitle: "次回予定",
  homeUpcomingDescription:
    "次回予定の表示は、スケジュール項目がそろったあとに追加します。",

  homeRecentTitle: "最近のスケジュール",
  homeRecentEmpty:
    "まだスケジュールがありません。まずは1件追加してみましょう。",

  scheduleListTitle: "スケジュール一覧",
  scheduleAddTitle: "スケジュール追加",
  scheduleDetailTitle: "スケジュール詳細",
  scheduleEditTitle: "スケジュール編集",
  scheduleListTitleReturn: "スケジュール一覧へ戻る",

  // 👇ここ統一
  scheduleAddButton: "＋ スケジュール追加",
  scheduleEditButton: "スケジュールを編集する",
  scheduleSaveButton: "スケジュールを保存する",

  scheduleEmpty: "スケジュールがありません。",

  noMemo: "メモはありません。",
  loading: "読み込み中...",
} as const;

export const THEME = {
  pink: {
    primary: "bg-pink-500",
    primaryHover: "hover:bg-pink-600",

    // ⚠ Tailwind v4対策
    primaryText: "text-white!",

    light: "bg-pink-50",
    lightBorder: "border-pink-200",
    lightText: "text-pink-600",
    softBadge: "bg-pink-100 text-pink-700",
  },
} as const;
