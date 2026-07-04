const UUID_REGEXP =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ROUTE_KEY_REGEXP = /^[A-Za-z0-9_-]{22}$/;
const BASE64URL_ALPHABET =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const BASE64URL_INDEX_BY_CHAR = new Map(
	BASE64URL_ALPHABET.split("").map((char, index) => [char, index]),
);

/**
 * 값이 UUID 문자열인지 확인합니다.
 */
export function isUuid(value: string): boolean {
	return UUID_REGEXP.test(value);
}

/**
 * 값이 UUID route key 형식인지 확인합니다.
 */
export function isRouteKey(value: string): boolean {
	if (!ROUTE_KEY_REGEXP.test(value)) {
		return false;
	}

	const bytes = decodeBase64Url(value);
	return bytes !== null && bytes.length === 16;
}

/**
 * UUID를 URL-safe short route key로 변환합니다.
 */
export function toRouteKey(value: string): string {
	if (!isUuid(value)) {
		return value;
	}

	return encodeBase64Url(uuidToBytes(value));
}

/**
 * UUID route key를 UUID로 복원합니다. 복원할 수 없으면 원본 값을 반환합니다.
 */
export function fromRouteKey(value: string): string {
	return tryFromRouteKey(value) ?? value;
}

/**
 * UUID route key를 UUID로 복원합니다. 복원할 수 없으면 null을 반환합니다.
 */
export function tryFromRouteKey(value: string): string | null {
	if (isUuid(value)) {
		return value;
	}

	if (!ROUTE_KEY_REGEXP.test(value)) {
		return null;
	}

	const bytes = decodeBase64Url(value);
	if (!bytes || bytes.length !== 16) {
		return null;
	}

	return bytesToUuid(bytes);
}

function uuidToBytes(uuid: string): Uint8Array {
	const hex = uuid.replaceAll("-", "");
	const bytes = new Uint8Array(16);

	for (let index = 0; index < bytes.length; index += 1) {
		bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
	}

	return bytes;
}

function bytesToUuid(bytes: Uint8Array): string {
	const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
		"",
	);

	return [
		hex.slice(0, 8),
		hex.slice(8, 12),
		hex.slice(12, 16),
		hex.slice(16, 20),
		hex.slice(20),
	].join("-");
}

function encodeBase64Url(bytes: Uint8Array): string {
	let output = "";

	for (let index = 0; index < bytes.length; index += 3) {
		const first = bytes[index];
		const second = bytes[index + 1] ?? 0;
		const third = bytes[index + 2] ?? 0;

		output += BASE64URL_ALPHABET[first >> 2];
		output += BASE64URL_ALPHABET[((first & 0b11) << 4) | (second >> 4)];

		if (index + 1 < bytes.length) {
			output +=
				BASE64URL_ALPHABET[((second & 0b1111) << 2) | (third >> 6)];
		}

		if (index + 2 < bytes.length) {
			output += BASE64URL_ALPHABET[third & 0b111111];
		}
	}

	return output;
}

function decodeBase64Url(value: string): Uint8Array | null {
	const bytes: number[] = [];
	let buffer = 0;
	let bits = 0;

	for (const char of value) {
		const next = BASE64URL_INDEX_BY_CHAR.get(char);
		if (next === undefined) {
			return null;
		}

		buffer = (buffer << 6) | next;
		bits += 6;

		if (bits >= 8) {
			bits -= 8;
			bytes.push((buffer >> bits) & 0xff);
		}
	}

	return new Uint8Array(bytes);
}
