import { Space } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
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
	 * SpaceCategory 위계 기반 접근 가능한 Space ID 배열 조회
	 *
	 * 1. 해당 Space의 SpaceClassification → Category (children 포함) 조회
	 * 2. 현재 Category + 하위 Category에 속한 모든 Space ID 수집
	 *
	 * ROOT Category → 자신 + 모든 BRANCH Space
	 * BRANCH Category → 자신만
	 */
	async findSpaceIdsByCategoryHierarchy(spaceId: string): Promise<string[]> {
		this.logger.debug(`카테고리 위계 기반 Space ID 조회: spaceId=${spaceId.slice(-8)}`);

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

		const classifications =
			await this.txHost.tx.spaceClassification.findMany({
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
		this.logger.debug(`여러 ID로 Space 조회 (Ground 포함): count=${ids.length}`);

		const results = await this.txHost.tx.space.findMany({
			where: { id: { in: ids }, removedAt: null },
			include: { ground: true },
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => plainToInstance(Space, result));
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
}
