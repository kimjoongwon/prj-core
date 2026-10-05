import {
	type RuntimeSecurityConfig,
	runtimeSecurityConfig,
} from "./runtime-security.config";

const loadRuntimeSecurityConfig =
	runtimeSecurityConfig as unknown as () => RuntimeSecurityConfig;

const productionEnvironment = {
	NODE_ENV: "production",
	DATABASE_URL:
		"postgresql://core_api:production-password@postgres.internal:5432/core_api?schema=public",
	REDIS_HOST: "redis.internal",
	REDIS_PORT: "6379",
	OIDC_COOKIE_SECRET:
		"production-cookie-secret-that-is-longer-than-32-characters",
	OIDC_ISSUER: "https://id.example.com",
	OIDC_JWKS_URI: "https://id.example.com/oidc/jwks",
	OIDC_ADMIN_BASE_URL: "https://admin.example.com",
	OIDC_INTERACTION_BASE_URL: "https://admin.example.com/interaction",
	OIDC_JWKS_KEYS: '{"keys":[{"kty":"RSA","kid":"core-api-prod-1"}]}',
	CORS_ENABLED: "true",
	CORS_ALLOWED_ORIGINS:
		"https://admin.example.com,https://proposal.example.com",
	TRUST_PROXY_HOPS: "1",
	SWAGGER_ENABLED: "false",
};

describe("runtimeSecurityConfig", () => {
	const originalEnvironment = process.env;

	beforeEach(() => {
		process.env = { ...originalEnvironment };
	});

	afterAll(() => {
		process.env = originalEnvironment;
	});

	it("개발 환경에서 CORS allowlist가 비어 있으면 기존 로컬 허용 동작을 유지해야 한다", () => {
		process.env = {
			...originalEnvironment,
			NODE_ENV: "development",
			CORS_ENABLED: "true",
			CORS_ALLOWED_ORIGINS: "",
			SWAGGER_ENABLED: "true",
		};

		const runtimeSecurity = loadRuntimeSecurityConfig();

		expect(runtimeSecurity.cors).toEqual({
			enabled: true,
			allowedOrigins: [],
		});
		expect(runtimeSecurity.swagger.enabled).toBe(true);
		expect(runtimeSecurity.trustProxyHops).toBe(0);
	});

	it("production에서 필수 보안 설정이 충족되면 Swagger를 기본 비활성화해야 한다", () => {
		process.env = { ...originalEnvironment, ...productionEnvironment };

		const runtimeSecurity = loadRuntimeSecurityConfig();

		expect(runtimeSecurity.isProduction).toBe(true);
		expect(runtimeSecurity.swagger.enabled).toBe(false);
		expect(runtimeSecurity.cors.allowedOrigins).toEqual([
			"https://admin.example.com",
			"https://proposal.example.com",
		]);
	});

	it("production은 HTTPS trusted origin과 ingress proxy hop을 요구해야 한다", () => {
		process.env = {
			...originalEnvironment,
			...productionEnvironment,
			CORS_ALLOWED_ORIGINS: "http://admin.example.com",
		};

		expect(() => loadRuntimeSecurityConfig()).toThrow("CORS_ALLOWED_ORIGINS");

		process.env = {
			...process.env,
			CORS_ALLOWED_ORIGINS: "https://admin.example.com",
			TRUST_PROXY_HOPS: "0",
		};

		expect(() => loadRuntimeSecurityConfig()).toThrow("TRUST_PROXY_HOPS");
	});

	it("production Swagger 활성화에는 IP allowlist와 Basic Auth, HTTPS redirect가 필요하다", () => {
		process.env = {
			...originalEnvironment,
			...productionEnvironment,
			SWAGGER_ENABLED: "true",
		};

		expect(() => loadRuntimeSecurityConfig()).toThrow(
			"Production Swagger requires",
		);

		process.env = {
			...process.env,
			SWAGGER_ALLOWED_IPS: "203.0.113.10",
			SWAGGER_BASIC_AUTH_USERNAME: "operations",
			SWAGGER_BASIC_AUTH_PASSWORD: "a-long-production-only-password",
			SWAGGER_OAUTH_REDIRECT_URI:
				"https://api.example.com/api/oauth2-redirect.html",
		};

		expect(loadRuntimeSecurityConfig().swagger).toMatchObject({
			enabled: true,
			allowedIps: ["203.0.113.10"],
			basicAuth: { username: "operations" },
		});
	});
});
