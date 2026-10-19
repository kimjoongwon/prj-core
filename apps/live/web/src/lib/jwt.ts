import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * 시연용 HS256 JWT 서명/검증 (의존성 없이 node:crypto로 직접 구현).
 * 실제 서비스에서는 카카오 로그인 응답 access_token 검증 후 서버 세션/토큰으로 교체한다.
 */

function getJwtSecret(): string {
	return process.env.LIVE_DEMO_JWT_SECRET ?? "live-demo-mock-secret";
}

export type JwtPayload = {
	sub?: string;
	nickname?: string;
	scope?: string;
	channelId?: string;
	iat: number;
	exp: number;
};

export function signJwt(
	payload: Omit<JwtPayload, "iat" | "exp">,
	expiresInSeconds: number,
): string {
	const issuedAt = Math.floor(Date.now() / 1000);
	const header = Buffer.from(
		JSON.stringify({ alg: "HS256", typ: "JWT" }),
	).toString("base64url");
	const body = Buffer.from(
		JSON.stringify({
			...payload,
			iat: issuedAt,
			exp: issuedAt + expiresInSeconds,
		}),
	).toString("base64url");
	const signature = createHmac("sha256", getJwtSecret())
		.update(`${header}.${body}`)
		.digest("base64url");
	return `${header}.${body}.${signature}`;
}

export function verifyJwt(token: string): JwtPayload | null {
	const tokenParts = token.split(".");
	if (tokenParts.length !== 3) {
		return null;
	}
	const [headerPart, bodyPart, signaturePart] = tokenParts;

	const expectedSignature = createHmac("sha256", getJwtSecret())
		.update(`${headerPart}.${bodyPart}`)
		.digest();
	const givenSignature = Buffer.from(signaturePart, "base64url");
	if (
		expectedSignature.length !== givenSignature.length ||
		!timingSafeEqual(expectedSignature, givenSignature)
	) {
		return null;
	}

	try {
		const payload = JSON.parse(
			Buffer.from(bodyPart, "base64url").toString("utf8"),
		) as JwtPayload;
		if (payload.exp < Math.floor(Date.now() / 1000)) {
			return null;
		}
		return payload;
	} catch {
		return null;
	}
}
