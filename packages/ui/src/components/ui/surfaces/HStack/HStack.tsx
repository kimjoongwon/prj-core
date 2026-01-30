import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

export interface HStackProps {
	/** 자식 요소들 */
	children?: ReactNode;
	/** 추가 CSS 클래스 */
	className?: string;
	/** 세로 정렬 (align-items) */
	alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
	/** 가로 정렬 (justify-content) */
	justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
	/** 전체 너비 사용 여부 */
	fullWidth?: boolean;
	/** 요소 간 간격 (px 단위) @default 4 */
	gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
}

const hStackVariants = cva("flex", {
	variants: {
		alignItems: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			stretch: "items-stretch",
			baseline: "items-baseline",
		},
		justifyContent: {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
			between: "justify-between",
			around: "justify-around",
			evenly: "justify-evenly",
		},
		fullWidth: {
			true: "w-full",
			false: "",
		},
		gap: {
			0: "gap-[0px]",
			1: "gap-[1px]",
			2: "gap-[2px]",
			3: "gap-[3px]",
			4: "gap-[4px]",
			5: "gap-[5px]",
			6: "gap-[6px]",
			8: "gap-[8px]",
			10: "gap-[10px]",
			12: "gap-[12px]",
			16: "gap-[16px]",
			20: "gap-[20px]",
			24: "gap-[24px]",
		},
	},
	defaultVariants: {
		fullWidth: false,
		gap: 4,
	},
});

/**
 * HStack 컴포넌트
 * 자식 요소들을 가로(수평) 방향으로 배치하는 Flex 컨테이너입니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <HStack gap={8}>
 *   <Button>취소</Button>
 *   <Button color="primary">확인</Button>
 * </HStack>
 *
 * // 정렬과 간격 조정
 * <HStack justifyContent="between" alignItems="center" fullWidth>
 *   <Logo />
 *   <UserMenu />
 * </HStack>
 * ```
 */
export const HStack = (props: HStackProps) => {
	const {
		children,
		className,
		alignItems,
		justifyContent,
		fullWidth,
		gap,
		...rest
	} = props;

	return (
		<div
			className={hStackVariants({
				alignItems,
				justifyContent,
				fullWidth,
				gap,
				className,
			})}
			{...rest}
		>
			{children}
		</div>
	);
};
