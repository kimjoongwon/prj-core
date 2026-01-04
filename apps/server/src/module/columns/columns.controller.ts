import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	ColumnDefinitionResponseDto,
	CreateColumnDefinitionDto,
	UpdateColumnDefinitionDto,
} from "@cocrepo/dto";
import type { ColumnDefinitionsService } from "@cocrepo/service";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Logger,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UnauthorizedException,
} from "@nestjs/common";
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import type { ClsService } from "nestjs-cls";

/**
 * ColumnDefinitions 에러 메시지 상수
 */
const ColumnDefinitionsErrorMessages = {
	SPACE_NOT_SELECTED:
		"Space가 선택되지 않았습니다. X-Space-ID 헤더를 확인해주세요.",
	COLUMN_NOT_FOUND: "컬럼 정의를 찾을 수 없습니다",
	INVALID_DEVICE_TYPE: "유효하지 않은 디바이스 타입입니다",
	COLUMNS_ALREADY_EXIST: "이미 초기화된 엔티티입니다",
} as const;

/**
 * 디바이스 타입
 */
type DeviceType = "desktop" | "tablet" | "mobile";

@ApiTags("COLUMN_DEFINITIONS")
@Controller("api/v1/columns")
export class ColumnsController {
	private readonly logger = new Logger(ColumnsController.name);

	constructor(
		private readonly service: ColumnDefinitionsService,
		private readonly cls: ClsService,
	) {}

