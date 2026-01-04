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
