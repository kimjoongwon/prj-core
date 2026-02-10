import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { OidcConfig } from "../../config/oidc.config";
import { AccountService } from "./account.service";
import { RedisOidcAdapterFactory } from "./oidc.adapter";
import { OidcClientRepository } from "./oidc-client.repository";
import type { OidcClientConfig, OidcConfiguration } from "./types";

/**
 * OIDC Configuration Service
 *
 * oidc-provider 초기화에 필요한 설정을 빌드합니다.
 * DB에서 클라이언트를 로드하고, 기본 폴백 클라이언트를 관리합니다.
 */
@Injectable()
export class OidcConfigurationService {
	private readonly logger = new Logger(OidcConfigurationService.name);

	private static readonly FALLBACK_CLIENTS: OidcClientConfig[] = [
		{
			client_id: "prj-core-admin",
			client_secret: "admin-secret-change-in-production",
			client_name: "PRJ Core Admin",
			redirect_uris: [
				"http://localhost:3000/api/v1/auth/callback",
				"http://localhost:3001/api/v1/auth/callback",
			],
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
			client_id: "prj-core-swagger",
			client_name: "PRJ Core Swagger UI",
			redirect_uris: ["http://localhost:3006/api/oauth2-redirect.html"],
			grant_types: ["authorization_code"],
			response_types: ["code"],
			token_endpoint_auth_method: "none",
			scope: "openid profile email roles",
		},
	];

	constructor(
		private readonly configService: ConfigService,
		private readonly accountService: AccountService,
		private readonly adapterFactory: RedisOidcAdapterFactory,
		private readonly oidcClientRepository: OidcClientRepository,
	) {}

	async buildConfiguration(): Promise<OidcConfiguration> {
		const oidcConfig = this.configService.get<OidcConfig>("oidc");
		const clients = await this.loadClients();

		const issuer = oidcConfig?.issuer || "http://localhost:3007";

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
				url: (_ctx, interaction) => `/interaction/${interaction.uid}`,
			},
			// PKCE 설정 - Public Client(token_endpoint_auth_method=none)는 PKCE 필수
			pkce: {
				required: (_ctx, client) => client.tokenEndpointAuthMethod === "none",
			},
			// 에러 렌더링 (EJS 템플릿)
			renderError: async (ctx, out, _error) => {
				const ejs = await import("ejs");
				const path = await import("node:path");
				const templatePath = path.join(__dirname, "../../../views/error.ejs");
				ctx.type = "html";
				ctx.body = await ejs.renderFile(templatePath, {
					error: out.error || "Unknown Error",
					error_description: out.error_description || "",
					details: out,
					process,
				});
			},
		};
	}

	/**
	 * DB에서 OIDC 클라이언트 로드
	 * DB 접근 실패 시 폴백 클라이언트를 사용합니다.
	 */
	private async loadClients(): Promise<OidcClientConfig[]> {
		try {
			const clients = await this.oidcClientRepository.findActiveClients();

			if (clients.length > 0) {
				this.logger.log(`DB에서 ${clients.length}개의 OIDC 클라이언트 로드됨`);
				return clients.map((client) => ({
					client_id: client.clientId,
					client_secret: client.clientSecret || undefined,
					client_name: client.clientName,
					redirect_uris: client.redirectUris,
					grant_types: client.grantTypes,
					response_types: client.responseTypes,
					token_endpoint_auth_method: client.tokenEndpointAuthMethod,
					scope: client.scope,
				}));
			}
		} catch {
			this.logger.debug(
				"DB에서 클라이언트 로드 실패 (RLS) - 기본 클라이언트 사용",
			);
		}

		return OidcConfigurationService.FALLBACK_CLIENTS;
	}
}
