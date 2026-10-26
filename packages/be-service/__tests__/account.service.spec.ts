import { UsersRepository } from "@cocrepo/repository";
import { Test, type TestingModule } from "@nestjs/testing";
import { AccountService } from "../src/oidc/account.service";
import { RedisService } from "../src/redis/redis.service";

describe("AccountService", () => {
	let service: AccountService;
	let usersRepository: jest.Mocked<UsersRepository>;
	let redisService: jest.Mocked<RedisService>;

	beforeEach(async () => {
		usersRepository = {
			findByUserIdWithTenantsAndProfiles: jest.fn(),
		} as unknown as jest.Mocked<UsersRepository>;
		redisService = {
			get: jest.fn(),
			set: jest.fn(),
		} as unknown as jest.Mocked<RedisService>;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AccountService,
				{
					provide: UsersRepository,
					useValue: usersRepository,
				},
				{
					provide: RedisService,
					useValue: redisService,
				},
			],
		}).compile();

		service = module.get(AccountService);
	});

	it("roles scope claims에 fitnessCenterName을 포함한다", async () => {
		usersRepository.findByUserIdWithTenantsAndProfiles.mockResolvedValue({
			id: 1n,
			userId: "user-1",
			name: "Tester",
			email: "tester@example.com",
			phone: "010-1234-5678",
			createdAt: new Date("2026-01-01T00:00:00.000Z"),
			updatedAt: new Date("2026-01-02T00:00:00.000Z"),
			tenants: [
				{
					spaceId: 11n,
					roleId: 12n,
					role: {
						roleId: "01J00000000000000000000012",
						name: "MEMBER",
						displayName: "회원",
					},
					space: {
						spaceId: "01J00000000000000000000011",
						fitnessCenter: {
							name: "System Fitness Center",
						},
					},
				},
			],
		} as unknown as Awaited<
			ReturnType<UsersRepository["findByUserIdWithTenantsAndProfiles"]>
		>);

		const account = await service.findAccount({}, "user-1");
		const claims = await account?.claims("id_token", "openid roles", {}, []);

		expect(claims).toEqual({
			sub: "user-1",
			roles: [
				{
					spaceId: "01J00000000000000000000011",
					roleId: "01J00000000000000000000012",
					roleName: "MEMBER",
					roleDisplayName: "회원",
				},
			],
			spaces: [
				{
					spaceId: "01J00000000000000000000011",
					fitnessCenterName: "System Fitness Center",
				},
			],
		});
		expect(redisService.set).toHaveBeenCalledWith(
			"oidc:account:user-1",
			expect.any(String),
			300,
		);
	});
});
