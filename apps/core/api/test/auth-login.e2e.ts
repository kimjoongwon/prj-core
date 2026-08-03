import { MOBILE_NATIVE_CLIENT_ID } from "@cocrepo/constant";
import { AuthCacheService, TokenStorageService } from "@cocrepo/service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";

interface NativeLoginResponseData {
	accessToken: string;
	refreshToken: string;
	sessionId: string;
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
	user: {
		id: string;
		email: string;
		password?: string;
	};
}

describe("Auth Login API E2E 테스트", () => {
	let app: INestApplication;
	let tokenStorageService: TokenStorageService;
	let authCacheService: AuthCacheService;
	let jwtService: JwtService;
	const createdSessions: Array<{ userId: string; sessionId: string }> = [];

	const adminEmail = process.env.E2E_ADMIN_EMAIL ?? "admin@plate.com";
	const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? "rkdmf12!@";

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		setNestApp(app);
		await app.init();

		tokenStorageService = app.get(TokenStorageService);
		authCacheService = app.get(AuthCacheService);
		jwtService = app.get(JwtService);
	}, 60000);

	afterAll(async () => {
		for (const session of createdSessions) {
			try {
				await tokenStorageService.deleteSession(
					session.userId,
					session.sessionId,
				);
				await authCacheService.invalidate(session.userId);
			} catch {
				// 테스트 정리 중 이미 만료/삭제된 세션은 무시
			}
		}

		if (app) {
			await app.close();
		}
	}, 30000);

	describe("POST /api/v1/auth/login", () => {
		it("Given seeded 관리자 계정 When native 로그인하면 Then native token과 Redis 세션을 발급해야 한다", async () => {
			// Given
			const loginPayload = {
				email: adminEmail,
				password: adminPassword,
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/auth/login")
				.set("User-Agent", "core-api-login-e2e")
				.send(loginPayload);

			// Then
			expect(response.status).toBe(200);
			expect(response.body.httpStatus).toBe(200);
			expect(response.body.data).toEqual(
				expect.objectContaining({
					accessToken: expect.any(String),
					refreshToken: expect.any(String),
					sessionId: expect.stringMatching(
						new RegExp(`^${MOBILE_NATIVE_CLIENT_ID}\\.`),
					),
					accessTokenExpiresAt: expect.any(Number),
					refreshTokenExpiresAt: expect.any(Number),
					user: expect.objectContaining({
						id: expect.any(String),
						email: adminEmail,
					}),
				}),
			);

			const data = response.body.data as NativeLoginResponseData;
			expect(data.accessToken.split(".")).toHaveLength(3);
			const tokenPayload = jwtService.decode(data.accessToken) as {
				sub?: string;
			};
			expect(tokenPayload.sub).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
			expect(data.user.password).toBeUndefined();
			expect(data.accessTokenExpiresAt).toBeGreaterThan(Date.now());
			expect(data.refreshTokenExpiresAt).toBeGreaterThan(Date.now());

			createdSessions.push({
				userId: tokenPayload.sub!,
				sessionId: data.sessionId,
			});

			const storedSession = await tokenStorageService.getSessionBySessionId(
				data.sessionId,
			);
			expect(storedSession).toEqual(
				expect.objectContaining({
					userId: tokenPayload.sub,
					sessionId: data.sessionId,
					session: expect.objectContaining({
						refreshToken: data.refreshToken,
						clientId: MOBILE_NATIVE_CLIENT_ID,
					}),
				}),
			);

			const verifyResponse = await request(app.getHttpServer())
				.get("/api/v1/auth/verify-token")
				.set("Authorization", `Bearer ${data.accessToken}`);
			expect(verifyResponse.status).toBe(200);
			expect(verifyResponse.body.data).toEqual(
				expect.objectContaining({
					valid: true,
					accessTokenExpiresAt: data.accessTokenExpiresAt,
				}),
			);
		});

		it("Given 존재하지 않는 계정 When native 로그인하면 Then 401과 로그인 실패 payload를 반환해야 한다", async () => {
			// Given
			const loginPayload = {
				email: `missing-login-${Date.now()}@example.com`,
				password: "ValidPassword123!",
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/auth/login")
				.send(loginPayload);

			// Then
			expect(response.status).toBe(401);
			expect(response.body.httpStatus).toBe(401);
			expect(response.body.data).toEqual(
				expect.objectContaining({
					error: "INVALID_CREDENTIALS",
					displayMessage: expect.any(String),
					recoveryActions: expect.arrayContaining([
						expect.objectContaining({ type: "forgot-password" }),
					]),
				}),
			);
		});

		it("Given 잘못된 로그인 payload When native 로그인하면 Then 400을 반환해야 한다", async () => {
			// Given
			const invalidPayload = {
				email: "not-an-email",
				password: "short",
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/auth/login")
				.send(invalidPayload);

			// Then
			expect(response.status).toBe(400);
			expect(response.body.httpStatus).toBe(400);
		});
	});

	describe("GET /api/v1/auth/oidc/login", () => {
		it("Given admin-web client When OIDC 로그인을 시작하면 Then authorization URL로 redirect하고 state를 저장해야 한다", async () => {
			// Given
			const returnTo = "/admin/dashboard";

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/auth/oidc/login")
				.query({
					clientId: "admin-web",
					returnTo,
					prompt: "login",
				});

			// Then
			expect(response.status).toBe(302);
			const location = response.headers.location;
			expect(location).toEqual(expect.any(String));
			if (typeof location !== "string") {
				throw new Error("OIDC login response is missing the Location header.");
			}

			const authorizationUrl = new URL(location);
			expect(authorizationUrl.pathname).toBe("/oidc/auth");
			expect(authorizationUrl.searchParams.get("response_type")).toBe("code");
			expect(authorizationUrl.searchParams.get("client_id")).toBe("admin-web");
			expect(authorizationUrl.searchParams.get("prompt")).toBe("login");
			expect(authorizationUrl.searchParams.get("code_challenge_method")).toBe(
				"S256",
			);

			const state = authorizationUrl.searchParams.get("state");
			expect(state).toEqual(expect.any(String));
			if (typeof state !== "string") {
				throw new Error(
					"OIDC authorization URL is missing the state parameter.",
				);
			}

			const storedState =
				await tokenStorageService.validateAndConsumeOidcState(state);
			expect(storedState).toEqual(
				expect.objectContaining({
					clientId: "admin-web",
					returnTo,
					codeVerifier: expect.any(String),
				}),
			);
		});

		it("Given clientId가 없을 때 When OIDC 로그인을 시작하면 Then 400을 반환해야 한다", async () => {
			// When
			const response = await request(app.getHttpServer()).get(
				"/api/v1/auth/oidc/login",
			);

			// Then
			expect(response.status).toBe(400);
			expect(response.body.httpStatus).toBe(400);
		});
	});
});
