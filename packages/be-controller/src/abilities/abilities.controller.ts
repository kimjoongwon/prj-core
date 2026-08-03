import { ParseBigIntIdPipe } from "@cocrepo/be-common";
import {
	CreateAbilityCommand,
	DeleteAbilityCommand,
	GetAbilityByIdQuery,
	GetAllAbilitiesQuery,
	GetMyAbilitiesQuery,
	UpdateAbilityCommand,
} from "@cocrepo/command";
import { ABILITY_ERRORS, USER_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	AbilityResponseDto,
	CreateAbilityDto,
	UpdateAbilityDto,
} from "@cocrepo/dto";
import { Ability } from "@cocrepo/entity";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("ABILITIES")
@Controller()
export class AbilitiesController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	/**
	 * 전체 권한 정의 목록 조회
	 * GET /api/v1/abilities
	 */
	@Get()
	@ApiOperation({
		operationId: "getAbilities",
		summary: "전체 권한 정의 목록 조회",
		description:
			"모든 권한 정의(Ability) 목록을 조회합니다. Subject, Action 정보를 포함합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("권한 목록 조회 성공")
	async getAbilities(): Promise<Ability[]> {
		return this.queryBus.execute(new GetAllAbilitiesQuery());
	}

	/**
	 * 현재 로그인 사용자의 권한 조회
	 * GET /api/v1/abilities/my
	 */
	@Get("my")
	@ApiOperation({
		operationId: "getMyAbilities",
		summary: "현재 로그인 사용자의 권한 조회",
		description:
			"현재 선택한 Space 기준으로 로그인 사용자에게 적용되는 Role/User Policy를 병합해 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("내 권한 조회 성공")
	async getMyAbilities(): Promise<Ability[]> {
		return this.queryBus.execute(new GetMyAbilitiesQuery());
	}

	/**
	 * 권한 상세 조회
	 * GET /api/v1/abilities/:id
	 */
	@Get(":id")
	@ApiOperation({
		operationId: "getAbilityById",
		summary: "권한 상세 조회",
		description: "ID로 특정 권한을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Ability ID (canonical decimal BIGINT string)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: ABILITY_ERRORS.USER_NOT_FOUND },
		{ status: 404, message: ABILITY_ERRORS.NOT_FOUND },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK)
	@ResponseMessage("권한 조회 성공")
	async getAbilityById(
		@Param("id", ParseBigIntIdPipe) id: bigint,
	): Promise<Ability> {
		return this.queryBus.execute(new GetAbilityByIdQuery(id));
	}

	/**
	 * 권한 정의 생성 (관리자 전용)
	 * POST /api/v1/abilities
	 */
	@Post()
	@ApiOperation({
		operationId: "createAbility",
		summary: "권한 정의 생성",
		description:
			"재사용 가능한 권한 정의를 생성합니다. Role/User에 할당하려면 Policy에 포함하세요.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateAbilityDto,
		description: "생성할 Ability 데이터",
	})
	@ApiErrors(
		{ status: 401, message: ABILITY_ERRORS.USER_NOT_FOUND },
		{ status: 400, message: ABILITY_ERRORS.CREATE_FAILED },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.CREATED)
	@ResponseMessage("권한 정의 생성 성공")
	async createAbility(@Body() dto: CreateAbilityDto): Promise<Ability> {
		return this.commandBus.execute(new CreateAbilityCommand(dto));
	}

	/**
	 * 권한 정의 수정 (관리자 전용)
	 * PATCH /api/v1/abilities/:id
	 */
	@Patch(":id")
	@ApiOperation({
		operationId: "updateAbility",
		summary: "권한 정의 수정",
		description:
			"기존 권한 정의를 수정합니다. Policy assignment 메타데이터(isActive, priority)는 변경되지 않습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Ability ID (canonical decimal BIGINT string)",
		type: String,
	})
	@ApiBody({
		type: UpdateAbilityDto,
		description: "수정할 Ability 데이터",
	})
	@ApiErrors(
		{ status: 401, message: ABILITY_ERRORS.USER_NOT_FOUND },
		{ status: 404, message: ABILITY_ERRORS.NOT_FOUND },
		{ status: 400, message: ABILITY_ERRORS.UPDATE_FAILED },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK)
	@ResponseMessage("권한 정의 수정 성공")
	async updateAbility(
		@Param("id", ParseBigIntIdPipe) id: bigint,
		@Body() dto: UpdateAbilityDto,
	): Promise<Ability> {
		return this.commandBus.execute(new UpdateAbilityCommand(id, dto));
	}

	/**
	 * 권한 삭제 (관리자 전용, 소프트 삭제)
	 * DELETE /api/v1/abilities/:id
	 */
	@Delete(":id")
	@ApiOperation({
		operationId: "deleteAbility",
		summary: "권한 삭제",
		description: "기존 권한을 삭제합니다. (소프트 삭제)",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Ability ID (canonical decimal BIGINT string)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: ABILITY_ERRORS.USER_NOT_FOUND },
		{ status: 404, message: ABILITY_ERRORS.NOT_FOUND },
		{ status: 400, message: ABILITY_ERRORS.DELETE_FAILED },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK)
	@ResponseMessage("권한 삭제 성공")
	async deleteAbility(
		@Param("id", ParseBigIntIdPipe) id: bigint,
	): Promise<Ability> {
		return this.commandBus.execute(new DeleteAbilityCommand(id));
	}
}
