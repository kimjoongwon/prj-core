import { PolicyAggregate } from "../src/policy/policy.aggregate";
import { RoleAssignmentAggregate } from "../src/policy/role-assignment.aggregate";

describe("권한 관계 Aggregate", () => {
	it("다른 Space의 Policy를 Role에 할당하지 못하게 해야 한다", async () => {
		const policiesRepository = {
			findActivePolicyIdsInSpace: jest.fn().mockResolvedValue(["policy-a"]),
		};
		const roleAssignmentsRepository = {
			syncByRoleId: jest.fn(),
		};
		const rolesRepository = {
			findById: jest.fn().mockResolvedValue({ id: "role-id" }),
		};
		const aggregate = new RoleAssignmentAggregate(
			policiesRepository as never,
			roleAssignmentsRepository as never,
			rolesRepository as never,
			{ spaceId: "space-id" } as never,
		);

		await expect(
			(
				aggregate as unknown as {
					assertPoliciesBelongToSpace(
						policyIds: string[],
						spaceId: string,
					): Promise<void>;
				}
			).assertPoliciesBelongToSpace(
				["policy-a", "other-space-policy"],
				"space-id",
			),
		).rejects.toThrow(
			"현재 Tenant의 정책만 할당할 수 있습니다: other-space-policy",
		);
		expect(roleAssignmentsRepository.syncByRoleId).not.toHaveBeenCalled();
	});

	it("존재하지 않는 Ability를 Policy Entry로 추가하지 못하게 해야 한다", async () => {
		const policiesRepository = {
			findByIdInSpace: jest.fn().mockResolvedValue({
				id: "policy-id",
				spaceId: "space-id",
			}),
		};
		const policyEntriesRepository = {
			syncByPolicyId: jest.fn(),
		};
		const abilitiesRepository = {
			findByIds: jest.fn().mockResolvedValue([{ id: "ability-a" }]),
		};
		const aggregate = new PolicyAggregate(
			policiesRepository as never,
			policyEntriesRepository as never,
			abilitiesRepository as never,
			{} as never,
			{ spaceId: "space-id" } as never,
			{ user: { id: "user-id" } } as never,
		);

		await expect(
			(
				aggregate as unknown as {
					assertAbilitiesExist(abilityIds: string[]): Promise<void>;
				}
			).assertAbilitiesExist(["ability-a", "missing-ability"]),
		).rejects.toThrow(
			"존재하지 않는 권한이 포함되어 있습니다: missing-ability",
		);
		expect(policyEntriesRepository.syncByPolicyId).not.toHaveBeenCalled();
	});
});
