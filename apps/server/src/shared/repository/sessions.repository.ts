import { UseEntity } from "@cocrepo/decorator";
import { Session } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(Session)
export class SessionsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Session");
	}

	async create(args: any): Promise<Session> {
		this.logger.debug(`Session 생성 중...`);
		const result = await this.prisma.session.create(args);
		return plainToInstance(Session, result);
	}

	async upsert(args: any): Promise<Session> {
		this.logger.debug(`Session 업서트 중...`);
		const result = await this.prisma.session.upsert(args);
		return plainToInstance(Session, result);
	}

	async update(args: any): Promise<Session> {
		this.logger.debug(`Session 업데이트 중...`);
		const result = await this.prisma.session.update(args);
		return plainToInstance(Session, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`Session 다중 업데이트 중...`);
		return await this.prisma.session.updateMany(args);
	}

	async delete(args: any): Promise<Session> {
		this.logger.debug(`Session 삭제 중...`);
		const result = await this.prisma.session.delete(args);
		return plainToInstance(Session, result);
	}

	async findMany(args: any): Promise<Session[]> {
		this.logger.debug(`Session 다중 조회 중...`);
		const result = await this.prisma.session.findMany(args);
		return result.map((item) => plainToInstance(Session, item));
	}

	async findFirst(args: any): Promise<Session> {
		this.logger.debug(`Session 최초 조회 중...`);
		const result = await this.prisma.session.findFirst(args);
		return plainToInstance(Session, result);
	}

	async findUnique(args: any): Promise<Session> {
		this.logger.debug(`Session 고유 조회 중...`);
		const result = await this.prisma.session.findUnique(args);
		return plainToInstance(Session, result);
	}


	async createManyAndReturn(
		args: any,
	): Promise<Session[]> {
		this.logger.debug(`Session 다중 생성 중...`);
		const result = await this.prisma.session.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Session, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`Session 다중 삭제 중...`);
		return await this.prisma.session.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`Session 집계 중...`);
		return await this.prisma.session.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`Session 개수 세기 중...`);
		return await this.prisma.session.count(args);
	}
}
