/**
 * 데이터베이스와 백엔드 런타임에서 사용하는 bigint ID 타입입니다.
 */
export type DatabaseId = bigint;

/**
 * wire protocol에서 사용하는 canonical decimal ID 문자열 타입입니다.
 */
export type DecimalId = string;

/**
 * 허용되는 최소 데이터베이스 ID 값입니다.
 */
export const DATABASE_ID_MIN = BigInt("1");

/**
 * 허용되는 최대 데이터베이스 ID 값입니다.
 */
export const DATABASE_ID_MAX = BigInt("9223372036854775807");

const SHORTER_DECIMAL_ID_PATTERN_SOURCE = "[1-9][0-9]{0,17}";

const buildBoundedDecimalSuffixPattern = (maxDigits: string): string => {
	if (maxDigits.length === 1) {
		return `[0-${maxDigits}]`;
	}

	const firstDigit = maxDigits[0] as string;
	const restDigits = maxDigits.slice(1);
	const firstDigitValue = Number.parseInt(firstDigit, 10);
	const rest = restDigits;
	const branches: string[] = [];

	if (firstDigitValue > 0) {
		branches.push(`[0-${firstDigitValue - 1}][0-9]{${rest.length}}`);
	}

	branches.push(`${firstDigit}${buildBoundedDecimalSuffixPattern(rest)}`);
	return `(?:${branches.join("|")})`;
};

const buildMaxBoundedPositiveDecimalPattern = (maxValue: bigint): string => {
	const maxDigits = maxValue.toString();

	if (maxDigits.length === 1) {
		return `^[1-${maxDigits}]$`;
	}

	const firstDigit = maxDigits[0] as string;
	const restDigits = maxDigits.slice(1);
	const firstDigitValue = Number.parseInt(firstDigit, 10);
	const rest = restDigits;
	const equalLengthBranches: string[] = [];

	if (firstDigitValue > 1) {
		equalLengthBranches.push(`[1-${firstDigitValue - 1}][0-9]{${rest.length}}`);
	}

	equalLengthBranches.push(
		`${firstDigit}${buildBoundedDecimalSuffixPattern(rest)}`,
	);

	return `^(?:${SHORTER_DECIMAL_ID_PATTERN_SOURCE}|(?:${equalLengthBranches.join("|")}))$`;
};

/**
 * canonical positive signed-BIGINT decimal string을 검증하는 정규식 source입니다.
 */
export const DECIMAL_ID_PATTERN_SOURCE =
	buildMaxBoundedPositiveDecimalPattern(DATABASE_ID_MAX);

/**
 * canonical positive signed-BIGINT decimal string을 검증하는 정규식입니다.
 */
export const DECIMAL_ID_PATTERN = new RegExp(DECIMAL_ID_PATTERN_SOURCE);

/**
 * 입력값이 허용된 decimal ID 문자열인지 판별합니다.
 *
 * @param value 검사할 입력값
 * @returns canonical decimal ID 문자열 여부
 */
export function isDecimalId(value: unknown): value is DecimalId {
	return typeof value === "string" && DECIMAL_ID_PATTERN.test(value);
}

/**
 * 외부 입력을 canonical decimal ID로 확인하고 좁혀 반환합니다.
 *
 * @param value 검사할 외부 입력
 * @param fieldName 오류 메시지에 사용할 필드 이름
 * @returns 검증된 decimal ID 문자열
 * @throws TypeError 입력이 숫자 ID 문자열 계약을 벗어난 경우
 */
export function requireDecimalId(value: unknown, fieldName = "id"): DecimalId {
	if (!isDecimalId(value)) {
		throw new TypeError(
			`${fieldName} must be a canonical positive signed-BIGINT decimal string`,
		);
	}

	return value;
}

/**
 * decimal ID 문자열을 데이터베이스 bigint ID로 변환합니다.
 *
 * @param value wire protocol에서 받은 ID 문자열
 * @returns 유효하면 bigint ID, 아니면 null
 */
export function parseDecimalId(value: string): DatabaseId | null {
	if (!isDecimalId(value)) {
		return null;
	}

	return BigInt(value);
}

/**
 * 데이터베이스 bigint ID를 wire protocol용 decimal ID 문자열로 직렬화합니다.
 *
 * @param value 직렬화할 bigint ID
 * @returns canonical decimal ID 문자열
 * @throws RangeError 허용 범위를 벗어난 경우
 */
export function formatDatabaseId(value: DatabaseId): DecimalId {
	if (value < DATABASE_ID_MIN || value > DATABASE_ID_MAX) {
		throw new RangeError(
			`DatabaseId must be between ${DATABASE_ID_MIN} and ${DATABASE_ID_MAX}`,
		);
	}

	return value.toString() as DecimalId;
}
