import { ColumnDefinition } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { ColumnDefinitionsRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

/**
 * ColumnDefinitions 서비스 에러 메시지
 */
const ColumnDefinitionsServiceErrorMessages = {
	COLUMN_NOT_FOUND: "컬럼 정의를 찾을 수 없습니다",
	INVALID_DEVICE_TYPE: "유효하지 않은 디바이스 타입입니다",
	COLUMNS_ALREADY_EXIST: "이미 초기화된 엔티티입니다",
} as const;

/**
 * 디바이스 타입
 */
export type DeviceType = "desktop" | "tablet" | "mobile";

@Injectable()
export class ColumnDefinitionsService {
	private readonly logger = new Logger(ColumnDefinitionsService.name);

	constructor(private readonly repository: ColumnDefinitionsRepository) {}

	/**
	 * 엔티티의 컬럼 정의 조회 (디바이스별 필터링 지원)
	 * 비즈니스 로직:
	 * 1. Repository에서 엔티티의 모든 컬럼 조회
	 * 2. 디바이스 타입이 지정된 경우, 가시성 기반 필터링
	 *    - isRequired = true인 컬럼은 항상 포함
	 *    - 디바이스별 visibility 플래그 확인
	 * 3. sortOrder 기준으로 정렬된 결과 반환
	 *
	 * @param entity - 엔티티 이름
	 * @param spaceId - Space ID
	 * @param deviceType - 디바이스 타입 (선택)
	 * @returns 필터링 및 정렬된 컬럼 정의 배열
	 */
	async getColumnsByEntity(
		entity: string,
		spaceId: string,
		deviceType?: DeviceType,
	): Promise<ColumnDefinition[]> {
		this.logger.debug(
			`엔티티 컬럼 조회: entity=${entity}, spaceId=${spaceId.slice(-8)}, deviceType=${deviceType ?? "all"}`,
		);

		// 1. Repository에서 컬럼 조회
		const columns = await this.repository.findManyByEntityAndSpaceIdWithSubject(
			entity,
			spaceId,
		);

		// 2. 디바이스 타입별 필터링
		if (deviceType) {
			return this.filterByDeviceType(columns, deviceType);
		}

		// 3. 전체 컬럼 반환 (이미 sortOrder 기준 정렬됨)
		return columns;
	}

	/**
	 * ID로 컬럼 정의 조회
	 * 비즈니스 로직:
	 * 1. Repository에서 ID로 조회
	 * 2. 존재하지 않으면 NotFoundException
	 *
	 * @param id - ColumnDefinition ID
	 * @returns 컬럼 정의
	 * @throws NotFoundException - 컬럼 정의를 찾을 수 없는 경우
	 */
	async getColumnById(id: string): Promise<ColumnDefinition> {
		this.logger.debug(`컬럼 정의 조회: id=${id.slice(-8)}`);

		const column = await this.repository.findByIdWithSpaceAndSubject(id);

		if (!column) {
			throw new NotFoundException(
				ColumnDefinitionsServiceErrorMessages.COLUMN_NOT_FOUND,
			);
		}

		return column;
	}

	/**
	 * 컬럼 정의 생성
	 * 비즈니스 로직:
	 * 1. Repository를 통해 컬럼 정의 생성
	 * 2. 생성 로그 기록
	 *
	 * @param data - 컬럼 정의 생성 데이터
	 * @returns 생성된 컬럼 정의
	 */
	async createColumn(
		data: Prisma.ColumnDefinitionUncheckedCreateInput,
	): Promise<ColumnDefinition> {
		this.logger.debug(
			`컬럼 정의 생성: entity=${data.entity}, field=${data.field}`,
		);

		const column = await this.repository.create(data);

		this.logger.log(
			`컬럼 정의 생성 완료: id=${column.id.slice(-8)}, entity=${data.entity}, field=${data.field}`,
		);

		return column;
	}

	/**
	 * 컬럼 정의 수정
	 * 비즈니스 로직:
	 * 1. 컬럼 존재 여부 확인
	 * 2. Repository를 통해 업데이트
	 * 3. 업데이트 로그 기록
	 *
	 * @param id - ColumnDefinition ID
	 * @param data - 수정할 컬럼 정의 데이터
	 * @returns 수정된 컬럼 정의
	 * @throws NotFoundException - 컬럼 정의를 찾을 수 없는 경우
	 */
	async updateColumn(
		id: string,
		data: Prisma.ColumnDefinitionUncheckedUpdateInput,
	): Promise<ColumnDefinition> {
		this.logger.debug(`컬럼 정의 수정: id=${id.slice(-8)}`);

		// 컬럼 존재 확인
		await this.getColumnById(id);

		// 업데이트
		const updatedColumn = await this.repository.updateById(id, data);

		this.logger.log(`컬럼 정의 수정 완료: id=${id.slice(-8)}`);

		return updatedColumn;
	}

	/**
	 * 컬럼 정의 삭제 (Soft Delete)
	 * 비즈니스 로직:
	 * 1. Repository를 통해 소프트 삭제
	 * 2. 삭제 로그 기록
	 *
	 * @param id - ColumnDefinition ID
	 * @returns 삭제된 컬럼 정의
	 */
	async deleteColumn(id: string): Promise<ColumnDefinition> {
		this.logger.debug(`컬럼 정의 삭제: id=${id.slice(-8)}`);

		const deletedColumn = await this.repository.removeById(id);

		this.logger.log(`컬럼 정의 삭제 완료: id=${id.slice(-8)}`);

		return deletedColumn;
	}

	/**
	 * 기본 컬럼 정의 초기화
	 * 비즈니스 로직:
	 * 1. 해당 엔티티의 컬럼 정의가 이미 존재하는지 확인
	 * 2. 존재하지 않으면 기본 컬럼 정의 생성
	 * 3. 생성된 개수 반환
	 *
	 * @param entity - 엔티티 이름
	 * @param spaceId - Space ID
	 * @param columns - 생성할 기본 컬럼 정의 배열
	 * @returns 생성된 컬럼 개수
	 * @throws BadRequestException - 이미 초기화된 엔티티인 경우
	 */
	async initializeDefaultColumns(
		entity: string,
		spaceId: string,
		columns: Prisma.ColumnDefinitionCreateManyInput[],
	): Promise<number> {
		this.logger.debug(
			`기본 컬럼 정의 초기화: entity=${entity}, spaceId=${spaceId.slice(-8)}, count=${columns.length}`,
		);

		// 1. 이미 존재하는지 확인
		const existingColumns =
			await this.repository.findManyByEntityAndSpaceIdWithSubject(
				entity,
				spaceId,
			);

		if (existingColumns.length > 0) {
			throw new BadRequestException(
				ColumnDefinitionsServiceErrorMessages.COLUMNS_ALREADY_EXIST,
			);
		}

		// 2. 기본 컬럼 정의 생성
		const count = await this.repository.createMany(columns);

		this.logger.log(
			`기본 컬럼 정의 초기화 완료: entity=${entity}, spaceId=${spaceId.slice(-8)}, count=${count}`,
		);

		return count;
	}

	/**
	 * Space의 모든 엔티티 조회
	 * 비즈니스 로직:
	 * 1. Repository를 통해 Space의 모든 엔티티 목록 조회
	 * 2. 중복 제거된 엔티티 이름 배열 반환
	 *
	 * @param spaceId - Space ID
	 * @returns 엔티티 이름 배열
	 */
	async getEntitiesBySpace(spaceId: string): Promise<string[]> {
		this.logger.debug(`Space의 엔티티 조회: spaceId=${spaceId.slice(-8)}`);

		return this.repository.findDistinctEntitiesBySpaceId(spaceId);
	}

	/**
	 * 디바이스 타입별 컬럼 필터링 (Private Helper)
	 * 비즈니스 로직:
	 * - isRequired = true인 컬럼은 항상 포함
	 * - 디바이스별 visibility 플래그에 따라 필터링
	 *
	 * @param columns - 원본 컬럼 배열
	 * @param deviceType - 디바이스 타입
	 * @returns 필터링된 컬럼 배열
	 */
	private filterByDeviceType(
		columns: ColumnDefinition[],
		deviceType: DeviceType,
	): ColumnDefinition[] {
		return columns.filter((col) => {
			// 필수 컬럼은 항상 표시
			if (col.isRequired) return true;

			// 디바이스별 가시성 확인
			switch (deviceType) {
				case "desktop":
					return col.visibleOnDesktop;
				case "tablet":
					return col.visibleOnTablet;
				case "mobile":
					return col.visibleOnMobile;
				default:
					return true;
			}
		});
	}
}
