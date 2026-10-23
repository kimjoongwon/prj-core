"use client";

import {
	HStack,
	ScreenSurface,
	ScrollShadow,
	SectionSurface,
	Separator,
	Surface,
	Typography,
	VStack,
	type StackGap,
} from "@cocrepo/ui";
import { GalleryExample, GallerySection } from "../GallerySection";

const surfaceVariantOptions = [
	{ value: "default", label: "default — 카드 표면" },
	{ value: "secondary", label: "secondary — 기본 패널" },
	{ value: "tertiary", label: "tertiary — 중첩 패널" },
	{ value: "transparent", label: "transparent — 배경 없음" },
] as const;

const stackGapExamples: { value: StackGap; label: string }[] = [
	{ value: "flush", label: "0px" },
	{ value: "dense", label: "4px" },
	{ value: "inline", label: "8px" },
	{ value: "block", label: "12px" },
	{ value: "section", label: "16px" },
	{ value: "page", label: "24px" },
	{ value: "roomy", label: "32px" },
];

const scrollShadowItems = Array.from({ length: 12 }, (_, index) => index + 1);

export default function SurfaceRhythmSection() {
	return (
		<GallerySection
			id="surface-rhythm"
			title="표면·리듬"
			description="컨텐츠를 담는 표면 변형과 VStack/HStack의 시맨틱 간격 체계입니다."
		>
			<GalleryExample
				label="Surface 변형"
				className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
			>
				{surfaceVariantOptions.map((variantOption) => (
					<Surface key={variantOption.value} variant={variantOption.value}>
						<div className="p-4 text-sm">{variantOption.label}</div>
					</Surface>
				))}
			</GalleryExample>
			<GalleryExample
				label="SectionSurface · ScreenSurface"
				className="grid gap-3 sm:grid-cols-2"
			>
				<SectionSurface>
					<div className="p-4 text-sm">SectionSurface — 섹션 단위 표면</div>
				</SectionSurface>
				<ScreenSurface>
					<div className="p-4 text-sm">ScreenSurface — 화면 단위 표면</div>
				</ScreenSurface>
			</GalleryExample>
			<GalleryExample label="Separator" className="block">
				<div className="flex flex-col gap-4 py-2">
					<Typography.Paragraph>구분선 위 콘텐츠</Typography.Paragraph>
					<Separator />
					<Typography.Paragraph>구분선 아래 콘텐츠</Typography.Paragraph>
				</div>
			</GalleryExample>
			<GalleryExample label="리듬 갭 스케일" className="flex flex-col gap-3">
				{stackGapExamples.map((gapExample) => (
					<div key={gapExample.value} className="flex items-center gap-3">
						<span className="w-20 shrink-0 font-mono text-xs text-muted">
							{gapExample.value} · {gapExample.label}
						</span>
						<HStack gap={gapExample.value}>
							<span className="rounded-md bg-accent px-3 py-1.5 text-sm text-accent-foreground">
								박스
							</span>
							<span className="rounded-md bg-default px-3 py-1.5 text-sm">
								박스
							</span>
						</HStack>
					</div>
				))}
			</GalleryExample>
			<GalleryExample label="VStack · ScrollShadow">
				<div className="grid max-w-xl gap-6 sm:grid-cols-2">
					<VStack gap="block">
						<span className="rounded-md bg-surface-secondary px-3 py-1.5 text-sm">
							위쪽 항목
						</span>
						<span className="rounded-md bg-surface-secondary px-3 py-1.5 text-sm">
							아래쪽 항목
						</span>
					</VStack>
					<ScrollShadow className="h-32 rounded-lg border border-border p-3">
						<ul className="flex flex-col gap-2 text-sm">
							{scrollShadowItems.map((item) => (
								<li key={item} className="rounded-md bg-default px-2 py-1">
									스크롤 항목 {item}
								</li>
							))}
						</ul>
					</ScrollShadow>
				</div>
			</GalleryExample>
		</GallerySection>
	);
}
