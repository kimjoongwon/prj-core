export function resolveTextFieldValue(
	value: string,
	type?: string,
): string | number {
	if (type !== "number" || value === "") {
		return value;
	}

	const numericValue = Number(value);

	return Number.isNaN(numericValue) ? value : numericValue;
}
