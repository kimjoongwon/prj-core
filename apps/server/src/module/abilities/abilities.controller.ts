import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import type { User } from "@cocrepo/entity";
import type { AbilitiesService } from "@cocrepo/service";
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
import { plainToInstance } from "class-transformer";
import type { ClsService } from "nestjs-cls";
import { AbilityResponseDto, UpdateRoleAbilitiesRequestDto } from "./dto";

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
		private readonly abilitiesService: AbilitiesService,
		private readonly cls: ClsService,
	) {}

	/**
	 * 현재 로그인한 사용자를 가져옵니다.
	 */
	private getCurrentUser(): User {
		const user = this.cls.get<User>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(AbilitiesErrorMessages.USER_NOT_FOUND);
		}
		return user;
	}

	/**
	 * 현재 요청의 Space ID를 가져옵니다.
	 * X-Space-ID 헤더에서 추출됩니다.
	 */
	private getSpaceId(): string {
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException(
				AbilitiesErrorMessages.SPACE_NOT_SELECTED,
			);
		}
		return spaceId;
	}

	@Get("my")
	@ApiOperation({
		summary: "내 권한 조회",
		description:
			"현재 로그인한 사용자의 Role에 할당된 모든 권한을 조회합니다. Subject 관계를 포함합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: AbilitiesErrorMessages.USER_NOT_FOUND },
		{ status: 400, message: AbilitiesErrorMessages.ROLE_NOT_FOUND },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("내 권한 조회 성공")
	async getMyAbilities(): Promise<AbilityResponseDto[]> {
		const user = this.getCurrentUser();

		const abilities = await this.abilitiesService.getMyAbilities(user.id);

		return abilities.map((ability) =>
			plainToInstance(AbilityResponseDto, ability, {
				excludeExtraneousValues: true,
			}),
		);
	}

	@Get("roles/:roleId")
	@ApiOperation({
		summary: "Role별 권한 조회",
		description:
			"특정 Role에 할당된 모든 권한을 조회합니다. Subject 관계를 포함합니다.",
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
	): Promise<AbilityResponseDto[]> {
		const abilities = await this.abilitiesService.getAbilitiesByRoleId(roleId);

		return abilities.map((ability) =>
			plainToInstance(AbilityResponseDto, ability, {
				excludeExtraneousValues: true,
			}),
		);
	}

	@Put("roles/:roleId")
	@ApiOperation({
		summary: "Role 권한 수정",
		description:
			"Role의 권한을 일괄 수정합니다. 기존 권한은 소프트 삭제되고 새로운 권한이 생성됩니다. 트랜잭션으로 원자성을 보장합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "roleId",
		description: "Role ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateRoleAbilitiesRequestDto,
		description: "생성할 Ability 목록",
	})
	@ApiErrors(
		{ status: 401, message: AbilitiesErrorMessages.USER_NOT_FOUND },
		{ status: 401, message: AbilitiesErrorMessages.SPACE_NOT_SELECTED },
		{ status: 400, message: AbilitiesErrorMessages.ABILITY_UPDATE_FAILED },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Role 권한 수정 성공")
	async updateRoleAbilities(
		@Param("roleId", ParseUUIDPipe) roleId: string,
		@Body() body: UpdateRoleAbilitiesRequestDto,
	): Promise<AbilityResponseDto[]> {
		const spaceId = this.getSpaceId();

		const updatedAbilities = await this.abilitiesService.updateRoleAbilities(
			roleId,
			spaceId,
			body.abilities,
		);

		return updatedAbilities.map((ability) =>
			plainToInstance(AbilityResponseDto, ability, {
				excludeExtraneousValues: true,
			}),
		);
	}
}
