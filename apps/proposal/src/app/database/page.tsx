"use client";

import { observer } from "mobx-react-lite";
import { EmptyState } from "../../components/EmptyState";

/**
 * DB 설계 페이지
 * 데이터베이스 스키마 설계 및 ERD
 */
function DatabasePage() {
	return (
		<div className="py-8">
			<EmptyState
				title="DB 설계"
				description="데이터베이스 스키마 설계 및 ERD를 관리합니다."
			/>
		</div>
	);
}

export default observer(DatabasePage);
