import { ConfigService } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import { OidcFacade } from "../src/oidc.facade";

describe("OidcFacade", () => {
	let facade: OidcFacade;

	beforeEach(async () => {
		const mockConfigService = {
			get: jest.fn().mockReturnValue({
				issuer: "http://localhost:3007",
				jwksUri: "http://localhost:3007/oidc/jwks",
				clients: {
					admin: {
						clientId: "test-admin-client",
						clientSecret: "test-admin-secret",
						redirectUri: "http://localhost:3000/api/v1/auth/callback",
						loginUrl: "http://localhost:3000/admin/auth/login",
						defaultReturnTo: "http://localhost:3000/admin/dashboard",
					},
					storybook: {
						clientId: "test-storybook-client",
						clientSecret: "test-storybook-secret",
						redirectUri:
							"http://localhost:6006/api/v1/auth/storybook/callback",
						loginUrl: "http://localhost:6006/__storybook_auth/login",
						defaultReturnTo: "http://localhost:6006/",
					},
					idpWeb: {
						clientId: "test-idp-web-client",
						clientSecret: "test-idp-web-secret",
						redirectUri: "http://localhost:3008/api/v1/auth/idp/callback",
						loginUrl: "http://localhost:3008/auth/login",
						defaultReturnTo: "http://localhost:3008/dashboard",
					},
				},
			}),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OidcFacade,
				{ provide: ConfigService, useValue: mockConfigService },
			],
		}).compile();

		facade = module.get<OidcFacade>(OidcFacade);
	});

	it("authorization request를 생성해야 한다", () => {
		const result = facade.createAuthorizationRequest(
			"admin",
			"/admin/dashboard",
		);

		expect(result.state).toBeTruthy();
		expect(result.codeVerifier).toBeTruthy();
		expect(result.returnTo).toBe("/admin/dashboard");
		expect(result.authorizationUrl).toContain("/oidc/auth?");
		expect(result.authorizationUrl).toContain("client_id=test-admin-client");
		expect(result.authorizationUrl).toContain("code_challenge=");
	});

	it("storybook RP 설정으로 authorization request를 생성해야 한다", () => {
		const result = facade.createAuthorizationRequest(
			"storybook",
			"http://localhost:6006/?path=/story/example",
		);

		expect(result.authorizationUrl).toContain(
			"client_id=test-storybook-client",
		);
		expect(result.authorizationUrl).toContain(
			encodeURIComponent(
				"http://localhost:6006/api/v1/auth/storybook/callback",
			),
		);
	});

	it("idpWeb RP 설정으로 authorization request를 생성해야 한다", () => {
		const result = facade.createAuthorizationRequest(
			"idpWeb",
			"http://localhost:3008/dashboard",
		);

		expect(result.authorizationUrl).toContain("client_id=test-idp-web-client");
		expect(result.authorizationUrl).toContain(
			encodeURIComponent("http://localhost:3008/api/v1/auth/idp/callback"),
		);
	});
});
