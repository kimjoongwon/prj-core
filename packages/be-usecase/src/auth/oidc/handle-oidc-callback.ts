import { OidcClientAggregate } from "@cocrepo/aggregate";
import { OidcClient } from "@cocrepo/client";
import {
	AuthCacheService,
	TokenService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { resolveHttpClientIp, resolveHttpUserAgent } from "@cocrepo/toolkit";
import { SessionId } from "@cocrepo/vo";
import { UnauthorizedException } from "@nestjs/common";
import type { Request, Response } from "express";
import { serializeAuthCacheUser } from "../serialize-auth-cache-user";
import { decodeAccessToken } from "./decode-access-token";
import { decodeOidcStateContext } from "./decode-oidc-state-context";
import type { OidcCallbackResult } from "./oidc-callback.result";
import { resolveOidcClient } from "./resolve-oidc-client";
import { resolveStoredClientId } from "./resolve-stored-client-id";
import { setLoggedInMarkerCookie } from "./set-logged-in-marker-cookie";
import { setSessionIdCookie } from "./set-session-id-cookie";
import { toProtocolClientConfig } from "./to-protocol-client-config";

export async function handleOidcCallback(params: {
	code: string;
	state: string;
	req: Request;
	res: Response;
	tokenStorageService: TokenStorageService;
	oidcClientService: OidcClientAggregate;
	oidcClient: OidcClient;
	usersService: UserService;
	authCacheService: AuthCacheService;
	tokenService: TokenService;
}): Promise<OidcCallbackResult> {
	const stateData =
		await params.tokenStorageService.validateAndConsumeOidcState(params.state);
	if (!stateData) {
		throw new UnauthorizedException("OIDC state 검증에 실패했습니다");
	}

	const legacyStateContext = decodeOidcStateContext(stateData.returnTo);
	const clientId = resolveStoredClientId(
		stateData.clientId,
		stateData.clientKey,
		legacyStateContext.clientId,
	);
	const returnTo = legacyStateContext.returnTo ?? stateData.returnTo;
	const client = await resolveOidcClient(params.oidcClientService, clientId, {
		requireActive: false,
	});

	const tokenResponse = await params.oidcClient.exchangeCodeForTokens(
		params.code,
		stateData.codeVerifier,
		toProtocolClientConfig(client),
	);
	const payload = decodeAccessToken(tokenResponse.access_token);
	const user = await (
		params.usersService as UserService & {
			findByUserIdWithTenants: (
				userId: string,
			) => ReturnType<UserService["getByIdWithTenants"]>;
		}
	).findByUserIdWithTenants(payload.sub);

	if (!user) {
		throw new UnauthorizedException("사용자를 찾을 수 없습니다");
	}

	const expSeconds = (payload as { exp?: number }).exp ?? 0;
	const remainingSeconds = expSeconds - Math.floor(Date.now() / 1000);
	if (remainingSeconds > 0) {
		await params.authCacheService.set(
			payload.sub,
			serializeAuthCacheUser(user),
			remainingSeconds,
		);
	}

	const sessionId = SessionId.create(
		client.clientId,
		params.tokenStorageService.generateSessionId(),
	).value;
	if (tokenResponse.refresh_token) {
		await params.tokenStorageService.saveSession(
			payload.sub,
			sessionId,
			tokenResponse.refresh_token,
			{
				userAgent: resolveHttpUserAgent(params.req),
				ipAddress: resolveHttpClientIp(params.req),
				clientId: client.clientId,
				// 로그아웃 시 end_session의 id_token_hint로 쓴다.
				idToken: tokenResponse.id_token,
			},
		);
	}

	params.tokenService.setAccessTokenCookie(
		params.res,
		tokenResponse.access_token,
	);
	if (tokenResponse.refresh_token) {
		params.tokenService.setRefreshTokenCookie(
			params.res,
			tokenResponse.refresh_token,
		);
	}
	setSessionIdCookie(params.res, sessionId);
	setLoggedInMarkerCookie(params.res);

	return {
		returnTo,
		defaultReturnTo: client.defaultReturnTo || "/",
		loginUrl: client.loginUrl,
		session: {
			accessToken: tokenResponse.access_token,
			refreshToken: tokenResponse.refresh_token ?? "",
			accessTokenExpiresAt: expSeconds * 1000,
			refreshTokenExpiresAt: tokenResponse.refresh_token
				? Date.now() + 30 * 24 * 60 * 60 * 1000
				: expSeconds * 1000,
			user,
		},
	};
}
