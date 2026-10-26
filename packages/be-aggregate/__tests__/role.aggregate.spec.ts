import { SYSTEM_ROLES } from "@cocrepo/constant";
import type { Role } from "@cocrepo/entity";
import { RolesRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	NotFoundException,
} from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { RoleAggregate } from "../src/role/role.aggregate";

describe("RoleAggregate", () => {
	let service: RoleAggregate;
	let mockRepository: DeepMockProxy<RolesRepository>;

	const mockRole = {
		id: 101n,
		name: SYSTEM_ROLES.MEMBER,
		description: "회원 기본 역할",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	};

	beforeEach(async () => {
		mockRepository = mockDeep<RolesRepository>();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RoleAggregate,
				{ provide: RolesRepository, useValue: mockRepository },
			],
		}).compile();

		service = module.get<RoleAggregate>(RoleAggregate);
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
			const roleId = 101n;
			mockRepository.findById.mockResolvedValue(mockRole as unknown as Role);

			// When
			const result = await service.getById(roleId);

			// Then
			expect(mockRepository.findById).toHaveBeenCalledWith(roleId);
			expect(result).toEqual(mockRole);
		});

		it("역할이 없으면 null을 반환해야 한다", async () => {
			// Given
			const roleId = 999n;
			mockRepository.findById.mockResolvedValue(null);

			// When
			const result = await service.getById(roleId);

			// Then
			expect(result).toBeNull();
		});
	});

	describe("getDefaultUserRole", () => {
		it("기본 MEMBER 역할을 조회해야 한다", async () => {
			// Given
			mockRepository.findByName.mockResolvedValue(mockRole as unknown as Role);

			// When
			const result = await service.getDefaultUserRole();

			// Then
			expect(mockRepository.findByName).toHaveBeenCalledWith(
				SYSTEM_ROLES.MEMBER,
			);
			expect(result).toEqual(mockRole);
			expect(result?.name).toBe(SYSTEM_ROLES.MEMBER);
		});

		it("MEMBER 역할이 없으면 null을 반환해야 한다", async () => {
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
				{ ...mockRole, id: "role-2", name: SYSTEM_ROLES.COMPANY_MANAGER },
			];
			mockRepository.findAll.mockResolvedValue(mockRoles as unknown as Role[]);

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

	describe("create", () => {
		it("역할을 생성해야 한다", async () => {
			// Given
			const input = {
				name: "CUSTOM_ROLE",
				displayName: "커스텀 역할",
				description: "사용자 정의 역할",
			};
			mockRepository.findByName.mockResolvedValue(null);
			mockRepository.create.mockResolvedValue({
				id: 201n,
				name: input.name,
				displayName: input.displayName,
				description: input.description,
			} as unknown as Role);

			// When
			await service.create(input as never);

			// Then
			expect(mockRepository.create).toHaveBeenCalledWith({
				name: input.name,
				displayName: input.displayName,
				description: input.description,
			});
		});
	});

	describe("update", () => {
		it("역할을 업데이트해야 한다", async () => {
			// Given
			const roleId = 101n;
			const role = { ...mockRole };
			const input = {
				displayName: "수정된 역할",
				description: "수정된 설명",
			};
			mockRepository.findById.mockResolvedValue(role as unknown as Role);
			mockRepository.updateById.mockResolvedValue({
				...role,
				...input,
			} as unknown as Role);

			// When
			await service.update(roleId, input as never);

			// Then
			expect(mockRepository.updateById).toHaveBeenCalledWith(roleId, input);
		});

		it("존재하지 않는 역할이면 예외를 던져야 한다", async () => {
			// Given
			mockRepository.findById.mockResolvedValue(null);

			// When / Then
			await expect(
				service.update(
					999n,
					{ displayName: "없음", description: "없음" } as never,
				),
			).rejects.toBeInstanceOf(NotFoundException);
		});
	});

	describe("delete", () => {
		it("역할을 삭제해야 한다", async () => {
			// Given
			const roleId = 101n;
			const role = { ...mockRole };
			mockRepository.findById.mockResolvedValue(role as unknown as Role);
			mockRepository.countTenantsByRoleId.mockResolvedValue(0);
			mockRepository.deleteById.mockResolvedValue(role as unknown as Role);

			// When
			await service.delete(roleId);

			// Then
			expect(mockRepository.countTenantsByRoleId).toHaveBeenCalledWith(roleId);
			expect(mockRepository.deleteById).toHaveBeenCalledWith(roleId);
		});

		it("연결된 사용자가 있으면 삭제를 막아야 한다", async () => {
			// Given
			const roleId = 101n;
			mockRepository.findById.mockResolvedValue(mockRole as unknown as Role);
			mockRepository.countTenantsByRoleId.mockResolvedValue(2);

			// When / Then
			await expect(service.delete(roleId)).rejects.toBeInstanceOf(
				BadRequestException,
			);
			expect(mockRepository.deleteById).not.toHaveBeenCalled();
		});
	});
});
