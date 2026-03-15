"use client";

import { Page, PageSurface, PageTitleBar, SectionSurface } from "@cocrepo/ui";
import dynamic from "next/dynamic";

const AssetsPageClient = dynamic(() => import("./_client"), {
	ssr: false,
	loading: () => (
		<Page
			top={
				<PageTitleBar
					title="에셋 관리"
					description="업로드된 에셋을 조회, 검색, 필터링하고 삭제할 수 있습니다."
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

export default function AssetsPage() {
	return <AssetsPageClient />;
}
