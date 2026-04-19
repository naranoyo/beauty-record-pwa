// app/page.tsx

import PageContainer from "@/components/layout/PageContainer";
import TodayCard from "@/components/home/TodayCard";
import UpcomingCard from "@/components/home/UpcomingCard";
import RecentRecords from "@/components/home/RecentRecords";

export default function HomePage() {
  return (
    <PageContainer>
      <div className="grid gap-4">
        <TodayCard />
        <UpcomingCard />
        <RecentRecords />
      </div>
    </PageContainer>
  );
}
