import { cn } from "@heroui/react";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import {
	isRhythmPreset,
	resolveRhythmValue,
	rhythmDefaults,
	type RhythmValue,
} from "../presets";
import {
	getRhythmLegacyPixelGapClass,
	getRhythmTailwindGapClass,
	type RhythmScaleValue,
} from "../tokens";

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
	/** 요소 간 간격. semantic preset 사용을 권장하고, numeric 값은 legacy px 의미를 유지합니다. */
	gap?: RhythmValue;
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
	},
	defaultVariants: {
		fullWidth: false,
	},
});

const HSTACK_DEFAULT_LEGACY_GAP = 4 satisfies RhythmScaleValue;

/**
 * HStack 컴포넌트
 * 자식 요소들을 가로(수평) 방향으로 배치하는 Flex 컨테이너입니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <HStack gap="inline">
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
	const gapClassName =
		gap === undefined
			? getRhythmLegacyPixelGapClass(HSTACK_DEFAULT_LEGACY_GAP)
			: isRhythmPreset(gap)
				? getRhythmTailwindGapClass(
						resolveRhythmValue(gap, rhythmDefaults.hStackPreset),
					)
				: getRhythmLegacyPixelGapClass(gap);

	return (
		<div
			className={cn(
				hStackVariants({
					alignItems,
					justifyContent,
					fullWidth,
				}),
				gapClassName,
				className,
			)}
			{...rest}
		>
			{children}
		</div>
	);
};
