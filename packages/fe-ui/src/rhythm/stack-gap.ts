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
