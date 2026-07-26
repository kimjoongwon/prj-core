import { PolicyEntry } from "@cocrepo/entity";
import { Test, type TestingModule } from "@nestjs/testing";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PolicyEntriesRepository } from "../src/policy-entries.repository";

describe("PolicyEntriesRepository", () => {
	let repository: PolicyEntriesRepository;
	const policyEntry = {
		findMany: jest.fn(),
		updateMany: jest.fn(),
		upsert: jest.fn(),
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
				id: "entry-id",
				policyId: "policy-id",
				abilityId: "ability-id",
				createdAt: new Date(),
				updatedAt: new Date(),
				removedAt: null,
				ability: {},
			},
		]);

		const result = await repository.findActiveByPolicyId("policy-id");

		expect(policyEntry.findMany).toHaveBeenCalledWith({
			where: {
				policyId: "policy-id",
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
		});
		expect(result[0]).toBeInstanceOf(PolicyEntry);
	});

	it("같은 Ability가 중복 입력되면 Entry 하나만 복원해야 한다", async () => {
		policyEntry.updateMany.mockResolvedValue({ count: 0 });
		policyEntry.upsert.mockResolvedValue({});
		policyEntry.findMany.mockResolvedValue([]);

		await repository.syncByPolicyId("policy-id", ["ability-id", "ability-id"]);

		expect(policyEntry.upsert).toHaveBeenCalledTimes(1);
		expect(policyEntry.upsert).toHaveBeenCalledWith({
			where: {
				policyId_abilityId: {
					policyId: "policy-id",
					abilityId: "ability-id",
				},
			},
			create: {
				policyId: "policy-id",
				abilityId: "ability-id",
			},
			update: {
				removedAt: null,
			},
		});
	});
});
