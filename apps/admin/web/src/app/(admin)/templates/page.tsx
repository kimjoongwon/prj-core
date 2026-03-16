"use client";

import dynamic from "next/dynamic";
import { Page, PageSurface, PageTitleBar, SectionSurface } from "@cocrepo/ui";

const TemplatesPageClient = dynamic(() => import("./_client"), {
  ssr: false,
  loading: () => (
    <Page
      top={
        <PageTitleBar
          title="메시지 템플릿"
          description="시스템에 등록된 메시지 템플릿을 관리합니다."
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

export default function TemplatesPage() {
  return <TemplatesPageClient />;
}
