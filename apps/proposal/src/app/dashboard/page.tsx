"use client";

import { EmptyState } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

/**
 * 대시보드 페이지
 * 프로젝트 현황 요약 및 주요 지표 표시
 */
function DashboardPage() {
	return (
		<div className="py-8">
			<EmptyState
				title="대시보드"
				description="프로젝트 현황 및 주요 지표를 한눈에 확인할 수 있습니다."
			/>
		</div>
	);
}

export default observer(DashboardPage);
