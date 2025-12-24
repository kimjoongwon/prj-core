import { SpaceAssociation } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PRISMA_SERVICE_TOKEN } from "../constants/tokens";
import type { IPrismaClient } from "../types/prisma-client.interface";

@Injectable()
export class SpaceAssociationsRepository {
	private readonly logger: Logger;

	constructor(
		@Inject(PRISMA_SERVICE_TOKEN)
		private readonly prisma: IPrismaClient
	) {
		this.logger = new Logger("SpaceAssociation");
	}

	async create(
		args: Prisma.SpaceAssociationCreateArgs,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 생성 중...`);
		const result = await this.prisma.spaceAssociation.create(args);
		return plainToInstance(SpaceAssociation, result);
	}

	async upsert(
		args: Prisma.SpaceAssociationUpsertArgs,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 업서트 중...`);
		const result = await this.prisma.spaceAssociation.upsert(args);
		return plainToInstance(SpaceAssociation, result);
	}

	async update(
		args: Prisma.SpaceAssociationUpdateArgs,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 업데이트 중...`);
		const result = await this.prisma.spaceAssociation.update(args);
		return plainToInstance(SpaceAssociation, result);
	}

	async updateMany(
		args: Prisma.SpaceAssociationUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`SpaceAssociation 다중 업데이트 중...`);
		return await this.prisma.spaceAssociation.updateMany(args);
	}

	async delete(
		args: Prisma.SpaceAssociationDeleteArgs,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 삭제 중...`);
		const result = await this.prisma.spaceAssociation.delete(args);
		return plainToInstance(SpaceAssociation, result);
	}

	async findMany(
		args: Prisma.SpaceAssociationFindManyArgs,
	): Promise<SpaceAssociation[]> {
		this.logger.debug(`SpaceAssociation 다중 조회 중...`);
		const result = await this.prisma.spaceAssociation.findMany(args);
		return result.map((item) => plainToInstance(SpaceAssociation, item));
	}

	async findFirst(
		args: Prisma.SpaceAssociationFindFirstArgs,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 최초 조회 중...`);
		const result = await this.prisma.spaceAssociation.findFirst(args);
		return plainToInstance(SpaceAssociation, result);
	}

	async findUnique(
		args: Prisma.SpaceAssociationFindUniqueArgs,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 고유 조회 중...`);
		const result = await this.prisma.spaceAssociation.findUnique(args);
		return plainToInstance(SpaceAssociation, result);
	}

	async createManyAndReturn(
		args: Prisma.SpaceAssociationCreateManyAndReturnArgs,
	): Promise<SpaceAssociation[]> {
		this.logger.debug(`SpaceAssociation 다중 생성 중...`);
		const result = await this.prisma.spaceAssociation.createManyAndReturn(args);
		return result.map((item) => plainToInstance(SpaceAssociation, item));
	}

	async deleteMany(
		args: Prisma.SpaceAssociationDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`SpaceAssociation 다중 삭제 중...`);
		return await this.prisma.spaceAssociation.deleteMany(args);
	}

	async aggregate(
		args: Prisma.SpaceAssociationAggregateArgs,
	): Promise<Prisma.GetSpaceAssociationAggregateType<typeof args>> {
		this.logger.debug(`SpaceAssociation 집계 중...`);
		return await this.prisma.spaceAssociation.aggregate(args);
	}

	async count(args: Prisma.SpaceAssociationCountArgs): Promise<number> {
		this.logger.debug(`SpaceAssociation 개수 세기 중...`);
		return await this.prisma.spaceAssociation.count(args);
	}
}
