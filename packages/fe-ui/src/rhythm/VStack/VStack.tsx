import { cn } from "@heroui/react";
import { cva } from "class-variance-authority";
import { Children, type ReactNode } from "react";

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
};

const vStackVariants = cva("flex flex-col gap-4", {
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
	},
	defaultVariants: {
		fullWidth: false,
	},
});

/**
 * VStack 컴포넌트
 * 자식 요소들을 세로(수직) 방향으로 배치하는 Flex 컨테이너입니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <VStack>
 *   <Input label="이름" />
 *   <Input label="이메일" />
 *   <Button>제출</Button>
 * </VStack>
 *
 * // 넉넉한 빈 상태 리듬
 * <VStack alignItems="center" justifyContent="center" fullWidth>
 *   <Logo />
 *   <Typography.Paragraph>환영합니다</Typography.Paragraph>
 * </VStack>
 * ```
 */
export const VStack = (props: VStackProps) => {
	const { children, className, alignItems, justifyContent, fullWidth } = props;

	return (
		<div
			className={cn(
				vStackVariants({
					alignItems,
					justifyContent,
					fullWidth,
				}),
				className,
			)}
		>
			{Children.toArray(children)}
		</div>
	);
};
