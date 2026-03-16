"use client";

import dynamic from "next/dynamic";
import { Page, PageSurface, PageTitleBar, SectionSurface } from "@cocrepo/ui";

const RoutinesPageClient = dynamic(() => import("./_client"), {
  ssr: false,
  loading: () => (
    <Page
      top={
        <PageTitleBar
          title="루틴"
          description="운동 루틴(커리큘럼)을 관리합니다."
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

export default function RoutinesPage() {
  return <RoutinesPageClient />;
}
