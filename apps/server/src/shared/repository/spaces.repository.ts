import { Space } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
export class SpacesRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Space");
	}

	async create(args: Prisma.SpaceCreateArgs): Promise<Space> {
		this.logger.debug(`Space 생성 중...`);
		const result = await this.prisma.space.create(args);
		return plainToInstance(Space, result);
	}

	async upsert(args: Prisma.SpaceUpsertArgs): Promise<Space> {
		this.logger.debug(`Space 업서트 중...`);
		const result = await this.prisma.space.upsert(args);
		return plainToInstance(Space, result);
	}

	async update(args: Prisma.SpaceUpdateArgs): Promise<Space> {
		this.logger.debug(`Space 업데이트 중...`);
		const result = await this.prisma.space.update(args);
		return plainToInstance(Space, result);
	}

	async updateMany(
		args: Prisma.SpaceUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Space 다중 업데이트 중...`);
		return await this.prisma.space.updateMany(args);
	}

	async delete(args: Prisma.SpaceDeleteArgs): Promise<Space> {
		this.logger.debug(`Space 삭제 중...`);
		const result = await this.prisma.space.delete(args);
		return plainToInstance(Space, result);
	}

	async findMany(args: Prisma.SpaceFindManyArgs): Promise<Space[]> {
		this.logger.debug(`Space 다중 조회 중...`);
		const result = await this.prisma.space.findMany(args);
		return result.map((item) => plainToInstance(Space, item));
	}

	async findFirst(args: Prisma.SpaceFindFirstArgs): Promise<Space> {
		this.logger.debug(`Space 최초 조회 중...`);
		const result = await this.prisma.space.findFirst(args);
		return plainToInstance(Space, result);
	}

	async findUnique(args: Prisma.SpaceFindUniqueArgs): Promise<Space> {
		this.logger.debug(`Space 고유 조회 중...`);
		const result = await this.prisma.space.findUnique(args);
		return plainToInstance(Space, result);
	}

	async createManyAndReturn(
		args: Prisma.SpaceCreateManyAndReturnArgs,
	): Promise<Space[]> {
		this.logger.debug(`Space 다중 생성 중...`);
		const result = await this.prisma.space.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Space, item));
	}

	async deleteMany(
		args: Prisma.SpaceDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Space 다중 삭제 중...`);
		return await this.prisma.space.deleteMany(args);
	}

	async aggregate(
		args: Prisma.SpaceAggregateArgs,
	): Promise<Prisma.GetSpaceAggregateType<typeof args>> {
		this.logger.debug(`Space 집계 중...`);
		return await this.prisma.space.aggregate(args);
	}

	async count(args: Prisma.SpaceCountArgs): Promise<number> {
		this.logger.debug(`Space 개수 세기 중...`);
		return await this.prisma.space.count(args);
	}
}
