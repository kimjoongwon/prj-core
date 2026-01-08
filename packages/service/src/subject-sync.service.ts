import { Subject } from "@cocrepo/entity";
import {
	getDmmfParser,
	type FieldInfo,
	type ModelInfo,
	SubjectTypes,
} from "@cocrepo/prisma";
import { SubjectsRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";

/**
 * 동기화 결과
 */
export interface SyncResult {
	/** 새로 생성된 Subject 수 */
	created: number;
	/** displayName이 업데이트된 Subject 수 */
	updated: number;
	/** 스킵된 Subject 수 (이미 존재하고 displayName이 설정된 경우) */
	skipped: number;
}

/**
 * Prisma 스키마에서 Entity/Column Subject를 동기화하는 서비스
 *
 * 앱 부트스트랩 시 Prisma DMMF를 파싱하여 Subject 테이블에 동기화합니다.
 * - 새로운 Entity/Column → INSERT
 * - displayName 변경 (DB값 null) → UPDATE
 * - displayName 변경 (DB값 있음) → SKIP (관리자 오버라이드 유지)
 */
@Injectable()
export class SubjectSyncService {
	private readonly logger = new Logger(SubjectSyncService.name);

	constructor(private readonly repository: SubjectsRepository) {}

	/**
	 * Prisma 스키마에서 Entity/Column Subject를 동기화합니다.
	 *
	 * @param tenantId - 시스템 테넌트 ID
	 * @returns 동기화 결과 (생성/업데이트/스킵 수)
	 */
	async syncFromSchema(tenantId: string): Promise<SyncResult> {
		this.logger.log("Subject 동기화 시작...");

		const result: SyncResult = {
			created: 0,
			updated: 0,
			skipped: 0,
		};

		const parser = await getDmmfParser();

		// 1. Entity Subject 동기화
		const models = parser.parseModels();
		await this.syncEntitySubjects(models, tenantId, result);

		// 2. Column Subject 동기화
		const fields = parser.parseFields();
		await this.syncColumnSubjects(fields, tenantId, result);

		this.logger.log(
			`Subject 동기화 완료: 생성=${result.created}, 업데이트=${result.updated}, 스킵=${result.skipped}`,
		);

		return result;
	}

	/**
	 * Entity Subject를 동기화합니다.
	 */
	private async syncEntitySubjects(
		models: ModelInfo[],
		tenantId: string,
		result: SyncResult,
	): Promise<void> {
		this.logger.debug(`Entity Subject 동기화: ${models.length}개 모델`);

		for (const model of models) {
			const subjectName = `entity:${model.name}`;
			await this.upsertSubject(
				{
					name: subjectName,
					type: SubjectTypes.Entity,
					displayName: model.displayName,
					tenantId,
				},
				result,
			);
		}
	}

	/**
	 * Column Subject를 동기화합니다.
	 */
	private async syncColumnSubjects(
		fields: FieldInfo[],
		tenantId: string,
		result: SyncResult,
	): Promise<void> {
		this.logger.debug(`Column Subject 동기화: ${fields.length}개 필드`);

		// Entity Subject를 먼저 조회하여 parentId 매핑
		const entitySubjects = await this.repository.findManyByType(
			SubjectTypes.Entity,
		);
		const entitySubjectMap = new Map<string, Subject>();
		for (const subject of entitySubjects) {
			// entity:User → User
			const modelName = subject.name.replace("entity:", "");
			entitySubjectMap.set(modelName, subject);
		}

		for (const field of fields) {
			const subjectName = `column:${field.modelName}.${field.name}`;
			const parentSubject = entitySubjectMap.get(field.modelName);

			await this.upsertSubject(
				{
					name: subjectName,
					type: SubjectTypes.Column,
					displayName: field.displayName,
					tenantId,
					parentId: parentSubject?.id ?? null,
				},
				result,
			);
		}
	}

	/**
	 * Subject를 upsert합니다.
	 *
	 * - 존재하지 않으면 생성
	 * - 존재하고 DB의 displayName이 null이면 업데이트
	 * - 존재하고 DB의 displayName이 있으면 스킵 (관리자 오버라이드 유지)
	 */
	private async upsertSubject(
		data: {
			name: string;
			type: SubjectTypes;
			displayName: string | null;
			tenantId: string;
			parentId?: string | null;
		},
		result: SyncResult,
	): Promise<void> {
		const existing = await this.repository.findByName(data.name);

		if (!existing) {
			// 새로 생성
			await this.repository.create({
				name: data.name,
				type: data.type,
				displayName: data.displayName,
				tenantId: data.tenantId,
				parentId: data.parentId ?? null,
			});
			result.created++;
			this.logger.debug(`Subject 생성: ${data.name}`);
		} else if (existing.displayName === null && data.displayName !== null) {
			// displayName이 null인 경우에만 업데이트
			await this.repository.updateById(existing.id, {
				displayName: data.displayName,
				// parentId도 업데이트 (Column Subject의 경우)
				...(data.parentId !== undefined && { parentId: data.parentId }),
			});
			result.updated++;
			this.logger.debug(
				`Subject displayName 업데이트: ${data.name} → ${data.displayName}`,
			);
		} else {
			// 이미 displayName이 설정된 경우 스킵
			result.skipped++;
		}
	}
}
