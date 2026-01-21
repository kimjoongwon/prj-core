/**
 * Action 설정 관련 타입 정의
 *
 * @description
 * CASL Action.config에서 사용되는 마스킹, 포맷팅, 변환 설정 타입
 */

/**
 * Action 마스킹 설정 인터페이스
 *
 * @description
 * Action.config에 저장되는 마스킹 설정을 정의합니다.
 *
 * @example
 * // 프리셋 마스킹
 * { type: "masking", preset: "PRESET_EMAIL" }
 *
 * // 커스텀 패턴 마스킹
 * { type: "masking", pattern: "^(.{3}).*(.{2})$", replacement: "$1***$2" }
 */
export interface ActionMaskingConfig {
	type: "masking";
	/** 마스킹 프리셋 이름 (PRESET_EMAIL, PRESET_PHONE 등) */
	preset?: string;
	/** 커스텀 정규식 패턴 */
	pattern?: string;
	/** 치환 문자열 ($1, $2 등 캡처 그룹 사용 가능) */
	replacement?: string;
}

/**
 * Action 포맷팅 설정 인터페이스
 *
 * @example
 * { type: "format", pattern: "YYYY-MM-DD" }
 */
export interface ActionFormatConfig {
	type: "format";
	/** 포맷 패턴 (날짜: 'YYYY-MM-DD', 숫자: '#,###' 등) */
	pattern: string;
}

/**
 * Action 변환 설정 인터페이스
 *
 * @example
 * { type: "transform", rule: "uppercase" }
 */
export interface ActionTransformConfig {
	type: "transform";
	/** 변환 규칙 ('uppercase', 'lowercase', 'capitalize' 등) */
	rule: string;
}

/**
 * Action 설정 유니온 타입
 *
 * @description
 * Action.config 필드에 저장될 수 있는 모든 설정 타입
 */
export type ActionConfig =
	| ActionMaskingConfig
	| ActionFormatConfig
	| ActionTransformConfig
	| null;
