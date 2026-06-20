"use client";

import { useFeaturePermission } from "@cocrepo/store";
import type { ReactNode } from "react";

export interface CanFeatureProps {
	/**
	 * 기능 이름 (feature: 접두어 없이)
	 * 예: "export", "bulk-edit", "advanced-search"
	 */
	feature: string;
	/**
	 * 기능 사용 권한이 있을 때 렌더링할 내용
	 */
	children: ReactNode;
	/**
	 * 기능 사용 권한이 없을 때 렌더링할 대체 내용 (선택)
	 */
	fallback?: ReactNode;
}

/**
 * CanFeature 컴포넌트 - 기능 사용 권한이 있을 때만 children을 렌더링
 *
 * 사용 예시:
 * ```tsx
 * <CanFeature feature="export">
 *   <Button>내보내기</Button>
 * </CanFeature>
 *
 * <CanFeature feature="bulk-edit" fallback={<UpgradePrompt />}>
 *   <BulkEditPanel />
 * </CanFeature>
 * ```
 */
export function CanFeature({
	feature,
	children,
	fallback = null,
}: CanFeatureProps) {
	const hasPermission = useFeaturePermission(feature);

	if (hasPermission) {
		return <>{children}</>;
	}

	return <>{fallback}</>;
}
