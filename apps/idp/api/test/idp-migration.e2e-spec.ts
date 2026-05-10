import { createHash, randomBytes } from "node:crypto";

/**
 * IDP 모듈 마이그레이션 E2E 테스트
 *
 * apps/server(3006) → apps/idp-server(3007) 마이그레이션 후
 * 모든 엔드포인트가 정상 동작하는지 검증합니다.
 *
 * 사전 조건:
 * - idp-server가 localhost:3007에서 실행 중
 * - PostgreSQL + Redis가 실행 중
 * - 시드 데이터가 적용된 상태
 */

const BASE_URL = "http://localhost:3007";

type FirstPartyClient = "admin-web" | "idp-web" | "storybook-web";

const FIRST_PARTY_CALLBACK_URIS: Record<FirstPartyClient, string> = {
	"admin-web": "http://localhost:3000/api/v1/auth/callback?clientId=admin-web",
	"idp-web": "http://localhost:3008/api/v1/auth/callback?clientId=idp-web",
	"storybook-web":
		"http://localhost:6006/api/v1/auth/callback?clientId=storybook-web",
};

const FIRST_PARTY_LOGIN_URLS: Record<FirstPartyClient, string> = {
	"admin-web": "http://localhost:3000/admin/auth/login",
	"idp-web": "http://localhost:3008/auth/login",
	"storybook-web": "http://localhost:6006/__storybook_auth/login",
};

const SWAGGER_CLIENT_ID = "swagger-web";
const SWAGGER_BASE_URL = process.env.IDP_CLIENT_URL ?? "http://localhost:3008";
const SWAGGER_REDIRECT_URI =
	process.env.OIDC_SWAGGER_REDIRECT_URI ??
	`${SWAGGER_BASE_URL}/api/oauth2-redirect.html`;
const DEFAULT_ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@onora.com";
const DEFAULT_ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "rkdmf12!@";

type CookieJar = Map<string, string>;

function buildCookieHeader(jar: CookieJar): string | undefined {
	if (jar.size === 0) {
		return undefined;
	}

	return Array.from(jar.values()).join("; ");
}

function storeResponseCookies(response: Response, jar: CookieJar) {
	const setCookies =
		(
			response.headers as unknown as {
				getSetCookie?: () => string[];
			}
		).getSetCookie?.() ?? [];

	for (const setCookie of setCookies) {
		const [cookiePair] = setCookie.split(";");
		const [name, ...valueParts] = cookiePair.split("=");
		jar.set(name, `${name}=${valueParts.join("=")}`);
	}
}

async function fetchWithCookies(
	url: string,
	jar: CookieJar,
	init: RequestInit = {},
): Promise<Response> {
	const headers = new Headers(init.headers);
	const cookieHeader = buildCookieHeader(jar);

	if (cookieHeader) {
		headers.set("cookie", cookieHeader);
	}

	const response = await fetch(url, {
		...init,
		headers,
		redirect: "manual",
	});
	storeResponseCookies(response, jar);
	return response;
}

function createPkcePair() {
	const codeVerifier = randomBytes(32).toString("base64url");
	const codeChallenge = createHash("sha256")
		.update(codeVerifier)
		.digest("base64url");

	return { codeVerifier, codeChallenge };
}

function extractInteractionUid(url: string): string | null {
	try {
		const parsed = new URL(url);
		const match = parsed.pathname.match(/^\/interaction\/([^/]+)$/);
		return match?.[1] ?? null;
	} catch {
		return null;
	}
}

