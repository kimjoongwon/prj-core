import type React from "react";

export interface SpacerProps {
	/** 공간 크기 (px 단위) @default 4 */
	size?: number;
	/** 공간 방향 @default "vertical" */
	direction?: "horizontal" | "vertical";
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * Spacer 컴포넌트
 * 요소 사이에 빈 공간을 생성합니다.
 *
 * @example
 * ```tsx
 * // 세로 간격 (기본)
 * <VStack>
 *   <Text>위쪽</Text>
 *   <Spacer size={16} />
 *   <Text>아래쪽</Text>
 * </VStack>
 *
 * // 가로 간격
 * <HStack>
 *   <Button>왼쪽</Button>
 *   <Spacer size={8} direction="horizontal" />
 *   <Button>오른쪽</Button>
 * </HStack>
 * ```
 */
export const Spacer: React.FC<SpacerProps> = ({
	size = 4,
	direction = "vertical",
	className = "",
}) => {
	const spacingClass = `${direction === "horizontal" ? "w" : "h"}-[${size}px]`;

	return <div className={`${spacingClass} ${className}`} aria-hidden="true" />;
};
