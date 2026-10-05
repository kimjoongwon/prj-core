export function parseExpiresInToSeconds(expiresIn: string | number): number {
	if (typeof expiresIn === "number") return expiresIn;

	const match = expiresIn.match(/^(\d+)([smhd])$/);
	if (!match) return 3600;

	const value = Number.parseInt(match[1], 10);
	const unit = match[2];

	const unitToSeconds: Record<string, number> = {
		s: 1,
		m: 60,
		h: 60 * 60,
		d: 24 * 60 * 60,
	};

	return value * unitToSeconds[unit];
}
