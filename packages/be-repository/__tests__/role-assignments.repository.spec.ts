import { RoleAssignment } from "@cocrepo/entity";
import { Test, type TestingModule } from "@nestjs/testing";
import { TransactionHost } from "@nestjs-cls/transactional";
import { RoleAssignmentsRepository } from "../src/role-assignments.repository";

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
				roleSeq: 10n,
				policySeq: 20n,
				isActive: false,
				priority: 10,
				createdAt: new Date(),
				updatedAt: new Date(),
				removedAt: null,
				policy: { entries: [] },
			},
		]);

		const result = await repository.findByRoleIdInSpace(10n, 30n);

		expect(roleAssignment.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: {
					roleSeq: { in: [10n] },
					removedAt: null,
					policy: { space: { seq: 30n }, removedAt: null },
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

		await repository.findActiveByRoleIdsInSpace([10n, 11n], 30n);

		expect(roleAssignment.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({
					roleSeq: { in: [10n, 11n] },
					isActive: true,
					policy: { space: { seq: 30n }, removedAt: null },
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
			10n,
			[
				{ policySeq: 20n, isActive: true, priority: 1 },
				{ policySeq: 20n, isActive: false, priority: 20 },
			],
			30n,
		);

		expect(roleAssignment.create).toHaveBeenCalledTimes(1);
		expect(roleAssignment.create).toHaveBeenCalledWith({
			data: {
				roleSeq: 10n,
				policySeq: 20n,
				isActive: false,
				priority: 20,
				removedAt: null,
			},
		});
		expect(roleAssignment.update).not.toHaveBeenCalled();
	});
});
