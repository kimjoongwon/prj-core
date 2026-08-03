import {
	DEFAULT_PASSWORD_MAX_LENGTH,
	DEFAULT_PASSWORD_MIN_LENGTH,
	DEFAULT_PASSWORD_REQUIRE_LOWERCASE,
	DEFAULT_PASSWORD_REQUIRE_NUMBER,
	DEFAULT_PASSWORD_REQUIRE_SPECIAL,
	DEFAULT_PASSWORD_REQUIRE_UPPERCASE,
	DEFAULT_PASSWORD_REUSE_LIMIT,
	PRISMA_SERVICE_TOKEN,
} from "@cocrepo/constant";
import {
	type PrismaService,
	RedisService,
	TokenStorageService,
} from "@cocrepo/service";
import { HashedPassword, PasswordResetToken, PlainPassword } from "@cocrepo/vo";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";

const RESET_TOKEN_PREFIX = "password-reset:";
const RESET_TOKEN_TTL_SECONDS = 30 * 60;

interface CreatedSession {
	userId: string;
	sessionId: string;
}

interface TestUser {
	id: bigint;
	userId: string;
	email: string;
}

describe("Auth Password Policy API E2E 테스트", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let redisService: RedisService;
	let tokenStorageService: TokenStorageService;
	let originalPolicy: Awaited<
		ReturnType<PrismaService["securityPolicy"]["findUnique"]>
	>;
	let userSequence = 0;
	const createdUserIds: bigint[] = [];
	const createdSessionIds: CreatedSession[] = [];
	const createdResetTokenKeys: string[] = [];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		setNestApp(app);
		await app.init();

		prisma = app.get<PrismaService>(PRISMA_SERVICE_TOKEN);
		redisService = app.get(RedisService);
		tokenStorageService = app.get(TokenStorageService);

		originalPolicy = await prisma.securityPolicy.findUnique({
			where: { key: "default" },
		});
		await upsertPasswordPolicy();
	}, 60000);

	afterAll(async () => {
		for (const session of createdSessionIds) {
			try {
				await tokenStorageService.deleteSession(
					session.userId,
					session.sessionId,
				);
			} catch {
				// 테스트 정리 중 이미 삭제된 세션은 무시
			}
		}

		for (const key of createdResetTokenKeys) {
			await redisService.del(key);
		}

		if (createdUserIds.length > 0) {
			await prisma.authAuditLog.deleteMany({
				where: { user: { id: { in: createdUserIds } } },
			});
			await prisma.user.deleteMany({
				where: { id: { in: createdUserIds } },
			});
		}

		if (originalPolicy) {
			await prisma.securityPolicy.update({
				where: { key: "default" },
				data: {
					passwordMinLength: originalPolicy.passwordMinLength,
					passwordRequireUppercase: originalPolicy.passwordRequireUppercase,
					passwordRequireLowercase: originalPolicy.passwordRequireLowercase,
					passwordRequireNumber: originalPolicy.passwordRequireNumber,
					passwordRequireSpecial: originalPolicy.passwordRequireSpecial,
					passwordExpirationDays: originalPolicy.passwordExpirationDays,
					passwordReuseLimit: originalPolicy.passwordReuseLimit,
				},
			});
		} else {
			await prisma.securityPolicy.deleteMany({
				where: { key: "default" },
			});
		}

		if (app) {
			await app.close();
		}
	}, 30000);

	describe("GET /api/password-policy", () => {
		it("Given 기본 보안 정책 When 비밀번호 정책을 조회하면 Then 가벼운 기본 정책을 반환해야 한다", async () => {
			// When
			const response = await request(app.getHttpServer()).get(
				"/api/password-policy",
			);

			// Then
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				expect.objectContaining({
					minLength: DEFAULT_PASSWORD_MIN_LENGTH,
					maxLength: DEFAULT_PASSWORD_MAX_LENGTH,
					requireUppercase: DEFAULT_PASSWORD_REQUIRE_UPPERCASE,
					requireLowercase: DEFAULT_PASSWORD_REQUIRE_LOWERCASE,
					requireNumber: DEFAULT_PASSWORD_REQUIRE_NUMBER,
					requireSpecial: DEFAULT_PASSWORD_REQUIRE_SPECIAL,
					blockCommonPasswords: true,
					reuseLimit: DEFAULT_PASSWORD_REUSE_LIMIT,
				}),
			);
		});
	});

	describe("POST /api/reset-password/:token", () => {
		it("Given 정책보다 짧은 비밀번호 When 재설정을 실행하면 Then 정책 위반을 반환해야 한다", async () => {
			// Given
			const user = await createTestUser("CurrentPass1!");
			const token = await createResetToken(user);

			// When
			const response = await request(app.getHttpServer())
				.post(`/api/reset-password/${token}`)
				.send({
					password: "short1!",
					confirmPassword: "short1!",
				});

			// Then
			expect(response.status).toBe(400);
			expect(response.body.error).toContain("PASSWORD_POLICY_VIOLATION");
			expect(response.body.error).toContain(
				`${DEFAULT_PASSWORD_MIN_LENGTH}자 이상`,
			);
		});

		it("Given 흔한 비밀번호 When 재설정을 실행하면 Then common password 차단 오류를 반환해야 한다", async () => {
			// Given
			const user = await createTestUser("CurrentPass1!");
			const token = await createResetToken(user);

			// When
			const response = await request(app.getHttpServer())
				.post(`/api/reset-password/${token}`)
				.send({
					password: "Password123!",
					confirmPassword: "Password123!",
				});

			// Then
			expect(response.status).toBe(400);
			expect(response.body.error).toContain("PASSWORD_POLICY_VIOLATION");
			expect(response.body.error).toContain("흔한 비밀번호 사용 금지");
		});

		it("Given confirmPassword가 다를 때 When 재설정을 실행하면 Then 불일치 오류를 반환해야 한다", async () => {
			// Given
			const user = await createTestUser("CurrentPass1!");
			const token = await createResetToken(user);

			// When
			const response = await request(app.getHttpServer())
				.post(`/api/reset-password/${token}`)
				.send({
					password: "validpolicy1!",
					confirmPassword: "differentpolicy1!",
				});

			// Then
			expect(response.status).toBe(400);
			expect(response.body.error).toBe("PASSWORD_MISMATCH");
		});

		it("Given 최근 비밀번호 When 재설정을 실행하면 Then 재사용 오류를 반환해야 한다", async () => {
			// Given
			const reusedPassword = "oldpolicy1!";
			const user = await createTestUser("CurrentPass1!");
			await createPasswordHistory(user.id, reusedPassword);
			const token = await createResetToken(user);

			// When
			const response = await request(app.getHttpServer())
				.post(`/api/reset-password/${token}`)
				.send({
					password: reusedPassword,
					confirmPassword: reusedPassword,
				});

			// Then
			expect(response.status).toBe(400);
			expect(response.body.error).toBe("PASSWORD_REUSE");
		});

		it("Given 정책을 만족하는 새 비밀번호 When 재설정을 실행하면 Then 새 비밀번호로 로그인할 수 있어야 한다", async () => {
			// Given
			const user = await createTestUser("CurrentPass1!");
			const token = await createResetToken(user);
			const newPassword = "freshpolicy1!";

			// When
			const resetResponse = await request(app.getHttpServer())
				.post(`/api/reset-password/${token}`)
				.send({
					password: newPassword,
					confirmPassword: newPassword,
				});

			// Then
			expect(resetResponse.status).toBe(200);
			expect(resetResponse.body).toEqual(
				expect.objectContaining({
					message: expect.any(String),
				}),
			);

			const loginResponse = await request(app.getHttpServer())
				.post("/api/v1/auth/login")
				.set("User-Agent", "core-api-password-policy-e2e")
				.send({
					email: user.email,
					password: newPassword,
				});

			expect(loginResponse.status).toBe(200);
			expect(loginResponse.body.data).toEqual(
				expect.objectContaining({
					accessToken: expect.any(String),
					refreshToken: expect.any(String),
					sessionId: expect.any(String),
					user: expect.objectContaining({
						id: user.id.toString(),
						email: user.email,
					}),
				}),
			);

			createdSessionIds.push({
				userId: user.userId,
				sessionId: loginResponse.body.data.sessionId,
			});
		});
	});

	async function upsertPasswordPolicy(): Promise<void> {
		await prisma.securityPolicy.upsert({
			where: { key: "default" },
			update: {
				passwordMinLength: DEFAULT_PASSWORD_MIN_LENGTH,
				passwordRequireUppercase: DEFAULT_PASSWORD_REQUIRE_UPPERCASE,
				passwordRequireLowercase: DEFAULT_PASSWORD_REQUIRE_LOWERCASE,
				passwordRequireNumber: DEFAULT_PASSWORD_REQUIRE_NUMBER,
				passwordRequireSpecial: DEFAULT_PASSWORD_REQUIRE_SPECIAL,
				passwordExpirationDays: 0,
				passwordReuseLimit: DEFAULT_PASSWORD_REUSE_LIMIT,
			},
			create: {
				key: "default",
				passwordMinLength: DEFAULT_PASSWORD_MIN_LENGTH,
				passwordRequireUppercase: DEFAULT_PASSWORD_REQUIRE_UPPERCASE,
				passwordRequireLowercase: DEFAULT_PASSWORD_REQUIRE_LOWERCASE,
				passwordRequireNumber: DEFAULT_PASSWORD_REQUIRE_NUMBER,
				passwordRequireSpecial: DEFAULT_PASSWORD_REQUIRE_SPECIAL,
				passwordExpirationDays: 0,
				passwordReuseLimit: DEFAULT_PASSWORD_REUSE_LIMIT,
				temporaryLockThreshold: 5,
				temporaryLockDurationMin: 15,
				permanentLockThreshold: 10,
				accessTokenTtlSec: 3600,
				refreshTokenTtlSec: 2592000,
				sessionTtlSec: 86400,
				ipWhitelistEnabled: false,
				emailDomainWhitelistEnabled: false,
				corsOriginWhitelistEnabled: false,
			},
		});
	}

	async function createTestUser(password: string): Promise<TestUser> {
		userSequence += 1;
		const suffix = `${Date.now()}-${userSequence}`;
		const plainPassword = PlainPassword.create(password);
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);
		const user = await prisma.user.create({
			data: {
				email: `password-policy-e2e-${suffix}@example.com`,
				name: `password-policy-e2e-${suffix}`,
				phone: `010-password-policy-${suffix}`,
				password: hashedPassword.value,
				passwordChangedAt: new Date(),
				isActive: true,
				mustChangePassword: false,
			},
			select: {
				id: true,
				userId: true,
				email: true,
			},
		});
		createdUserIds.push(user.id);
		return user;
	}

	async function createPasswordHistory(
		userId: bigint,
		password: string,
	): Promise<void> {
		const plainPassword = PlainPassword.create(password);
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);
		await prisma.passwordHistory.create({
			data: {
				user: { connect: { id: userId } },
				passwordHash: hashedPassword.value,
			},
		});
	}

	async function createResetToken(user: TestUser): Promise<string> {
		const token = PasswordResetToken.generate();
		const key = `${RESET_TOKEN_PREFIX}${token.toHash()}`;
		await redisService.set(
			key,
			JSON.stringify({ userId: user.id.toString(), email: user.email }),
			RESET_TOKEN_TTL_SECONDS,
		);
		createdResetTokenKeys.push(key);
		return token.value;
	}
});