	/**
	 * 현재 요청의 Space ID를 가져옵니다.
	 * X-Space-ID 헤더에서 추출됩니다.
	 */
	private getSpaceId(): string {
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException(
				ColumnDefinitionsErrorMessages.SPACE_NOT_SELECTED,
			);
		}
		return spaceId;
	}

	@Get("entities/list")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: "Space의 엔티티 목록 조회",
		description:
			"현재 Space에 정의된 모든 엔티티 이름 목록을 조회합니다. 중복 제거되어 반환됩니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: ColumnDefinitionsErrorMessages.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(String, HttpStatus.OK, { isArray: true })
	@ResponseMessage("엔티티 목록 조회 성공")
	async getEntities(): Promise<string[]> {
		const spaceId = this.getSpaceId();

		this.logger.debug(`엔티티 목록 조회 요청: spaceId=${spaceId.slice(-8)}`);

		return this.service.getEntitiesBySpace(spaceId);
	}

	@Get("id/:id")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: "ID로 컬럼 정의 조회",
		description:
			"특정 컬럼 정의를 ID로 조회합니다. Space 및 Subject 관계를 포함합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Column Definition ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 404, message: ColumnDefinitionsErrorMessages.COLUMN_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(ColumnDefinitionResponseDto, HttpStatus.OK)
	@ResponseMessage("컬럼 정의 조회 성공")
	async getColumnById(
		@Param("id", ParseUUIDPipe) id: string,
	): Promise<ColumnDefinitionResponseDto> {
		this.logger.debug(`컬럼 정의 조회 요청: id=${id.slice(-8)}`);

		const column = await this.service.getColumnById(id);

		return plainToInstance(ColumnDefinitionResponseDto, column, {
			excludeExtraneousValues: true,
		});
	}

	@Get(":entity")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: "엔티티의 컬럼 정의 조회",
		description:
			"특정 엔티티의 모든 컬럼 정의를 조회합니다. 디바이스 타입별 필터링을 지원하며, sortOrder 기준으로 정렬됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "entity",
		description: "Entity name (User, Reservation 등)",
		type: String,
	})
	@ApiQuery({
		name: "deviceType",
		description: "디바이스 타입 (선택적)",
		required: false,
		enum: ["desktop", "tablet", "mobile"],
	})
	@ApiErrors(
		{ status: 401, message: ColumnDefinitionsErrorMessages.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(ColumnDefinitionResponseDto, HttpStatus.OK, {
		isArray: true,
	})
	@ResponseMessage("컬럼 정의 목록 조회 성공")
	async getColumnsByEntity(
		@Param("entity") entity: string,
		@Query("deviceType") deviceType?: DeviceType,
	): Promise<ColumnDefinitionResponseDto[]> {
		const spaceId = this.getSpaceId();

		this.logger.debug(
			`엔티티 컬럼 조회 요청: entity=${entity}, spaceId=${spaceId.slice(-8)}, deviceType=${deviceType ?? "all"}`,
		);

		const columns = await this.service.getColumnsByEntity(
			entity,
			spaceId,
			deviceType,
		);

		return columns.map((column) =>
			plainToInstance(ColumnDefinitionResponseDto, column, {
				excludeExtraneousValues: true,
			}),
		);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: "컬럼 정의 생성",
		description:
			"새로운 컬럼 정의를 생성합니다. spaceId는 X-Space-ID 헤더에서 자동으로 추출됩니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateColumnDefinitionDto,
		description: "컬럼 정의 생성 데이터",
	})
	@ApiErrors(
		{ status: 401, message: ColumnDefinitionsErrorMessages.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(ColumnDefinitionResponseDto, HttpStatus.CREATED)
	@ResponseMessage("컬럼 정의 생성 성공")
	async createColumn(
		@Body() body: CreateColumnDefinitionDto,
	): Promise<ColumnDefinitionResponseDto> {
		const spaceId = this.getSpaceId();

		this.logger.debug(
			`컬럼 정의 생성 요청: entity=${body.entity}, field=${body.field}, spaceId=${spaceId.slice(-8)}`,
		);

		const data = {
			entity: body.entity,
			field: body.field,
			label: body.label,
			spaceId,
			sortOrder: body.sortOrder,
			isRequired: body.isRequired,
			visibleOnDesktop: body.visibleOnDesktop,
			visibleOnTablet: body.visibleOnTablet,
			visibleOnMobile: body.visibleOnMobile,
			sortable: body.sortable,
			width: body.width,
			minWidth: body.minWidth,
			subjectId: body.subjectId,
		};

		const column = await this.service.createColumn(data);

		return plainToInstance(ColumnDefinitionResponseDto, column, {
			excludeExtraneousValues: true,
		});
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: "컬럼 정의 수정",
		description:
			"기존 컬럼 정의를 수정합니다. 변경하려는 필드만 전송하면 됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Column Definition ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateColumnDefinitionDto,
		description: "컬럼 정의 수정 데이터",
	})
	@ApiErrors(
		{ status: 404, message: ColumnDefinitionsErrorMessages.COLUMN_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(ColumnDefinitionResponseDto, HttpStatus.OK)
	@ResponseMessage("컬럼 정의 수정 성공")
	async updateColumn(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() body: UpdateColumnDefinitionDto,
	): Promise<ColumnDefinitionResponseDto> {
		this.logger.debug(`컬럼 정의 수정 요청: id=${id.slice(-8)}`);

		const data = {
			label: body.label,
			sortOrder: body.sortOrder,
			isRequired: body.isRequired,
			visibleOnDesktop: body.visibleOnDesktop,
			visibleOnTablet: body.visibleOnTablet,
			visibleOnMobile: body.visibleOnMobile,
			sortable: body.sortable,
			width: body.width,
			minWidth: body.minWidth,
			subjectId: body.subjectId,
		};

		const column = await this.service.updateColumn(id, data);

		return plainToInstance(ColumnDefinitionResponseDto, column, {
			excludeExtraneousValues: true,
		});
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: "컬럼 정의 삭제",
		description:
			"컬럼 정의를 삭제합니다 (Soft Delete). removedAt 필드가 설정됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Column Definition ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 404, message: ColumnDefinitionsErrorMessages.COLUMN_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(ColumnDefinitionResponseDto, HttpStatus.OK)
	@ResponseMessage("컬럼 정의 삭제 성공")
	async deleteColumn(
		@Param("id", ParseUUIDPipe) id: string,
	): Promise<ColumnDefinitionResponseDto> {
		this.logger.debug(`컬럼 정의 삭제 요청: id=${id.slice(-8)}`);

		const column = await this.service.deleteColumn(id);

		return plainToInstance(ColumnDefinitionResponseDto, column, {
			excludeExtraneousValues: true,
		});
	}
}
