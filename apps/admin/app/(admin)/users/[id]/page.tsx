import { Suspense } from "react";
import { MemberDetailContent } from "./_components";

/**
 * 로딩 스켈레톤
 */
function MemberDetailSkeleton() {
	return (
		<div className="flex flex-col gap-6 p-4 md:p-6">
			<div className="flex items-center gap-4">
				<div className="h-10 w-10 rounded-lg bg-default-200 animate-pulse" />
				<div className="flex flex-col gap-2">
					<div className="h-8 w-48 rounded bg-default-200 animate-pulse" />
					<div className="h-4 w-32 rounded bg-default-200 animate-pulse" />
				</div>
			</div>
			<div className="h-64 w-full rounded-lg bg-default-200 animate-pulse" />
			<div className="h-48 w-full rounded-lg bg-default-200 animate-pulse" />
		</div>
	);
}

/**
 * 회원 상세 페이지 (Server Component)
 *
 * Suspense로 감싸서 Next.js 16 Cache Components와 호환되도록 처리
 */
export default function MemberDetailPage() {
	return (
		<Suspense fallback={<MemberDetailSkeleton />}>
			<MemberDetailContent />
		</Suspense>
	);
}
