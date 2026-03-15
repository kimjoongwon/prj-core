"use client";

import { Page, PageSurface, PageTitleBar, SectionSurface } from "@cocrepo/ui";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const AssetDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
	loading: () => (
		<Page top={<PageTitleBar title="에셋 상세" description="로딩 중..." />}>
			<PageSurface>
				<SectionSurface>
					<div className="h-32" />
				</SectionSurface>
			</PageSurface>
		</Page>
	),
});

export default function AssetDetailPage() {
	const params = useParams<{ assetId: string }>();
	return <AssetDetailPageClient assetId={params.assetId} />;
}
