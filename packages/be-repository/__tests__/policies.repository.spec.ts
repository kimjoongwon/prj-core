import { Policy } from "@cocrepo/entity";
import { Test, type TestingModule } from "@nestjs/testing";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PoliciesRepository } from "../src/policies.repository";

describe("PoliciesRepository", () => {
	let repository: PoliciesRepository;
	const policy = {
		findMany: jest.fn(),
		findFirst: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PoliciesRepository,
				{
					provide: TransactionHost,
					useValue: { tx: { policy } },
				},
			],
		}).compile();
		repository = module.get(PoliciesRepository);
	});

	it("삭제되지 않은 Policy를 이름 오름차순으로 반환해야 한다", async () => {
		policy.findMany.mockResolvedValue([
			{
				id: 1n,
				spaceId: 10n,
				name: "Alpha",
				createdById: 20n,
				createdAt: new Date(),
				updatedAt: new Date(),
				removedAt: null,
				space: {},
				createdBy: {},
				entries: [],
			},
		]);

		const result = await repository.findManyBySpaceId(10n);

		expect(policy.findMany).toHaveBeenCalledWith({
			where: {
				spaceId: 10n,
				removedAt: null,
			},
			include: {
				space: true,
				createdBy: true,
				entries: {
					where: { removedAt: null },
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
				},
			},
			orderBy: [{ name: "asc" }],
		});
		expect(result[0]).toBeInstanceOf(Policy);
	});
});
