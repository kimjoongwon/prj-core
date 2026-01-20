import { RolesGuard } from "@cocrepo/be-common";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import { CreateRoleDto, RoleDto, UpdateRoleDto } from "@cocrepo/dto";
import { RolesService } from "@cocrepo/service";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

@ApiTags("ROLES")
@Controller()
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Get()
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.SUPER_ADMIN])
	@ApiOperation({
		operationId: "getRoles",
		summary: "역할 목록 조회",
		description: "모든 역할 목록을 조회합니다. 관리자 전용 API입니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(RoleDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("역할 목록 조회 성공")
	async getAll() {
		const roles = await this.rolesService.getAll();
		return roles.map((role) => plainToInstance(RoleDto, role));
	}

	@Get(":id")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.SUPER_ADMIN])
	@ApiOperation({
		operationId: "getRoleById",
		summary: "역할 상세 조회",
		description: "ID로 역할을 조회합니다. 관리자 전용 API입니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "역할 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	@ResponseMessage("역할 조회 성공")
	async getById(@Param("id", ParseUUIDPipe) id: string) {
		const role = await this.rolesService.getById(id);
		return plainToInstance(RoleDto, role);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.SUPER_ADMIN])
	@ApiOperation({
		operationId: "createRole",
		summary: "역할 생성",
		description:
			"새로운 역할을 생성합니다. SUPER_ADMIN 전용 API입니다. 역할 식별자(name)는 영문 대문자와 언더스코어만 사용 가능합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateRoleDto,
		description: "생성할 역할 정보",
	})
	@ApiErrors(400, 401, 403, 409, 500)
	@ApiResponseEntity(RoleDto, HttpStatus.CREATED)
	@ResponseMessage("역할 생성 성공")
	async create(@Body() dto: CreateRoleDto) {
		const role = await this.rolesService.create(dto);
		return plainToInstance(RoleDto, role);
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.SUPER_ADMIN])
	@ApiOperation({
		operationId: "updateRole",
		summary: "역할 수정",
		description:
			"역할 정보를 수정합니다. SUPER_ADMIN 전용 API이며, 시스템 역할(SUPER_ADMIN, ADMIN, USER)은 수정할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "역할 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateRoleDto,
		description: "수정할 역할 정보 (displayName, description만 수정 가능)",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	@ResponseMessage("역할 수정 성공")
	async updateById(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateRoleDto,
	) {
		const role = await this.rolesService.update(id, dto);
		return plainToInstance(RoleDto, role);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.SUPER_ADMIN])
	@ApiOperation({
		operationId: "deleteRole",
		summary: "역할 삭제",
		description:
			"역할을 삭제합니다. SUPER_ADMIN 전용 API이며, 시스템 역할은 삭제할 수 없고, 연결된 사용자가 있으면 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "역할 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	@ResponseMessage("역할 삭제 성공")
	async deleteById(@Param("id", ParseUUIDPipe) id: string) {
		const role = await this.rolesService.delete(id);
		return plainToInstance(RoleDto, role);
	}
}
