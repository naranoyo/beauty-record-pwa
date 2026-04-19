// app/records/page.tsx

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/state";
import { getImagesByIds } from "@/lib/image-storage";
import LinkButton from "@/components/ui/LinkButton";

function categoryLabel(category: string) {
  switch (category) {
    case "hair":
      return "髪型";
    case "diet":
      return "ダイエット";
    case "epilation":
      return "脱毛";
    case "nail":
      return "ネイル";
    case "skin":
      return "肌";
    case "memo":
      return "メモ";
    default:
      return "その他";
  }
}

function formatDateLabel(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);
}

export default function RecordsPage() {
  const { state } = useAppState();
  const [thumbMap, setThumbMap] = useState<Record<string, string>>({});

  const records = useMemo(() => state.records, [state.records]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const map: Record<string, string> = {};

      for (const record of records) {
        if (!record.imageIds || record.imageIds.length === 0) continue;

        try {
          const images = await getImagesByIds(record.imageIds);
          if (images[0]?.dataUrl) {
            map[record.id] = images[0].dataUrl;
          }
        } catch {
          // 読み込み失敗時は無視
        }
      }

      if (alive) {
        setThumbMap(map);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [records]);

  return (
    <main className="mx-auto w-full max-w-2xl p-4 pb-24">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">記録一覧</h1>
          <p className="mt-2 text-sm text-slate-600">
            保存した記録を一覧で確認できます。
          </p>
        </div>

        <LinkButton href="/records/new">新規追加</LinkButton>
      </div>

      {!state.initialized ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">読み込み中...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">まだ記録がありません。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => {
            const thumb = thumbMap[record.id];

            return (
              <Link
                key={record.id}
                href={`/records/${record.id}`}
                className="block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-pink-200 hover:shadow"
              >
                <div className="flex min-h-28">
                  <div className="relative w-28 shrink-0 bg-slate-100 sm:w-32">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
                          {categoryLabel(record.category)}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
                          {formatDateLabel(record.date)}
                        </span>

                        {record.imageIds.length > 0 ? (
                          <span className="rounded-full bg-pink-100 px-3 py-1 text-[11px] font-medium text-pink-600">
                            画像 {record.imageIds.length}件
                          </span>
                        ) : null}
                      </div>

                      <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                        {record.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {record.memo || "メモはありません。"}
                      </p>
                    </div>

                    <div className="mt-3 text-[11px] text-slate-400">
                      タップで詳細を見る
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
