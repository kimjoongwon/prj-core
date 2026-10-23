import type { Metadata } from "next";
import ComponentGalleryExplorer from "@/components/gallery/ComponentGalleryExplorer";

export const metadata: Metadata = {
	title: "UI 키트 — 디자인 링크 아카이브",
	description:
		"@cocrepo/ui 구성요소 갤러리와 디자인 토큰 기반 톤앤매너 탐색기입니다.",
};

export default function ComponentGalleryPage() {
	return <ComponentGalleryExplorer />;
}
