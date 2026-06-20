import { UnauthorizedException } from "@nestjs/common";

export function decodeAccessToken(token: string): {
	sub: string;
	exp?: number;
	iss?: string;
	aud?: string | string[];
} {
	const parts = token.split(".");
	if (parts.length !== 3) {
		throw new UnauthorizedException("유효하지 않은 토큰 형식입니다");
	}

	const payload = JSON.parse(
		Buffer.from(parts[1], "base64url").toString("utf-8"),
	);

	if (!payload.sub) {
		throw new UnauthorizedException("토큰에 sub 클레임이 없습니다");
	}

	return payload;
}
