export function normalizeMetadataValue(value: string): string {
	return /[^\x20-\x7E]/.test(value) ? encodeURIComponent(value) : value;
}