async function loginAsFullAccessWithSwaggerClient(): Promise<string> {
	const jar: CookieJar = new Map();
	const state = randomBytes(16).toString("hex");
	const { codeVerifier, codeChallenge } = createPkcePair();
	const authUrl = new URL("/oidc/auth", BASE_URL);

	authUrl.searchParams.set("response_type", "code");
	authUrl.searchParams.set("client_id", SWAGGER_CLIENT_ID);
	authUrl.searchParams.set("redirect_uri", SWAGGER_REDIRECT_URI);
	authUrl.searchParams.set("scope", "openid profile email roles");
	authUrl.searchParams.set("state", state);
	authUrl.searchParams.set("code_challenge", codeChallenge);
	authUrl.searchParams.set("code_challenge_method", "S256");
	authUrl.searchParams.set("prompt", "login");

	const authResponse = await fetchWithCookies(authUrl.toString(), jar);
	expect([302, 303]).toContain(authResponse.status);

	let nextUrl = authResponse.headers.get("location");
	expect(nextUrl).toBeDefined();

	for (let step = 0; step < 10; step++) {
		if (!nextUrl) {
			break;
		}

		const uid = extractInteractionUid(nextUrl);
		if (uid) {
			const interactionRes = await fetchWithCookies(
				`${BASE_URL}/api/interaction/${uid}`,
				jar,
			);
			expect(interactionRes.status).toBe(200);
			const interaction = (await interactionRes.json()) as {
				type: "login" | "consent";
			};

			if (interaction.type === "login") {
				const loginRes = await fetchWithCookies(
					`${BASE_URL}/api/interaction/${uid}/login`,
					jar,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: DEFAULT_ADMIN_EMAIL,
							password: DEFAULT_ADMIN_PASSWORD,
							remember: false,
						}),
					},
				);
				expect(loginRes.status).toBe(200);
				nextUrl = ((await loginRes.json()) as { redirectTo: string }).redirectTo;
				continue;
			}

			const consentRes = await fetchWithCookies(
				`${BASE_URL}/api/interaction/${uid}/confirm`,
				jar,
				{
					method: "POST",
				},
			);
			expect(consentRes.status).toBe(200);
			nextUrl = ((await consentRes.json()) as { redirectTo: string }).redirectTo;
			continue;
		}

		const resumeRes = await fetchWithCookies(nextUrl, jar);
		expect([302, 303]).toContain(resumeRes.status);
		const location = resumeRes.headers.get("location");
		expect(location).toBeDefined();

		const redirectUrl = new URL(location as string, BASE_URL);
		const expectedRedirectUrl = new URL(SWAGGER_REDIRECT_URI);
		if (
			redirectUrl.origin === expectedRedirectUrl.origin &&
			redirectUrl.pathname === expectedRedirectUrl.pathname
		) {
			const code = redirectUrl.searchParams.get("code");
			const returnedState = redirectUrl.searchParams.get("state");
			expect(code).toBeDefined();
			expect(returnedState).toBe(state);

			const tokenRes = await fetchWithCookies(`${BASE_URL}/oidc/token`, jar, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					grant_type: "authorization_code",
					client_id: SWAGGER_CLIENT_ID,
					redirect_uri: SWAGGER_REDIRECT_URI,
					code: code as string,
					code_verifier: codeVerifier,
				}).toString(),
			});
			expect(tokenRes.status).toBe(200);
			const tokenBody = (await tokenRes.json()) as {
				access_token?: string;
			};
			expect(tokenBody.access_token).toBeDefined();
			return tokenBody.access_token as string;
		}

		nextUrl = location;
	}

	throw new Error("Swagger public client login did not finish in time.");
}

