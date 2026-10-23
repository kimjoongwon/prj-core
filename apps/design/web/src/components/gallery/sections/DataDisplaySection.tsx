"use client";

import {
	Chip,
	DogPawIcon,
	HStack,
	InfoIcon,
	StarIcon,
	Typography,
	WarningIcon,
} from "@cocrepo/ui";
import { GalleryExample, GallerySection } from "../GallerySection";

const chipVariantOptions = [
	"primary",
	"secondary",
	"soft",
	"tertiary",
] as const;

const chipColorOptions = [
	{ value: "default", label: "기본" },
	{ value: "accent", label: "액센트" },
	{ value: "success", label: "성공" },
	{ value: "warning", label: "주의" },
	{ value: "danger", label: "위험" },
] as const;

export default function DataDisplaySection() {
	return (
		<GallerySection
			id="data-display"
			title="데이터 표시"
			description="칩, 타이포그래피, 인라인 아이콘입니다."
		>
			{chipVariantOptions.map((chipVariant) => (
				<GalleryExample key={chipVariant} label={`Chip · ${chipVariant}`}>
					{chipColorOptions.map((colorOption) => (
						<Chip
							key={colorOption.value}
							variant={chipVariant}
							color={colorOption.value}
						>
							{colorOption.label}
						</Chip>
					))}
				</GalleryExample>
			))}
			<GalleryExample label="Typography" className="block">
				<div className="flex flex-col gap-2">
					<Typography.Heading level={1} weight="bold">
						Heading 1 — 디자인 아카이브
					</Typography.Heading>
					<Typography.Heading level={2} weight="semibold">
						Heading 2 — 카테고리 제목
					</Typography.Heading>
					<Typography.Heading level={3} weight="medium">
						Heading 3 — 카드 제목
					</Typography.Heading>
					<Typography.Paragraph>
						Paragraph — 살아있는 서비스는 분야별로 쌓고, 폐업·방치된 곳은 제외
						이력으로 남깁니다.
					</Typography.Paragraph>
					<Typography.Paragraph color="muted">
						Paragraph muted — 보조 설명에 쓰는 톤입니다.
					</Typography.Paragraph>
					<Typography.Code>--accent: oklch(0.6204 0.195 253.83)</Typography.Code>
				</div>
			</GalleryExample>
			<GalleryExample label="인라인 아이콘">
				<HStack gap="section" alignItems="center">
					<InfoIcon size={24} />
					<StarIcon size={24} />
					<WarningIcon size={24} />
					<DogPawIcon size={24} />
				</HStack>
			</GalleryExample>
		</GallerySection>
	);
}
