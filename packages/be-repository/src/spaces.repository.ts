import { Company, FitnessCenter, Space } from "@cocrepo/entity";
import { LanguageCode, Prisma, PrismaClient } from "@cocrepo/prisma";
import { SpaceResourceScope } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class SpacesRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("SpacesRepository");
	}

	private toFitnessCenterWithCompany(
		result: Prisma.FitnessCenterGetPayload<{ include: { company: true } }>,
	): FitnessCenter {
		const fitnessCenter = toDomainEntity(FitnessCenter, result);
		const company = toDomainEntity(Company, result.company);
		fitnessCenter.company = company;
		company.fitnessCenters = [fitnessCenter];
		return fitnessCenter;
	}

	private toSpaceWithFitnessCenter(
		result: Prisma.SpaceGetPayload<{
			include: { fitnessCenter: { include: { company: true } } };
		}>,
	): Space {
		const space = toDomainEntity(Space, result);

		const centerRecord = result.fitnessCenter;
		if (!centerRecord || centerRecord.removedAt !== null) {
			return space;
		}

		const fitnessCenter = this.toFitnessCenterWithCompany(centerRecord);
		fitnessCenter.spaceSeq = space.seq;
		fitnessCenter.space = space;
		space.fitnessCenter = fitnessCenter;
		return space;
	}

	/**
	 * ID로 Space 조회
	 */
	async findById(id: string): Promise<Space | null> {
		this.logger.debug(`ID로 Space 조회: ${id.toString()}`);

		const result = await this.txHost.tx.space.findUnique({
			where: { id },
		});

		return result ? toDomainEntity(Space, result) : null;
	}

	/**
	 * ID로 Space 조회 (FitnessCenter 포함)
	 */
	async findByIdWithFitnessCenter(id: string): Promise<Space | null> {
		this.logger.debug(`ID로 Space 조회 (FitnessCenter 포함): ${id.toString()}`);

		const result = await this.txHost.tx.space.findUnique({
			where: { id: id },
			include: {
				fitnessCenter: {
					include: {
						company: true,
					},
				},
			},
		});

		return result ? this.toSpaceWithFitnessCenter(result) : null;
	}

	/**
	 * FitnessCenter를 포함한 Space 목록 조회
	 */
	async findManyWithFitnessCenter(params?: {
		spaceIds?: string[];
		skip?: number;
		take?: number;
		search?: string;
		contentLanguageCode?: LanguageCode;
	}): Promise<[Space[], number]> {
		const queryParams = params ?? {};
		this.logger.debug(
			`FitnessCenter 포함 Space 목록 조회: count=${queryParams.spaceIds?.length ?? "all"}, search=${queryParams.search ?? "없음"}`,
		);

		const where: Prisma.SpaceWhereInput = {
			removedAt: null,
			...(queryParams.spaceIds ? { id: { in: queryParams.spaceIds } } : {}),
			...(queryParams.contentLanguageCode
				? { contentLanguageCode: queryParams.contentLanguageCode }
				: {}),
			// 이름의 원천이 Space이므로 목록 노출에 FitnessCenter를 요구하지 않습니다.
			// 회사명·사업자번호 검색만 상세 관계를 선택적으로 참조합니다.
			...(queryParams.search
				? {
						OR: [
							{
								name: {
									contains: queryParams.search,
									mode: "insensitive",
								},
							},
							{
								fitnessCenter: {
									is: {
										removedAt: null,
										company: {
											is: {
												removedAt: null,
												name: {
													contains: queryParams.search,
													mode: "insensitive",
												},
											},
										},
									},
								},
							},
							{
								fitnessCenter: {
									is: {
										removedAt: null,
										company: {
											is: {
												removedAt: null,
												businessNo: {
													contains: queryParams.search,
													mode: "insensitive",
												},
											},
										},
									},
								},
							},
						],
					}
				: {}),
		};

		const [results, total] = await Promise.all([
			this.txHost.tx.space.findMany({
				where,
				include: {
					fitnessCenter: {
						include: {
							company: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip: queryParams.skip,
				take: queryParams.take,
			}),
			this.txHost.tx.space.count({ where }),
		]);

		return [
			results.map((result) => this.toSpaceWithFitnessCenter(result)),
			total,
		];
	}

	/**
	 * Space에 종속된 FitnessCenter 조회
	 */
	async findFitnessCenterBySpaceId(
		spaceId: string,
	): Promise<FitnessCenter | null> {
		this.logger.debug(`Space의 FitnessCenter 조회: ${spaceId}`);

		const result = await this.txHost.tx.fitnessCenter.findFirst({
			where: { space: { id: spaceId } },
			include: {
				company: true,
				space: true,
			},
		});

		if (!result) {
			return null;
		}

		const fitnessCenter = this.toFitnessCenterWithCompany(result);
		fitnessCenter.space = toDomainEntity(Space, result.space);
		return fitnessCenter;
	}

	/**
	 * Space Category 위계 기반 Space ID 배열을 조회합니다.
	 */
	async findSpaceIdsByCategoryHierarchy(
		spaceId: string,
		scope: SpaceResourceScope = SpaceResourceScope.WITH_DESCENDANTS,
	): Promise<string[]> {
		this.logger.debug(
			`카테고리 위계 기반 Space ID 조회: spaceId=${spaceId}, scope=${scope}`,
		);

		const spaceClassification =
			await this.txHost.tx.spaceClassification.findFirst({
				where: {
					space: { id: spaceId, removedAt: null },
					removedAt: null,
					category: {
						removedAt: null,
					},
				},
				select: { category: { select: { id: true } } },
			});

		if (!spaceClassification) {
			return [spaceId];
		}

		const categories = await this.txHost.tx.category.findMany({
			where: {
				removedAt: null,
				spaceClassifications: { some: { removedAt: null } },
			},
			select: {
				id: true,
				parent: { select: { id: true } },
			},
		});
		const categoryRecords = categories.map((category) => ({
			id: category.id,
			parentSeq: category.parent?.id ?? null,
		}));
		const categoryById = new Map(
			categoryRecords.map((category) => [category.id, category]),
		);
		const childCategoryIdsByParentId = new Map<string, string[]>();
		for (const category of categoryRecords) {
			if (!category.parentSeq) {
				continue;
			}

			const childCategoryIds =
				childCategoryIdsByParentId.get(category.parentSeq) ?? [];
			childCategoryIds.push(category.id);
			childCategoryIdsByParentId.set(category.parentSeq, childCategoryIds);
		}

		const categoryIds = new Set<string>([spaceClassification.category.id]);

		if (
			scope === SpaceResourceScope.WITH_ANCESTORS ||
			scope === SpaceResourceScope.WITH_TREE
		) {
			let cursor = categoryById.get(spaceClassification.category.id)?.parentSeq;
			while (cursor) {
				categoryIds.add(cursor);
				cursor = categoryById.get(cursor)?.parentSeq;
			}
		}

		if (
			scope === SpaceResourceScope.WITH_DESCENDANTS ||
			scope === SpaceResourceScope.WITH_TREE
		) {
			const pendingCategoryIds = [
				...(childCategoryIdsByParentId.get(spaceClassification.category.id) ??
					[]),
			];
			while (pendingCategoryIds.length > 0) {
				const categorySeq = pendingCategoryIds.shift();
				if (!categorySeq || categoryIds.has(categorySeq)) {
					continue;
				}

				categoryIds.add(categorySeq);
				pendingCategoryIds.push(
					...(childCategoryIdsByParentId.get(categorySeq) ?? []),
				);
			}
		}

		const classifications = await this.txHost.tx.spaceClassification.findMany({
			where: {
				removedAt: null,
				category: { id: { in: [...categoryIds] } },
				space: { removedAt: null },
			},
			select: { id: true },
		});

		return [
			...new Set([
				spaceId,
				...classifications.map((classification) => classification.id),
			]),
		];
	}

	/**
	 * 여러 ID로 Space 조회 (FitnessCenter 포함)
	 */
	async findByIdsWithFitnessCenter(ids: string[]): Promise<Space[]> {
		this.logger.debug(
			`여러 공개 ID로 Space 조회 (FitnessCenter 포함): count=${ids.length}`,
		);

		const results = await this.txHost.tx.space.findMany({
			where: { id: { in: ids }, removedAt: null },
			include: {
				fitnessCenter: {
					include: {
						company: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => this.toSpaceWithFitnessCenter(result));
	}
}
