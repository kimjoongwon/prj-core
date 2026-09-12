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

export const stackGapRootClasses: Record<StackGap, { root: string }> = {
	flush: { root: "gap-0" },
	dense: { root: "gap-1" },
	inline: { root: "gap-2" },
	block: { root: "gap-3" },
	section: { root: "gap-4" },
	page: { root: "gap-6" },
	roomy: { root: "gap-8" },
};
