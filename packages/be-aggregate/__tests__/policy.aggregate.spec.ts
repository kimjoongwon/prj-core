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
				{ provide: SpaceContext, useValue: { spaceId: "01JSPACE0000000000000000P1" } },
				{ provide: AuthContext, useValue: { user: { id: "01JUSER0000000000000000P2" } } },
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
				spaceId: "01JSPACE0000000000000000P1",
				name: input.name,
			} as unknown as Policy);

			// When
			await service.createPolicy(input);

			// Then
			expect(policiesRepository.create).toHaveBeenCalledWith({
				spaceId: "01JSPACE0000000000000000P1",
				createdById: "01JUSER0000000000000000P2",
				name: input.name,
				displayName: input.displayName,
				description: input.description,
			});
		});
	});

	describe("updatePolicy", () => {
		it("정책을 업데이트해야 한다", async () => {
			// Given
			const policySeq = "01JAAAAAAAAAAAAAAAAAAAAAAAA";
			const input = {
				displayName: "수정된 정책",
				description: "수정된 설명",
			};
			policiesRepository.findByIdInSpace.mockResolvedValue({
				id: policySeq,
				spaceId: "01JSPACE0000000000000000P1",
				name: "custom-policy",
			} as unknown as Policy);
			policiesRepository.updateById.mockResolvedValue({
				id: policySeq,
				spaceId: "01JSPACE0000000000000000P1",
				name: "custom-policy",
				displayName: input.displayName,
				description: input.description,
			} as unknown as Policy);

			// When
			await service.updatePolicy(policySeq, input);

			// Then
			expect(policiesRepository.updateById).toHaveBeenCalledWith(policySeq, {
				displayName: input.displayName,
				description: input.description,
			});
		});
	});

	describe("deletePolicy", () => {
		it("정책을 삭제해야 한다", async () => {
			// Given
			const policySeq = "01JAAAAAAAAAAAAAAAAAAAAAAAA";
			policiesRepository.findByIdInSpace.mockResolvedValue({
				id: policySeq,
				spaceId: "01JSPACE0000000000000000P1",
				name: "system-policy",
			} as unknown as Policy);
			policiesRepository.removeById.mockResolvedValue({
				id: policySeq,
				spaceId: "01JSPACE0000000000000000P1",
				name: "system-policy",
			} as unknown as Policy);

			// When
			await service.deletePolicy(policySeq);

			// Then
			expect(roleAssignmentsRepository.removeByPolicyId).toHaveBeenCalledWith(
				policySeq,
			);
			expect(policiesRepository.removeById).toHaveBeenCalledWith(policySeq);
		});
	});
});