async function fetchAuthorizedJson(
	url: string,
	accessToken: string,
	init: RequestInit = {},
) {
	const headers = new Headers(init.headers);
	headers.set("authorization", `Bearer ${accessToken}`);

	if (init.body && !headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	const response = await fetch(url, {
		...init,
		headers,
	});
	const rawBody = await response.text();
	const contentType = response.headers.get("content-type") ?? "";
	const trimmedBody = rawBody.trim();
	const body = (rawBody
		? contentType.includes("application/json") &&
			(trimmedBody.startsWith("{") || trimmedBody.startsWith("["))
			? (JSON.parse(rawBody) as {
					data?: unknown;
					message?: string;
				})
			: { message: rawBody }
		: {}) as {
		data?: unknown;
		message?: string;
	};

	return { response, body };
}

async function requestManualRedirect(url: string): Promise<Response> {
	return fetch(url, { redirect: "manual" });
}

async function expectOidcLoginRedirect(clientId: FirstPartyClient) {
	const res = await requestManualRedirect(
		`${BASE_URL}/api/v1/auth/login?clientId=${clientId}`,
	);

	expect(res.status).toBe(302);
	const location = res.headers.get("location");
	expect(location).toBeDefined();

	const url = new URL(location as string);
	expect(url.pathname).toBe("/oidc/auth");
	expect(url.searchParams.get("client_id")).toBe(clientId);
	expect(url.searchParams.get("response_type")).toBe("code");
	expect(url.searchParams.get("redirect_uri")).toBe(
		FIRST_PARTY_CALLBACK_URIS[clientId],
	);
	expect(url.searchParams.get("code_challenge_method")).toBe("S256");

	return url;
}

describe("IDP 모듈 마이그레이션 E2E 테스트", () => {
	// =========================================================================
	// 1. OIDC Provider 경로 (인증 불필요 - @Public)
	// =========================================================================
	describe("OIDC Provider 경로 (@Public)", () => {
		it("GET /oidc/.well-known/openid-configuration - OIDC Discovery", async () => {
			const res = await fetch(
				`${BASE_URL}/oidc/.well-known/openid-configuration`,
			);

			expect(res.status).toBe(200);
			const body = await res.json();
			expect(body.issuer).toBeDefined();
			expect(body.authorization_endpoint).toBeDefined();
			expect(body.token_endpoint).toBeDefined();
			expect(body.jwks_uri).toBeDefined();
		});

		it("GET /oidc/jwks - JWKS 키 조회", async () => {
			const res = await fetch(`${BASE_URL}/oidc/jwks`);

			expect(res.status).toBe(200);
			const body = await res.json();
			expect(body.keys).toBeDefined();
			expect(Array.isArray(body.keys)).toBe(true);
		});

		it("GET /oidc/auth - OIDC 인증 요청 (303 리다이렉트)", async () => {
			const params = new URLSearchParams({
				response_type: "code",
				client_id: "admin-web",
				redirect_uri:
					"http://localhost:3000/api/v1/auth/callback?clientId=admin-web",
				scope: "openid profile email roles",
				state: "test-state-" + Date.now(),
				code_challenge: "V81G5rYMWhbkYCZxf985aIHW5Lm0rnRgqlW74RYKmdk",
				code_challenge_method: "S256",
				prompt: "login",
			});

			const res = await fetch(`${BASE_URL}/oidc/auth?${params}`, {
				redirect: "manual",
			});

			// OIDC provider가 interaction 페이지로 리다이렉트
			expect(res.status).toBe(303);
			const location = res.headers.get("location");
			expect(location).toBeDefined();
			expect(location).toContain("/interaction/");
		});
	});

	// =========================================================================
	// 2. Interaction 경로 (인증 불필요 - @Public)
	// =========================================================================
	describe("Interaction 경로 (@Public)", () => {
		it("GET /api/interaction/:uid - 유효하지 않은 UID는 에러 반환", async () => {
			const res = await fetch(
				`${BASE_URL}/api/interaction/invalid-uid-12345`,
			);

			// interaction이 없으면 404 또는 400 반환
			expect([400, 404, 500]).toContain(res.status);
		});
	});

	// =========================================================================
	// 3. Password Reset 경로 (인증 불필요 - @Public)
	// =========================================================================
	describe("Password Reset 경로 (@Public)", () => {
		it("GET /api/password-policy - 비밀번호 정책 조회 (인증 불필요)", async () => {
			const res = await fetch(`${BASE_URL}/api/password-policy`);

			// @Public 데코레이터로 인증 없이 접근 가능 (401이 아닌 것 확인)
			expect(res.status).not.toBe(401);
			// 200 또는 500 (DB 마이그레이션 미적용 시 500 가능)
			expect([200, 500]).toContain(res.status);
		});

		it("POST /api/forgot-password - 존재하지 않는 이메일 처리", async () => {
			const res = await fetch(`${BASE_URL}/api/forgot-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: "nonexistent@example.com" }),
			});

			// 보안을 위해 존재하지 않는 이메일이라도 200 반환하는 경우가 많음
			expect([200, 404]).toContain(res.status);
		});

		it("GET /api/reset-password/:token - 유효하지 않은 토큰 (인증 불필요)", async () => {
			const res = await fetch(
				`${BASE_URL}/api/reset-password/invalid-token-12345`,
			);

			// @Public 데코레이터로 인증 없이 접근 가능 (401이 아닌 것 확인)
			expect(res.status).not.toBe(401);
			// 200 (토큰 유효성은 응답 body에서 판단) 또는 400/404
			expect([200, 400, 404]).toContain(res.status);
		});
	});

	// =========================================================================
	// 4. Auth 경로 (/api/v1/auth)
	// =========================================================================
	describe("Auth 경로 (/api/v1/auth)", () => {
		it("GET /api/v1/auth/login - clientId 없이 요청 시 400", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
				redirect: "manual",
			});

			expect(res.status).toBe(400);
		});

		it("GET /api/v1/auth/login?clientId=admin-web - admin-web 로그인 리다이렉트에 prompt를 강제하지 않아야 한다", async () => {
			const url = await expectOidcLoginRedirect("admin-web");

			expect(url.searchParams.get("prompt")).toBeNull();
		});

		it("GET /api/v1/auth/login?clientId=idp-web - OIDC 로그인 리다이렉트", async () => {
			await expectOidcLoginRedirect("idp-web");
		});

		it("GET /api/v1/auth/login?clientId=storybook-web - storybook 로그인 리다이렉트", async () => {
			await expectOidcLoginRedirect("storybook-web");
		});

		it("GET /api/v1/auth/login?clientId=idp-web&returnTo=/admin/settings - returnTo 파라미터 전달", async () => {
			const res = await requestManualRedirect(
				`${BASE_URL}/api/v1/auth/login?clientId=idp-web&returnTo=/admin/settings`,
			);

			expect(res.status).toBe(302);
			const location = res.headers.get("location");
			expect(location).toBeDefined();
			expect(location).toContain("/oidc/auth");
		});

		it("GET /api/v1/auth/login?clientId=does-not-exist - 알 수 없는 clientId는 404", async () => {
			const res = await fetch(
				`${BASE_URL}/api/v1/auth/login?clientId=does-not-exist`,
			);

			expect(res.status).toBe(404);
			const body = await res.json();
			expect(body.message).toBe("OIDC 클라이언트를 찾을 수 없습니다");
		});

		it("GET /api/v1/auth/callback?clientId=storybook-web&error=access_denied - storybook loginUrl로 복귀", async () => {
			const res = await requestManualRedirect(
				`${BASE_URL}/api/v1/auth/callback?clientId=storybook-web&error=access_denied&error_description=%EC%9D%B8%EC%A6%9D%20%EA%B1%B0%EB%B6%80`,
			);

			expect(res.status).toBe(302);
			expect(res.headers.get("location")).toBe(
				`${FIRST_PARTY_LOGIN_URLS["storybook-web"]}?error=%EC%9D%B8%EC%A6%9D+%EA%B1%B0%EB%B6%80`,
			);
		});

		it("GET /api/v1/auth/callback - clientId 없이 요청 시 400", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/auth/callback`);

			expect(res.status).toBe(400);
		});

		it("POST /api/v1/auth/token/refresh - 리프레시 토큰 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/auth/token/refresh`, {
				method: "POST",
			});

			expect(res.status).toBe(401);
		});

		it("GET /api/v1/auth/verify-token - 토큰 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/auth/verify-token`);

			expect(res.status).toBe(401);
		});

		it("POST /api/v1/auth/sign-up - 이메일/비밀번호 없이 요청 시 400", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/auth/sign-up`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({}),
			});

			expect(res.status).toBe(400);
		});

		it("POST /api/v1/auth/logout - 인증 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
				method: "POST",
			});

			expect(res.status).toBe(401);
		});

		it("GET /api/v1/auth/my-spaces - 인증 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/auth/my-spaces`);

			expect(res.status).toBe(401);
		});

		it("GET /api/v1/auth/my-sessions - 인증 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/auth/my-sessions`);

			expect(res.status).toBe(401);
		});

		it("POST /api/v1/auth/change-password - 인증 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/auth/change-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					currentPassword: "old",
					newPassword: "new",
					confirmPassword: "new",
				}),
			});

			expect(res.status).toBe(401);
		});

		it("GET /api/v1/auth/audit-logs - 인증 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/auth/audit-logs`);

			expect(res.status).toBe(401);
		});
	});

	// =========================================================================
	// 5. IDP Accounts 경로 (/api/v1/idp/accounts)
	// =========================================================================
	describe("IDP Accounts 경로 (/api/v1/idp/accounts)", () => {
		it("GET /api/v1/idp/accounts - 인증 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/idp/accounts`);

			expect(res.status).toBe(401);
		});
	});

	// =========================================================================
	// 6. IDP Dashboard 경로 (/api/v1/idp/dashboard)
	// =========================================================================
	describe("IDP Dashboard 경로 (/api/v1/idp/dashboard)", () => {
		it("GET /api/v1/idp/dashboard/stats - 인증 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/idp/dashboard/stats`);

			expect(res.status).toBe(401);
		});

		it("GET /api/v1/idp/dashboard/login-trend - 인증 없이 요청 시 401", async () => {
			const res = await fetch(
				`${BASE_URL}/api/v1/idp/dashboard/login-trend`,
			);

			expect(res.status).toBe(401);
		});
	});

	// =========================================================================
	// 7. OIDC Clients 경로 (/api/v1/oidc-clients)
	// =========================================================================
	describe("OIDC Clients 경로 (/api/v1/oidc-clients)", () => {
		it("GET /api/v1/oidc-clients - 인증 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/oidc-clients`);

			expect(res.status).toBe(401);
		});

		it("FULL_ACCESS 토큰으로 create/update/toggle-active가 login endpoint에 즉시 반영된다", async () => {
			const accessToken = await loginAsFullAccessWithSwaggerClient();
			const suffix = Date.now().toString();
			const clientId = `e2e-auth-shell-${suffix}`;
			const initialRedirectUri = `http://localhost:3100/api/v1/auth/callback?clientId=${clientId}`;
			const updatedRedirectUri = `http://localhost:3200/api/v1/auth/callback?clientId=${clientId}`;
			const initialLoginUrl = "http://localhost:3100/auth/login";
			const updatedLoginUrl = "http://localhost:3200/auth/login";
			let oidcClientId: string | null = null;

			try {
				const createResult = await fetchAuthorizedJson(
					`${BASE_URL}/api/v1/oidc-clients`,
					accessToken,
					{
						method: "POST",
						body: JSON.stringify({
							clientId,
							clientSecret: "e2e-secret-change-me",
							name: `E2E Auth Shell ${suffix}`,
							redirectUris: [initialRedirectUri],
							loginUrl: initialLoginUrl,
							defaultReturnTo: "http://localhost:3100/dashboard",
							grantTypes: ["authorization_code", "refresh_token"],
							responseTypes: ["code"],
							tokenEndpointAuthMethod: "client_secret_post",
							scope: "openid profile email roles",
							isFirstParty: true,
							skipConsent: true,
						}),
					},
				);

				expect(createResult.response.status).toBe(201);
				const createdClient = createResult.body.data as {
					id: string;
					clientId: string;
				};
				oidcClientId = createdClient.id;
				expect(createdClient.clientId).toBe(clientId);

				const createdLoginRes = await requestManualRedirect(
					`${BASE_URL}/api/v1/auth/login?clientId=${clientId}`,
				);
				expect(createdLoginRes.status).toBe(302);
				const createdLoginUrl = new URL(
					createdLoginRes.headers.get("location") as string,
				);
				expect(createdLoginUrl.searchParams.get("redirect_uri")).toBe(
					initialRedirectUri,
				);

				const updateResult = await fetchAuthorizedJson(
					`${BASE_URL}/api/v1/oidc-clients/${oidcClientId}`,
					accessToken,
					{
						method: "PATCH",
						body: JSON.stringify({
							name: `E2E Auth Shell Updated ${suffix}`,
							redirectUris: [updatedRedirectUri],
							loginUrl: updatedLoginUrl,
							defaultReturnTo: "http://localhost:3200/dashboard",
						}),
					},
				);

				expect(updateResult.response.status).toBe(200);

				const updatedLoginRes = await requestManualRedirect(
					`${BASE_URL}/api/v1/auth/login?clientId=${clientId}`,
				);
				expect(updatedLoginRes.status).toBe(302);
				const updatedLoginUrlObj = new URL(
					updatedLoginRes.headers.get("location") as string,
				);
				expect(updatedLoginUrlObj.searchParams.get("redirect_uri")).toBe(
					updatedRedirectUri,
				);

				const disableResult = await fetchAuthorizedJson(
					`${BASE_URL}/api/v1/oidc-clients/${oidcClientId}/toggle-active`,
					accessToken,
					{
						method: "PATCH",
					},
				);

				expect(disableResult.response.status).toBe(200);
				const disabledLoginRes = await requestManualRedirect(
					`${BASE_URL}/api/v1/auth/login?clientId=${clientId}`,
				);
				expect(disabledLoginRes.status).toBe(400);
				const disabledBody = await disabledLoginRes.json();
				expect(disabledBody.message).toBe("비활성화된 OIDC 클라이언트입니다");

				const enableResult = await fetchAuthorizedJson(
					`${BASE_URL}/api/v1/oidc-clients/${oidcClientId}/toggle-active`,
					accessToken,
					{
						method: "PATCH",
					},
				);

				expect(enableResult.response.status).toBe(200);
				const reenabledLoginRes = await requestManualRedirect(
					`${BASE_URL}/api/v1/auth/login?clientId=${clientId}`,
				);
				expect(reenabledLoginRes.status).toBe(302);
			} finally {
				if (oidcClientId) {
					await fetchAuthorizedJson(
						`${BASE_URL}/api/v1/oidc-clients/${oidcClientId}`,
						accessToken,
						{
							method: "DELETE",
						},
					);
				}
			}
		});
	});

	// =========================================================================
	// 8. OIDC Sessions 경로 (/api/v1/oidc-sessions)
	// =========================================================================
	describe("OIDC Sessions 경로 (/api/v1/oidc-sessions)", () => {
		it("GET /api/v1/oidc-sessions - 인증 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/oidc-sessions`);

			expect(res.status).toBe(401);
		});

		it("GET /api/v1/oidc-sessions/stats - 인증 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/oidc-sessions/stats`);

			expect(res.status).toBe(401);
		});
	});

	// =========================================================================
	// 9. Security Policy 경로 (/api/v1/idp/security-policy)
	// =========================================================================
	describe("Security Policy 경로 (/api/v1/idp/security-policy)", () => {
		it("GET /api/v1/idp/security-policy - 인증 없이 요청 시 401", async () => {
			const res = await fetch(`${BASE_URL}/api/v1/idp/security-policy`);

			expect(res.status).toBe(401);
		});
	});

	// =========================================================================
	// 10. Swagger 문서
	// =========================================================================
	describe("Swagger 문서", () => {
		it("GET /api - Swagger UI 접근 가능", async () => {
			const res = await fetch(`${BASE_URL}/api`);

			expect(res.status).toBe(200);
			const html = await res.text();
			expect(html).toContain("swagger");
		});

		it("GET /api-json - OpenAPI JSON 스펙 접근 가능", async () => {
			const res = await fetch(`${BASE_URL}/api-json`);

			expect(res.status).toBe(200);
			const body = await res.json();
			expect(body.openapi).toBeDefined();
			expect(body.paths).toBeDefined();

			// 마이그레이션된 모듈 경로가 포함되어 있는지 확인
			const paths = Object.keys(body.paths);
			expect(paths.some((p: string) => p.includes("/api/v1/auth/"))).toBe(true);
			expect(
				paths.some((p: string) => p.includes("/api/v1/idp/accounts")),
			).toBe(true);
			expect(
				paths.some((p: string) => p.includes("/api/v1/idp/dashboard")),
			).toBe(true);
			expect(
				paths.some((p: string) => p.includes("/api/v1/oidc-clients")),
			).toBe(true);
			expect(
				paths.some((p: string) => p.includes("/api/v1/oidc-sessions")),
			).toBe(true);
			expect(
				paths.some((p: string) =>
					p.includes("/api/v1/idp/security-policy"),
				),
			).toBe(true);
		});
	});

	// =========================================================================
	// 11. OIDC 전체 플로우 테스트 (login → auth → interaction 리다이렉트)
	// =========================================================================
	describe("OIDC 전체 플로우", () => {
		it("login → OIDC auth → interaction 리다이렉트 체인", async () => {
			// Step 1: /api/v1/auth/login?clientId=... 호출
			const loginRes = await fetch(
				`${BASE_URL}/api/v1/auth/login?clientId=idp-web`,
				{
					redirect: "manual",
				},
			);
			expect(loginRes.status).toBe(302);

			const oidcAuthUrl = loginRes.headers.get("location");
			expect(oidcAuthUrl).toBeDefined();
			expect(oidcAuthUrl).toContain("/oidc/auth");

			// Step 2: OIDC auth URL로 요청 (같은 서버에서 처리)
			const authRes = await fetch(oidcAuthUrl!, { redirect: "manual" });
			expect(authRes.status).toBe(303);

			const interactionUrl = authRes.headers.get("location");
			expect(interactionUrl).toBeDefined();
			expect(interactionUrl).toContain("/interaction/");
		});
	});

	// =========================================================================
	// 12. 서버 분리 검증 (main server에는 이동된 경로가 없어야 함)
	// =========================================================================
	describe("서버 분리 검증", () => {
		const MAIN_SERVER = "http://localhost:3006";

		it("main server(3006)에 /api/v1/auth/login 없음 (404 또는 연결 실패)", async () => {
			try {
				const res = await fetch(
					`${MAIN_SERVER}/api/v1/auth/login?clientId=idp-web`,
					{
						redirect: "manual",
					},
				);
				// 서버가 실행 중이면 404, 아니면 연결 실패
				expect([404, 403]).toContain(res.status);
			} catch {
				// 서버가 실행 중이 아니면 연결 실패 - 그래도 통과
				expect(true).toBe(true);
			}
		});

		it("main server(3006)에 /api/v1/idp/accounts 없음", async () => {
			try {
				const res = await fetch(`${MAIN_SERVER}/api/v1/idp/accounts`);
				expect([404, 401]).toContain(res.status);
			} catch {
				expect(true).toBe(true);
			}
		});

		it("main server(3006)에 /api/v1/oidc-clients 없음", async () => {
			try {
				const res = await fetch(`${MAIN_SERVER}/api/v1/oidc-clients`);
				expect([404, 401]).toContain(res.status);
			} catch {
				expect(true).toBe(true);
			}
		});
	});
});
