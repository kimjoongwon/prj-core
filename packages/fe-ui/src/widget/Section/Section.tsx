import type { ReactNode } from "react";

export interface SectionProps {
	/** 섹션 내부 콘텐츠 */
	children: ReactNode;
}

/**
 * Section 컴포넌트
 * 테두리와 패딩이 적용된 기본 섹션 영역입니다.
 *
 * @example
 * ```tsx
 * <Section>
 *   <PageTitleBar level={2} title="기본 정보" />
 *   <Input label="이름" />
 *   <Input label="이메일" />
 * </Section>
 * ```
 */
export const Section = (props: SectionProps) => {
	const { children } = props;
	return (
		<div className="flex w-full flex-1 flex-col space-y-4 rounded-xl border-1 p-4">
			{children}
		</div>
	);
};
