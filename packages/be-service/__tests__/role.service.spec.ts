import { SYSTEM_ROLES } from "@cocrepo/constant";
import { RolesRepository } from "@cocrepo/repository";
import { Test, type TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { RoleService } from "../src/role.service";

describe("RoleService", () => {
	let service: RoleService;
	let mockRepository: DeepMockProxy<RolesRepository>;

	const mockRole = {
		id: "role-test-id",
		name: SYSTEM_ROLES.VIEW,
		description: "기본 조회 역할",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	};

	beforeEach(async () => {
		mockRepository = mockDeep<RolesRepository>();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RoleService,
				{ provide: RolesRepository, useValue: mockRepository },
			],
		}).compile();

		service = module.get<RoleService>(RoleService);
	});

	afterEach(() => {
		mockReset(mockRepository);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(service).toBeDefined();
	});

	describe("getById", () => {
		it("ID로 역할을 조회해야 한다", async () => {
			// Given
			const roleId = "role-test-id";
			mockRepository.findById.mockResolvedValue(mockRole as any);

			// When
			const result = await service.getById(roleId);

			// Then
			expect(mockRepository.findById).toHaveBeenCalledWith(roleId);
			expect(result).toEqual(mockRole);
		});

		it("역할이 없으면 null을 반환해야 한다", async () => {
			// Given
			const roleId = "non-existent";
			mockRepository.findById.mockResolvedValue(null);

			// When
			const result = await service.getById(roleId);

			// Then
			expect(result).toBeNull();
		});
	});

	describe("getDefaultUserRole", () => {
		it("기본 VIEW 역할을 조회해야 한다", async () => {
			// Given
			mockRepository.findByName.mockResolvedValue(mockRole as any);

			// When
			const result = await service.getDefaultUserRole();

			// Then
			expect(mockRepository.findByName).toHaveBeenCalledWith(SYSTEM_ROLES.VIEW);
			expect(result).toEqual(mockRole);
			expect(result?.name).toBe(SYSTEM_ROLES.VIEW);
		});

		it("VIEW 역할이 없으면 null을 반환해야 한다", async () => {
			// Given
			mockRepository.findByName.mockResolvedValue(null);

			// When
			const result = await service.getDefaultUserRole();

			// Then
			expect(result).toBeNull();
		});
	});

	describe("getAll", () => {
		it("전체 역할 목록을 조회해야 한다", async () => {
			// Given
			const mockRoles = [
				mockRole,
				{ ...mockRole, id: "role-2", name: SYSTEM_ROLES.MANAGE },
			];
			mockRepository.findAll.mockResolvedValue(mockRoles as any);

			// When
			const result = await service.getAll();

			// Then
			expect(mockRepository.findAll).toHaveBeenCalled();
			expect(result).toHaveLength(2);
		});

		it("역할이 없으면 빈 배열을 반환해야 한다", async () => {
			// Given
			mockRepository.findAll.mockResolvedValue([]);

			// When
			const result = await service.getAll();

			// Then
			expect(result).toEqual([]);
		});
	});
});
