import { type OidcConfig, oidcConfig } from "./oidc.config";

const loadOidcConfig = oidcConfig as unknown as () => OidcConfig;

describe("oidcConfig", () => {
	const originalEnvironment = process.env;

	beforeEach(() => {
		process.env = { ...originalEnvironment, NODE_ENV: "test" };
		delete process.env.OIDC_ADMIN_BASE_URL;
		delete process.env.OIDC_COOKIE_SECRET;
		delete process.env.OIDC_INTERACTION_BASE_URL;
		delete process.env.OIDC_ISSUER;
		delete process.env.OIDC_JWKS_KEYS;
		delete process.env.OIDC_JWKS_URI;
	});

	afterAll(() => {
		process.env = originalEnvironment;
	});

	it("interaction UI 기본값으로 IDP web origin을 사용해야 한다", () => {
		expect(loadOidcConfig().interactionBaseUrl).toBe("http://localhost:3008");
	});

	it("명시한 interaction UI URL을 기본값보다 우선해야 한다", () => {
		process.env.OIDC_INTERACTION_BASE_URL = "https://id.example.com";

		expect(loadOidcConfig().interactionBaseUrl).toBe(
			"https://id.example.com",
		);
	});
});
