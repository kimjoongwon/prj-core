import type { ReactNode } from "react";
import { Text } from "../../ui/data-display/Text/Text";

export interface SectionHeaderProps {
	/** 섹션 제목 (h2) */
	title?: ReactNode;
	/** 섹션 설명 */
	description?: ReactNode;
	/** 우측 액션 영역 */
	actions?: ReactNode;
	/** 하위호환용 캡션 콘텐츠 */
	children?: ReactNode;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * SectionHeader 컴포넌트
 * 섹션 상단의 제목/설명/액션 영역을 표준화합니다.
 * title이 없고 children만 전달되면 기존 캡션 스타일을 유지합니다.
 *
 * @example
 * ```tsx
 * <SectionHeader title="기본 정보" />
 * <SectionHeader title="프로그램 목록" actions={<Button>추가</Button>} />
 * ```
 */
export function SectionHeader({
	title,
	description,
	actions,
	children,
	className,
}: SectionHeaderProps) {
	if (title !== undefined || description !== undefined || actions !== undefined) {
		return (
			<div
				className={`flex items-start justify-between gap-3${className ? ` ${className}` : ""}`}
			>
				<div className="flex items-start gap-2">
					<div>
						{title && <h2>{title}</h2>}
						{description && <p>{description}</p>}
					</div>
				</div>
				{actions && <div>{actions}</div>}
			</div>
		);
	}

	return (
		<Text
			variant="caption"
			className={`uppercase mb-2${className ? ` ${className}` : ""}`}
		>
			{children ?? null}
		</Text>
	);
}
