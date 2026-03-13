import type { Ability } from "@cocrepo/entity";
import { AbilityService } from "@cocrepo/service";
import { Test, type TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { AbilityApplicationService } from "../src/ability.application-service";

describe("AbilityApplicationService", () => {
	let applicationService: AbilityApplicationService;
	let mockAbilitiesService: DeepMockProxy<AbilityService>;

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

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AbilityApplicationService,
				{ provide: AbilityService, useValue: mockAbilitiesService },
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

	describe("getRoleAbilities", () => {
		it("Role ID로 권한 목록을 조회해야 한다", async () => {
			// Given
			const roleId = "role-test-id";
			const mockAbilities = [mockAbility];
			mockAbilitiesService.getRoleAbilities.mockResolvedValue(
				mockAbilities,
			);

			// When
			const result = await applicationService.getRoleAbilities(roleId);

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
			const result = await applicationService.getRoleAbilities(roleId);

			// Then
			expect(result).toEqual([]);
		});
	});
});
