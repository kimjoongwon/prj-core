"use client";

import dynamic from "next/dynamic";
import { Page, PageSurface, PageTitleBar, SectionSurface } from "@cocrepo/ui";

const TimelinesPageClient = dynamic(() => import("./_client"), {
  ssr: false,
  loading: () => (
    <Page
      top={
        <PageTitleBar
          title="타임라인"
          description="학기/시즌 단위 타임라인을 관리합니다."
        />
      }
    >
      <PageSurface>
        <SectionSurface>
          <div className="h-32" />
        </SectionSurface>
      </PageSurface>
    </Page>
  ),
});

export default function TimelinesPage() {
  return <TimelinesPageClient />;
}
