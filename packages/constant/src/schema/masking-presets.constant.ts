/**
 * 마스킹 프리셋 상수
 *
 * Action.config에서 사용되는 마스킹 프리셋 이름
 */
export const MASKING_PRESETS = {
	EMAIL: "PRESET_EMAIL",
	PHONE: "PRESET_PHONE",
	NAME: "PRESET_NAME",
	SSN: "PRESET_SSN",
	CARD: "PRESET_CARD",
	ACCOUNT: "PRESET_ACCOUNT",
} as const;

export type MaskingPreset =
	(typeof MASKING_PRESETS)[keyof typeof MASKING_PRESETS];
