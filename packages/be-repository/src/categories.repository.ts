import { Category } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class CategoriesRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("CategoriesRepository");
	}

	/**
	 * ID로 카테고리 조회
	 */
	async findById(
		id: string,
		include?: Prisma.CategoryInclude,
	): Promise<Category | null> {
		this.logger.debug(`ID로 카테고리 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.category.findUnique({
			where: { id },
			include,
		});

		return result ? plainToInstance(Category, result) : null;
	}

	/**
	 * 이름으로 카테고리 조회
	 */
	async findByName(name: string): Promise<Category | null> {
		this.logger.debug(`이름으로 카테고리 조회: ${name}`);

		const result = await this.txHost.tx.category.findFirst({
			where: { name },
		});

		return result ? plainToInstance(Category, result) : null;
	}

	/**
	 * 조건별 카테고리 목록 조회
	 */
	async findMany(params: {
		where?: Prisma.CategoryWhereInput;
		orderBy?: Prisma.CategoryOrderByWithRelationInput[];
		include?: Prisma.CategoryInclude;
	}): Promise<Category[]> {
		this.logger.debug("카테고리 목록 조회");

		const results = await this.txHost.tx.category.findMany({
			where: params.where,
			orderBy: params.orderBy ?? [{ createdAt: "asc" }],
			include: params.include,
		});

		return results.map((result) => plainToInstance(Category, result));
	}

	/**
	 * 카테고리 생성
	 */
	async create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category> {
		this.logger.debug(`카테고리 생성: name=${data.name}`);

		const result = await this.txHost.tx.category.create({ data });

		return plainToInstance(Category, result);
	}

	/**
	 * 카테고리 수정
	 */
	async updateById(
		id: string,
		data: Prisma.CategoryUncheckedUpdateInput,
	): Promise<Category> {
		this.logger.debug(`카테고리 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.category.update({
			where: { id },
			data,
		});

		return plainToInstance(Category, result);
	}

	/**
	 * 카테고리 삭제
	 */
	async deleteById(id: string): Promise<Category> {
		this.logger.debug(`카테고리 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.category.delete({
			where: { id },
		});

		return plainToInstance(Category, result);
	}

	/**
	 * 하위 카테고리 수 조회
	 */
	async countChildrenById(id: string): Promise<number> {
		this.logger.debug(`하위 카테고리 수 조회: ${id.slice(-8)}`);

		return this.txHost.tx.category.count({
			where: { parentId: id },
		});
	}

	/**
	 * 카테고리에 연결된 RoleClassification 수 조회
	 */
	async countRoleClassificationsByCategoryId(
		categoryId: string,
	): Promise<number> {
		this.logger.debug(
			`카테고리에 연결된 역할 수 조회: ${categoryId.slice(-8)}`,
		);

		return this.txHost.tx.roleClassification.count({
			where: { categoryId },
		});
	}

	/**
	 * 모든 하위 카테고리 ID를 재귀적으로 조회 (순환 참조 검증용)
	 */
	async findAllDescendantIds(categoryId: string): Promise<string[]> {
		this.logger.debug(`하위 카테고리 ID 재귀 조회: ${categoryId.slice(-8)}`);

		const descendantIds: string[] = [];
		const queue = [categoryId];

		while (queue.length > 0) {
			const currentId = queue.shift()!;
			const children = await this.txHost.tx.category.findMany({
				where: { parentId: currentId },
				select: { id: true },
			});

			for (const child of children) {
				descendantIds.push(child.id);
				queue.push(child.id);
			}
		}

		return descendantIds;
	}
}
