import { Subject } from "@cocrepo/entity";
import { CreateSubjectParams, SubjectsRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

/**
 * Subject 서비스 에러 메시지
 */
const SubjectServiceErrorMessages = {
	SUBJECT_NOT_FOUND: "Subject를 찾을 수 없습니다",
	PARENT_NOT_FOUND: "부모 Subject를 찾을 수 없습니다",
	INVALID_SUBJECT_DATA: "유효하지 않은 Subject 데이터입니다",
} as const;

@Injectable()
export class SubjectsService {
	private readonly logger = new Logger(SubjectsService.name);

	constructor(private readonly repository: SubjectsRepository) {}

	/**
	 * 모든 Subject 조회
	 * Tenant에 속한 모든 Subject를 조회합니다.
	 *
	 * @param tenantId - Tenant ID (현재 구현에서는 removedAt=null 조건만 사용)
	 * @returns 모든 Subject 배열
	 */
	async getAllSubjects(tenantId: string): Promise<Subject[]> {
		this.logger.debug(`모든 Subject 조회: tenantId=${tenantId.slice(-8)}`);

		// Repository의 findAll 메서드 호출
		// 참고: 현재 Repository는 tenantId 필터를 지원하지 않으므로,
		// 향후 필요시 findAll에 tenantId 필터 추가 필요
		const subjects = await this.repository.findAll();

		return subjects;
	}

	/**
	 * Subject 계층 구조 조회
	 * parentId가 제공되면 해당 부모의 하위 트리를 반환하고,
	 * parentId가 없으면 최상위 Subject와 그 자식들을 반환합니다.
	 *
	 * @param tenantId - Tenant ID
	 * @param parentId - 부모 Subject ID (선택)
	 * @returns 계층 구조를 포함한 Subject 배열
	 */
	async getSubjectTree(
		tenantId: string,
		parentId?: string,
	): Promise<Subject[]> {
		this.logger.debug(
			`Subject 계층 조회: tenantId=${tenantId.slice(-8)}, parentId=${parentId ? parentId.slice(-8) : "null (root)"}`,
		);

		let subjects: Subject[];

		if (parentId) {
			// 특정 부모의 전체 하위 트리 조회 (재귀)
			subjects = await this.repository.findTreeByParentId(parentId);
		} else {
			// 최상위 Subject와 직접 자식들 조회
			subjects = await this.repository.findWithChildren();
		}

		return subjects;
	}

	/**
	 * Subject 생성
	 * parentId가 제공된 경우 부모 Subject의 존재를 검증합니다.
	 *
	 * @param dto - Subject 생성 파라미터
	 * @returns 생성된 Subject
	 * @throws NotFoundException - 부모 Subject를 찾을 수 없는 경우
	 * @throws BadRequestException - 유효하지 않은 데이터인 경우
	 */
	async createSubject(dto: CreateSubjectParams): Promise<Subject> {
		this.logger.debug(`Subject 생성: name=${dto.name}, type=${dto.type}`);

		// 1. 유효성 검증
		if (!dto.name || !dto.type || !dto.tenantId) {
			throw new BadRequestException(
				SubjectServiceErrorMessages.INVALID_SUBJECT_DATA,
			);
		}

		// 2. parentId가 제공된 경우 부모 존재 확인
		if (dto.parentId) {
			const parent = await this.repository.findById(dto.parentId);

			if (!parent) {
				throw new NotFoundException(
					SubjectServiceErrorMessages.PARENT_NOT_FOUND,
				);
			}

			this.logger.debug(
				`부모 Subject 확인 완료: parentId=${dto.parentId.slice(-8)}`,
			);
		}

		// 3. Subject 생성
		const subject = await this.repository.create(dto);

		this.logger.log(
			`Subject 생성 완료: id=${subject.id.slice(-8)}, name=${subject.name}`,
		);

		return subject;
	}
}
