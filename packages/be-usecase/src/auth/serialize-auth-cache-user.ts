import { stringifyBigIntJson } from "@cocrepo/type/bigint-json";

/**
 * bigint를 포함한 인증 사용자 스냅샷을 Redis 캐시에 저장할 JSON 문자열로 변환합니다.
 *
 * @param user 인증 후 조회된 사용자 스냅샷
 * @returns JSON 직렬화가 가능한 사용자 캐시 payload
 */
export function serializeAuthCacheUser(user: unknown): string {
	return stringifyBigIntJson(user);
}
