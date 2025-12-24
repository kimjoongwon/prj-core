import { Session } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PRISMA_SERVICE_TOKEN } from "../constants/tokens";
import type { IPrismaClient } from "../types/prisma-client.interface";

@Injectable()
export class SessionsRepository {
	private readonly logger: Logger;

	constructor(
		@Inject(PRISMA_SERVICE_TOKEN)
		private readonly prisma: IPrismaClient
	) {
		this.logger = new Logger("Session");
	}

	async create(args: Prisma.SessionCreateArgs): Promise<Session> {
		this.logger.debug(`Session 생성 중...`);
		const result = await this.prisma.session.create(args);
		return plainToInstance(Session, result);
	}

	async upsert(args: Prisma.SessionUpsertArgs): Promise<Session> {
		this.logger.debug(`Session 업서트 중...`);
		const result = await this.prisma.session.upsert(args);
		return plainToInstance(Session, result);
	}

	async update(args: Prisma.SessionUpdateArgs): Promise<Session> {
		this.logger.debug(`Session 업데이트 중...`);
		const result = await this.prisma.session.update(args);
		return plainToInstance(Session, result);
	}

	async updateMany(
		args: Prisma.SessionUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Session 다중 업데이트 중...`);
		return await this.prisma.session.updateMany(args);
	}

	async delete(args: Prisma.SessionDeleteArgs): Promise<Session> {
		this.logger.debug(`Session 삭제 중...`);
		const result = await this.prisma.session.delete(args);
		return plainToInstance(Session, result);
	}

	async findMany(args: Prisma.SessionFindManyArgs): Promise<Session[]> {
		this.logger.debug(`Session 다중 조회 중...`);
		const result = await this.prisma.session.findMany(args);
		return result.map((item) => plainToInstance(Session, item));
	}

	async findFirst(args: Prisma.SessionFindFirstArgs): Promise<Session> {
		this.logger.debug(`Session 최초 조회 중...`);
		const result = await this.prisma.session.findFirst(args);
		return plainToInstance(Session, result);
	}

	async findUnique(args: Prisma.SessionFindUniqueArgs): Promise<Session> {
		this.logger.debug(`Session 고유 조회 중...`);
		const result = await this.prisma.session.findUnique(args);
		return plainToInstance(Session, result);
	}

	async createManyAndReturn(
		args: Prisma.SessionCreateManyAndReturnArgs,
	): Promise<Session[]> {
		this.logger.debug(`Session 다중 생성 중...`);
		const result = await this.prisma.session.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Session, item));
	}

	async deleteMany(
		args: Prisma.SessionDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Session 다중 삭제 중...`);
		return await this.prisma.session.deleteMany(args);
	}

	async aggregate(
		args: Prisma.SessionAggregateArgs,
	): Promise<Prisma.GetSessionAggregateType<typeof args>> {
		this.logger.debug(`Session 집계 중...`);
		return await this.prisma.session.aggregate(args);
	}

	async count(args: Prisma.SessionCountArgs): Promise<number> {
		this.logger.debug(`Session 개수 세기 중...`);
		return await this.prisma.session.count(args);
	}
}
