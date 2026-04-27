// app/page.tsx

"use client";

import PageContainer from "@/components/layout/PageContainer";
import TodayCard from "@/components/home/TodayCard";
import UpcomingCard from "@/components/home/UpcomingCard";
import RecentRecords from "@/components/home/RecentRecords";
import { useAppState } from "@/lib/state";

export default function HomePage() {
  const { state } = useAppState();

  return (
    <PageContainer>
      <div className="grid gap-4">
        <TodayCard />
        <UpcomingCard records={state.records} />
        <RecentRecords />
      </div>
    </PageContainer>
  );
}
