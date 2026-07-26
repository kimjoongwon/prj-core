import { RoleAssignment } from "@cocrepo/entity";
import { Test, type TestingModule } from "@nestjs/testing";
import { TransactionHost } from "@nestjs-cls/transactional";
import { RoleAssignmentsRepository } from "../src/role-assignments.repository";

describe("RoleAssignmentsRepository", () => {
	let repository: RoleAssignmentsRepository;
	const roleAssignment = {
		findMany: jest.fn(),
		updateMany: jest.fn(),
		upsert: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RoleAssignmentsRepository,
				{
					provide: TransactionHost,
					useValue: { tx: { roleAssignment } },
				},
			],
		}).compile();
		repository = module.get(RoleAssignmentsRepository);
	});

	it("Role의 활성·비활성 Assignment를 현재 Space의 Policy로 제한해 반환해야 한다", async () => {
		roleAssignment.findMany.mockResolvedValue([
			{
				id: "assignment-id",
				roleId: "role-id",
				policyId: "policy-id",
				isActive: false,
				priority: 10,
				createdAt: new Date(),
				updatedAt: new Date(),
				removedAt: null,
				policy: { entries: [] },
			},
		]);

		const result = await repository.findByRoleIdInSpace("role-id", "space-id");

		expect(roleAssignment.findMany).toHaveBeenCalledWith({
			where: {
				roleId: { in: ["role-id"] },
				removedAt: null,
				policy: { spaceId: "space-id", removedAt: null },
			},
			include: {
				policy: {
					include: {
						entries: {
							where: {
								removedAt: null,
								ability: { removedAt: null },
							},
							include: {
								ability: {
									include: {
										subject: true,
										action: true,
									},
								},
							},
							orderBy: { createdAt: "asc" },
						},
					},
				},
			},
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});
		expect(result[0]).toBeInstanceOf(RoleAssignment);
		expect(result[0]?.isActive).toBe(false);
	});

	it("CASL 계산용 조회는 활성 Assignment만 포함해야 한다", async () => {
		roleAssignment.findMany.mockResolvedValue([]);

		await repository.findActiveByRoleIdsInSpace(
			["role-a", "role-b"],
			"space-id",
		);

		expect(roleAssignment.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({
					roleId: { in: ["role-a", "role-b"] },
					isActive: true,
					policy: { spaceId: "space-id", removedAt: null },
				}),
			}),
		);
	});

	it("같은 Policy가 중복 입력되면 마지막 값 하나로 동기화해야 한다", async () => {
		roleAssignment.updateMany.mockResolvedValue({ count: 0 });
		roleAssignment.upsert.mockResolvedValue({});
		roleAssignment.findMany.mockResolvedValue([]);

		await repository.syncByRoleId(
			"role-id",
			[
				{ policyId: "policy-id", isActive: true, priority: 1 },
				{ policyId: "policy-id", isActive: false, priority: 20 },
			],
			"space-id",
		);

		expect(roleAssignment.upsert).toHaveBeenCalledTimes(1);
		expect(roleAssignment.upsert).toHaveBeenCalledWith(
			expect.objectContaining({
				update: {
					isActive: false,
					priority: 20,
					removedAt: null,
				},
			}),
		);
	});
});
