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
				id: "policy-1",
				spaceId: "space-10",
				name: "Alpha",
				createdById: "user-20",
				createdAt: new Date(),
				updatedAt: new Date(),
				removedAt: null,
				space: {},
				createdBy: {},
				entries: [],
			},
		]);

		const result = await repository.findManyBySpaceId("space-10");

		expect(policy.findMany).toHaveBeenCalledWith({
			where: {
				spaceId: "space-10",
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
