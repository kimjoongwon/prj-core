import { OidcRuntimeClientsRepository } from "@cocrepo/repository";
import { ConfigService } from "@nestjs/config";
import { AccountService } from "./account.service";
import { OidcConfigurationService } from "./oidc-configuration.service";
import { RedisOidcAdapterFactory } from "./redis-oidc-adapter.factory";

describe("OidcConfigurationService", () => {
	const buildService = (
		clients: Awaited<
			ReturnType<OidcRuntimeClientsRepository["findActiveClients"]>
		>,
	) =>
		new OidcConfigurationService(
			{
				get: jest.fn((key: string) => {
					if (key === "oidc") {
						return {
							issuer: "http://localhost:3000",
							interactionBaseUrl: "http://localhost:3000/admin",
						};
					}

					return undefined;
				}),
			} as unknown as ConfigService,
			{ findAccount: jest.fn() } as unknown as AccountService,
			{
				getAdapterFactory: jest.fn(() => jest.fn()),
			} as unknown as RedisOidcAdapterFactory,
			{
				findActiveClients: jest.fn().mockResolvedValue(clients),
			} as unknown as OidcRuntimeClientsRepository,
		);

	const buildClient = (
		clientId: string,
		isFirstParty: boolean,
		skipConsent: boolean,
		overrides: {
			loginUrl?: string | null;
			postLogoutRedirectUris?: string[];
		} = {},
	) => ({
		clientId,
		clientSecret: null,
		name: `${clientId} app`,
		redirectUris: ["kr.co.cocdev.onoramobile://auth/callback"],
		grantTypes: ["authorization_code"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "none",
		scope: "openid profile email",
		isFirstParty,
		skipConsent,
		loginUrl: null,
		postLogoutRedirectUris: [] as string[],
		...overrides,
	});

	it("first-party skipConsent client는 기존 grant가 없으면 grant를 자동 생성해야 한다", async () => {
		const service = buildService([buildClient("partner-web", true, true)]);
		const configuration = await service.buildConfiguration();
		expect(configuration.clients?.[0]?.application_type).toBe("native");
		const grant = {
			addOIDCScope: jest.fn(),
			addResourceScope: jest.fn(),
			save: jest.fn().mockResolvedValue("grant-id"),
		};
		const GrantConstructor = jest.fn(() => grant);

		const result = await configuration.loadExistingGrant?.({
			oidc: {
				account: { accountId: "user-1" },
				client: { clientId: "partner-web" },
				params: {
					client_id: "partner-web",
					resource: "http://localhost:3000",
					scope: "openid profile email",
				},
				provider: {
					Grant: Object.assign(GrantConstructor, {
						find: jest.fn(),
					}),
				} as never,
				session: { grantIdFor: jest.fn() },
			},
		});

		expect(GrantConstructor).toHaveBeenCalledWith({
			accountId: "user-1",
			clientId: "partner-web",
		});
		expect(grant.addOIDCScope).toHaveBeenCalledWith("openid profile email");
		expect(grant.addResourceScope).toHaveBeenCalledWith(
			"http://localhost:3000",
			"openid profile email",
		);
		expect(grant.save).toHaveBeenCalled();
		expect(result).toBe(grant);
	});

	it("prompt=consent 요청과 third-party client는 자동 grant를 생성하지 않아야 한다", async () => {
		const service = buildService([
			buildClient("user-mobile", true, true),
			buildClient("partner-web", false, true),
		]);
		const configuration = await service.buildConfiguration();
		const GrantConstructor = jest.fn();
		const baseContext = {
			account: { accountId: "user-1" },
			params: {
				scope: "openid profile email",
			},
			provider: {
				Grant: Object.assign(GrantConstructor, {
					find: jest.fn(),
				}),
			} as never,
			session: { grantIdFor: jest.fn() },
		};

		await expect(
			configuration.loadExistingGrant?.({
				oidc: {
					...baseContext,
					client: { clientId: "user-mobile" },
					params: {
						...baseContext.params,
						client_id: "user-mobile",
						prompt: "consent",
					},
				},
			}),
		).resolves.toBeUndefined();
		await expect(
			configuration.loadExistingGrant?.({
				oidc: {
					...baseContext,
					client: { clientId: "partner-web" },
					params: {
						...baseContext.params,
						client_id: "partner-web",
					},
				},
			}),
		).resolves.toBeUndefined();
		expect(GrantConstructor).not.toHaveBeenCalled();
	});

	it("first-party skipConsent client는 offline_access와 무관하게 refresh token을 발급해야 한다", async () => {
		const service = buildService([
			buildClient("admin-web", true, true),
			buildClient("partner-web", false, false),
		]);
		const configuration = await service.buildConfiguration();
		const codeWithGrantedOfflineAccess = {
			scopes: new Set(["openid", "offline_access"]),
		};
		const codeWithoutOfflineAccess = {
			scopes: new Set(["openid", "profile"]),
		};

		await expect(
			configuration.issueRefreshToken?.(
				{} as never,
				{ clientId: "admin-web", grantTypeAllowed: () => true },
				codeWithGrantedOfflineAccess,
			),
		).resolves.toBe(true);
		// provider가 scope에서 offline_access를 제거했더라도 정책상 발급한다.
		await expect(
			configuration.issueRefreshToken?.(
				{} as never,
				{ clientId: "admin-web", grantTypeAllowed: () => true },
				codeWithoutOfflineAccess,
			),
		).resolves.toBe(true);
	});

	it("third-party client는 offline_access scope가 승인된 경우에만 refresh token을 발급해야 한다", async () => {
		const service = buildService([buildClient("partner-web", false, false)]);
		const configuration = await service.buildConfiguration();

		await expect(
			configuration.issueRefreshToken?.(
				{} as never,
				{ clientId: "partner-web", grantTypeAllowed: () => true },
				{ scopes: new Set(["openid", "offline_access"]) },
			),
		).resolves.toBe(true);
		await expect(
			configuration.issueRefreshToken?.(
				{} as never,
				{ clientId: "partner-web", grantTypeAllowed: () => true },
				{ scopes: new Set(["openid"]) },
			),
		).resolves.toBe(false);
		await expect(
			configuration.issueRefreshToken?.(
				{} as never,
				{
					clientId: "partner-web",
					grantTypeAllowed: (grantType: string) =>
						grantType !== "refresh_token",
				},
				{ scopes: new Set(["openid", "offline_access"]) },
			),
		).resolves.toBe(false);
	});

	it("login 프롬프트와 consent 프롬프트를 각각 전용 화면 경로로 보내야 한다", async () => {
		const service = buildService([buildClient("admin-web", true, true)]);
		const configuration = await service.buildConfiguration();
		const buildInteractionUrl = configuration.interactions?.url;

		expect(
			await buildInteractionUrl?.({} as never, {
				uid: "interaction-1",
				prompt: { name: "login" },
			} as never),
		).toBe("http://localhost:3000/admin/auth/login/interaction-1");
		expect(
			await buildInteractionUrl?.({} as never, {
				uid: "interaction-2",
				prompt: { name: "consent" },
			} as never),
		).toBe("http://localhost:3000/admin/auth/consent/interaction-2");
	});

	describe("rpInitiatedLogout", () => {
		const providerLogoutForm =
			'<form id="op.logoutForm" method="post" action="/oidc/session/end/confirm"><input type="hidden" name="xsrf" value="xsrf-secret"/></form>';

		const renderLogoutConfirmationPage = async (
			clients: Parameters<typeof buildService>[0],
			oidcContext: {
				client?: { clientId: string };
				entities?: { IdTokenHint?: unknown };
			},
		) => {
			const service = buildService(clients);
			const configuration = await service.buildConfiguration();
			const ctx = { oidc: oidcContext, type: "", body: "" };
			await configuration.features?.rpInitiatedLogout?.logoutSource?.(
				ctx,
				providerLogoutForm,
			);
			return ctx;
		};

		it("검증된 id_token_hint를 가진 최초파티 클라이언트는 전체 로그아웃 폼을 자동 제출한다", async () => {
			const ctx = await renderLogoutConfirmationPage(
				[buildClient("admin-web", true, true)],
				{
					client: { clientId: "admin-web" },
					entities: { IdTokenHint: { payload: { sub: "user-1" } } },
				},
			);

			expect(ctx.type).toBe("html");
			expect(ctx.body).toContain('name="logout" value="yes"');
			expect(ctx.body).toContain("document.forms[0].submit()");
		});

		it("최초파티 클라이언트는 id_token_hint가 없어도 전체 로그아웃 폼을 자동 제출한다", async () => {
			const ctx = await renderLogoutConfirmationPage(
				[buildClient("admin-web", true, true)],
				{ client: { clientId: "admin-web" } },
			);

			expect(ctx.type).toBe("html");
			expect(ctx.body).toContain('name="logout" value="yes"');
			expect(ctx.body).toContain("document.forms[0].submit()");
			// 확인 버튼 페이지가 아니어야 한다
			expect(ctx.body).not.toContain('form="op.logoutForm"');
		});

		it("third-party 클라이언트는 id_token_hint가 있어도 확인 버튼을 렌더한다", async () => {
			const ctx = await renderLogoutConfirmationPage(
				[buildClient("partner-web", false, false)],
				{
					client: { clientId: "partner-web" },
					entities: { IdTokenHint: { payload: { sub: "user-1" } } },
				},
			);

			expect(ctx.body).toContain('form="op.logoutForm"');
			expect(ctx.body).not.toContain("document.forms[0].submit()");
		});

		it("postLogoutSuccessSource는 등록된 로그인 화면 URL을 이스케이프해 meta-refresh로 되돌린다", async () => {
			const service = buildService([
				buildClient("admin-web", true, true, {
					loginUrl: "http://localhost:3000/admin/auth/login?next=/a&b=1",
				}),
			]);
			const configuration = await service.buildConfiguration();
			const ctx = {
				oidc: { client: { clientId: "admin-web" } },
				type: "",
				body: "",
			};

			await configuration.features?.rpInitiatedLogout?.postLogoutSuccessSource?.(
				ctx,
				() => undefined,
			);

			expect(ctx.body).toContain(
				"url=http://localhost:3000/admin/auth/login?next=/a&amp;b=1",
			);
			expect(ctx.body).not.toContain('next=/a&b=1"');
		});

		it("postLogoutSuccessSource는 로그인 화면이 없는 클라이언트는 기본 안내 화면을 렌더한다", async () => {
			const service = buildService([buildClient("partner-web", false, false)]);
			const configuration = await service.buildConfiguration();
			const ctx = {
				oidc: { client: { clientId: "partner-web" } },
				type: "",
				body: "",
			};
			const renderDefaultPage = jest.fn();

			await configuration.features?.rpInitiatedLogout?.postLogoutSuccessSource?.(
				ctx,
				renderDefaultPage,
			);

			expect(renderDefaultPage).toHaveBeenCalled();
			expect(ctx.body).toBe("");
		});
	});
});
