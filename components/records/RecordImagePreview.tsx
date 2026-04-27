// components/records/RecordImagePreview.tsx

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  deleteImageById,
  getImagesByIds,
  type StoredImage,
} from "@/lib/image-storage";

type Props = {
  imageIds: string[];
  editable?: boolean;
  onChange?: (nextImageIds: string[]) => void;
};

export default function RecordImagePreview({
  imageIds,
  editable = false,
  onChange,
}: Props) {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<StoredImage | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (imageIds.length === 0) {
        setImages([]);
        return;
      }

      try {
        setLoading(true);

        const list = await getImagesByIds(imageIds);

        if (!active) return;

        setImages(list);
      } catch (error) {
        console.error(error);

        if (!active) return;

        setImages([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [imageIds]);

  const handleRemove = async (id: string) => {
    if (!editable || !onChange) return;

    const ok = window.confirm("この画像を削除しますか？");
    if (!ok) return;

    try {
      await deleteImageById(id);

      const nextIds = imageIds.filter((imageId) => imageId !== id);
      onChange(nextIds);
    } catch (error) {
      console.error(error);
      alert("画像の削除に失敗しました。");
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        画像を読み込み中...
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        画像はまだありません。
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <button
              type="button"
              onClick={() => setSelectedImage(image)}
              className="relative block aspect-square w-full bg-slate-100"
            >
              <Image
                src={image.dataUrl}
                alt="スケジュール画像"
                fill
                unoptimized
                className="object-cover"
              />
            </button>

            {editable ? (
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => handleRemove(image.id)}
                  className="w-full rounded-xl border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  画像を削除
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {selectedImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-2 top-2 z-10 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm"
            >
              閉じる
            </button>

            <div className="relative aspect-square overflow-hidden rounded-3xl bg-black">
              <Image
                src={selectedImage.dataUrl}
                alt="拡大画像"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
