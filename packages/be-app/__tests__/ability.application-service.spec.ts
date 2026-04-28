import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { Ability } from "@cocrepo/entity";
import { UnauthorizedException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { ClsService } from "nestjs-cls";
import { AbilityService } from "@cocrepo/service";
import { AbilityApplicationService } from "../src/ability.application-service";

describe("AbilityApplicationService", () => {
	let applicationService: AbilityApplicationService;
	let mockAbilitiesService: DeepMockProxy<AbilityService>;
	let mockClsService: { get: jest.Mock };

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
		mockAbilitiesService = mockDeep<AbilityService>();
		mockClsService = {
			get: jest.fn((key: string) => {
				if (key === CONTEXT_KEYS.AUTH_USER) {
					return {
						id: "user-test-id",
						tenants: [
							{
								id: "tenant-1",
								spaceId: "space-1",
								roleId: "role-1",
							},
							{
								id: "tenant-2",
								spaceId: "space-1",
								roleId: "role-2",
							},
							{
								id: "tenant-3",
								spaceId: "space-2",
								roleId: "role-3",
							},
						],
					};
				}
				if (key === CONTEXT_KEYS.SPACE_ID) {
					return "space-1";
				}
				return undefined;
			}),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AbilityApplicationService,
				{ provide: AbilityService, useValue: mockAbilitiesService },
				{
					provide: ClsService,
					useValue: mockClsService as unknown as ClsService,
				},
			],
		}).compile();

		applicationService = module.get<AbilityApplicationService>(
			AbilityApplicationService,
		);
	});

	afterEach(() => {
		mockReset(mockAbilitiesService);
	});

	it("애플리케이션 서비스가 정의되어야 한다", () => {
		expect(applicationService).toBeDefined();
	});

	describe("getMyAbilities", () => {
		it("현재 Space 기준으로 Role/User 권한을 병합 조회해야 한다", async () => {
			const mockAbilities = [mockAbility];
			mockAbilitiesService.getMergedAbilities.mockResolvedValue(mockAbilities);

			const result = await applicationService.getMyAbilities();

			expect(mockAbilitiesService.getMergedAbilities).toHaveBeenCalledWith(
				["role-1", "role-2"],
				"user-test-id",
				"space-1",
			);
			expect(result).toEqual(mockAbilities);
		});

		it("같은 Space의 중복 roleId는 제거해야 한다", async () => {
			mockClsService.get.mockImplementation((key: string) => {
				if (key === CONTEXT_KEYS.AUTH_USER) {
					return {
						id: "user-test-id",
						tenants: [
							{ id: "tenant-1", spaceId: "space-1", roleId: "role-1" },
							{ id: "tenant-2", spaceId: "space-1", roleId: "role-1" },
						],
					};
				}
				if (key === CONTEXT_KEYS.SPACE_ID) {
					return "space-1";
				}
				return undefined;
			});

			mockAbilitiesService.getMergedAbilities.mockResolvedValue([mockAbility]);

			await applicationService.getMyAbilities();

			expect(mockAbilitiesService.getMergedAbilities).toHaveBeenCalledWith(
				["role-1"],
				"user-test-id",
				"space-1",
			);
		});

		it("사용자 정보가 없으면 UnauthorizedException을 던져야 한다", async () => {
			mockClsService.get.mockImplementation((key: string) =>
				key === CONTEXT_KEYS.SPACE_ID ? "space-1" : undefined,
			);

			await expect(applicationService.getMyAbilities()).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it("선택된 Space가 없으면 UnauthorizedException을 던져야 한다", async () => {
			mockClsService.get.mockImplementation((key: string) =>
				key === CONTEXT_KEYS.AUTH_USER
					? {
							id: "user-test-id",
							tenants: [
								{ id: "tenant-1", spaceId: "space-1", roleId: "role-1" },
							],
						}
					: undefined,
			);

			await expect(applicationService.getMyAbilities()).rejects.toThrow(
				UnauthorizedException,
			);
		});
	});

	describe("getAllAbilities", () => {
		it("전체 권한 목록을 조회해야 한다", async () => {
			const mockAbilities = [mockAbility];
			mockAbilitiesService.getAllAbilities.mockResolvedValue(mockAbilities);

			const result = await applicationService.getAllAbilities();

			expect(mockAbilitiesService.getAllAbilities).toHaveBeenCalledWith();
			expect(result).toEqual(mockAbilities);
		});

		it("권한이 없으면 빈 배열을 반환해야 한다", async () => {
			mockAbilitiesService.getAllAbilities.mockResolvedValue([]);

			const result = await applicationService.getAllAbilities();

			expect(result).toEqual([]);
		});
	});
});
