import { OidcRuntimeClientsRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { applyRuntimeManagedOidcClientConfig } from "../oidc-runtime-client-config";
import { AccountService } from "./account.service";
import type { OidcConfig } from "./oidc-config";
import { RedisOidcAdapterFactory } from "./redis-oidc-adapter.factory";
import type { RuntimeOidcProviderClient } from "./runtime-oidc-provider-client";
import type { Grant, OidcConfiguration, OidcProviderContext } from "./types";

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
		private readonly oidcClientRepository: OidcRuntimeClientsRepository,
	) {}

	async buildConfiguration(): Promise<OidcConfiguration> {
		const oidcConfig = this.configService.get<OidcConfig>("oidc");
		const issuer = oidcConfig?.issuer || "http://localhost:3000";
		const interactionBaseUrl =
			oidcConfig?.interactionBaseUrl || "http://localhost:3000/admin";
		const { providerClients, clientLoginUrls } = await this.loadClients();
		const skipConsentClientIds = new Set(
			providerClients
				.filter((client) => client.isFirstParty && client.skipConsent)
				.map((client) => client.client_id),
		);

		return {
			adapter: this.adapterFactory.getAdapterFactory(),
			findAccount: this.accountService.findAccount,
			clients: providerClients,
			loadExistingGrant: (ctx) =>
				this.loadExistingGrant(ctx, skipConsentClientIds, issuer),

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
				rpInitiatedLogout: {
					enabled: true,
					// 최초파티 로그아웃은 별도 확인 없이 폼을 자동 제출해
					// 세션 종료 → post_logout_redirect_uri 복귀까지 한 번에 진행한다.
					// provider 폼은 xsrf만 담고 있어 그대로 제출하면 RP 전용 로그아웃
					// (그랜트만 폐기, OP 세션 유지)으로 처리된다. logout=yes를 추가해
					// OP 세션 전체를 종료하는 경로로 보낸다.
					logoutSource: (ctx, form) => {
						const logoutAllForm = form.replace(
							"</form>",
							'<input type="hidden" name="logout" value="yes"/></form>',
						);
						ctx.type = "html";
						ctx.body = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>로그아웃</title></head><body>${logoutAllForm}<script>document.forms[0].submit();</script></body></html>`;
					},
					postLogoutSuccessSource: (ctx, render) =>
						this.renderPostLogoutSuccess(ctx, render, clientLoginUrls),
				},
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
					`${interactionBaseUrl}/auth/interaction/${interaction.uid}`,
			},
			// PKCE 설정 - Public Client(token_endpoint_auth_method=none)는 PKCE 필수
			pkce: {
				required: (_ctx, client) => client.tokenEndpointAuthMethod === "none",
			},
			// OIDC Core는 offline_access에 prompt=consent를 요구하고, 요청에 동의 prompt가
			// 없으면 provider가 scope에서 offline_access를 제거한다. 퍼스트파티 skip-consent
			// 클라이언트는 로그인 시점에 요청 scope 전체를 자동 승인하는 정책이므로 동의
			// 화면 없이 refresh token을 발급한다. 그 외 클라이언트는 기본 동작을 따른다.
			issueRefreshToken: async (_ctx, client, code) => {
				if (client.clientId && skipConsentClientIds.has(client.clientId)) {
					return true;
				}
				return Boolean(
					client.grantTypeAllowed?.("refresh_token") &&
						code.scopes?.has("offline_access"),
				);
			},
			// 에러 렌더링 - idp-client의 /error 페이지로 리다이렉트
			renderError: async (ctx, out, _error) => {
				const errorParams = new URLSearchParams({
					error: String(out.error || "Unknown Error"),
					error_description: String(out.error_description || ""),
				});
				const errorUrl = `${interactionBaseUrl}/auth/error?${errorParams.toString()}`;
				ctx.type = "html";
				ctx.body = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${errorUrl}"></head><body>Redirecting...</body></html>`;
			},
		};
	}

	/**
	 * DB에서 활성 OIDC 클라이언트를 provider 메타데이터와
	 * clientId→로그인 화면 URL 매핑으로 로드합니다.
	 */
	private async loadClients(): Promise<{
		providerClients: RuntimeOidcProviderClient[];
		clientLoginUrls: Map<string, string>;
	}> {
		try {
			const clients = await this.oidcClientRepository.findActiveClients();

			this.logger.log(`DB에서 ${clients.length}개의 OIDC 클라이언트 로드됨`);
			if (clients.length === 0) {
				this.logger.warn(
					"활성 OIDC 클라이언트가 없습니다. 어드민에서 OIDC 클라이언트를 등록해야 인증이 동작합니다.",
				);
			}

			const clientLoginUrls = new Map<string, string>();
			const providerClients = clients.map((client) => {
				const runtimeClient = applyRuntimeManagedOidcClientConfig(client);

				if (runtimeClient.loginUrl) {
					clientLoginUrls.set(runtimeClient.clientId, runtimeClient.loginUrl);
				}

				return {
					client_id: runtimeClient.clientId,
					client_secret: runtimeClient.clientSecret || undefined,
					client_name: runtimeClient.name,
					application_type:
						runtimeClient.tokenEndpointAuthMethod === "none"
							? ("native" as const)
							: ("web" as const),
					redirect_uris: runtimeClient.redirectUris,
					post_logout_redirect_uris: runtimeClient.postLogoutRedirectUris ?? [],
					grant_types: runtimeClient.grantTypes,
					response_types: runtimeClient.responseTypes,
					token_endpoint_auth_method: runtimeClient.tokenEndpointAuthMethod,
					scope: runtimeClient.scope,
					logo_uri: runtimeClient.logoUri ?? undefined,
					policy_uri: runtimeClient.policyUri ?? undefined,
					tos_uri: runtimeClient.tosUri ?? undefined,
					isFirstParty: runtimeClient.isFirstParty,
					skipConsent: runtimeClient.skipConsent,
				};
			});

			return { providerClients, clientLoginUrls };
		} catch (error) {
			this.logger.error("DB에서 OIDC 클라이언트 로드 실패");
			this.logger.debug(String(error));
		}

		return { providerClients: [], clientLoginUrls: new Map() };
	}

	/**
	 * RP-Initiated Logout 완료 화면. 클라이언트가 등록한 로그인 화면 URL로
	 * 되돌리고(renderError와 같은 meta-refresh 방식), 알 수 없으면 기본
	 * 안내 화면을 렌더한다.
	 */
	private renderPostLogoutSuccess(
		ctx: Parameters<
			NonNullable<
				NonNullable<OidcConfiguration["features"]>["rpInitiatedLogout"]
			>["postLogoutSuccessSource"]
		>[0],
		render: () => unknown,
		clientLoginUrls: Map<string, string>,
	) {
		const clientId = ctx.oidc?.client?.clientId;
		const loginUrl = clientId ? clientLoginUrls.get(clientId) : undefined;
		if (!loginUrl) {
			return render();
		}

		ctx.type = "html";
		ctx.body = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${loginUrl}"></head><body>Redirecting...</body></html>`;
	}

	private async loadExistingGrant(
		ctx: OidcProviderContext,
		skipConsentClientIds: Set<string>,
		defaultResource: string,
	): Promise<Grant | undefined> {
		if (this.hasPromptConsent(ctx)) {
			return undefined;
		}

		const clientId = this.resolveGrantClientId(ctx);
		const grantId =
			ctx.oidc?.result?.consent?.grantId ||
			(clientId ? ctx.oidc?.session?.grantIdFor(clientId) : undefined);
		if (grantId) {
			return ctx.oidc?.provider?.Grant.find(grantId);
		}

		const accountId = ctx.oidc?.account?.accountId;
		const scope = ctx.oidc?.params?.scope;
		const provider = ctx.oidc?.provider;
		if (
			!accountId ||
			!clientId ||
			!scope ||
			!provider ||
			!skipConsentClientIds.has(clientId)
		) {
			return undefined;
		}

		const grant = new provider.Grant({ accountId, clientId });
		grant.addOIDCScope(scope);
		for (const resourceIndicator of this.resolveGrantResourceIndicators(
			ctx,
			defaultResource,
		)) {
			grant.addResourceScope(resourceIndicator, scope);
		}
		await grant.save();
		return grant;
	}

	private hasPromptConsent(ctx: OidcProviderContext): boolean {
		const prompt = ctx.oidc?.params?.prompt;
		return typeof prompt === "string" && prompt.split(" ").includes("consent");
	}

	private resolveGrantClientId(ctx: OidcProviderContext): string | undefined {
		return ctx.oidc?.client?.clientId || ctx.oidc?.params?.client_id;
	}

	private resolveGrantResourceIndicators(
		ctx: OidcProviderContext,
		defaultResource: string,
	): string[] {
		const resource = ctx.oidc?.params?.resource;
		const resources = Array.isArray(resource)
			? resource
			: typeof resource === "string"
				? [resource]
				: [defaultResource];

		return [...new Set(resources.filter((value) => value.length > 0))];
	}
}
