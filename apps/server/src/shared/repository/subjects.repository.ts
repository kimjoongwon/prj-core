import { Subject } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
export class SubjectsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Subject");
	}

	async create(args: Prisma.SubjectCreateArgs): Promise<Subject> {
		this.logger.debug(`Subject 생성 중...`);
		const result = await this.prisma.subject.create(args);
		return plainToInstance(Subject, result);
	}

	async upsert(args: Prisma.SubjectUpsertArgs): Promise<Subject> {
		this.logger.debug(`Subject 업서트 중...`);
		const result = await this.prisma.subject.upsert(args);
		return plainToInstance(Subject, result);
	}

	async update(args: Prisma.SubjectUpdateArgs): Promise<Subject> {
		this.logger.debug(`Subject 업데이트 중...`);
		const result = await this.prisma.subject.update(args);
		return plainToInstance(Subject, result);
	}

	async updateMany(
		args: Prisma.SubjectUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Subject 다중 업데이트 중...`);
		return await this.prisma.subject.updateMany(args);
	}

	async delete(args: Prisma.SubjectDeleteArgs): Promise<Subject> {
		this.logger.debug(`Subject 삭제 중...`);
		const result = await this.prisma.subject.delete(args);
		return plainToInstance(Subject, result);
	}

	async findMany(args: Prisma.SubjectFindManyArgs): Promise<Subject[]> {
		this.logger.debug(`Subject 다중 조회 중...`);
		const result = await this.prisma.subject.findMany(args);
		return result.map((item) => plainToInstance(Subject, item));
	}

	async findFirst(args: Prisma.SubjectFindFirstArgs): Promise<Subject> {
		this.logger.debug(`Subject 최초 조회 중...`);
		const result = await this.prisma.subject.findFirst(args);
		return plainToInstance(Subject, result);
	}

	async findUnique(args: Prisma.SubjectFindUniqueArgs): Promise<Subject> {
		this.logger.debug(`Subject 고유 조회 중...`);
		const result = await this.prisma.subject.findUnique(args);
		return plainToInstance(Subject, result);
	}

	async createManyAndReturn(
		args: Prisma.SubjectCreateManyAndReturnArgs,
	): Promise<Subject[]> {
		this.logger.debug(`Subject 다중 생성 중...`);
		const result = await this.prisma.subject.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Subject, item));
	}

	async deleteMany(
		args: Prisma.SubjectDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Subject 다중 삭제 중...`);
		return await this.prisma.subject.deleteMany(args);
	}

	async aggregate(
		args: Prisma.SubjectAggregateArgs,
	): Promise<Prisma.GetSubjectAggregateType<typeof args>> {
		this.logger.debug(`Subject 집계 중...`);
		return await this.prisma.subject.aggregate(args);
	}

	async count(args: Prisma.SubjectCountArgs): Promise<number> {
		this.logger.debug(`Subject 개수 세기 중...`);
		return await this.prisma.subject.count(args);
	}
}
