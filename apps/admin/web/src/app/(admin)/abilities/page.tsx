"use client";

import dynamic from "next/dynamic";
import { Page, PageSurface, PageTitleBar, SectionSurface } from "@cocrepo/ui";

const AbilitiesPageClient = dynamic(() => import("./_client"), {
  ssr: false,
  loading: () => (
    <Page
      top={
        <PageTitleBar
          title="권한 목록"
          description="시스템에 등록된 CASL 권한을 관리합니다."
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

export default function AbilitiesPage() {
  return <AbilitiesPageClient />;
}
