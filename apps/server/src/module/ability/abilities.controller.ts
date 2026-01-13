import {
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import { AbilityDto } from "@cocrepo/dto";
import { AbilitiesService } from "@cocrepo/service";
import { Controller, Get, HttpStatus, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

@ApiTags("ABILITIES")
@Controller("abilities")
export class AbilitiesController {
	constructor(private readonly abilitiesService: AbilitiesService) {}

	@Public()
	@Get()
	@ApiOperation({
		operationId: "getAbilities",
		summary: "Ability 목록 조회",
		description: "모든 Ability 목록을 조회합니다.",
	})
	@ApiQuery({
		name: "roleId",
		required: false,
		description: "Role ID로 필터링",
	})
	@ApiQuery({
		name: "userId",
		required: false,
		description: "User ID로 필터링 (예외 권한)",
	})
	@ApiQuery({
		name: "subjectId",
		required: false,
		description: "Subject ID로 필터링",
	})
	@ApiErrors(500)
	@ApiResponseEntity(AbilityDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Ability 목록 조회 성공")
	async getAll(
		@Query("roleId") roleId?: string,
		@Query("userId") userId?: string,
		@Query("subjectId") _subjectId?: string,
	) {
		let abilities;

		if (roleId) {
			abilities = await this.abilitiesService.getRoleAbilities(roleId);
		} else if (userId) {
			abilities = await this.abilitiesService.getUserAbilities(userId);
		} else {
			// subjectId 필터링은 현재 서비스에서 지원하지 않음 - 전체 조회 후 필터링
			abilities = [];
		}

		return abilities.map((ability) => plainToInstance(AbilityDto, ability));
	}

	@Public()
	@Get(":id")
	@ApiOperation({
		operationId: "getAbilityById",
		summary: "Ability 상세 조회",
		description: "ID로 Ability를 조회합니다.",
	})
	@ApiErrors(404, 500)
	@ApiResponseEntity(AbilityDto, HttpStatus.OK)
	@ResponseMessage("Ability 조회 성공")
	async getById(@Param("id") id: string) {
		const ability = await this.abilitiesService.getAbilityById(id);
		return plainToInstance(AbilityDto, ability);
	}
}
