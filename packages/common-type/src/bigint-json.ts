const BIGINT_JSON_TAG = "__cocrepoBigInt";

type TaggedBigInt = {
	[BIGINT_JSON_TAG]: string;
};

/**
 * bigint를 손실 없이 Redis·캐시 JSON에 저장할 수 있는 tagged JSON으로 직렬화합니다.
 *
 * @param value bigint를 포함할 수 있는 값
 * @returns bigint 타입 정보를 보존하는 JSON 문자열
 */
export function stringifyBigIntJson(value: unknown): string {
	return JSON.stringify(value, (_key, nestedValue) =>
		typeof nestedValue === "bigint"
			? ({ [BIGINT_JSON_TAG]: nestedValue.toString() } satisfies TaggedBigInt)
			: nestedValue,
	);
}

/**
 * {@link stringifyBigIntJson}으로 저장한 tagged JSON의 bigint 값을 복원합니다.
 *
 * @param value tagged JSON 문자열
 * @returns bigint 타입이 복원된 값
 */
export function parseBigIntJson<T>(value: string): T {
	return JSON.parse(value, (_key, nestedValue: unknown) => {
		if (!isTaggedBigInt(nestedValue)) {
			return nestedValue;
		}

		return BigInt(nestedValue[BIGINT_JSON_TAG]);
	}) as T;
}

function isTaggedBigInt(value: unknown): value is TaggedBigInt {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return false;
	}

	const record = value as Record<string, unknown>;
	return (
		Object.keys(record).length === 1 &&
		typeof record[BIGINT_JSON_TAG] === "string" &&
		/^-?(?:0|[1-9]\d*)$/.test(record[BIGINT_JSON_TAG])
	);
}
