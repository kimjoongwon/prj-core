/**
 * VStack/HStack이 공유하는 시맨틱 간격 체계입니다.
 * 이름과 용도는 저장소 루트 DESIGN.md의 Rhythm Primitives 표를 따릅니다.
 */
export type StackGap =
	| "flush"
	| "dense"
	| "inline"
	| "block"
	| "section"
	| "page"
	| "roomy";

export const stackGapClasses: Record<StackGap, string> = {
	flush: "gap-0",
	dense: "gap-1",
	inline: "gap-2",
	block: "gap-3",
	section: "gap-4",
	page: "gap-6",
	roomy: "gap-8",
};

/** 시맨틱 리듬이 Tailwind `gap-N`의 N(0.25rem 단위)에 대응하는 값입니다. */
export const stackGapTailwindUnits: Record<StackGap, number> = {
	flush: 0,
	dense: 1,
	inline: 2,
	block: 3,
	section: 4,
	page: 6,
	roomy: 8,
};

const stackGapByTailwindUnits = new Map<number, StackGap>(
	(Object.keys(stackGapTailwindUnits) as StackGap[]).map((gap) => [
		stackGapTailwindUnits[gap],
		gap,
	]),
);

/**
 * 계산된 간격(px)을 시맨틱 리듬으로 역산합니다.
 * Tailwind `gap-N`은 N × 0.25rem이므로 문서 root font-size로 단위를 정규화하며,
 * 시맨틱 표에 없는 값은 null을 반환합니다.
 */
export function resolveStackGapFromPixels(
	gapPixels: number,
	rootFontSizePixels: number,
): StackGap | null {
	if (!Number.isFinite(gapPixels) || rootFontSizePixels <= 0) {
		return null;
	}
	const exactTailwindUnits = gapPixels / (rootFontSizePixels * 0.25);
	const tailwindUnits = Math.round(exactTailwindUnits);
	// 단위와 단계 사이 중간값(예: 10px = 2.5단위)은 시맨틱 표 밖으로 판정합니다.
	if (Math.abs(exactTailwindUnits - tailwindUnits) > 0.25) {
		return null;
	}
	return stackGapByTailwindUnits.get(tailwindUnits) ?? null;
}
