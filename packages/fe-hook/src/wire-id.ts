import {
	type DecimalId,
	formatDatabaseId,
	isDecimalId,
} from "@cocrepo/type";

export function isWireId(value: unknown): value is DecimalId {
	return isDecimalId(value);
}

export function toWireId(value: unknown): DecimalId | null {
	if (isDecimalId(value)) {
		return value;
	}

	if (typeof value !== "bigint") {
		return null;
	}

	try {
		return formatDatabaseId(value);
	} catch {
		return null;
	}
}

export function isSameWireId(
	a: string | null | undefined,
	b: string | null | undefined,
): boolean {
	return a === b;
}
