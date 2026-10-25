import { type IntegrationUlid, isIntegrationUlid } from "@cocrepo/type";

/**
 * 와이어 식별자는 공개 ULID 문자열입니다.
 * 구 decimal 문자열과 bigint 입력은 더 이상 와이어 계약이 아니므로 거부합니다.
 */
export function isWireId(value: unknown): value is IntegrationUlid {
	return isIntegrationUlid(value);
}

export function toWireId(value: unknown): IntegrationUlid | null {
	return isIntegrationUlid(value) ? value : null;
}

export function isSameWireId(
	a: string | null | undefined,
	b: string | null | undefined,
): boolean {
	return a === b;
}
