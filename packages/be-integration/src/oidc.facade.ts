import * as crypto from "node:crypto";
import {
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export type OidcRpClientKey = "admin" | "storybook" | "idpWeb";

interface OidcRpClientConfig {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
	loginUrl?: string;
	defaultReturnTo?: string;
}

interface OidcServerConfig {
	issuer: string;
	jwksUri: string;
	clients: Record<OidcRpClientKey, OidcRpClientConfig>;
}

export interface OidcTokenResponse {
	access_token: string;
	refresh_token?: string;
	id_token?: string;
	token_type: string;
	expires_in: number;
	scope?: string;
}

const DEFAULT_OIDC_CONFIG: OidcServerConfig = {
	issuer: "http://localhost:3007",
	jwksUri: "http://localhost:3007/oidc/jwks",
	clients: {
		admin: {
			clientId: "admin-web",
			clientSecret: "admin-secret-change-in-production",
			redirectUri: "http://localhost:3000/api/v1/auth/callback",
			loginUrl: "http://localhost:3000/admin/auth/login",
			defaultReturnTo: "http://localhost:3000/admin/dashboard",
		},
		storybook: {
			clientId: "storybook",
			clientSecret: "storybook-secret-change-in-production",
			redirectUri: "http://localhost:6006/api/v1/auth/storybook/callback",
			loginUrl: "http://localhost:6006/__storybook_auth/login",
			defaultReturnTo: "http://localhost:6006/",
		},
		idpWeb: {
			clientId: "idp-web",
			clientSecret: "idp-web-secret-change-in-production",
			redirectUri: "http://localhost:3008/api/v1/auth/idp/callback",
			loginUrl: "http://localhost:3008/auth/login",
			defaultReturnTo: "http://localhost:3008/dashboard",
		},
	},
};

@Injectable()
export class OidcFacade {
	private readonly logger = new Logger(OidcFacade.name);
	private readonly oidcConfig: OidcServerConfig;

	constructor(private readonly configService: ConfigService) {
		const rawConfig = this.configService.get<OidcServerConfig>("oidc");
		this.oidcConfig = this.resolveConfig(rawConfig);
	}

	createAuthorizationRequest(
		clientKey: OidcRpClientKey = "admin",
		returnTo?: string,
	): {
		state: string;
		codeVerifier: string;
		authorizationUrl: string;
		returnTo?: string;
	} {
		const clientConfig = this.resolveClientConfig(clientKey);
		const state = crypto.randomBytes(32).toString("hex");
		const codeVerifier = crypto.randomBytes(32).toString("base64url");
		const codeChallenge = crypto
			.createHash("sha256")
			.update(codeVerifier)
			.digest("base64url");

		const params = new URLSearchParams({
			response_type: "code",
			client_id: clientConfig.clientId,
			redirect_uri: clientConfig.redirectUri,
			scope: "openid profile email roles",
			state,
			code_challenge: codeChallenge,
			code_challenge_method: "S256",
			prompt: "login",
		});

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
		clientKey: OidcRpClientKey = "admin",
	): Promise<OidcTokenResponse> {
		const clientConfig = this.resolveClientConfig(clientKey);
		const tokenUrl = `${this.oidcConfig.issuer}/oidc/token`;
		const body = new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: clientConfig.redirectUri,
			client_id: clientConfig.clientId,
			client_secret: clientConfig.clientSecret,
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
		clientKey: OidcRpClientKey = "admin",
	): Promise<OidcTokenResponse> {
		const clientConfig = this.resolveClientConfig(clientKey);
		const tokenUrl = `${this.oidcConfig.issuer}/oidc/token`;
		const body = new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: clientConfig.clientId,
			client_secret: clientConfig.clientSecret,
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
		clientKey: OidcRpClientKey = "admin",
	): Promise<void> {
		const clientConfig = this.resolveClientConfig(clientKey);
		const revocationUrl = `${this.oidcConfig.issuer}/oidc/token/revocation`;
		const body = new URLSearchParams({
			token,
			client_id: clientConfig.clientId,
			client_secret: clientConfig.clientSecret,
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

	private resolveClientConfig(clientKey: OidcRpClientKey): OidcRpClientConfig {
		return this.oidcConfig.clients[clientKey] || this.oidcConfig.clients.admin;
	}

	private resolveConfig(rawConfig?: OidcServerConfig): OidcServerConfig {
		if (!rawConfig) {
			return DEFAULT_OIDC_CONFIG;
		}

		return {
			issuer: rawConfig.issuer || DEFAULT_OIDC_CONFIG.issuer,
			jwksUri: rawConfig.jwksUri || DEFAULT_OIDC_CONFIG.jwksUri,
			clients: {
				admin: {
					...DEFAULT_OIDC_CONFIG.clients.admin,
					...rawConfig.clients?.admin,
				},
				storybook: {
					...DEFAULT_OIDC_CONFIG.clients.storybook,
					...rawConfig.clients?.storybook,
				},
				idpWeb: {
					...DEFAULT_OIDC_CONFIG.clients.idpWeb,
					...rawConfig.clients?.idpWeb,
				},
			},
		};
	}
}
