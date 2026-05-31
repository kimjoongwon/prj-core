import type React from "react";
import { cn } from "../../design-system/primitives";
import {
	isRhythmPreset,
	type RhythmPreset,
	resolveRhythmValue,
	rhythmDefaults,
} from "../presets";
import { getRhythmTailwindAxisClass } from "../tokens";

export interface SpacerProps {
	/** 공간 크기. numeric 값은 px, semantic preset은 권장 rhythm token입니다. */
	size?: number | RhythmPreset;
	/** 가로 여백 shortcut. 지정되면 direction보다 우선합니다. */
	x?: number | RhythmPreset;
	/** 세로 여백 shortcut. 지정되면 direction보다 우선합니다. */
	y?: number | RhythmPreset;
	/** 공간 방향 @default "vertical" */
	direction?: "horizontal" | "vertical";
	/** 추가 CSS 클래스 */
	className?: string;
}

function resolveSpacerAxisClass(
	axis: "x" | "y",
	value: number | RhythmPreset | undefined,
): string | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (typeof value === "number") {
		return `${axis === "x" ? "w" : "h"}-[${value}px]`;
	}

	if (isRhythmPreset(value)) {
		return getRhythmTailwindAxisClass(
			axis,
			resolveRhythmValue(value, rhythmDefaults.spacerPreset),
		);
	}

	return undefined;
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
 *   <Spacer size="section" />
 *   <Text>아래쪽</Text>
 * </VStack>
 *
 * // 가로 간격
 * <HStack>
 *   <Button>왼쪽</Button>
 *   <Spacer x="inline" />
 *   <Button>오른쪽</Button>
 * </HStack>
 * ```
 */
export const Spacer: React.FC<SpacerProps> = ({
	size = 4,
	x,
	y,
	direction = "vertical",
	className = "",
}) => {
	const xClassName = resolveSpacerAxisClass("x", x);
	const yClassName = resolveSpacerAxisClass("y", y);
	const sizeClassName =
		xClassName || yClassName
			? undefined
			: resolveSpacerAxisClass(direction === "horizontal" ? "x" : "y", size);

	return (
		<div
			className={cn(xClassName, yClassName, sizeClassName, className)}
			aria-hidden="true"
		/>
	);
};
