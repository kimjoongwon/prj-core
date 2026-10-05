import { VoValidationError } from "../../errors/vo.error";

export function parseExpiration(expiresIn: string | number): number {
	if (typeof expiresIn === "number") {
		if (expiresIn <= 0) {
			throw new VoValidationError("만료 시간은 0보다 커야 합니다.");
		}
		return expiresIn * 1000;
	}

	const regex = /^(\d+)([smhd])$/;
	const match = expiresIn.match(regex);

	if (!match) {
		throw new VoValidationError(
			`유효하지 않은 만료 시간 형식입니다: ${expiresIn}. 예: "15m", "7d", "24h"`,
		);
	}

	const value = Number.parseInt(match[1], 10);
	const unit = match[2];

	const unitToMs: Record<string, number> = {
		s: 1000,
		m: 60 * 1000,
		h: 60 * 60 * 1000,
		d: 24 * 60 * 60 * 1000,
	};

	return value * unitToMs[unit];
}
