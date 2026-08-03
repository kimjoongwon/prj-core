import { type DecimalId, isDecimalId } from "@cocrepo/type";

export function isWireId(value: unknown): value is DecimalId {
	return isDecimalId(value);
}

export function isSameWireId(
	a: string | null | undefined,
	b: string | null | undefined,
): boolean {
	return a === b;
}
