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
	async getRoleAbilities(
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
	async getUserAbilities(
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
	 * 권한 생성 (관리자 전용)
	 * POST /api/v1/abilities
	 */
	@Post()
	@ApiOperation({
		operationId: "createAbility",
		summary: "권한 생성",
		description:
			"새로운 권한을 생성합니다. roleId 또는 userId 중 하나는 필수입니다.",
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
	@ResponseMessage("권한 생성 성공")
	async createAbility(@Body() dto: CreateAbilityDto): Promise<Ability> {
		const data = {
			actionId: dto.actionId,
			subjectId: dto.subjectId,
			fields: dto.fields ?? [],
			conditions: dto.conditions ?? null,
			inverted: dto.inverted ?? false,
			reason: dto.reason ?? null,
			roleId: dto.roleId ?? null,
			userId: dto.userId ?? null,
			name: dto.name ?? null,
			description: dto.description ?? null,
			isActive: dto.isActive ?? true,
			priority: dto.priority ?? 0,
		};

		return this.abilitiesFacade.createAbility(data);
	}

	/**
	 * 권한 수정 (관리자 전용)
	 * PATCH /api/v1/abilities/:id
	 */
	@Patch(":id")
	@ApiOperation({
		operationId: "updateAbility",
		summary: "권한 수정",
		description: "기존 권한의 정보를 수정합니다.",
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
	@ResponseMessage("권한 수정 성공")
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
			...(dto.roleId !== undefined && { roleId: dto.roleId }),
			...(dto.userId !== undefined && { userId: dto.userId }),
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.description !== undefined && { description: dto.description }),
			...(dto.isActive !== undefined && { isActive: dto.isActive }),
			...(dto.priority !== undefined && { priority: dto.priority }),
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

	/**
	 * Role 권한 일괄 설정 (관리자 전용)
	 * PUT /api/v1/abilities/roles/:roleId
	 */
	@Put("roles/:roleId")
	@ApiOperation({
		operationId: "setRoleAbilities",
		summary: "Role 권한 일괄 설정",
		description:
			"Role의 기본 권한을 일괄 설정합니다. 기존 권한은 소프트 삭제되고 새로운 권한이 생성됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "roleId",
		description: "Role ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateRoleAbilitiesRequestDto,
		description: "설정할 Ability 목록",
	})
	@ApiErrors(
		{ status: 401, message: AbilitiesErrorMessages.USER_NOT_FOUND },
		{ status: 400, message: AbilitiesErrorMessages.ABILITY_UPDATE_FAILED },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Role 권한 설정 성공")
	async setRoleAbilities(
		@Param("roleId", ParseUUIDPipe) roleId: string,
		@Body() body: UpdateRoleAbilitiesRequestDto,
	): Promise<Ability[]> {
		const abilitiesToCreate = body.abilities.map((ability) => ({
			...ability,
			roleId,
		}));

		return this.abilitiesFacade.batchSetRoleAbilities(
			roleId,
			abilitiesToCreate,
		);
	}

	/**
	 * User 예외 권한 일괄 설정 (관리자 전용)
	 * PUT /api/v1/abilities/users/:userId
	 */
	@Put("users/:userId")
	@ApiOperation({
		operationId: "setUserAbilities",
		summary: "User 예외 권한 일괄 설정",
		description:
			"User의 예외 권한을 일괄 설정합니다. 기존 예외 권한은 소프트 삭제되고 새로운 권한이 생성됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "userId",
		description: "User ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateRoleAbilitiesRequestDto,
		description: "설정할 Ability 목록",
	})
	@ApiErrors(
		{ status: 401, message: AbilitiesErrorMessages.USER_NOT_FOUND },
		{ status: 400, message: AbilitiesErrorMessages.ABILITY_UPDATE_FAILED },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("User 예외 권한 설정 성공")
	async setUserAbilities(
		@Param("userId", ParseUUIDPipe) userId: string,
		@Body() body: UpdateRoleAbilitiesRequestDto,
	): Promise<Ability[]> {
		const abilitiesToCreate = body.abilities.map((ability) => ({
			...ability,
			userId,
		}));

		return this.abilitiesFacade.batchSetUserAbilities(
			userId,
			abilitiesToCreate,
		);
	}
}
