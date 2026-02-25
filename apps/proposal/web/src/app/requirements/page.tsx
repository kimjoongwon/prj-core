import type { Metadata } from "next";

import { RequirementsPageClient } from "./_client";

export const metadata: Metadata = {
	title: "요구사항 그래프 | Proposal",
	description: "요구사항 계층 구조를 그래프로 시각화하고 AI로 분석합니다.",
};

export default function RequirementsPage() {
	return <RequirementsPageClient />;
}
