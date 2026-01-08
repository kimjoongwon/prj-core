import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	AbilityResponseDto,
	UpdateRoleAbilitiesRequestDto,
} from "@cocrepo/dto";
import { Ability, User } from "@cocrepo/entity";
import { AbilitiesFacade } from "@cocrepo/facade";
import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	ParseUUIDPipe,
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
	ABILITY_UPDATE_FAILED: "권한 업데이트에 실패했습니다",
} as const;

@ApiTags("ABILITIES")
@Controller()
export class AbilitiesController {
	constructor(
		private readonly abilitiesFacade: AbilitiesFacade,
		private readonly cls: ClsService,
	) {}

	@Get("my")
	@ApiOperation({
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

	@Get("roles/:roleId")
	@ApiOperation({
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

	@Get("users/:userId")
	@ApiOperation({
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

	@Put("roles/:roleId")
	@ApiOperation({
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

	@Put("users/:userId")
	@ApiOperation({
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
