import type { RhythmScaleValue } from "./tokens";

export const rhythmPresets = {
	flush: {
		value: 0,
		description: "추가 간격 없이 맞닿아야 하는 그룹",
	},
	dense: {
		value: 1,
		description: "메타데이터, 보조 텍스트, 짧은 보조 그룹",
	},
	inline: {
		value: 2,
		description: "버튼 행, 배지/필터 칩, 짧은 액션 묶음",
	},
	block: {
		value: 3,
		description: "제목-본문, 카드 내부의 작은 블록",
	},
	section: {
		value: 4,
		description: "섹션 내부 기본 수직 리듬",
	},
	page: {
		value: 5,
		description: "페이지 레벨 주요 블록 사이 간격",
	},
	roomy: {
		value: 6,
		description: "빈 상태, 로그인/로딩, 강조 카드 같은 넉넉한 리듬",
	},
} as const satisfies Record<
	string,
	{ value: RhythmScaleValue; description: string }
>;

export type RhythmPreset = keyof typeof rhythmPresets;
export type RhythmValue = RhythmPreset | RhythmScaleValue;

export const rhythmDefaults = {
	hStack: "inline",
	vStack: "section",
} as const satisfies Record<string, RhythmPreset>;

export function isRhythmPreset(value: unknown): value is RhythmPreset {
	return typeof value === "string" && value in rhythmPresets;
}

export function resolveRhythmValue(
	value: RhythmValue | undefined,
	fallback: RhythmPreset,
): RhythmScaleValue {
	if (value === undefined) {
		return rhythmPresets[fallback].value;
	}

	if (isRhythmPreset(value)) {
		return rhythmPresets[value].value;
	}

	return value;
}
