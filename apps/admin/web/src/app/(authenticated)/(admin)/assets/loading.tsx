import { Spinner } from "@heroui/react";

/** 에셋 route의 query-state 초기 준비를 기다리는 Suspense 경계입니다. */
export default function AssetsPageLoading() {
	return (
		<div className="flex min-h-64 items-center justify-center">
			<Spinner />
		</div>
	);
}
