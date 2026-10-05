import {
	MOBILE_NATIVE_CLIENT_ID,
	MOBILE_OIDC_REDIRECT_URI,
	OIDC_ISSUER_URL,
} from "@cocrepo/constant";
import * as Crypto from "expo-crypto";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import type { MobileAuthSession } from "../_utils/auth";

/**
 * IDP 시트 로그인 (WebView 없음)
 *
 * openAuthSessionAsync로 시스템 인증 세션(iOS 앱 시트 / Android Custom Tabs)을
 * 띄워 IDP 로그인 화면(idp-web)을 보여주고, 앱 스킴 콜백으로 authorization code를
 * 받아 public client + PKCE(S256)로 /oidc/token에서 직접 토큰을 교환한다.
 * 모바일 번들의 발급자는 EXPO_PUBLIC_OIDC_ISSUER_URL로 재정의할 수 있다.
 */

const AUTHORIZE_PATH = "/oidc/auth";
const TOKEN_PATH = "/oidc/token";
const REVOCATION_PATH = "/oidc/token/revocation";
const OIDC_SCOPE = "openid profile email";

const OIDC_REFRESH_TOKEN_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

function bytesToBase64Url(bytes: Uint8Array): string {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	let output = "";
	for (let index = 0; index < bytes.length; index += 3) {
		const byte0 = bytes[index] ?? 0;
		const byte1 = bytes[index + 1];
		const byte2 = bytes[index + 2];
		output += chars[byte0 >> 2] ?? "";
		output += chars[((byte0 & 0x03) << 4) | ((byte1 ?? 0) >> 4)] ?? "";
		if (byte1 !== undefined) {
			output += chars[((byte1 & 0x0f) << 2) | ((byte2 ?? 0) >> 6)] ?? "";
		}
		if (byte2 !== undefined) {
			output += chars[byte2 & 0x3f] ?? "";
		}
	}
	return output.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomBase64Url(byteLength: number): string {
	return bytesToBase64Url(Crypto.getRandomValues(new Uint8Array(byteLength)));
}

async function sha256Base64Url(value: string): Promise<string> {
	const digest = await Crypto.digestStringAsync(
		Crypto.CryptoDigestAlgorithm.SHA256,
		value,
		{ encoding: Crypto.CryptoEncoding.BASE64 },
	);
	return digest.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function toTokenSession(tokenResponse: {
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
}): MobileAuthSession {
	if (!tokenResponse.access_token) {
		throw new Error("oidc_token_response_missing_access_token");
	}
	return {
		accessToken: tokenResponse.access_token,
		refreshToken: tokenResponse.refresh_token ?? null,
		accessTokenExpiresAt:
			Date.now() + (tokenResponse.expires_in ?? 3600) * 1000,
		refreshTokenExpiresAt: tokenResponse.refresh_token
			? Date.now() + OIDC_REFRESH_TOKEN_LIFETIME_MS
			: null,
		sessionId: null,
	};
}

async function requestTokenEndpoint(
	body: Record<string, string>,
): Promise<MobileAuthSession> {
	const response = await fetch(`${OIDC_ISSUER_URL}${TOKEN_PATH}`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(body).toString(),
	});
	if (!response.ok) {
		throw new Error("oidc_token_request_failed");
	}
	return toTokenSession(await response.json());
}

/**
 * 로그아웃 시 발급받은 토큰을 RFC 7009 revocation 엔드포인트에서 폐기한다.
 * public 클라이언트(user-mobile)라 client_id만으로 호출한다. refresh token을
 * 폐기하면 OP가 연관 토큰(그랜트)을 함께 무효화한다. 폐기 실패가 로그아웃을
 * 막아서는 안 되므로 best-effort로 실패를 삼킨다.
 */
export async function revokeOidcTokens(tokens: {
	accessToken?: string | null;
	refreshToken?: string | null;
}): Promise<void> {
	const revokeTargets = [tokens.refreshToken, tokens.accessToken].filter(
		(token): token is string => Boolean(token),
	);

	for (const token of revokeTargets) {
		try {
			await fetch(`${OIDC_ISSUER_URL}${REVOCATION_PATH}`, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					token,
					client_id: MOBILE_NATIVE_CLIENT_ID,
				}).toString(),
			});
		} catch {
			// 네트워크 실패 시에도 나머지 토큰 폐기와 로컬 로그아웃을 계속한다.
		}
	}
}

export async function loginWithOidcSheet(): Promise<MobileAuthSession> {
	WebBrowser.maybeCompleteAuthSession();

	const codeVerifier = randomBase64Url(48);
	if (codeVerifier.length < 43 || codeVerifier.length > 128) {
		throw new Error("oidc_pkce_verifier_length_invalid");
	}
	const codeChallenge = await sha256Base64Url(codeVerifier);
	const state = randomBase64Url(16);

	const authorizeUrl = `${OIDC_ISSUER_URL}${AUTHORIZE_PATH}?${new URLSearchParams(
		{
			client_id: MOBILE_NATIVE_CLIENT_ID,
			redirect_uri: MOBILE_OIDC_REDIRECT_URI,
			response_type: "code",
			scope: OIDC_SCOPE,
			state,
			code_challenge: codeChallenge,
			code_challenge_method: "S256",
		},
	).toString()}`;

	const authResult = await WebBrowser.openAuthSessionAsync(
		authorizeUrl,
		MOBILE_OIDC_REDIRECT_URI,
	);
	if (authResult.type !== "success" || !authResult.url) {
		throw new Error("oidc_auth_session_cancelled");
	}

	const callbackUrl = new URL(authResult.url);
	const callbackError = callbackUrl.searchParams.get("error");
	if (callbackError) {
		throw new Error(`oidc_auth_failed:${callbackError}`);
	}
	const authorizationCode = callbackUrl.searchParams.get("code");
	const callbackState = callbackUrl.searchParams.get("state");
	if (!authorizationCode || callbackState !== state) {
		throw new Error("oidc_callback_state_mismatch");
	}

	return requestTokenEndpoint({
		grant_type: "authorization_code",
		code: authorizationCode,
		redirect_uri: MOBILE_OIDC_REDIRECT_URI,
		client_id: MOBILE_NATIVE_CLIENT_ID,
		code_verifier: codeVerifier,
	});
}

export async function refreshOidcSession(
	refreshToken: string,
): Promise<MobileAuthSession> {
	return requestTokenEndpoint({
		grant_type: "refresh_token",
		refresh_token: refreshToken,
		client_id: MOBILE_NATIVE_CLIENT_ID,
	});
}

export function openOidcAuthPage(
	path: "/auth/sign-up" | "/auth/forgot-password",
): void {
	void Linking.openURL(`${OIDC_ISSUER_URL}${path}`);
}
