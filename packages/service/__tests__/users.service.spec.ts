import { UsersRepository } from "@cocrepo/repository";
import { Test, TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { UsersService } from "../src/service/users.service";

describe("UsersService", () => {
	let service: UsersService;
	let mockRepository: DeepMockProxy<UsersRepository>;

	const mockUser = {
		id: "user-test-id",
		email: "test@example.com",
		name: "Test User",
		phone: "010-1234-5678",
		password: "$2b$10$hashedPassword",
		spaceId: "space-test-id",
		tenants: [
			{
				id: "tenant-test-id",
				main: true,
				spaceId: "space-test-id",
				roleId: "role-test-id",
				space: { id: "space-test-id", name: "Test Space" },
				role: {
					id: "role-test-id",
					name: "Admin",
					classification: {
						category: { parent: { parent: { parent: null } } },
					},
				},
			},
		],
		profiles: [{ name: "Test User", nickname: "testuser" }],
	};

	beforeEach(async () => {
		mockRepository = mockDeep<UsersRepository>();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: UsersRepository,
					useValue: mockRepository,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	afterEach(() => {
		mockReset(mockRepository);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(service).toBeDefined();
	});

	describe("getByIdWithTenants", () => {
		it("ID로 사용자를 조회해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			mockRepository.findByIdWithTenantsAndProfiles.mockResolvedValue(
				mockUser as any,
			);

			// When
			const result = await service.getByIdWithTenants(userId);

			// Then
			expect(
				mockRepository.findByIdWithTenantsAndProfiles,
			).toHaveBeenCalledWith(userId);
			expect(result).toEqual(mockUser);
		});

		it("사용자가 없으면 null을 반환해야 한다", async () => {
			// Given
			const userId = "non-existent-user";
			mockRepository.findByIdWithTenantsAndProfiles.mockResolvedValue(null);

			// When
			const result = await service.getByIdWithTenants(userId);

			// Then
			expect(
				mockRepository.findByIdWithTenantsAndProfiles,
			).toHaveBeenCalledWith(userId);
			expect(result).toBeNull();
		});
	});

	describe("findUserForAuth", () => {
		it("이메일로 인증용 사용자를 조회해야 한다", async () => {
			// Given
			const email = "test@example.com";
			mockRepository.findByEmailWithTenantsAndProfiles.mockResolvedValue(
				mockUser as any,
			);

			// When
			const result = await service.findUserForAuth(email);

			// Then
			expect(
				mockRepository.findByEmailWithTenantsAndProfiles,
			).toHaveBeenCalledWith(email);
			expect(result).toEqual(mockUser);
		});

		it("이메일로 사용자를 찾지 못하면 null을 반환해야 한다", async () => {
			// Given
			const email = "nonexistent@example.com";
			mockRepository.findByEmailWithTenantsAndProfiles.mockResolvedValue(null);

			// When
			const result = await service.findUserForAuth(email);

			// Then
			expect(
				mockRepository.findByEmailWithTenantsAndProfiles,
			).toHaveBeenCalledWith(email);
			expect(result).toBeNull();
		});
	});
});
