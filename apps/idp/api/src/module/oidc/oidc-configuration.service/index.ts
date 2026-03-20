import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { OidcConfig } from "../../../config/oidc.config";
import { AccountService } from "../account.service";
import { RedisOidcAdapterFactory } from "../oidc.adapter";
import { OidcClientRepository } from "../oidc-client.repository";
import type { OidcClientConfig, OidcConfiguration } from "../types";

function resolveUrl(baseUrl: string, pathname: string): string {
	const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
	return new URL(pathname, normalizedBaseUrl).toString();
}

/**
 * OIDC Configuration Service
 *
 * oidc-provider 초기화에 필요한 설정을 빌드합니다.
 * DB에서 클라이언트를 로드하고, 기본 폴백 클라이언트를 관리합니다.
 */
@Injectable()
export class OidcConfigurationService {
	private readonly logger = new Logger(OidcConfigurationService.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly accountService: AccountService,
		private readonly adapterFactory: RedisOidcAdapterFactory,
		private readonly oidcClientRepository: OidcClientRepository,
	) {}

	async buildConfiguration(): Promise<OidcConfiguration> {
		const oidcConfig = this.configService.get<OidcConfig>("oidc");
		const issuer = oidcConfig?.issuer || "http://localhost:3007";
		const idpClientUrl =
			this.configService.get<string>("IDP_CLIENT_URL") ||
			"http://localhost:3008";
		const clients = await this.loadClients(
			this.buildFallbackClients(oidcConfig, issuer, idpClientUrl),
		);

		return {
			adapter: this.adapterFactory.getAdapterFactory(),
			findAccount: this.accountService.findAccount,
			clients,

			// JWKS 서명 키 (RS256) - 환경변수에서 로드
			...(oidcConfig?.jwks && { jwks: oidcConfig.jwks }),

			claims: {
				openid: ["sub"],
				profile: ["name", "updated_at"],
				email: ["email", "email_verified"],
				phone: ["phone_number", "phone_number_verified"],
				roles: ["roles", "spaces"],
			},
			features: {
				devInteractions: { enabled: false },
				clientCredentials: { enabled: true },
				introspection: { enabled: true },
				revocation: { enabled: true },
				userinfo: { enabled: true },
				jwtUserinfo: { enabled: false },
				rpInitiatedLogout: { enabled: true },
				// Resource Indicators - JWT Access Token 발급을 위해 필수
				resourceIndicators: {
					enabled: true,
					defaultResource: () => issuer,
					useGrantedResource: () => true,
					getResourceServerInfo: () => ({
						scope: "openid profile email roles",
						audience: issuer,
						accessTokenFormat: "jwt",
						jwt: {
							sign: { alg: "RS256" },
						},
					}),
				},
			},
			cookies: {
				keys: oidcConfig?.cookieKeys || ["default-cookie-key"],
				long: {
					httpOnly: true,
					sameSite: "lax",
					signed: true,
					path: "/",
				},
				short: {
					httpOnly: true,
					sameSite: "lax",
					signed: true,
					path: "/",
				},
			},
			ttl: {
				AccessToken: 3600,
				AuthorizationCode: 600,
				ClientCredentials: 3600,
				DeviceCode: 600,
				IdToken: 3600,
				RefreshToken: 86400 * 30,
				Interaction: 3600,
				Session: 86400 * 14,
				Grant: 86400 * 14,
			},
			interactions: {
				url: (_ctx, interaction) =>
					`${idpClientUrl}/interaction/${interaction.uid}`,
			},
			// PKCE 설정 - Public Client(token_endpoint_auth_method=none)는 PKCE 필수
			pkce: {
				required: (_ctx, client) => client.tokenEndpointAuthMethod === "none",
			},
			// 에러 렌더링 - idp-client의 /error 페이지로 리다이렉트
			renderError: async (ctx, out, _error) => {
				const errorParams = new URLSearchParams({
					error: String(out.error || "Unknown Error"),
					error_description: String(out.error_description || ""),
				});
				const errorUrl = `${idpClientUrl}/error?${errorParams.toString()}`;
				ctx.type = "html";
				ctx.body = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${errorUrl}"></head><body>Redirecting...</body></html>`;
			},
		};
	}

	/**
	 * DB에서 OIDC 클라이언트 로드
	 * DB 접근 실패 시 폴백 클라이언트를 사용합니다.
	 */
	private async loadClients(
		fallbackClients: OidcClientConfig[],
	): Promise<OidcClientConfig[]> {
		try {
			const clients = await this.oidcClientRepository.findActiveClients();

			if (clients.length > 0) {
				this.logger.log(`DB에서 ${clients.length}개의 OIDC 클라이언트 로드됨`);
				const mappedClients = clients.map((client) => ({
					client_id: client.clientId,
					client_secret: client.clientSecret || undefined,
					client_name: client.clientName,
					redirect_uris: client.redirectUris,
					grant_types: client.grantTypes,
					response_types: client.responseTypes,
					token_endpoint_auth_method: client.tokenEndpointAuthMethod,
					scope: client.scope,
					}));
				return this.mergeWithFallbackClients(mappedClients, fallbackClients);
			}
		} catch (error) {
			this.logger.warn(
				"DB에서 클라이언트 로드 실패 - 환경 기반 폴백 클라이언트를 사용합니다.",
			);
			this.logger.debug(String(error));
		}

		return this.mergeWithFallbackClients([], fallbackClients);
	}

