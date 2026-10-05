import {
	OidcDirectPrismaProvider,
	OidcDirectUsersRepository,
} from "@cocrepo/repository";
import { ConfigService } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import { EmailService } from "../src/email/email.service";
import { TOKEN_TTL_SECONDS } from "../src/idp/password-reset.constants";
import { PasswordResetService } from "../src/idp/password-reset.service";
import { RedisService } from "../src/redis/redis.service";

describe("PasswordResetService", () => {
	let service: PasswordResetService;
	let redisService: jest.Mocked<RedisService>;

	beforeEach(async () => {
		redisService = {
			set: jest.fn(),
			get: jest.fn(),
			del: jest.fn(),
		} as unknown as jest.Mocked<RedisService>;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PasswordResetService,
				{
					provide: OidcDirectUsersRepository,
					useValue: {},
				},
				{
					provide: OidcDirectPrismaProvider,
					useValue: {},
				},
				{
					provide: EmailService,
					useValue: {},
				},
				{
					provide: RedisService,
					useValue: redisService,
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn().mockReturnValue("http://localhost:3000/admin"),
					},
				},
			],
		}).compile();

		service = module.get<PasswordResetService>(PasswordResetService);
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
});
