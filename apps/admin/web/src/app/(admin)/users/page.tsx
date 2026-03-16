"use client";

import dynamic from "next/dynamic";
import { Page, PageSurface, PageTitleBar, SectionSurface } from "@cocrepo/ui";

const UsersPageClient = dynamic(() => import("./_client"), {
  ssr: false,
  loading: () => (
    <Page
      top={
        <PageTitleBar
          title="이용자 목록"
          description="시스템에 등록된 이용자를 조회합니다."
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

export default function UsersPage() {
  return <UsersPageClient />;
}
