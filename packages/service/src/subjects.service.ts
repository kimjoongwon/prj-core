import { getDmmfParser } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";

/**
 * Subject 정보 (Prisma 모델 기반)
 */
export interface SubjectInfo {
	/** 모델명 (예: User, Reservation) */
	name: string;
	/** 표시명 (@displayName 주석) */
	displayName: string | null;
	/** 필드 목록 */
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
 * Subject 서비스 (DMMF 기반)
 *
 * Prisma 스키마에서 동적으로 Subject(모델) 목록을 생성합니다.
 * DB에 저장하지 않고 런타임에 DMMF를 파싱합니다.
 */
@Injectable()
export class SubjectsService {
	private readonly logger = new Logger(SubjectsService.name);
	private cachedSubjects: SubjectInfo[] | null = null;

	/**
	 * 모든 Subject 조회
	 * Prisma 스키마의 모든 모델을 Subject로 반환합니다.
	 *
	 * @returns Subject 배열
	 */
	async getSubjects(): Promise<SubjectInfo[]> {
		this.logger.debug("모든 Subject 조회");

		if (this.cachedSubjects) {
			return this.cachedSubjects;
		}

		const parser = await getDmmfParser();
		const models = parser.parseModels();

		this.cachedSubjects = models.map((model) => {
			// 각 모델의 필드 정보 가져오기
			const fields = parser.parseFieldsByModel(model.name);

			return {
				name: model.name,
				displayName: model.displayName,
				fields: fields.map((field) => ({
					name: field.name,
					displayName: field.displayName,
					type: "String", // DMMF FieldInfo에 type이 없으므로 기본값 사용
					isRequired: false, // DMMF FieldInfo에 isRequired가 없으므로 기본값 사용
					isRelation: false, // parseFieldsByModel은 관계 필드를 제외함
				})),
			};
		});

		// 'all' Subject 추가 (모든 모델에 대한 권한)
		this.cachedSubjects.unshift({
			name: "all",
			displayName: "전체",
			fields: [],
		});

		return this.cachedSubjects;
	}

	/**
	 * Subject 이름 목록 조회
	 *
	 * @returns Subject 이름 배열
	 */
	async getSubjectNames(): Promise<string[]> {
		const subjects = await this.getSubjects();
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

		if (subjectName === "all") {
			return [];
		}

		const subjects = await this.getSubjects();
		const subject = subjects.find((s) => s.name === subjectName);

		if (!subject) {
			this.logger.warn(`Subject를 찾을 수 없음: ${subjectName}`);
			return [];
		}

		return subject.fields;
	}

	/**
	 * 유효한 Subject인지 확인
	 *
	 * @param subjectName - Subject 이름
	 * @returns 유효 여부
	 */
	async isValidSubject(subjectName: string): Promise<boolean> {
		const subjectNames = await this.getSubjectNames();
		return subjectNames.includes(subjectName);
	}

	/**
	 * 캐시 초기화
	 */
	clearCache(): void {
		this.cachedSubjects = null;
		this.logger.debug("Subject 캐시 초기화됨");
	}
}
