import { ConfigService } from "@nestjs/config";
import { OidcConfigurationService } from ".";
import { AccountService } from "../account.service";
import { RedisOidcAdapterFactory } from "../oidc.adapter";
import { OidcClientRepository } from "../oidc-client.repository";

describe("OidcConfigurationService", () => {
	const buildService = (clients: Awaited<ReturnType<OidcClientRepository["findActiveClients"]>>) =>
		new OidcConfigurationService(
			{
				get: jest.fn((key: string) => {
					if (key === "oidc") {
						return { issuer: "http://localhost:3007" };
					}

					if (key === "IDP_CLIENT_URL") {
						return "http://localhost:3008";
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
			} as unknown as OidcClientRepository,
		);

	const buildClient = (clientId: string, skipConsent: boolean) => ({
		clientId,
		clientSecret: null,
		name: `${clientId} app`,
		redirectUris: ["kr.co.cocdev.onoramobile://auth/callback"],
		grantTypes: ["authorization_code"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "none",
		scope: "openid profile email",
		skipConsent,
	});

	it("skipConsent first-party client는 기존 grant가 없으면 grant를 자동 생성해야 한다", async () => {
		const service = buildService([buildClient("user-mobile", true)]);
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
				client: { clientId: "user-mobile" },
				params: {
					client_id: "user-mobile",
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
			clientId: "user-mobile",
		});
		expect(grant.addOIDCScope).toHaveBeenCalledWith("openid profile email");
		expect(grant.save).toHaveBeenCalled();
		expect(result).toBe(grant);
	});

	it("prompt=consent 요청과 third-party client는 자동 grant를 생성하지 않아야 한다", async () => {
		const service = buildService([
			buildClient("user-mobile", true),
			buildClient("partner-web", true),
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
});
