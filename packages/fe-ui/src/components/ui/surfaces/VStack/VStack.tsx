import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

export type VStackProps = {
	/** 자식 요소들 */
	children?: ReactNode;
	/** 추가 CSS 클래스 */
	className?: string;
	/** 가로 정렬 (align-items) */
	alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
	/** 세로 정렬 (justify-content) */
	justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
	/** 전체 너비 사용 여부 */
	fullWidth?: boolean;
	/** 요소 간 간격 (Tailwind spacing 단위) @default 4 */
	gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
};

const vStackVariants = cva("flex flex-col", {
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
			0: "gap-0",
			1: "gap-1",
			2: "gap-2",
			3: "gap-3",
			4: "gap-4",
			5: "gap-5",
			6: "gap-6",
			8: "gap-8",
			10: "gap-10",
			12: "gap-12",
			16: "gap-16",
			20: "gap-20",
			24: "gap-24",
		},
	},
	defaultVariants: {
		fullWidth: false,
		gap: 4,
	},
});

/**
 * VStack 컴포넌트
 * 자식 요소들을 세로(수직) 방향으로 배치하는 Flex 컨테이너입니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <VStack gap={4}>
 *   <Input label="이름" />
 *   <Input label="이메일" />
 *   <Button>제출</Button>
 * </VStack>
 *
 * // 중앙 정렬
 * <VStack alignItems="center" justifyContent="center" fullWidth>
 *   <Logo />
 *   <Text>환영합니다</Text>
 * </VStack>
 * ```
 */
export const VStack = (props: VStackProps) => {
	const { children, className, alignItems, justifyContent, fullWidth, gap } =
		props;

	return (
		<div
			className={vStackVariants({
				alignItems,
				justifyContent,
				fullWidth,
				gap,
				className,
			})}
		>
			{children}
		</div>
	);
};
