/**
 * 외부 integration/protocol 경계에서만 사용하는 ULID 문자열 타입입니다.
 */
export type IntegrationUlid = string & {
	readonly __integrationUlidBrand: unique symbol;
};

/**
 * integration ULID 문자열을 검증하는 정규식 source입니다.
 */
export const INTEGRATION_ULID_PATTERN_SOURCE = "^[0-9A-HJKMNP-TV-Z]{26}$";

/**
 * integration ULID 문자열을 검증하는 정규식입니다.
 */
export const INTEGRATION_ULID_PATTERN = new RegExp(
	INTEGRATION_ULID_PATTERN_SOURCE,
);

/**
 * 입력값이 integration ULID인지 판별합니다.
 *
 * @param value 검사할 입력값
 * @returns ULID 여부
 */
export function isIntegrationUlid(value: unknown): value is IntegrationUlid {
	return typeof value === "string" && INTEGRATION_ULID_PATTERN.test(value);
}

/**
 * integration ULID 문자열을 brand 타입으로 반환합니다.
 *
 * @param value 검증할 ULID 문자열
 * @returns 유효한 ULID면 brand 타입, 아니면 null
 */
export function parseIntegrationUlid(value: string): IntegrationUlid | null {
	if (!isIntegrationUlid(value)) {
		return null;
	}

	return value;
}
