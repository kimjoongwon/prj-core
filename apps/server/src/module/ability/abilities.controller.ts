import { CONTEXT_KEYS } from "@cocrepo/constant";
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
	UpdateRoleAbilitiesRequestDto,
} from "@cocrepo/dto";
import { Ability, User } from "@cocrepo/entity";
import { AbilitiesFacade } from "@cocrepo/facade";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Put,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ClsService } from "nestjs-cls";

/**
 * Abilities 에러 메시지 상수
 */
const AbilitiesErrorMessages = {
	USER_NOT_FOUND: "사용자를 찾을 수 없습니다",
	SPACE_NOT_SELECTED:
		"Space가 선택되지 않았습니다. X-Space-ID 헤더를 확인해주세요.",
	ROLE_NOT_FOUND: "역할(Role)을 찾을 수 없습니다",
	ABILITY_NOT_FOUND: "권한을 찾을 수 없습니다",
	ABILITY_UPDATE_FAILED: "권한 업데이트에 실패했습니다",
	ABILITY_CREATE_FAILED: "권한 생성에 실패했습니다",
	ABILITY_DELETE_FAILED: "권한 삭제에 실패했습니다",
} as const;

@ApiTags("ABILITIES")
@Controller()
export class AbilitiesController {
	constructor(
		private readonly abilitiesFacade: AbilitiesFacade,
		private readonly cls: ClsService,
	) {}

	/**
	 * 내 권한 조회 (로그인 필수)
	 * GET /api/v1/abilities/my
	 *
	 * 참고: /my는 /:id 보다 먼저 정의되어야 라우팅 우선순위가 올바르게 동작합니다.
	 */
	@Get("my")
	@ApiOperation({
		operationId: "getMyAbilities",
		summary: "내 권한 조회",
		description:
			"현재 로그인한 사용자의 Role 권한과 예외 권한을 병합하여 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: AbilitiesErrorMessages.USER_NOT_FOUND },
		{ status: 400, message: AbilitiesErrorMessages.ROLE_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("내 권한 조회 성공")
	async getMyAbilities(): Promise<Ability[]> {
		const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(AbilitiesErrorMessages.USER_NOT_FOUND);
		}

		return this.abilitiesFacade.getMyAbilities(user.id);
	}

	/**
	 * Role별 기본 권한 조회
	 * GET /api/v1/abilities/roles/:roleId
	 */
	@Get("roles/:roleId")
	@ApiOperation({
		operationId: "getAbilitiesByRoleId",
		summary: "Role별 기본 권한 조회",
		description: "특정 Role에 할당된 기본 권한 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "roleId",
		description: "Role ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: AbilitiesErrorMessages.USER_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Role별 권한 조회 성공")
	async getAbilitiesByRoleId(
		@Param("roleId", ParseUUIDPipe) roleId: string,
	): Promise<Ability[]> {
		return this.abilitiesFacade.getRoleAbilities(roleId);
	}

	/**
	 * User별 예외 권한 조회
	 * GET /api/v1/abilities/users/:userId
	 */
	@Get("users/:userId")
	@ApiOperation({
		operationId: "getAbilitiesByUserId",
		summary: "User별 예외 권한 조회",
		description: "특정 User에게 할당된 예외 권한 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "userId",
		description: "User ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: AbilitiesErrorMessages.USER_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("User별 예외 권한 조회 성공")
	async getAbilitiesByUserId(
		@Param("userId", ParseUUIDPipe) userId: string,
	): Promise<Ability[]> {
		return this.abilitiesFacade.getUserAbilities(userId);
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
		description: "Ability ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: AbilitiesErrorMessages.USER_NOT_FOUND },
		{ status: 404, message: AbilitiesErrorMessages.ABILITY_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK)
	@ResponseMessage("권한 조회 성공")
	async getAbilityById(
		@Param("id", ParseUUIDPipe) id: string,
	): Promise<Ability> {
		return this.abilitiesFacade.getAbilityById(id);
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
			"재사용 가능한 권한 정의를 생성합니다. Role/User에 할당하려면 Grant를 생성하세요.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateAbilityDto,
		description: "생성할 Ability 데이터",
	})
	@ApiErrors(
		{ status: 401, message: AbilitiesErrorMessages.USER_NOT_FOUND },
		{ status: 400, message: AbilitiesErrorMessages.ABILITY_CREATE_FAILED },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.CREATED)
	@ResponseMessage("권한 정의 생성 성공")
	async createAbility(@Body() dto: CreateAbilityDto): Promise<Ability> {
		const data = {
			actionId: dto.actionId,
			subjectId: dto.subjectId,
			fields: dto.fields ?? [],
			conditions: dto.conditions ?? null,
			inverted: dto.inverted ?? false,
			reason: dto.reason ?? null,
			name: dto.name ?? "Unnamed Ability", // name is now required
			description: dto.description ?? null,
		};

		return this.abilitiesFacade.createAbility(data);
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
			"기존 권한 정의를 수정합니다. Grant 메타데이터(isActive, priority)는 변경되지 않습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Ability ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateAbilityDto,
		description: "수정할 Ability 데이터",
	})
	@ApiErrors(
		{ status: 401, message: AbilitiesErrorMessages.USER_NOT_FOUND },
		{ status: 404, message: AbilitiesErrorMessages.ABILITY_NOT_FOUND },
		{ status: 400, message: AbilitiesErrorMessages.ABILITY_UPDATE_FAILED },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK)
	@ResponseMessage("권한 정의 수정 성공")
	async updateAbility(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateAbilityDto,
	): Promise<Ability> {
		const data = {
			...(dto.actionId !== undefined && { actionId: dto.actionId }),
			...(dto.subjectId !== undefined && { subjectId: dto.subjectId }),
			...(dto.fields !== undefined && { fields: dto.fields }),
			...(dto.conditions !== undefined && { conditions: dto.conditions }),
			...(dto.inverted !== undefined && { inverted: dto.inverted }),
			...(dto.reason !== undefined && { reason: dto.reason }),
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.description !== undefined && { description: dto.description }),
		};

		return this.abilitiesFacade.updateAbility(id, data);
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
		description: "Ability ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: AbilitiesErrorMessages.USER_NOT_FOUND },
		{ status: 404, message: AbilitiesErrorMessages.ABILITY_NOT_FOUND },
		{ status: 400, message: AbilitiesErrorMessages.ABILITY_DELETE_FAILED },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK)
	@ResponseMessage("권한 삭제 성공")
	async deleteAbility(
		@Param("id", ParseUUIDPipe) id: string,
	): Promise<Ability> {
		return this.abilitiesFacade.deleteAbility(id);
	}

	// TODO: Implement Grant-based batch assignment endpoints
	// PUT /api/v1/grants/roles/:roleId
	// PUT /api/v1/grants/users/:userId
}
