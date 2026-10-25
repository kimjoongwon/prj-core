import { RoleAssignment } from "@cocrepo/entity";
import { Test, type TestingModule } from "@nestjs/testing";
import { TransactionHost } from "@nestjs-cls/transactional";
import { RoleAssignmentsRepository } from "../src/role-assignments.repository";

const ROLE_ID = "01JAAAAAAAAAAAAAAAAAAAAAAAA";
const SPACE_ID = "01JBBBBBBBBBBBBBBBBBBBBBBBB";

describe("RoleAssignmentsRepository", () => {
	let repository: RoleAssignmentsRepository;
	const roleAssignment = {
		findFirst: jest.fn(),
		findMany: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		updateMany: jest.fn(),
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
				id: 1n,
				role: { connect: { id: ROLE_ID } },
				policy: { connect: { id: "01JBBBBBBBBBBBBBBBBBBBBBBBB" } },
				isActive: false,
				priority: 10,
				createdAt: new Date(),
				updatedAt: new Date(),
				removedAt: null,
			},
		]);

		const result = await repository.findByRoleIdInSpace(ROLE_ID, SPACE_ID);

		expect(roleAssignment.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: {
					role: { id: { in: [ROLE_ID] } },
					removedAt: null,
					policy: { space: { id: SPACE_ID }, removedAt: null },
				},
				include: expect.objectContaining({
					role: true,
					policy: expect.any(Object),
				}),
				orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
			}),
		);
		expect(result[0]).toBeInstanceOf(RoleAssignment);
		expect(result[0]?.isActive).toBe(false);
	});

	it("CASL 계산용 조회는 활성 Assignment만 포함해야 한다", async () => {
		roleAssignment.findMany.mockResolvedValue([]);

		await repository.findActiveByRoleIdsInSpace([ROLE_ID, "01JCCCCCCCCCCCCCCCCCCCCCCCC"], SPACE_ID);

		expect(roleAssignment.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({
					role: { id: { in: [ROLE_ID, "01JCCCCCCCCCCCCCCCCCCCCCCCC"] } },
					isActive: true,
					policy: { space: { id: SPACE_ID }, removedAt: null },
				}),
			}),
		);
	});

	it("같은 Policy가 중복 입력되면 마지막 값 하나로 동기화해야 한다", async () => {
		roleAssignment.updateMany.mockResolvedValue({ count: 0 });
		roleAssignment.findFirst.mockResolvedValue(null);
		roleAssignment.create.mockResolvedValue({});
		roleAssignment.findMany.mockResolvedValue([]);

		await repository.syncByRoleId(
			ROLE_ID,
			[
				{ policyId: "01JBBBBBBBBBBBBBBBBBBBBBBBB", isActive: true, priority: 1 },
				{ policyId: "01JBBBBBBBBBBBBBBBBBBBBBBBB", isActive: false, priority: 20 },
			],
			SPACE_ID,
		);

		expect(roleAssignment.create).toHaveBeenCalledTimes(1);
		expect(roleAssignment.create).toHaveBeenCalledWith({
			data: {
				role: { connect: { id: ROLE_ID } },
				policy: { connect: { id: "01JBBBBBBBBBBBBBBBBBBBBBBBB" } },
				isActive: false,
				priority: 20,
				removedAt: null,
			},
		});
		expect(roleAssignment.update).not.toHaveBeenCalled();
	});
});
