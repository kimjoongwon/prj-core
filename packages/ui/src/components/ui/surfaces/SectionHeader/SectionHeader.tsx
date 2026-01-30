import type { ReactNode } from "react";
import { Text } from "../../data-display/Text/Text";

export interface SectionHeaderProps {
	/** 헤더 텍스트 */
	children: ReactNode;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * SectionHeader 컴포넌트
 * 섹션의 제목을 대문자 캡션 스타일로 표시합니다.
 *
 * @example
 * ```tsx
 * <Section>
 *   <SectionHeader>기본 정보</SectionHeader>
 *   <Input label="이름" />
 * </Section>
 *
 * // 커스텀 스타일
 * <SectionHeader className="text-primary">필수 입력</SectionHeader>
 * ```
 */
export function SectionHeader({ children, className }: SectionHeaderProps) {
	return (
		<Text
			variant="caption"
			className={`uppercase mb-2${className ? ` ${className}` : ""}`}
		>
			{children}
		</Text>
	);
}
