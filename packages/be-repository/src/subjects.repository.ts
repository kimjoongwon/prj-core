import { Subject } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class SubjectsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("SubjectsRepository");
	}

	/**
	 * 전체 Subject 목록 조회
	 */
	async findAll(): Promise<Subject[]> {
		this.logger.debug("전체 Subject 목록 조회");

		const results = await this.txHost.tx.subject.findMany({
			where: { removedAt: null },
			orderBy: [{ group: "asc" }, { order: "asc" }],
		});

		return toDomainEntity(Subject, results);
	}

	/**
	 * ID로 Subject 조회
	 */
	async findById(id: bigint): Promise<Subject | null> {
		this.logger.debug(`ID로 Subject 조회: ${id.toString()}`);

		const result = await this.txHost.tx.subject.findUnique({
			where: { id },
		});

		return result ? toDomainEntity(Subject, result) : null;
	}

	/**
	 * 이름으로 Subject 조회
	 */
	async findByName(name: string): Promise<Subject | null> {
		this.logger.debug(`이름으로 Subject 조회: ${name}`);

		const result = await this.txHost.tx.subject.findFirst({
			where: { name, removedAt: null },
		});

		return result ? toDomainEntity(Subject, result) : null;
	}

	/**
	 * 그룹별 Subject 조회
	 */
	async findByGroup(group: string): Promise<Subject[]> {
		this.logger.debug(`그룹별 Subject 조회: ${group}`);

		const results = await this.txHost.tx.subject.findMany({
			where: { group, removedAt: null },
			orderBy: { order: "asc" },
		});

		return toDomainEntity(Subject, results);
	}

	/**
	 * 패턴으로 Subject 검색 (예: 'menu:%', 'entity:%')
	 */
	async findByPattern(pattern: string): Promise<Subject[]> {
		this.logger.debug(`패턴으로 Subject 검색: ${pattern}`);

		const results = await this.txHost.tx.subject.findMany({
			where: {
				name: { startsWith: pattern.replace("%", "") },
				removedAt: null,
			},
			orderBy: { order: "asc" },
		});

		return toDomainEntity(Subject, results);
	}

	/**
	 * Subject 생성
	 */
	async create(data: Prisma.SubjectUncheckedCreateInput): Promise<Subject> {
		this.logger.debug(`Subject 생성: ${data.name}`);

		const result = await this.txHost.tx.subject.create({
			data,
		});

		return toDomainEntity(Subject, result);
	}

	/**
	 * Subject 수정
	 */
	async updateById(
		id: bigint,
		data: Prisma.SubjectUncheckedUpdateInput,
	): Promise<Subject> {
		this.logger.debug(`Subject 수정: ${id.toString()}`);

		const result = await this.txHost.tx.subject.update({
			where: { id },
			data,
		});

		return toDomainEntity(Subject, result);
	}

	/**
	 * Subject 소프트 삭제
	 */
	async removeById(id: bigint): Promise<Subject> {
		this.logger.debug(`Subject 삭제: ${id.toString()}`);

		const result = await this.txHost.tx.subject.update({
			where: { id },
			data: { removedAt: new Date() },
		});

		return toDomainEntity(Subject, result);
	}

	/**
	 * 여러 Subject ID로 조회
	 */
	async findByIds(ids: bigint[]): Promise<Subject[]> {
		this.logger.debug(`여러 ID로 Subject 조회: ${ids.length}개`);

		const results = await this.txHost.tx.subject.findMany({
			where: {
				id: { in: ids },
				removedAt: null,
			},
			orderBy: [{ group: "asc" }, { order: "asc" }],
		});

		return toDomainEntity(Subject, results);
	}
}
