import { SectionSurface, Typography } from "@cocrepo/ui";
import type { ReactNode } from "react";

export interface GallerySectionProps {
	id: string;
	title: string;
	description: string;
	children: ReactNode;
}

/** 갤러리의 한 카테고리를 표면과 제목·예시 묶음으로 감쌉니다. */
export function GallerySection({
	id,
	title,
	description,
	children,
}: GallerySectionProps) {
	return (
		<section id={id} className="scroll-mt-6">
			{/* shadow-surface는 twMerge가 variant의 shadow-none을 대체합니다.
			    그림자 토큰(--surface-shadow)이 패널에서 실시간 반영되는지 보여줍니다. */}
			<SectionSurface className="shadow-surface">
				<div className="flex flex-col gap-5 p-5">
					<div>
						<Typography.Heading level={2} weight="semibold">
							{title}
						</Typography.Heading>
						<Typography.Paragraph color="muted" size="sm" className="mt-1">
							{description}
						</Typography.Paragraph>
					</div>
					<div className="flex flex-col gap-6">{children}</div>
				</div>
			</SectionSurface>
		</section>
	);
}

export interface GalleryExampleProps {
	label: string;
	children: ReactNode;
	/** 예시 묶음 컨테이너 클래스. 기본값은 가로 flex 나열입니다. */
	className?: string;
}

/** 섹션 안의 한 예시 묶음에 라벨을 붙입니다. */
export function GalleryExample({
	label,
	children,
	className,
}: GalleryExampleProps) {
	return (
		<div className="flex flex-col gap-2">
			<p className="text-xs font-semibold tracking-wide text-muted uppercase">
				{label}
			</p>
			<div className={className ?? "flex flex-wrap items-center gap-3"}>
				{children}
			</div>
		</div>
	);
}