	private mergeWithFallbackClients(
		clients: OidcClientConfig[],
		fallbackClients: OidcClientConfig[],
	): OidcClientConfig[] {
		const mergedClients = new Map<string, OidcClientConfig>();

		for (const fallbackClient of fallbackClients) {
			mergedClients.set(fallbackClient.client_id, fallbackClient);
		}

		for (const client of clients) {
			const fallbackClient = mergedClients.get(client.client_id);
			mergedClients.set(
				client.client_id,
				fallbackClient
					? this.mergeClientConfig(fallbackClient, client)
					: client,
			);
		}

		return Array.from(mergedClients.values());
	}

	private mergeClientConfig(
		fallbackClient: OidcClientConfig,
		client: OidcClientConfig,
	): OidcClientConfig {
		return {
			...fallbackClient,
			...client,
			redirect_uris: this.mergeStringArrays(
				fallbackClient.redirect_uris,
				client.redirect_uris,
			),
			grant_types: this.mergeStringArrays(
				fallbackClient.grant_types,
				client.grant_types,
			),
			response_types: this.mergeStringArrays(
				fallbackClient.response_types,
				client.response_types,
			),
		};
	}

	private mergeStringArrays(...values: Array<string[] | undefined>): string[] {
		return Array.from(new Set(values.flatMap((value) => value ?? [])));
	}

	private buildFallbackClients(
		oidcConfig: OidcConfig | undefined,
		issuer: string,
		idpClientUrl: string,
	): OidcClientConfig[] {
		const adminClient = oidcConfig?.clients.admin;
		const storybookClient = oidcConfig?.clients.storybook;
		const swaggerRedirectUri =
			process.env.OIDC_SWAGGER_REDIRECT_URI ||
			resolveUrl(idpClientUrl || issuer, "/api/oauth2-redirect.html");
		const idpWebRedirectUri =
			process.env.OIDC_IDP_WEB_REDIRECT_URI ||
			resolveUrl(idpClientUrl, "/api/v1/auth/idp/callback");

		return [
			{
				client_id: adminClient?.clientId || "admin-web",
				client_secret:
					adminClient?.clientSecret || "admin-secret-change-in-production",
				client_name: "Admin Web",
				redirect_uris: [
					adminClient?.redirectUri || "http://localhost:3000/api/v1/auth/callback",
				],
				grant_types: ["authorization_code", "refresh_token"],
				response_types: ["code"],
				token_endpoint_auth_method: "client_secret_post",
				scope: "openid profile email roles",
			},
			{
				client_id: storybookClient?.clientId || "storybook",
				client_secret:
					storybookClient?.clientSecret ||
					"storybook-secret-change-in-production",
				client_name: "PRJ Core Storybook",
				redirect_uris: [
					storybookClient?.redirectUri ||
						"http://localhost:6006/api/v1/auth/storybook/callback",
				],
				grant_types: ["authorization_code", "refresh_token"],
				response_types: ["code"],
				token_endpoint_auth_method: "client_secret_post",
				scope: "openid profile email roles",
			},
			{
				client_id: process.env.OIDC_IDP_WEB_CLIENT_ID || "idp-web",
				client_secret:
					process.env.OIDC_IDP_WEB_CLIENT_SECRET ||
					"idp-web-secret-change-in-production",
				client_name: "IDP Web",
				redirect_uris: [idpWebRedirectUri],
				grant_types: ["authorization_code", "refresh_token"],
				response_types: ["code"],
				token_endpoint_auth_method: "client_secret_post",
				scope: "openid profile email roles",
			},
			{
				client_id: "prj-core-mobile",
				client_name: "PRJ Core Mobile App",
				redirect_uris: [
					"com.prjcore.app://callback",
					"http://localhost:19006/callback",
				],
				grant_types: ["authorization_code", "refresh_token"],
				response_types: ["code"],
				token_endpoint_auth_method: "none",
				scope: "openid profile email offline_access",
			},
			{
				client_id: process.env.OIDC_SWAGGER_CLIENT_ID || "prj-core-swagger",
				client_name: "PRJ Core Swagger UI",
				redirect_uris: [swaggerRedirectUri],
				grant_types: ["authorization_code"],
				response_types: ["code"],
				token_endpoint_auth_method: "none",
				scope: "openid profile email roles",
			},
		];
	}
}
