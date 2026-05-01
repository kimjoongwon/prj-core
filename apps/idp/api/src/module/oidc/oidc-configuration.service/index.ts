import { applyFirstPartyOidcRuntimeConfig } from "@cocrepo/service";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { OidcConfig } from "../../../config/oidc.config";
import { AccountService } from "../account.service";
import { RedisOidcAdapterFactory } from "../oidc.adapter";
import { OidcClientRepository } from "../oidc-client.repository";
import type { OidcClientConfig, OidcConfiguration } from "../types";

/**
 * OIDC Configuration Service
 *
 * oidc-provider 초기화에 필요한 설정을 빌드합니다.
 * OIDC 클라이언트는 DB를 source of truth로 사용합니다.
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
		const clients = await this.loadClients();

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
	 * DB에서 활성 OIDC 클라이언트를 로드합니다.
	 */
	private async loadClients(): Promise<OidcClientConfig[]> {
		try {
			const clients = await this.oidcClientRepository.findActiveClients();

			this.logger.log(`DB에서 ${clients.length}개의 OIDC 클라이언트 로드됨`);
			if (clients.length === 0) {
				this.logger.warn(
					"활성 OIDC 클라이언트가 없습니다. 어드민에서 OIDC 클라이언트를 등록해야 인증이 동작합니다.",
				);
			}
			return clients.map((client) => {
				const runtimeClient = applyFirstPartyOidcRuntimeConfig(client);

				return {
					client_id: runtimeClient.clientId,
					client_secret: runtimeClient.clientSecret || undefined,
					client_name: runtimeClient.name,
					redirect_uris: runtimeClient.redirectUris,
					grant_types: runtimeClient.grantTypes,
					response_types: runtimeClient.responseTypes,
					token_endpoint_auth_method: runtimeClient.tokenEndpointAuthMethod,
					scope: runtimeClient.scope,
				};
			});
		} catch (error) {
			this.logger.error("DB에서 OIDC 클라이언트 로드 실패");
			this.logger.debug(String(error));
		}

		return [];
	}
}
