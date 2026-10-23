"use client";

import { Button } from "@cocrepo/ui";
import { Plus, Search, Trash2 } from "lucide-react";
import { GalleryExample, GallerySection } from "../GallerySection";

const buttonVariantOptions = [
	{ value: "primary", label: "Primary" },
	{ value: "secondary", label: "Secondary" },
	{ value: "tertiary", label: "Tertiary" },
	{ value: "outline", label: "Outline" },
	{ value: "ghost", label: "Ghost" },
	{ value: "danger", label: "Danger" },
	{ value: "danger-soft", label: "Danger Soft" },
] as const;

export default function ButtonSection() {
	return (
		<GallerySection
			id="buttons"
			title="버튼"
			description="HeroUI v3 Button 래퍼입니다. variant가 색 의도까지 함께 표현합니다."
		>
			<GalleryExample label="variant">
				{buttonVariantOptions.map((variantOption) => (
					<Button key={variantOption.value} variant={variantOption.value}>
						{variantOption.label}
					</Button>
				))}
			</GalleryExample>
			<GalleryExample label="size">
				<Button size="sm">작게</Button>
				<Button size="md">보통</Button>
				<Button size="lg">크게</Button>
			</GalleryExample>
			<GalleryExample label="상태·구성">
				<Button variant="outline" isDisabled>
					비활성화
				</Button>
				<Button variant="primary" isLoading>
					저장 중
				</Button>
				<Button
					variant="primary"
					startContent={<Plus className="size-4" aria-hidden />}
				>
					항목 추가
				</Button>
				<Button
					variant="danger"
					endContent={<Trash2 className="size-4" aria-hidden />}
				>
					삭제
				</Button>
				<Button variant="outline" isIconOnly aria-label="검색">
					<Search className="size-4" aria-hidden />
				</Button>
			</GalleryExample>
			<GalleryExample label="fullWidth" className="flex flex-col gap-2">
				<Button variant="primary" fullWidth>
					전체 너비 버튼
				</Button>
			</GalleryExample>
		</GallerySection>
	);
}
