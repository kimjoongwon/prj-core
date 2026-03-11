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
				clientId: "test-client",
				clientSecret: "test-secret",
				redirectUri: "http://localhost:3000/api/v1/auth/callback",
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
		const result = facade.createAuthorizationRequest("/admin/dashboard");

		expect(result.state).toBeTruthy();
		expect(result.codeVerifier).toBeTruthy();
		expect(result.returnTo).toBe("/admin/dashboard");
		expect(result.authorizationUrl).toContain("/oidc/auth?");
		expect(result.authorizationUrl).toContain("client_id=test-client");
		expect(result.authorizationUrl).toContain("code_challenge=");
	});
});
