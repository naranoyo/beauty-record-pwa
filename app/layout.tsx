// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { AppProvider } from "@/lib/state";
import NotificationBoot from "@/components/notifications/NotificationBoot";

export const metadata: Metadata = {
  title: "B-RECO",
  description: "美容・体型・髪型・メモを日付ごとに記録できるアプリ",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-pink-50 text-slate-900">
        <AppProvider>
          {/* 👇 ここに追加 */}
          <NotificationBoot />

          <div className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col bg-white shadow-sm">
            <AppHeader />
            <main className="flex-1 px-4 pb-24 pt-4">{children}</main>
            <BottomNav />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
