"use client";

import { observer } from "mobx-react-lite";
import { EmptyState } from "../../components/EmptyState";

/**
 * 일정 페이지
 * 프로젝트 일정 및 타임라인
 */
function SchedulePage() {
	return (
		<div className="py-8">
			<EmptyState
				title="일정"
				description="프로젝트 일정 및 타임라인을 관리합니다."
			/>
		</div>
	);
}

export default observer(SchedulePage);
