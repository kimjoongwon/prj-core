import { ConfigService } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import { OidcFacade } from "../src/oidc.facade";

describe("OidcFacade", () => {
	let facade: OidcFacade;

	const adminClient = {
		clientId: "admin-web",
		clientSecret: "admin-secret",
		redirectUri:
			"http://localhost:3000/api/v1/auth/callback?clientId=admin-web",
		scope: "openid profile email roles",
	};

	const storybookClient = {
		clientId: "storybook-web",
		clientSecret: "storybook-secret",
		redirectUri:
			"http://localhost:6006/api/v1/auth/callback?clientId=storybook-web",
		scope: "openid profile email roles",
	};

	const mobileClient = {
		clientId: "user-mobile",
		clientSecret: null,
		redirectUri: "kr.co.cocdev.onoramobile://auth/callback",
		scope: "openid profile email",
	};

	beforeEach(async () => {
		const mockConfigService = {
			get: jest.fn().mockReturnValue({
				issuer: "http://localhost:3007",
				jwksUri: "http://localhost:3007/oidc/jwks",
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

	it("authorization request에서 explicit protocol client config를 사용해야 한다", () => {
		const result = facade.createAuthorizationRequest(
			adminClient,
			"/admin/dashboard",
		);

		expect(result.state).toBeTruthy();
		expect(result.codeVerifier).toBeTruthy();
		expect(result.returnTo).toBe("/admin/dashboard");
		expect(result.authorizationUrl).toContain("/oidc/auth?");

		const url = new URL(result.authorizationUrl);
		expect(url.searchParams.get("client_id")).toBe(adminClient.clientId);
		expect(url.searchParams.get("redirect_uri")).toBe(adminClient.redirectUri);
		expect(url.searchParams.get("scope")).toBe("openid profile email roles");
		expect(url.searchParams.get("code_challenge")).toBeTruthy();
		expect(url.searchParams.get("code_challenge_method")).toBe("S256");
	});

	it("storybook client config도 동일한 방식으로 authorization request를 생성해야 한다", () => {
		const result = facade.createAuthorizationRequest(
			storybookClient,
			"http://localhost:6006/?path=/story/example",
		);

		const url = new URL(result.authorizationUrl);
		expect(url.searchParams.get("client_id")).toBe(storybookClient.clientId);
		expect(url.searchParams.get("redirect_uri")).toBe(
			storybookClient.redirectUri,
		);
		expect(result.returnTo).toBe("http://localhost:6006/?path=/story/example");
	});

	it("client config의 scope를 authorization request에 사용해야 한다", () => {
		const result = facade.createAuthorizationRequest(mobileClient, "/");

		const url = new URL(result.authorizationUrl);
		expect(url.searchParams.get("client_id")).toBe("user-mobile");
		expect(url.searchParams.get("redirect_uri")).toBe(
			"kr.co.cocdev.onoramobile://auth/callback",
		);
		expect(url.searchParams.get("scope")).toBe("openid profile email");
	});
});
