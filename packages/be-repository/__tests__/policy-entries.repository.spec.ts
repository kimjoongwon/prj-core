import { PolicyEntry } from "@cocrepo/entity";
import { Test, type TestingModule } from "@nestjs/testing";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PolicyEntriesRepository } from "../src/policy-entries.repository";

describe("PolicyEntriesRepository", () => {
	let repository: PolicyEntriesRepository;
	const policyEntry = {
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
				PolicyEntriesRepository,
				{
					provide: TransactionHost,
					useValue: { tx: { policyEntry } },
				},
			],
		}).compile();
		repository = module.get(PolicyEntriesRepository);
	});

	it("삭제되지 않은 Entry와 Ability를 생성 순서로 반환해야 한다", async () => {
		policyEntry.findMany.mockResolvedValue([
			{
				id: 1n,
				policyId: 10n,
				abilityId: 20n,
				createdAt: new Date(),
				updatedAt: new Date(),
				removedAt: null,
				ability: {},
			},
		]);

		const result = await repository.findActiveByPolicyId(10n);

		expect(policyEntry.findMany).toHaveBeenCalledWith({
			where: {
				policyId: 10n,
				removedAt: null,
				ability: { removedAt: null },
			},
			include: {
				policy: { select: { id: true } },
				ability: {
					include: {
						subject: true,
						action: true,
					},
				},
			},
			orderBy: { createdAt: "asc" },
		});
		expect(result[0]).toBeInstanceOf(PolicyEntry);
	});

	it("같은 Ability가 중복 입력되면 Entry 하나만 복원해야 한다", async () => {
		policyEntry.updateMany.mockResolvedValue({ count: 0 });
		policyEntry.findFirst.mockResolvedValue(null);
		policyEntry.create.mockResolvedValue({});
		policyEntry.findMany.mockResolvedValue([]);

		await repository.syncByPolicyId(10n, [20n, 20n]);

		expect(policyEntry.create).toHaveBeenCalledTimes(1);
		expect(policyEntry.create).toHaveBeenCalledWith({
			data: {
				policyId: 10n,
				abilityId: 20n,
			},
		});
		expect(policyEntry.update).not.toHaveBeenCalled();
	});
});
