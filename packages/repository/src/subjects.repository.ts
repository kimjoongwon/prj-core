import { Subject } from "@cocrepo/entity";
import { PrismaClient, SubjectTypes } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

/**
 * Subject 생성 파라미터
 */
export interface CreateSubjectParams {
	name: string;
	type: SubjectTypes;
	label?: string;
	description?: string;
	parentId?: string;
	tenantId: string;
	sortOrder?: number;
}

/**
 * Subject 수정 파라미터
 */
export interface UpdateSubjectParams {
	name?: string;
	type?: SubjectTypes;
	label?: string;
	description?: string;
	parentId?: string;
	sortOrder?: number;
}

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
	 * 모든 Subject 조회
	 */
	async findAll(): Promise<Subject[]> {
		this.logger.debug("모든 Subject 조회");

		const results = await this.txHost.tx.subject.findMany({
			where: { removedAt: null },
			orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
		});

		return results.map((result) => plainToInstance(Subject, result));
	}

	/**
	 * ID로 조회
	 */
	async findById(id: string): Promise<Subject | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.subject.findUnique({
			where: { id },
		});

		return result ? plainToInstance(Subject, result) : null;
	}

	/**
	 * ID로 조회 (관계 포함)
	 */
	async findByIdWithRelations(id: string): Promise<Subject | null> {
		this.logger.debug(`ID로 조회 (관계 포함): ${id.slice(-8)}`);

		const result = await this.txHost.tx.subject.findUnique({
			where: { id },
			include: {
				parent: true,
				children: {
					where: { removedAt: null },
					orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
				},
				abilities: {
					where: { removedAt: null },
					include: {
						role: true,
					},
				},
			},
		});

		return result ? plainToInstance(Subject, result) : null;
	}

	/**
	 * name으로 조회
	 */
	async findByName(name: string): Promise<Subject | null> {
		this.logger.debug(`name으로 조회: ${name}`);

		const result = await this.txHost.tx.subject.findFirst({
			where: { name, removedAt: null },
		});

		return result ? plainToInstance(Subject, result) : null;
	}

	/**
	 * 타입별 조회
	 */
	async findByType(type: SubjectTypes): Promise<Subject[]> {
		this.logger.debug(`타입별 조회: ${type}`);

		const results = await this.txHost.tx.subject.findMany({
			where: { type, removedAt: null },
			orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
		});

		return results.map((result) => plainToInstance(Subject, result));
	}

	/**
	 * 계층 구조 조회
	 * parentId가 null이면 root subjects 조회
	 */
	async findWithChildren(parentId?: string): Promise<Subject[]> {
		this.logger.debug(
			`계층 구조 조회: parentId=${parentId ? parentId.slice(-8) : "null (root)"}`,
		);

		const results = await this.txHost.tx.subject.findMany({
			where: {
				parentId: parentId || null,
				removedAt: null,
			},
			include: {
				children: {
					where: { removedAt: null },
					orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
				},
			},
			orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
		});

		return results.map((result) => plainToInstance(Subject, result));
	}

	/**
	 * 전체 하위 트리 조회 (재귀)
	 */
	async findTreeByParentId(parentId: string): Promise<Subject[]> {
		this.logger.debug(`전체 하위 트리 조회: parentId=${parentId.slice(-8)}`);

		// 재귀 CTE를 사용한 전체 하위 트리 조회
		const results = await this.txHost.tx.$queryRaw<Subject[]>`
			WITH RECURSIVE subject_tree AS (
				-- Base case: 직접 자식
				SELECT *
				FROM subjects
				WHERE parent_id = ${parentId}
				  AND removed_at IS NULL

				UNION ALL

				-- Recursive case: 자식의 자식
				SELECT s.*
				FROM subjects s
				INNER JOIN subject_tree st ON s.parent_id = st.id
				WHERE s.removed_at IS NULL
			)
			SELECT * FROM subject_tree
			ORDER BY sort_order ASC, created_at ASC
		`;

		return results.map((result) => plainToInstance(Subject, result));
	}

	/**
	 * Subject 생성
	 */
	async create(data: CreateSubjectParams): Promise<Subject> {
		this.logger.debug(`Subject 생성: name=${data.name}`);

		const result = await this.txHost.tx.subject.create({
			data: {
				name: data.name,
				type: data.type,
				label: data.label,
				description: data.description,
				parentId: data.parentId,
				tenantId: data.tenantId,
				sortOrder: data.sortOrder ?? 0,
			},
		});

		return plainToInstance(Subject, result);
	}

	/**
	 * Subject 수정
	 */
	async update(id: string, data: UpdateSubjectParams): Promise<Subject> {
		this.logger.debug(`Subject 수정: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.subject.update({
			where: { id },
			data: {
				name: data.name,
				type: data.type,
				label: data.label,
				description: data.description,
				parentId: data.parentId,
				sortOrder: data.sortOrder,
			},
		});

		return plainToInstance(Subject, result);
	}

	/**
	 * Subject 삭제 (Soft Delete)
	 */
	async delete(id: string): Promise<Subject> {
		this.logger.debug(`Subject 삭제: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.subject.update({
			where: { id },
			data: { removedAt: new Date() },
		});

		return plainToInstance(Subject, result);
	}
}
