export function normalizeOptionalBooleanString(
	value?: string,
): string | undefined {
	const normalizedValue = value?.trim();
	return normalizedValue ? normalizedValue : undefined;
}
