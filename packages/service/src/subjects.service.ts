import { Subject } from "@cocrepo/entity";
import { getDmmfParser } from "@cocrepo/prisma";
import { SubjectsRepository } from "@cocrepo/repository";
import { Injectable, Logger } from "@nestjs/common";

/**
 * Subject 정보 (DB 기반)
 */
export interface SubjectInfo {
	/** Subject ID */
	id: string;
	/** Subject 이름 (예: User, menu:dashboard, entity:User) */
	name: string;
	/** 표시명 (@displayName 주석) */
	displayName: string | null;
	/** 아이콘 */
	icon: string | null;
	/** 그룹 (all, entity, menu, feature) */
	group: string | null;
	/** 정렬 순서 */
	order: number;
	/** 시스템 생성 여부 */
	isSystem: boolean;
	/** 필드 목록 (엔티티 Subject의 경우) */
	fields: SubjectFieldInfo[];
}

/**
 * Subject 필드 정보
 */
export interface SubjectFieldInfo {
	/** 필드명 */
	name: string;
	/** 표시명 (@displayName 주석) */
	displayName: string | null;
	/** 필드 타입 */
	type: string;
	/** 필수 여부 */
	isRequired: boolean;
	/** 관계 필드 여부 */
	isRelation: boolean;
}

/**
 * Subject 서비스 (Repository 기반)
 *
 * Subject 테이블에서 조회하며, 필드 정보는 DMMF에서 가져옵니다.
 */
@Injectable()
export class SubjectsService {
	private readonly logger = new Logger(SubjectsService.name);
	private cachedFieldsByModel: Map<string, SubjectFieldInfo[]> | null = null;

	constructor(private readonly repository: SubjectsRepository) {}

	/**
	 * 모든 Subject 조회
	 *
	 * @returns Subject 배열
	 */
	async getSubjects(): Promise<SubjectInfo[]> {
		this.logger.debug("모든 Subject 조회");

		const subjects = await this.repository.findAll();

		// 필드 정보 캐시 로드
		await this.loadFieldsCache();

		return subjects.map((subject) => this.toSubjectInfo(subject));
	}

	/**
	 * 그룹별 Subject 조회
	 *
	 * @param group - 그룹명 (all, entity, menu, feature)
	 * @returns Subject 배열
	 */
	async getSubjectsByGroup(group: string): Promise<SubjectInfo[]> {
		this.logger.debug(`그룹별 Subject 조회: ${group}`);

		const subjects = await this.repository.findByGroup(group);

		await this.loadFieldsCache();

		return subjects.map((subject) => this.toSubjectInfo(subject));
	}

	/**
	 * Subject ID로 조회
	 *
	 * @param id - Subject ID
	 * @returns Subject 정보 또는 null
	 */
	async getSubjectById(id: string): Promise<SubjectInfo | null> {
		this.logger.debug(`Subject ID로 조회: ${id}`);

		const subject = await this.repository.findById(id);

		if (!subject) {
			return null;
		}

		await this.loadFieldsCache();

		return this.toSubjectInfo(subject);
	}

	/**
	 * Subject 이름으로 조회
	 *
	 * @param name - Subject 이름
	 * @returns Subject 정보 또는 null
	 */
	async getSubjectByName(name: string): Promise<SubjectInfo | null> {
		this.logger.debug(`Subject 조회: ${name}`);

		const subject = await this.repository.findByName(name);

		if (!subject) {
			return null;
		}

		await this.loadFieldsCache();

		return this.toSubjectInfo(subject);
	}

	/**
	 * Subject 이름 목록 조회
	 *
	 * @returns Subject 이름 배열
	 */
	async getSubjectNames(): Promise<string[]> {
		const subjects = await this.repository.findAll();
		return subjects.map((s) => s.name);
	}

	/**
	 * 특정 Subject의 필드 목록 조회
	 *
	 * @param subjectName - Subject 이름 (Prisma 모델명)
	 * @returns 필드 정보 배열
	 */
	async getSubjectFields(subjectName: string): Promise<SubjectFieldInfo[]> {
		this.logger.debug(`Subject 필드 조회: ${subjectName}`);

		await this.loadFieldsCache();
		return this.getFieldsForSubject(subjectName);
	}

	/**
	 * 유효한 Subject인지 확인
	 *
	 * @param subjectName - Subject 이름
	 * @returns 유효 여부
	 */
	async isValidSubject(subjectName: string): Promise<boolean> {
		const subject = await this.repository.findByName(subjectName);
		return !!subject;
	}

	/**
	 * Subject ID로 이름 조회
	 *
	 * @param id - Subject ID
	 * @returns Subject 이름 또는 null
	 */
	async getSubjectNameById(id: string): Promise<string | null> {
		const subject = await this.repository.findById(id);
		return subject?.name ?? null;
	}

	/**
	 * Subject 이름으로 ID 조회
	 *
	 * @param name - Subject 이름
	 * @returns Subject ID 또는 null
	 */
	async getSubjectIdByName(name: string): Promise<string | null> {
		const subject = await this.repository.findByName(name);
		return subject?.id ?? null;
	}

	/**
	 * Subject Entity를 SubjectInfo로 변환
	 */
	private toSubjectInfo(subject: Subject): SubjectInfo {
		return {
			id: subject.id,
			name: subject.name,
			displayName: subject.displayName,
			icon: subject.icon,
			group: subject.group,
			order: subject.order,
			isSystem: subject.isSystem,
			fields: this.getFieldsForSubject(subject.name),
		};
	}

	/**
	 * DMMF에서 필드 정보 캐시 로드
	 */
	private async loadFieldsCache(): Promise<void> {
		if (this.cachedFieldsByModel) {
			return;
		}

		this.cachedFieldsByModel = new Map();

		try {
			const parser = await getDmmfParser();
			const models = parser.parseModels();

			for (const model of models) {
				const fields = parser.parseFieldsByModel(model.name);
				this.cachedFieldsByModel.set(
					model.name,
					fields.map((field) => ({
						name: field.name,
						displayName: field.displayName,
						type: "String", // DMMF FieldInfo에 type이 없으므로 기본값 사용
						isRequired: false,
						isRelation: false,
					})),
				);
			}
		} catch (error) {
			this.logger.warn("DMMF 파싱 실패, 필드 정보를 로드할 수 없습니다.", error);
		}
	}

	/**
	 * Subject 이름에서 필드 정보 가져오기
	 *
	 * @param subjectName - Subject 이름
	 * @returns 필드 정보 배열
	 */
	private getFieldsForSubject(subjectName: string): SubjectFieldInfo[] {
		if (!this.cachedFieldsByModel) {
			return [];
		}

		// entity:User 형태인 경우 모델명 추출
		if (subjectName.startsWith("entity:")) {
			const modelName = subjectName.substring(7); // "entity:" 제거
			return this.cachedFieldsByModel.get(modelName) ?? [];
		}

		// 직접 모델명인 경우
		return this.cachedFieldsByModel.get(subjectName) ?? [];
	}

	/**
	 * 캐시 초기화
	 */
	clearCache(): void {
		this.cachedFieldsByModel = null;
		this.logger.debug("Subject 필드 캐시 초기화됨");
	}
}
