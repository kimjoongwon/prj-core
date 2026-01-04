import { Roles } from "@cocrepo/prisma";
import { RolesRepository } from "@cocrepo/repository";
import { Test, type TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { RolesService } from "../src/roles.service";

describe("RolesService", () => {
	let service: RolesService;
	let mockRepository: DeepMockProxy<RolesRepository>;

	const mockRole = {
		id: "role-test-id",
		name: Roles.USER,
		description: "일반 사용자",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	};

	beforeEach(async () => {
		mockRepository = mockDeep<RolesRepository>();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RolesService,
				{ provide: RolesRepository, useValue: mockRepository },
			],
		}).compile();

		service = module.get<RolesService>(RolesService);
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
		it("기본 USER 역할을 조회해야 한다", async () => {
			// Given
			mockRepository.findByName.mockResolvedValue(mockRole as any);

			// When
			const result = await service.getDefaultUserRole();

			// Then
			expect(mockRepository.findByName).toHaveBeenCalledWith(Roles.USER);
			expect(result).toEqual(mockRole);
			expect(result?.name).toBe(Roles.USER);
		});

		it("USER 역할이 없으면 null을 반환해야 한다", async () => {
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
				{ ...mockRole, id: "role-2", name: Roles.ADMIN },
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
