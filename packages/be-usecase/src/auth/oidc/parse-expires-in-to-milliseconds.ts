export function parseExpiresInToMilliseconds(
	expiresIn: string | number,
): number {
	if (typeof expiresIn === "number") {
		return expiresIn * 1000;
	}

	const match = expiresIn.match(/^(\d+)(ms|s|m|h|d)$/);
	if (!match) {
		return 60 * 60 * 1000;
	}

	const value = Number.parseInt(match[1], 10);
	const unitToMilliseconds: Record<string, number> = {
		ms: 1,
		s: 1000,
		m: 60 * 1000,
		h: 60 * 60 * 1000,
		d: 24 * 60 * 60 * 1000,
	};

	return value * unitToMilliseconds[match[2]];
}
