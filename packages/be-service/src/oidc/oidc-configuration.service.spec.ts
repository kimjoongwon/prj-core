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
		const service = buildService([
			buildClient("partner-web", false, false),
		]);
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
});
