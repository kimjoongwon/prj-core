"use client";

import { observer } from "mobx-react-lite";
import { EmptyState } from "../../components/EmptyState";

/**
 * 화면 설계 페이지
 * UI/UX 화면 설계 및 와이어프레임
 */
function ScreensPage() {
	return (
		<div className="py-8">
			<EmptyState
				title="화면 설계"
				description="사용자 인터페이스 화면 설계 및 와이어프레임을 관리합니다."
			/>
		</div>
	);
}

export default observer(ScreensPage);
