"use client";

import { observer } from "mobx-react-lite";
import { EmptyState } from "../../components/EmptyState";

/**
 * API 설계 페이지
 * REST API 엔드포인트 설계 및 문서화
 */
function ApiPage() {
	return (
		<div className="py-8">
			<EmptyState
				title="API 설계"
				description="REST API 엔드포인트 설계 및 스펙을 관리합니다."
			/>
		</div>
	);
}

export default observer(ApiPage);
