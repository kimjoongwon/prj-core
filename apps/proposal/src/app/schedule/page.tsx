"use client";

import { EmptyState } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

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
