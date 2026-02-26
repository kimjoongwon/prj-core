import { RolesGuard } from "@cocrepo/be-common";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import { BatchGrantRequestDto, GrantResponseDto } from "@cocrepo/dto";
import { GrantsService } from "@cocrepo/service";
import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Put,
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("GRANTS")
@Controller()
export class GrantsController {
	constructor(private readonly grantsService: GrantsService) {}

	@Put("roles/:roleId")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "batchAssignGrantsToRole",
		summary: "역할별 권한 배치 할당",
		description:
			"특정 Role에 Ability를 배치로 할당/해제합니다. 전체 목록 동기화 방식입니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "roleId", description: "역할 ID (UUID)", type: String })
	@ApiBody({ type: BatchGrantRequestDto })
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(GrantResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("common.grant.batchAssign.success")
	async batchAssignGrantsToRole(
		@Param("roleId", ParseUUIDPipe) roleId: string,
		@Body() dto: BatchGrantRequestDto,
	) {
		return this.grantsService.batchAssignToRole(roleId, dto.grants);
	}

	@Get("roles/:roleId")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getGrantsByRoleId",
		summary: "역할별 권한 조회",
		description: "특정 Role에 할당된 Grant 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "roleId", description: "역할 ID (UUID)", type: String })
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(GrantResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("common.grant.byRole.success")
	async getGrantsByRoleId(@Param("roleId", ParseUUIDPipe) roleId: string) {
		return this.grantsService.findByRoleIds([roleId]);
	}
}
