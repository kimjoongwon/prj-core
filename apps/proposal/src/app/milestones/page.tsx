"use client";

import { observer } from "mobx-react-lite";
import { EmptyState } from "../../components/EmptyState";

/**
 * 마일스톤 페이지
 * 프로젝트 마일스톤 및 릴리스 계획
 */
function MilestonesPage() {
	return (
		<div className="py-8">
			<EmptyState
				title="마일스톤"
				description="프로젝트 마일스톤 및 릴리스 계획을 관리합니다."
			/>
		</div>
	);
}

export default observer(MilestonesPage);
