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
	issuer: "http://localhost:3007",
	jwksUri: "http://localhost:3007/oidc/jwks",
};

@Injectable()
export class OidcFacade {
	private readonly logger = new Logger(OidcFacade.name);
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
