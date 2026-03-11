import * as crypto from "node:crypto";
import {
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface OidcServerConfig {
	issuer: string;
	jwksUri: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

export interface OidcTokenResponse {
	access_token: string;
	refresh_token?: string;
	id_token?: string;
	token_type: string;
	expires_in: number;
	scope?: string;
}

@Injectable()
export class OidcFacade {
	private readonly logger = new Logger(OidcFacade.name);
	private readonly oidcConfig: OidcServerConfig;

	constructor(private readonly configService: ConfigService) {
		this.oidcConfig = this.configService.get<OidcServerConfig>("oidc") || {
			issuer: "http://localhost:3007",
			jwksUri: "http://localhost:3007/oidc/jwks",
			clientId: "prj-core-admin",
			clientSecret: "admin-secret-change-in-production",
			redirectUri: "http://localhost:3000/api/v1/auth/callback",
		};
	}

	createAuthorizationRequest(returnTo?: string): {
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
			client_id: this.oidcConfig.clientId,
			redirect_uri: this.oidcConfig.redirectUri,
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
	): Promise<OidcTokenResponse> {
		const tokenUrl = `${this.oidcConfig.issuer}/oidc/token`;
		const body = new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: this.oidcConfig.redirectUri,
			client_id: this.oidcConfig.clientId,
			client_secret: this.oidcConfig.clientSecret,
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

	async refreshTokens(refreshToken: string): Promise<OidcTokenResponse> {
		const tokenUrl = `${this.oidcConfig.issuer}/oidc/token`;
		const body = new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: this.oidcConfig.clientId,
			client_secret: this.oidcConfig.clientSecret,
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

	async revokeToken(token: string): Promise<void> {
		const revocationUrl = `${this.oidcConfig.issuer}/oidc/token/revocation`;
		const body = new URLSearchParams({
			token,
			client_id: this.oidcConfig.clientId,
			client_secret: this.oidcConfig.clientSecret,
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
}
