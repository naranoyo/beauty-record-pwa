// components/calendar/CalendarImageThumbnail.tsx

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getImagesByIds } from "@/lib/image-storage";

type Props = {
  imageId: string;
};

export default function CalendarImageThumbnail({ imageId }: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const images = await getImagesByIds([imageId]);
        if (!active) return;

        setSrc(images[0]?.dataUrl ?? null);
      } catch (error) {
        console.error(error);
        if (!active) return;
        setSrc(null);
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [imageId]);

  if (!src) return null;

  return (
    <div className="mt-2 h-10 overflow-hidden rounded-xl bg-slate-100">
      <Image
        src={src}
        alt="カレンダー画像"
        width={120}
        height={80}
        unoptimized
        className="h-full w-full object-cover"
      />
    </div>
  );
}
