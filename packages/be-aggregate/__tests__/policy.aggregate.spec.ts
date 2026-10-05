import { AuthContext, SpaceContext } from "@cocrepo/context";
import type { Policy } from "@cocrepo/entity";
import {
	AbilitiesRepository,
	PoliciesRepository,
	PolicyEntriesRepository,
	RoleAssignmentsRepository,
} from "@cocrepo/repository";
import { Test, type TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

jest.mock("@nestjs-cls/transactional", () => ({
	Transactional:
		() =>
		(
			_target: object,
			_propertyKey: string | symbol,
			descriptor: PropertyDescriptor,
		) =>
			descriptor,
}));

import { PolicyAggregate } from "../src/policy/policy.aggregate";

describe("PolicyAggregate", () => {
	let service: PolicyAggregate;
	let policiesRepository: DeepMockProxy<PoliciesRepository>;
	let policyEntriesRepository: DeepMockProxy<PolicyEntriesRepository>;
	let abilitiesRepository: DeepMockProxy<AbilitiesRepository>;
	let roleAssignmentsRepository: DeepMockProxy<RoleAssignmentsRepository>;

	beforeEach(async () => {
		policiesRepository = mockDeep<PoliciesRepository>();
		policyEntriesRepository = mockDeep<PolicyEntriesRepository>();
		abilitiesRepository = mockDeep<AbilitiesRepository>();
		roleAssignmentsRepository = mockDeep<RoleAssignmentsRepository>();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PolicyAggregate,
				{ provide: PoliciesRepository, useValue: policiesRepository },
				{
					provide: PolicyEntriesRepository,
					useValue: policyEntriesRepository,
				},
				{ provide: AbilitiesRepository, useValue: abilitiesRepository },
				{
					provide: RoleAssignmentsRepository,
					useValue: roleAssignmentsRepository,
				},
				{ provide: SpaceContext, useValue: { spaceId: 11n } },
				{ provide: AuthContext, useValue: { user: { id: 22n } } },
			],
		}).compile();

		service = module.get<PolicyAggregate>(PolicyAggregate);
	});

	afterEach(() => {
		mockReset(policiesRepository);
		mockReset(policyEntriesRepository);
		mockReset(abilitiesRepository);
		mockReset(roleAssignmentsRepository);
	});

	describe("createPolicy", () => {
		it("정책을 생성해야 한다", async () => {
			// Given
			const input = {
				name: "custom-policy",
				displayName: "커스텀 정책",
				description: "설명",
			};
			policiesRepository.findByNameInSpace.mockResolvedValue(null);
			policiesRepository.create.mockResolvedValue({
				id: 1n,
				spaceId: 11n,
				name: input.name,
			} as unknown as Policy);

			// When
			await service.createPolicy(input);

			// Then
			expect(policiesRepository.create).toHaveBeenCalledWith({
				spaceId: 11n,
				createdById: 22n,
				name: input.name,
				displayName: input.displayName,
				description: input.description,
			});
		});
	});

	describe("updatePolicy", () => {
		it("정책을 업데이트해야 한다", async () => {
			// Given
			const policyId = 1n;
			const input = {
				displayName: "수정된 정책",
				description: "수정된 설명",
			};
			policiesRepository.findByIdInSpace.mockResolvedValue({
				id: policyId,
				spaceId: 11n,
				name: "custom-policy",
			} as unknown as Policy);
			policiesRepository.updateById.mockResolvedValue({
				id: policyId,
				spaceId: 11n,
				name: "custom-policy",
				displayName: input.displayName,
				description: input.description,
			} as unknown as Policy);

			// When
			await service.updatePolicy(policyId, input);

			// Then
			expect(policiesRepository.updateById).toHaveBeenCalledWith(policyId, {
				displayName: input.displayName,
				description: input.description,
			});
		});
	});

	describe("deletePolicy", () => {
		it("정책을 삭제해야 한다", async () => {
			// Given
			const policyId = 1n;
			policiesRepository.findByIdInSpace.mockResolvedValue({
				id: policyId,
				spaceId: 11n,
				name: "system-policy",
			} as unknown as Policy);
			policiesRepository.removeById.mockResolvedValue({
				id: policyId,
				spaceId: 11n,
				name: "system-policy",
			} as unknown as Policy);

			// When
			await service.deletePolicy(policyId);

			// Then
			expect(roleAssignmentsRepository.removeByPolicyId).toHaveBeenCalledWith(
				policyId,
			);
			expect(policiesRepository.removeById).toHaveBeenCalledWith(policyId);
		});
	});
});
