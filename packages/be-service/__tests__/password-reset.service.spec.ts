import {
	OidcDirectPrismaProvider,
	OidcDirectUsersRepository,
} from "@cocrepo/repository";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "../src/email/email.service";
import { TOKEN_TTL_SECONDS } from "../src/idp/password-reset.constants";
import { PasswordResetService } from "../src/idp/password-reset.service";
import { RedisService } from "../src/redis/redis.service";

describe("PasswordResetService", () => {
	let service: PasswordResetService;
	let redisService: jest.Mocked<RedisService>;
	let directUserRepository: {
		findByEmailForAuth: jest.Mock;
	};
	let emailService: {
		sendPasswordResetEmail: jest.Mock;
	};
	let configService: {
		getOrThrow: jest.Mock;
	};

	const createService = (interactionBaseUrl: string) => {
		configService = {
			getOrThrow: jest.fn(() => ({ interactionBaseUrl })),
		};

		return new PasswordResetService(
			directUserRepository as unknown as OidcDirectUsersRepository,
			{
				getClient: jest.fn(),
			} as unknown as OidcDirectPrismaProvider,
			emailService as unknown as EmailService,
			redisService,
			configService as unknown as ConfigService,
		);
	};

	beforeEach(() => {
		redisService = {
			set: jest.fn(),
			get: jest.fn(),
			del: jest.fn(),
		} as unknown as jest.Mocked<RedisService>;
		directUserRepository = {
			findByEmailForAuth: jest.fn(),
		};
		emailService = {
			sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
		};
		service = createService("http://localhost:3008");
	});

	it("reset token payload는 bigint userId를 문자열로 저장해야 한다", async () => {
		await (
			service as never as {
				saveResetToken: (
					hashedToken: string,
					data: { userId: bigint; email: string },
				) => Promise<void>;
			}
		).saveResetToken("hashed-token", {
			userId: 101n,
			email: "tester@example.com",
		});

		expect(redisService.set).toHaveBeenCalledWith(
			"password-reset:hashed-token",
			JSON.stringify({
				userId: "101",
				email: "tester@example.com",
			}),
			TOKEN_TTL_SECONDS,
		);
	});

	it("저장된 reset token payload를 읽을 때 문자열 userId를 bigint로 복원해야 한다", async () => {
		redisService.get.mockResolvedValue(
			JSON.stringify({
				userId: "101",
				email: "tester@example.com",
			}),
		);

		const result = await (
			service as never as {
				getResetToken: (
					hashedToken: string,
				) => Promise<{ userId: bigint; email: string } | null>;
			}
		).getResetToken("hashed-token");

		expect(result).toEqual({
			userId: 101n,
			email: "tester@example.com",
		});
	});

	it("기본 IDP interaction URL로 비밀번호 재설정 이메일 링크를 만든다", async () => {
		directUserRepository.findByEmailForAuth.mockResolvedValue({
			id: 1n,
			userId: "user-1",
			email: "user@example.com",
			password: "hashed-password",
			failedLoginAttempts: 0,
			lockedUntil: null,
			isPermanentlyLocked: false,
			isActive: true,
		});

		await service.requestReset("user@example.com");

		expect(directUserRepository.findByEmailForAuth).toHaveBeenCalledWith(
			"user@example.com",
		);
		expect(redisService.set).toHaveBeenCalledWith(
			expect.stringMatching(/^password-reset:/),
			expect.stringContaining('"email":"user@example.com"'),
			TOKEN_TTL_SECONDS,
		);
		expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
			"user@example.com",
			expect.stringMatching(
				/^http:\/\/localhost:3008\/auth\/reset-password\/[a-f0-9]{64}$/,
			),
		);
	});

	it("등록된 OIDC interaction URL로 비밀번호 재설정 이메일 링크를 만든다", async () => {
		service = createService("https://id.example.com");
		directUserRepository.findByEmailForAuth.mockResolvedValue({
			id: 1n,
			userId: "user-1",
			email: "user@example.com",
			password: "hashed-password",
			failedLoginAttempts: 0,
			lockedUntil: null,
			isPermanentlyLocked: false,
			isActive: true,
		});

		await service.requestReset("user@example.com");

		expect(configService.getOrThrow).toHaveBeenCalledWith("oidc");
		expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
			"user@example.com",
			expect.stringMatching(
				/^https:\/\/id\.example\.com\/auth\/reset-password\/[a-f0-9]{64}$/,
			),
		);
	});
});
