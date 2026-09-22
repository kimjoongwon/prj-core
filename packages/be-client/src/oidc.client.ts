import * as crypto from "node:crypto";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface OidcClientProtocolConfig {
	clientId: string;
	clientSecret?: string | null;
	redirectUri: string;
	scope?: string;
}

interface OidcServerConfig {
	issuer: string;
	jwksUri: string;
}

export interface OidcTokenResponse {
	access_token: string;
	refresh_token?: string;
	id_token?: string;
	token_type: string;
	expires_in: number;
	scope?: string;
}

export interface OidcAuthorizationRequestOptions {
	prompt?: string;
}

const DEFAULT_OIDC_CONFIG: OidcServerConfig = {
	issuer: "http://localhost:3000",
	jwksUri: "http://localhost:3000/oidc/jwks",
};

@Injectable()
export class OidcClient {
	private readonly logger = new Logger(OidcClient.name);
	private readonly oidcConfig: OidcServerConfig;

	constructor(private readonly configService: ConfigService) {
		const rawConfig = this.configService.get<Partial<OidcServerConfig>>("oidc");
		this.oidcConfig = this.resolveConfig(rawConfig);
	}

	createAuthorizationRequest(
		client: OidcClientProtocolConfig,
		returnTo?: string,
		options: OidcAuthorizationRequestOptions = {},
	): {
		state: string;
		codeVerifier: string;
		authorizationUrl: string;
		returnTo?: string;
	} {
		const state = crypto.randomBytes(32).toString("hex");
		const codeVerifier = crypto.randomBytes(32).toString("base64url");
		const codeChallenge = crypto
			.createHash("sha256")
			.update(codeVerifier)
			.digest("base64url");

		const params = new URLSearchParams({
			response_type: "code",
			client_id: client.clientId,
			redirect_uri: client.redirectUri,
			scope: client.scope || "openid profile email",
			state,
			code_challenge: codeChallenge,
			code_challenge_method: "S256",
		});
		const prompt = options.prompt?.trim();
		if (prompt) {
			params.set("prompt", prompt);
		}

		return {
			state,
			codeVerifier,
			authorizationUrl: `${this.oidcConfig.issuer}/oidc/auth?${params.toString()}`,
			returnTo,
		};
	}

	async exchangeCodeForTokens(
		code: string,
		codeVerifier: string,
		client: OidcClientProtocolConfig,
	): Promise<OidcTokenResponse> {
		const tokenUrl = `${this.oidcConfig.issuer}/oidc/token`;
		const body = new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: client.redirectUri,
			client_id: client.clientId,
			...(client.clientSecret ? { client_secret: client.clientSecret } : {}),
			code_verifier: codeVerifier,
		});

		const response = await fetch(tokenUrl, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: body.toString(),
		});

		if (!response.ok) {
			const errorBody = await response.text();
			this.logger.error(
				`OIDC token exchange failed: ${response.status} ${errorBody}`,
			);
			throw new UnauthorizedException("토큰 교환에 실패했습니다");
		}

		return response.json() as Promise<OidcTokenResponse>;
	}

	async refreshTokens(
		refreshToken: string,
		client: OidcClientProtocolConfig,
	): Promise<OidcTokenResponse> {
		const tokenUrl = `${this.oidcConfig.issuer}/oidc/token`;
		const body = new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: client.clientId,
			...(client.clientSecret ? { client_secret: client.clientSecret } : {}),
		});

		const response = await fetch(tokenUrl, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: body.toString(),
		});

		if (!response.ok) {
			const errorBody = await response.text();
			this.logger.error(
				`OIDC token refresh failed: ${response.status} ${errorBody}`,
			);
			throw new UnauthorizedException("토큰 갱신에 실패했습니다");
		}

		return response.json() as Promise<OidcTokenResponse>;
	}

	async revokeToken(
		token: string,
		client: Pick<OidcClientProtocolConfig, "clientId" | "clientSecret">,
	): Promise<void> {
		const revocationUrl = `${this.oidcConfig.issuer}/oidc/token/revocation`;
		const body = new URLSearchParams({
			token,
			client_id: client.clientId,
			...(client.clientSecret ? { client_secret: client.clientSecret } : {}),
		});

		try {
			await fetch(revocationUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: body.toString(),
			});
		} catch (error) {
			this.logger.warn(`OIDC token revocation failed: ${error}`);
		}
	}

	/**
	 * OIDC RP-Initiated Logout 엔드포인트(end_session) URL을 만든다.
	 * 브라우저가 이 URL로 최상위 내비게이션하면 OP가 자기 세션과 쿠키를
	 * 스스로 정리한다. idTokenHint가 있으면 id_token_hint로 전달하고,
	 * 없으면(레거시 세션) client_id로만 식별해 OP 확인 화면을 거친다.
	 * postLogoutRedirectUri는 클라이언트에 등록된 URI여야 OP가 리다이렉트한다.
	 */
	buildEndSessionUrl(
		idTokenHint: string | null | undefined,
		options: { postLogoutRedirectUri?: string; clientId?: string } = {},
	): string {
		const endSessionUrl = new URL(`${this.oidcConfig.issuer}/oidc/session/end`);
		if (idTokenHint) {
			endSessionUrl.searchParams.set("id_token_hint", idTokenHint);
		}
		if (options.postLogoutRedirectUri) {
			endSessionUrl.searchParams.set(
				"post_logout_redirect_uri",
				options.postLogoutRedirectUri,
			);
		}
		if (options.clientId) {
			endSessionUrl.searchParams.set("client_id", options.clientId);
		}
		return endSessionUrl.toString();
	}

	private resolveConfig(
		rawConfig?: Partial<OidcServerConfig>,
	): OidcServerConfig {
		if (!rawConfig) {
			return DEFAULT_OIDC_CONFIG;
		}

		return {
			issuer: rawConfig.issuer || DEFAULT_OIDC_CONFIG.issuer,
			jwksUri: rawConfig.jwksUri || DEFAULT_OIDC_CONFIG.jwksUri,
		};
	}
}
