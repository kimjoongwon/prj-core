import { Company, Ground, Space } from "@cocrepo/entity";
import {
	CategoryTypes,
	LanguageCode,
	Prisma,
	PrismaClient,
} from "@cocrepo/prisma";
import { SpaceResourceScope } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

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

	private toGroundWithCompany(
		result: Prisma.GroundGetPayload<{ include: { company: true } }>,
	): Ground {
		const ground = plainToInstance(Ground, result);
		const company = plainToInstance(Company, result.company);
		ground.company = company;
		ground.businessNo = result.company.businessNo;
		ground.spaceId = result.company.spaceId;
		ground.logoImageFileId = result.company.logoImageFileId;
		return ground;
	}

	private toSpaceWithCompanyGround(
		result: Prisma.SpaceGetPayload<{
			include: { company: { include: { grounds: true } } };
		}>,
	): Space {
		const space = plainToInstance(Space, result);
		if (!result.company) {
			return space;
		}

		const company = plainToInstance(Company, result.company);
		space.company = company;

		if (result.company.grounds.length > 0) {
			const grounds = result.company.grounds.map((companyGround) => {
				const ground = this.toGroundWithCompany({
					...companyGround,
					company: result.company,
				});
				ground.space = space;
				return ground;
			});
			company.grounds = grounds;
			space.grounds = grounds;
			space.ground = grounds[0];
		}

		return space;
	}

	/**
	 * ID로 Space 조회
	 */
	async findById(id: string): Promise<Space | null> {
		this.logger.debug(`ID로 Space 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.space.findUnique({
			where: { id },
		});

		return result ? plainToInstance(Space, result) : null;
	}

	/**
	 * ID로 Space 조회 (Ground 포함)
	 */
	async findByIdWithGround(id: string): Promise<Space | null> {
		this.logger.debug(`ID로 Space 조회 (Ground 포함): ${id.slice(-8)}`);

		const result = await this.txHost.tx.space.findUnique({
			where: { id },
			include: {
				company: {
					include: {
						grounds: {
							where: { removedAt: null },
							orderBy: { createdAt: "asc" },
						},
					},
				},
			},
		});

		return result ? this.toSpaceWithCompanyGround(result) : null;
	}

	/**
	 * Ground를 포함한 Space 목록 조회
	 */
	async findManyWithGround(params?: {
		spaceIds?: string[];
		skip?: number;
		take?: number;
		search?: string;
		contentLanguageCode?: LanguageCode;
	}): Promise<[Space[], number]> {
		const queryParams = params ?? {};
		this.logger.debug(
			`Ground 포함 Space 목록 조회: count=${queryParams.spaceIds?.length ?? "all"}, search=${queryParams.search ?? "없음"}`,
		);

		const where: Prisma.SpaceWhereInput = {
			removedAt: null,
			...(queryParams.spaceIds ? { id: { in: queryParams.spaceIds } } : {}),
			...(queryParams.contentLanguageCode
				? { contentLanguageCode: queryParams.contentLanguageCode }
				: {}),
			company: {
				is: {
					removedAt: null,
					grounds: {
						some: {
							removedAt: null,
						},
					},
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
										businessNo: {
											contains: queryParams.search,
											mode: "insensitive",
										},
									},
									{
										grounds: {
											some: {
												removedAt: null,
												name: {
													contains: queryParams.search,
													mode: "insensitive",
												},
											},
										},
									},
								],
							}
						: {}),
				},
			},
		};

		const [results, total] = await Promise.all([
			this.txHost.tx.space.findMany({
				where,
				include: {
					company: {
						include: {
							grounds: {
								where: { removedAt: null },
								orderBy: { createdAt: "asc" },
							},
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
			results.map((result) => this.toSpaceWithCompanyGround(result)),
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

		return results.map((result) => plainToInstance(Space, result));
	}

	/**
	 * Space에 종속된 Ground 조회
	 */
	async findGroundBySpaceId(spaceId: string): Promise<Ground | null> {
		this.logger.debug(`Space의 Ground 조회: ${spaceId.slice(-8)}`);

		const result = await this.txHost.tx.ground.findFirst({
			where: {
				removedAt: null,
				company: {
					spaceId,
					removedAt: null,
				},
			},
			include: {
				company: true,
			},
			orderBy: { createdAt: "asc" },
		});

		return result ? this.toGroundWithCompany(result) : null;
	}

	/**
	 * 사업자등록번호로 Company의 Ground 조회
	 */
	async findGroundByBusinessNo(businessNo: string): Promise<Ground | null> {
		this.logger.debug(`사업자등록번호로 Ground 조회: ${businessNo}`);

		const result = await this.txHost.tx.ground.findFirst({
			where: {
				removedAt: null,
				company: {
					businessNo,
					removedAt: null,
				},
			},
			include: {
				company: true,
			},
			orderBy: { createdAt: "asc" },
		});

		return result ? this.toGroundWithCompany(result) : null;
	}

	/**
	 * Space 생성
	 */
	async create(data?: Prisma.SpaceUncheckedCreateInput): Promise<Space> {
		this.logger.debug("Space 생성");

		const result = await this.txHost.tx.space.create({
			data: data ?? {},
		});

		return plainToInstance(Space, result);
	}

	/**
	 * Space에 Company와 Ground detail 생성
	 */
	async createGroundBySpaceId(
		spaceId: string,
		data: {
			company: Omit<Prisma.CompanyUncheckedCreateInput, "spaceId">;
			ground: Omit<Prisma.GroundUncheckedCreateInput, "companyId">;
		},
	): Promise<Space> {
		this.logger.debug(`Space에 Ground 생성: ${spaceId.slice(-8)}`);

		const company = await this.txHost.tx.company.create({
			data: {
				...data.company,
				spaceId,
			},
		});

		await this.txHost.tx.ground.create({
			data: {
				...data.ground,
				companyId: company.id,
			},
		});

		const space = await this.findByIdWithGround(spaceId);
		if (!space) {
			throw new Error("GROUND_CREATE_FAILED");
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
		this.logger.debug(`Space 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.space.update({
			where: { id },
			data,
		});

		return plainToInstance(Space, result);
	}

	/**
	 * Space 소프트 삭제
	 */
	async removeById(id: string): Promise<Space> {
		this.logger.debug(`Space 소프트 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.space.update({
			where: { id },
			data: { removedAt: new Date() },
		});

		return plainToInstance(Space, result);
	}

	/**
	 * Space의 Company와 Ground detail 수정
	 */
	async updateGroundBySpaceId(
		spaceId: string,
		data: {
			company?: Prisma.CompanyUncheckedUpdateInput;
			ground?: Prisma.GroundUncheckedUpdateInput;
		},
	): Promise<Space> {
		this.logger.debug(`Space의 Ground 수정: ${spaceId.slice(-8)}`);

		const company = await this.txHost.tx.company.update({
			where: { spaceId },
			data: data.company ?? {},
		});

		if (data.ground) {
			const ground = await this.txHost.tx.ground.findFirst({
				where: {
					companyId: company.id,
					removedAt: null,
				},
				orderBy: { createdAt: "asc" },
				select: { id: true },
			});

			if (!ground) {
				throw new Error("GROUND_UPDATE_FAILED");
			}

			await this.txHost.tx.ground.update({
				where: { id: ground.id },
				data: data.ground,
			});
		}

		const space = await this.findByIdWithGround(spaceId);
		if (!space) {
			throw new Error("GROUND_UPDATE_FAILED");
		}

		return space;
	}

	/**
	 * Space Category 위계 기반 Space ID 배열을 조회합니다.
	 */
	async findSpaceIdsByCategoryHierarchy(
		spaceId: string,
		scope: SpaceResourceScope = SpaceResourceScope.WITH_DESCENDANTS,
	): Promise<string[]> {
		this.logger.debug(
			`카테고리 위계 기반 Space ID 조회: spaceId=${spaceId.slice(-8)}, scope=${scope}`,
		);

		const spaceClassification =
			await this.txHost.tx.spaceClassification.findFirst({
				where: {
					spaceId,
					removedAt: null,
					space: { removedAt: null },
					category: {
						type: CategoryTypes.Space,
						removedAt: null,
					},
				},
				select: { categoryId: true },
			});

		if (!spaceClassification) {
			return [spaceId];
		}

		const categories = await this.txHost.tx.category.findMany({
			where: {
				type: CategoryTypes.Space,
				removedAt: null,
			},
			select: {
				id: true,
				parentId: true,
			},
		});
		const categoryById = new Map(
			categories.map((category) => [category.id, category]),
		);
		const childCategoryIdsByParentId = new Map<string, string[]>();
		for (const category of categories) {
			if (!category.parentId) {
				continue;
			}

			const childCategoryIds =
				childCategoryIdsByParentId.get(category.parentId) ?? [];
			childCategoryIds.push(category.id);
			childCategoryIdsByParentId.set(category.parentId, childCategoryIds);
		}

		const categoryIds = new Set<string>([spaceClassification.categoryId]);

		if (
			scope === SpaceResourceScope.WITH_ANCESTORS ||
			scope === SpaceResourceScope.WITH_TREE
		) {
			let cursor = categoryById.get(spaceClassification.categoryId)?.parentId;
			while (cursor) {
				categoryIds.add(cursor);
				cursor = categoryById.get(cursor)?.parentId;
			}
		}

		if (
			scope === SpaceResourceScope.WITH_DESCENDANTS ||
			scope === SpaceResourceScope.WITH_TREE
		) {
			const pendingCategoryIds = [
				...(childCategoryIdsByParentId.get(spaceClassification.categoryId) ??
					[]),
			];
			while (pendingCategoryIds.length > 0) {
				const categoryId = pendingCategoryIds.shift();
				if (!categoryId || categoryIds.has(categoryId)) {
					continue;
				}

				categoryIds.add(categoryId);
				pendingCategoryIds.push(
					...(childCategoryIdsByParentId.get(categoryId) ?? []),
				);
			}
		}

		const classifications = await this.txHost.tx.spaceClassification.findMany({
			where: {
				removedAt: null,
				categoryId: { in: [...categoryIds] },
				space: { removedAt: null },
			},
			select: { spaceId: true },
		});

		return [
			...new Set([
				spaceId,
				...classifications.map((classification) => classification.spaceId),
			]),
		];
	}

	/**
	 * 여러 ID로 Space 조회 (Ground 포함)
	 */
	async findByIdsWithGround(ids: string[]): Promise<Space[]> {
		this.logger.debug(
			`여러 ID로 Space 조회 (Ground 포함): count=${ids.length}`,
		);

		const results = await this.txHost.tx.space.findMany({
			where: { id: { in: ids }, removedAt: null },
			include: {
				company: {
					include: {
						grounds: {
							where: { removedAt: null },
							orderBy: { createdAt: "asc" },
						},
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => this.toSpaceWithCompanyGround(result));
	}
}
