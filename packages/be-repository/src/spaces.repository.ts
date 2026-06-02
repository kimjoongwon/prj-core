import { Ground, Space } from "@cocrepo/entity";
import { LanguageCode, Prisma, PrismaClient } from "@cocrepo/prisma";
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
				ground: true,
			},
		});

		return result ? plainToInstance(Space, result) : null;
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
			ground: {
				is: {
					removedAt: null,
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
					ground: true,
				},
				orderBy: { createdAt: "desc" },
				skip: queryParams.skip,
				take: queryParams.take,
			}),
			this.txHost.tx.space.count({ where }),
		]);

		return [results.map((result) => plainToInstance(Space, result)), total];
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
				spaceId,
				removedAt: null,
			},
			include: {
				space: true,
			},
		});

		return result ? plainToInstance(Ground, result) : null;
	}

	/**
	 * 사업자등록번호로 Ground 조회
	 */
	async findGroundByBusinessNo(businessNo: string): Promise<Ground | null> {
		this.logger.debug(`사업자등록번호로 Ground 조회: ${businessNo}`);

		const result = await this.txHost.tx.ground.findFirst({
			where: {
				businessNo,
				removedAt: null,
			},
		});

		return result ? plainToInstance(Ground, result) : null;
	}

	/**
	 * Space 생성
	 */
	async create(data?: Prisma.SpaceUncheckedCreateInput): Promise<Space> {
		this.logger.debug("Space 생성");

		const result = await this.txHost.tx.space.create({
			data: data ?? {},
		});

		await this.cloneSystemPoliciesToSpace(result.id);

		return plainToInstance(Space, result);
	}

	private async cloneSystemPoliciesToSpace(spaceId: string): Promise<void> {
		const sourcePolicies = await this.txHost.tx.policy.findMany({
			where: {
				spaceId: { not: spaceId },
				isSystem: true,
				removedAt: null,
			},
			include: {
				policyAbilities: {
					where: { removedAt: null },
					select: { abilityId: true },
				},
				rolePolicies: {
					where: { removedAt: null },
					select: {
						roleId: true,
						isActive: true,
						priority: true,
					},
				},
			},
			orderBy: { createdAt: "asc" },
		});

		const sourcePolicyByName = new Map(
			sourcePolicies.map((policy) => [policy.name, policy]),
		);

		for (const sourcePolicy of sourcePolicyByName.values()) {
			const policy = await this.txHost.tx.policy.upsert({
				where: {
					spaceId_name: {
						spaceId,
						name: sourcePolicy.name,
					},
				},
				update: {
					displayName: sourcePolicy.displayName,
					description: sourcePolicy.description,
					isSystem: true,
					removedAt: null,
				},
				create: {
					spaceId,
					name: sourcePolicy.name,
					displayName: sourcePolicy.displayName,
					description: sourcePolicy.description,
					isSystem: true,
				},
			});

			for (const policyAbility of sourcePolicy.policyAbilities) {
				await this.txHost.tx.policyAbility.upsert({
					where: {
						policyId_abilityId: {
							policyId: policy.id,
							abilityId: policyAbility.abilityId,
						},
					},
					update: { removedAt: null },
					create: {
						policyId: policy.id,
						abilityId: policyAbility.abilityId,
					},
				});
			}

			for (const rolePolicy of sourcePolicy.rolePolicies) {
				await this.txHost.tx.rolePolicy.upsert({
					where: {
						roleId_policyId: {
							roleId: rolePolicy.roleId,
							policyId: policy.id,
						},
					},
					update: {
						isActive: rolePolicy.isActive,
						priority: rolePolicy.priority,
						removedAt: null,
					},
					create: {
						roleId: rolePolicy.roleId,
						policyId: policy.id,
						isActive: rolePolicy.isActive,
						priority: rolePolicy.priority,
					},
				});
			}
		}
	}

	/**
	 * Space에 Ground detail 생성
	 */
	async createGroundBySpaceId(
		spaceId: string,
		data: Omit<Prisma.GroundUncheckedCreateInput, "spaceId">,
	): Promise<Space> {
		this.logger.debug(`Space에 Ground 생성: ${spaceId.slice(-8)}`);

		await this.txHost.tx.ground.create({
			data: {
				...data,
				spaceId,
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
	 * Space의 Ground detail 수정
	 */
	async updateGroundBySpaceId(
		spaceId: string,
		data: Prisma.GroundUncheckedUpdateInput,
	): Promise<Space> {
		this.logger.debug(`Space의 Ground 수정: ${spaceId.slice(-8)}`);

		await this.txHost.tx.ground.update({
			where: { spaceId },
			data,
		});

		const space = await this.findByIdWithGround(spaceId);
		if (!space) {
			throw new Error("GROUND_UPDATE_FAILED");
		}

		return space;
	}

	/**
	 * SpaceCategory 위계 기반 접근 가능한 Space ID 배열 조회
	 *
	 * 1. 해당 Space의 SpaceClassification → Category (children 포함) 조회
	 * 2. 현재 Category + 하위 Category에 속한 모든 Space ID 수집
	 *
	 * ROOT Category → 자신 + 모든 BRANCH Space
	 * BRANCH Category → 자신만
	 */
	async findSpaceIdsByCategoryHierarchy(spaceId: string): Promise<string[]> {
		this.logger.debug(
			`카테고리 위계 기반 Space ID 조회: spaceId=${spaceId.slice(-8)}`,
		);

		const spaceClassification =
			await this.txHost.tx.spaceClassification.findUnique({
				where: { spaceId },
				include: {
					category: {
						include: {
							children: true,
						},
					},
				},
			});

		if (!spaceClassification) {
			return [spaceId];
		}

		const categoryIds = [spaceClassification.categoryId];
		for (const child of spaceClassification.category.children) {
			categoryIds.push(child.id);
		}

		const classifications = await this.txHost.tx.spaceClassification.findMany({
			where: {
				categoryId: { in: categoryIds },
			},
			select: { spaceId: true },
		});

		return classifications.map((c) => c.spaceId);
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
			include: { ground: true },
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => plainToInstance(Space, result));
	}
}
