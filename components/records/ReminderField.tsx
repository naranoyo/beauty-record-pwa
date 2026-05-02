// components/records/ReminderField.tsx

"use client";

export type ReminderSetting = {
  amount: number;
  unit: "分" | "時間" | "日" | "週";
  time?: string;
};

type Props = {
  enabled: boolean;
  reminders: ReminderSetting[];
  onChangeEnabled: (value: boolean) => void;
  onChangeReminders: (value: ReminderSetting[]) => void;
};

const DEFAULT_REMINDER: ReminderSetting = {
  amount: 1,
  unit: "日",
  time: "09:00",
};

export default function ReminderField({
  enabled,
  reminders,
  onChangeEnabled,
  onChangeReminders,
}: Props) {
  const safeReminders = reminders.length > 0 ? reminders : [DEFAULT_REMINDER];

  const addReminder = () => {
    onChangeReminders([...safeReminders, DEFAULT_REMINDER]);
  };

  const updateReminder = (
    index: number,
    nextValue: Partial<ReminderSetting>
  ) => {
    onChangeReminders(
      safeReminders.map((item, i) =>
        i === index ? { ...item, ...nextValue } : item
      )
    );
  };

  const removeReminder = (index: number) => {
    onChangeReminders(safeReminders.filter((_, i) => i !== index));
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">
            🔔
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">通知</h3>
            <p className="mt-1 text-xs font-medium text-slate-500">
              通知タイミングを設定できます
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChangeEnabled(!enabled)}
          className={[
            "rounded-full px-4 py-2 text-xs font-bold shadow-sm active:scale-[0.98]",
            enabled ? "bg-pink-500 text-white!" : "bg-slate-100 text-slate-500",
          ].join(" ")}
        >
          {enabled ? "ON" : "OFF"}
        </button>
      </div>

      {enabled ? (
        <div className="space-y-3">
          {safeReminders.map((reminder, index) => (
            <div
              key={`${reminder.amount}_${reminder.unit}_${index}`}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-sm font-bold text-slate-700">通知</span>

              <input
                type="number"
                min={1}
                value={reminder.amount}
                onChange={(e) =>
                  updateReminder(index, {
                    amount: Math.max(1, Number(e.target.value) || 1),
                  })
                }
                className="h-10 w-14 rounded-xl border border-slate-200 bg-slate-100 text-center text-sm font-bold outline-none"
              />

              <select
                value={reminder.unit}
                onChange={(e) =>
                  updateReminder(index, {
                    unit: e.target.value as ReminderSetting["unit"],
                  })
                }
                className="h-10 rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-bold outline-none"
              >
                <option value="分">分</option>
                <option value="時間">時間</option>
                <option value="日">日</option>
                <option value="週">週</option>
              </select>

              <span className="text-sm font-bold text-slate-600">前の</span>

              {(reminder.unit === "日" || reminder.unit === "週") && (
                <input
                  type="time"
                  value={reminder.time ?? "09:00"}
                  onChange={(e) =>
                    updateReminder(index, {
                      time: e.target.value,
                    })
                  }
                  className="h-10 w-24 rounded-xl border border-slate-200 bg-slate-100 px-2 text-sm font-bold outline-none"
                />
              )}

              <button
                type="button"
                onClick={() => removeReminder(index)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-500 shadow-sm"
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addReminder}
            className="text-sm font-bold text-blue-600"
          >
            通知を追加
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">
          通知はOFFです
        </div>
      )}
    </section>
  );
}
