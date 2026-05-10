import type { ConfigService } from "@nestjs/config";
import type { OidcClientData } from "../../oidc/oidc-client.repository";
import type { OidcClientRepository } from "../../oidc/oidc-client.repository";
import type { OidcProviderService } from "../../oidc/oidc-provider.service";
import type {
	Grant,
	KoaLikeRequest,
	KoaLikeResponse,
	OidcProviderInstance,
} from "../../oidc/types";
import { InteractionService } from ".";

describe("InteractionService", () => {
	const req = {
		method: "POST",
		url: "/api/interaction/uid/login",
		header: jest.fn(),
	} as unknown as KoaLikeRequest;
	const res = {
		status: 200,
		redirect: jest.fn(),
		render: jest.fn(),
	} as unknown as KoaLikeResponse;

	const buildClient = (
		overrides: Partial<OidcClientData> = {},
	): OidcClientData => ({
		clientId: "user-mobile",
		clientSecret: null,
		name: "PRJ Core Mobile App",
		redirectUris: ["kr.co.cocdev.onoramobile://auth/callback"],
		grantTypes: ["authorization_code", "refresh_token"],
		responseTypes: ["code"],
		tokenEndpointAuthMethod: "none",
		scope: "openid profile email",
		isFirstParty: true,
		skipConsent: true,
		loginUi: null,
		logoUri: null,
		policyUri: null,
		tosUri: null,
		...overrides,
	});

	const buildService = (
		provider: OidcProviderInstance,
		client: OidcClientData | null,
	) =>
		new InteractionService(
			{
				getProvider: jest.fn(() => provider),
			} as unknown as OidcProviderService,
			{
				findByClientId: jest.fn().mockResolvedValue(client),
			} as unknown as OidcClientRepository,
			{
				get: jest.fn((key: string) =>
					key === "oidc" ? { issuer: "http://localhost:3007" } : undefined,
				),
			} as unknown as ConfigService,
		);

	it("first-party skipConsent client는 로그인 완료 시 consent grant도 함께 제출해야 한다", async () => {
		const grant: Grant = {
			accountId: "user-1",
			clientId: "user-mobile",
			addOIDCScope: jest.fn(),
			addResourceScope: jest.fn(),
			save: jest.fn().mockResolvedValue("grant-id"),
		};
		const GrantConstructor = jest.fn(() => grant);
		const provider = {
			interactionDetails: jest.fn().mockResolvedValue({
				uid: "interaction-1",
				prompt: { name: "login" },
				params: {
					client_id: "user-mobile",
					scope: "openid profile email",
				},
			}),
			interactionResult: jest
				.fn()
				.mockResolvedValue("/oidc/auth/interaction-1"),
			Grant: Object.assign(GrantConstructor, {
				find: jest.fn(),
			}),
			Client: { find: jest.fn() },
		} as unknown as OidcProviderInstance;
		const service = buildService(provider, buildClient());

		await expect(
			service.completeLogin(req, res, "user-1", true),
		).resolves.toEqual({ redirectTo: "/oidc/auth/interaction-1" });

		expect(GrantConstructor).toHaveBeenCalledWith({
			accountId: "user-1",
			clientId: "user-mobile",
		});
		expect(grant.addOIDCScope).toHaveBeenCalledWith("openid profile email");
		expect(grant.addResourceScope).toHaveBeenCalledWith(
			"http://localhost:3007",
			"openid profile email",
		);
		expect(grant.save).toHaveBeenCalled();
		expect(provider.interactionResult).toHaveBeenCalledWith(
			req,
			res,
			{
				login: { accountId: "user-1", remember: true },
				consent: { grantId: "grant-id" },
			},
			{ mergeWithLastSubmission: false },
		);
	});

	it("explicit prompt=consent 요청은 로그인 완료 시 자동 consent grant를 만들지 않아야 한다", async () => {
		const GrantConstructor = jest.fn();
		const provider = {
			interactionDetails: jest.fn().mockResolvedValue({
				uid: "interaction-1",
				prompt: { name: "login" },
				params: {
					client_id: "user-mobile",
					prompt: "login consent",
					scope: "openid profile email",
				},
			}),
			interactionResult: jest
				.fn()
				.mockResolvedValue("/oidc/auth/interaction-1"),
			Grant: Object.assign(GrantConstructor, {
				find: jest.fn(),
			}),
			Client: { find: jest.fn() },
		} as unknown as OidcProviderInstance;
		const service = buildService(provider, buildClient());

		await service.completeLogin(req, res, "user-1", false);

		expect(GrantConstructor).not.toHaveBeenCalled();
		expect(provider.interactionResult).toHaveBeenCalledWith(
			req,
			res,
			{ login: { accountId: "user-1", remember: false } },
			{ mergeWithLastSubmission: false },
		);
	});
});
