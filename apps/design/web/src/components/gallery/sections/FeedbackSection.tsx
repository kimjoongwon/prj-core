"use client";

import { Alert, EmptyState, Skeleton, UnderConstruction } from "@cocrepo/ui";
import { GalleryExample, GallerySection } from "../GallerySection";

const alertStatusOptions = [
	{ value: "default", label: "안내" },
	{ value: "accent", label: "강조" },
	{ value: "success", label: "성공" },
	{ value: "warning", label: "주의" },
	{ value: "danger", label: "위험" },
] as const;

export default function FeedbackSection() {
	return (
		<GallerySection
			id="feedback"
			title="피드백"
			description="상태 안내, 빈 상태, 로딩 자리표시자, 준비 중 안내입니다."
		>
			<GalleryExample label="Alert" className="flex flex-col gap-3">
				{alertStatusOptions.map((statusOption) => (
					<Alert
						key={statusOption.value}
						status={statusOption.value}
						title={`${statusOption.label} 상태`}
						description="상태별 Alert 표시 예시입니다."
					/>
				))}
			</GalleryExample>
			<GalleryExample label="EmptyState" className="block">
				<EmptyState
					title="아직 북마크가 없습니다"
					description="마음에 드는 사이트를 저장해 보세요."
					statusLabel="빈 상태"
				/>
			</GalleryExample>
			<GalleryExample label="Skeleton">
				<div className="flex w-full max-w-md items-center gap-3">
					<Skeleton className="size-12 rounded-full" />
					<div className="flex flex-1 flex-col gap-2">
						<Skeleton className="h-4 w-2/5 rounded-lg" />
						<Skeleton className="h-4 w-4/5 rounded-lg" />
					</div>
				</div>
			</GalleryExample>
			<GalleryExample label="UnderConstruction" className="block">
				<UnderConstruction
					title="컬러 팔레트 비교 뷰"
					description="준비 중인 기능 안내 예시입니다."
				/>
			</GalleryExample>
		</GallerySection>
	);
}
