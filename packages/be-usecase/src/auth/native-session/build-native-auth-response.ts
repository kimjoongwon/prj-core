import { MOBILE_NATIVE_CLIENT_ID } from "@cocrepo/constant";
import { AuthCacheService, UserService } from "@cocrepo/service";
import type { AuthConfig } from "@cocrepo/type";
import { AccessToken, NativeRefreshToken, SessionId } from "@cocrepo/vo";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { SignOptions } from "jsonwebtoken";
import { decodeAccessToken } from "../oidc/decode-access-token";
import { parseExpiresInToMilliseconds } from "../oidc/parse-expires-in-to-milliseconds";
import { serializeAuthCacheUser } from "../serialize-auth-cache-user";
import type { NativeAuthResult } from "./native-auth.result";
import { NATIVE_TOKEN_ISSUER_SUFFIX } from "./native-token-issuer-suffix";

export async function buildNativeAuthResponse(params: {
	user: Awaited<ReturnType<UserService["getByIdWithTenants"]>>;
	sessionId: string;
	refreshToken: string;
	mustChangePassword?: boolean;
	jwtService: JwtService;
	configService: ConfigService;
	authCacheService: AuthCacheService;
}): Promise<NativeAuthResult> {
	if (!params.user) {
		throw new UnauthorizedException("사용자를 찾을 수 없습니다");
	}

	const authConfig = params.configService.get<AuthConfig>("auth");
	if (!authConfig?.secret) {
		throw new Error("JWT secret is not defined in the configuration.");
	}
	if (!params.user.userId) {
		throw new UnauthorizedException("사용자 공개 식별자를 찾을 수 없습니다");
	}

	const oidcConfig = params.configService.get<{ issuer?: string }>("oidc");
	const accessToken = params.jwtService.sign(
		{
			client_id: MOBILE_NATIVE_CLIENT_ID,
		},
		{
			algorithm: "HS256",
			audience: MOBILE_NATIVE_CLIENT_ID,
			expiresIn: authConfig.expires as SignOptions["expiresIn"],
			issuer: `${oidcConfig?.issuer || "http://localhost:3000"}${NATIVE_TOKEN_ISSUER_SUFFIX}`,
			subject: params.user.userId,
		},
	);
	const accessTokenVo = AccessToken.create(accessToken);
	const refreshToken = NativeRefreshToken.create(params.refreshToken);
	const sessionId = SessionId.fromString(params.sessionId);
	const payload = decodeAccessToken(accessTokenVo.value);
	const expSeconds = payload.exp ?? 0;
	const remainingSeconds = expSeconds - Math.floor(Date.now() / 1000);
	if (remainingSeconds > 0) {
		await params.authCacheService.set(
			params.user.userId,
			serializeAuthCacheUser(params.user),
			remainingSeconds,
		);
	}

	return {
		accessToken: accessTokenVo.value,
		refreshToken: refreshToken.value,
		sessionId: sessionId.value,
		accessTokenExpiresAt: expSeconds * 1000,
		refreshTokenExpiresAt:
			Date.now() + parseExpiresInToMilliseconds(authConfig?.refresh ?? "7d"),
		user: params.user,
		mustChangePassword: params.mustChangePassword,
	};
}
