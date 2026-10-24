import { Company, FitnessCenter, Space } from "@cocrepo/entity";
import {
	LanguageCode,
	Prisma,
	PrismaClient,
} from "@cocrepo/prisma";
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

	/** 내부 일련번호(seq)로 Space를 조회합니다. 저장소 내부 경로 전용입니다. */
	private async findByIdSeq(seq: bigint): Promise<Space | null> {
		const result = await this.txHost.tx.space.findUnique({
			where: { seq },
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
		spaceIds?: bigint[];
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
			...(queryParams.spaceIds ? { seq: { in: queryParams.spaceIds } } : {}),
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
	 * 전체 Space 목록 조회
	 */
	async findAll(): Promise<Space[]> {
		this.logger.debug("전체 Space 목록 조회");

		const results = await this.txHost.tx.space.findMany({
			where: { removedAt: null },
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => toDomainEntity(Space, result));
	}

	/**
	 * Space에 종속된 FitnessCenter 조회
	 */
	async findFitnessCenterBySpaceId(
		spaceSeq: bigint,
	): Promise<FitnessCenter | null> {
		this.logger.debug(`Space의 FitnessCenter 조회: ${spaceSeq.toString()}`);

		const result = await this.txHost.tx.fitnessCenter.findFirst({
			where: { spaceSeq },
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
	 * Space 생성
	 */
	async create(data: Prisma.SpaceUncheckedCreateInput): Promise<Space> {
		this.logger.debug(`Space 생성: ${data.name}`);

		const result = await this.txHost.tx.space.create({
			data,
		});

		return toDomainEntity(Space, result);
	}

	/**
	 * Space에 Company와 FitnessCenter detail 생성
	 */
	async createFitnessCenterBySpaceId(
		spaceSeq: bigint,
		data: {
			company: Prisma.CompanyUncheckedCreateInput;
			fitnessCenter: Omit<
				Prisma.FitnessCenterUncheckedCreateInput,
				"id" | "fitnessCenterId" | "companySeq" | "spaceSeq"
			>;
		},
	): Promise<Space> {
		this.logger.debug(`Space에 FitnessCenter 생성: ${spaceSeq.toString()}`);

		const company = await this.txHost.tx.company.create({
			data: data.company,
		});

		await this.txHost.tx.fitnessCenter.create({
			data: {
				...data.fitnessCenter,
				companySeq: company.seq,
				spaceSeq,
			},
		});

		const space = await this.findByIdSeq(spaceSeq);
		if (!space) {
			throw new Error("FITNESS_CENTER_CREATE_FAILED");
		}

		return space;
	}

	/**
	 * Space 수정
	 */
	async updateById(
		id: string,
		data: Prisma.SpaceUncheckedUpdateInput,
	): Promise<Space> {
		this.logger.debug(`Space 수정: ${id.toString()}`);

		const result = await this.txHost.tx.space.update({
			where: { id },
			data,
		});

		return toDomainEntity(Space, result);
	}

	/**
	 * Space 소프트 삭제
	 */
	async removeById(id: string): Promise<Space> {
		this.logger.debug(`Space 소프트 삭제: ${id.toString()}`);

		const result = await this.txHost.tx.space.update({
			where: { id },
			data: { removedAt: new Date() },
		});

		return toDomainEntity(Space, result);
	}

	/**
	 * Space의 FitnessCenter detail 수정
	 */
	async updateFitnessCenterBySpaceId(
		spaceSeq: bigint,
		data: {
			fitnessCenter: Prisma.FitnessCenterUncheckedUpdateInput;
		},
	): Promise<Space> {
		this.logger.debug(`Space의 FitnessCenter 수정: ${spaceSeq.toString()}`);

		const fitnessCenter = await this.txHost.tx.fitnessCenter.findFirst({
			where: { spaceSeq },
			select: { id: true },
		});

		if (!fitnessCenter) {
			throw new Error("FITNESS_CENTER_UPDATE_FAILED");
		}

		await this.txHost.tx.fitnessCenter.update({
			where: { id: fitnessCenter.id },
			data: data.fitnessCenter,
		});

		const space = await this.findByIdSeq(spaceSeq);
		if (!space) {
			throw new Error("FITNESS_CENTER_UPDATE_FAILED");
		}

		return space;
	}

	/**
	 * Space Category 위계 기반 Space ID 배열을 조회합니다.
	 */
	async findSpaceIdsByCategoryHierarchy(
		spaceSeq: bigint,
		scope: SpaceResourceScope = SpaceResourceScope.WITH_DESCENDANTS,
	): Promise<bigint[]> {
		this.logger.debug(
			`카테고리 위계 기반 Space ID 조회: spaceSeq=${spaceSeq.toString()}, scope=${scope}`,
		);

		const spaceClassification =
			await this.txHost.tx.spaceClassification.findFirst({
				where: {
					space: { seq: spaceSeq, removedAt: null },
					removedAt: null,
					category: {
						removedAt: null,
					},
				},
				select: { category: { select: { id: true } } },
			});

		if (!spaceClassification) {
			return [spaceSeq];
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
			select: { spaceSeq: true },
		});

		return [
			...new Set([
				spaceSeq,
				...classifications.map((classification) => classification.spaceSeq),
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
