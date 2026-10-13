"use client";

import { Spinner } from "@heroui/react";

/**
 * users 세그먼트 로딩 fallback.
 * nuqs useQueryStates(useSearchParams) suspension과 세그먼트 전환 시
 * Next.js App Router가 이 컴포넌트를 segment level Suspense fallback으로 표시합니다.
 */
export default function UsersLoading() {
	return (
		<div className="flex min-h-80 items-center justify-center">
			<Spinner size="lg" />
		</div>
	);
}
