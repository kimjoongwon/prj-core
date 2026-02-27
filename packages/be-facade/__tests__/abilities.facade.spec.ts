import type { Ability } from "@cocrepo/entity";
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
		name: "ability-read-subject",
		fields: [],
		inverted: false,
		reason: null,
		subjectId: "subject-test-id",
		actionId: "action-test-id",
		description: null,
		conditions: null,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
	} as unknown as Ability;

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
			mockAbilitiesService.getMergedAbilities.mockResolvedValue(
				mockAbilities,
			);

			// When
			const result = await facade.getMyAbilities(userId);

			// Then
			expect(mockUsersService.getByIdWithTenants).toHaveBeenCalledWith(userId);
			expect(mockAbilitiesService.getMergedAbilities).toHaveBeenCalledWith(
				[mockUser.tenants[0].roleId],
				userId,
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

	describe("getRoleAbilities", () => {
		it("Role ID로 권한 목록을 조회해야 한다", async () => {
			// Given
			const roleId = "role-test-id";
			const mockAbilities = [mockAbility];
			mockAbilitiesService.getRoleAbilities.mockResolvedValue(
				mockAbilities,
			);

			// When
			const result = await facade.getRoleAbilities(roleId);

			// Then
			expect(mockAbilitiesService.getRoleAbilities).toHaveBeenCalledWith(
				roleId,
			);
			expect(result).toEqual(mockAbilities);
		});

		it("권한이 없으면 빈 배열을 반환해야 한다", async () => {
			// Given
			const roleId = "role-without-abilities";
			mockAbilitiesService.getRoleAbilities.mockResolvedValue([]);

			// When
			const result = await facade.getRoleAbilities(roleId);

			// Then
			expect(result).toEqual([]);
		});
	});
});
