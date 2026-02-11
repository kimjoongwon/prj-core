import { Ability } from "@cocrepo/entity";
import { AbilitiesService, UsersService } from "@cocrepo/service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { AbilitiesFacade } from "../src/abilities.facade";

describe("AbilitiesFacade", () => {
	let facade: AbilitiesFacade;
	let mockUsersService: DeepMockProxy<UsersService>;
	let mockAbilitiesService: DeepMockProxy<AbilitiesService>;

	const mockUser = {
		id: "user-test-id",
		email: "test@example.com",
		name: "Test User",
		tenants: [
			{
				id: "tenant-test-id",
				roleId: "role-test-id",
				spaceId: "space-test-id",
			},
		],
	};

	const mockAbility: Ability = {
		id: "ability-test-id",
		type: "CAN",
		action: "READ",
		roleId: "role-test-id",
		subjectId: "subject-test-id",
		description: null,
		conditions: null,
		tenantId: "tenant-test-id",
		isActive: true,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
	} as Ability;

	beforeEach(async () => {
		mockUsersService = mockDeep<UsersService>();
		mockAbilitiesService = mockDeep<AbilitiesService>();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AbilitiesFacade,
				{ provide: UsersService, useValue: mockUsersService },
				{ provide: AbilitiesService, useValue: mockAbilitiesService },
			],
		}).compile();

		facade = module.get<AbilitiesFacade>(AbilitiesFacade);
	});

	afterEach(() => {
		mockReset(mockUsersService);
		mockReset(mockAbilitiesService);
	});

	it("파사드가 정의되어야 한다", () => {
		expect(facade).toBeDefined();
	});

	describe("getMyAbilities", () => {
		it("사용자의 권한 목록을 조회해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			const mockAbilities = [mockAbility];
			mockUsersService.getByIdWithTenants.mockResolvedValue(mockUser as any);
			mockAbilitiesService.getAbilitiesByRoleId.mockResolvedValue(
				mockAbilities,
			);

			// When
			const result = await facade.getMyAbilities(userId);

			// Then
			expect(mockUsersService.getByIdWithTenants).toHaveBeenCalledWith(userId);
			expect(mockAbilitiesService.getAbilitiesByRoleId).toHaveBeenCalledWith(
				mockUser.tenants[0].roleId,
			);
			expect(result).toEqual(mockAbilities);
		});

		it("사용자가 없으면 NotFoundException을 던져야 한다", async () => {
			// Given
			const userId = "non-existent-user";
			mockUsersService.getByIdWithTenants.mockResolvedValue(null);

			// When & Then
			await expect(facade.getMyAbilities(userId)).rejects.toThrow(
				NotFoundException,
			);
			await expect(facade.getMyAbilities(userId)).rejects.toThrow(
				"사용자를 찾을 수 없습니다",
			);
		});

		it("사용자에게 Tenant가 없으면 BadRequestException을 던져야 한다", async () => {
			// Given
			const userId = "user-without-tenant";
			const userWithoutTenant = { ...mockUser, tenants: [] };
			mockUsersService.getByIdWithTenants.mockResolvedValue(
				userWithoutTenant as any,
			);

			// When & Then
			await expect(facade.getMyAbilities(userId)).rejects.toThrow(
				BadRequestException,
			);
			await expect(facade.getMyAbilities(userId)).rejects.toThrow(
				"역할(Role)을 찾을 수 없습니다",
			);
		});

		it("tenants가 undefined이면 BadRequestException을 던져야 한다", async () => {
			// Given
			const userId = "user-test-id";
			const userWithUndefinedTenants = { ...mockUser, tenants: undefined };
			mockUsersService.getByIdWithTenants.mockResolvedValue(
				userWithUndefinedTenants as any,
			);

			// When & Then
			await expect(facade.getMyAbilities(userId)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("getAbilitiesByRoleId", () => {
		it("Role ID로 권한 목록을 조회해야 한다", async () => {
			// Given
			const roleId = "role-test-id";
			const mockAbilities = [mockAbility];
			mockAbilitiesService.getAbilitiesByRoleId.mockResolvedValue(
				mockAbilities,
			);

			// When
			const result = await facade.getAbilitiesByRoleId(roleId);

			// Then
			expect(mockAbilitiesService.getAbilitiesByRoleId).toHaveBeenCalledWith(
				roleId,
			);
			expect(result).toEqual(mockAbilities);
		});

		it("권한이 없으면 빈 배열을 반환해야 한다", async () => {
			// Given
			const roleId = "role-without-abilities";
			mockAbilitiesService.getAbilitiesByRoleId.mockResolvedValue([]);

			// When
			const result = await facade.getAbilitiesByRoleId(roleId);

			// Then
			expect(result).toEqual([]);
		});
	});

	describe("updateRoleAbilities", () => {
		it("Role의 권한을 일괄 업데이트해야 한다", async () => {
			// Given
			const roleId = "role-test-id";
			const tenantId = "tenant-test-id";
			const newAbilities = [
				{
					type: "CAN" as const,
					action: "CREATE" as const,
					roleId,
					subjectId: "subject-1",
					tenantId,
				},
				{
					type: "CAN" as const,
					action: "UPDATE" as const,
					roleId,
					subjectId: "subject-2",
					tenantId,
				},
			];
			const createdAbilities = [
				{ ...mockAbility, action: "CREATE" },
				{ ...mockAbility, action: "UPDATE" },
			];
			mockAbilitiesService.updateRoleAbilities.mockResolvedValue(
				createdAbilities as any,
			);

			// When
			const result = await facade.updateRoleAbilities(
				roleId,
				tenantId,
				newAbilities,
			);

			// Then
			expect(mockAbilitiesService.updateRoleAbilities).toHaveBeenCalledWith(
				roleId,
				tenantId,
				newAbilities,
			);
			expect(result).toHaveLength(2);
		});

		it("빈 권한 배열로 업데이트하면 빈 배열을 반환해야 한다", async () => {
			// Given
			const roleId = "role-test-id";
			const tenantId = "tenant-test-id";
			mockAbilitiesService.updateRoleAbilities.mockResolvedValue([]);

			// When
			const result = await facade.updateRoleAbilities(roleId, tenantId, []);

			// Then
			expect(mockAbilitiesService.updateRoleAbilities).toHaveBeenCalledWith(
				roleId,
				tenantId,
				[],
			);
			expect(result).toEqual([]);
		});
	});
});
