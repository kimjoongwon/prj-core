import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	CreateRoleDto,
	QueryRoleDto,
	RoleDto,
	UpdateRoleDto,
} from "@cocrepo/dto";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RolesService } from "../../service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("SPACES")
@Controller()
export class RolesController {
	constructor(private readonly service: RolesService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	async createRole(@Body() createRoleDto: CreateRoleDto) {
		const role = await this.service.create(createRoleDto);
		return role;
	}

	@Get(":roleId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	async getRole(@Param("roleId") roleId: string) {
		const role = await this.service.getById(roleId);
		return role;
	}

	@Patch(":roleId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	async updateRole(
		@Param("roleId") roleId: string,
		@Body() updateRoleDto: UpdateRoleDto,
	) {
		const role = await this.service.updateById(roleId, updateRoleDto);
		return role;
	}

	@Patch(":roleId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	async removeRole(@Param("roleId") roleId: string) {
		const role = await this.service.removeById(roleId);
		return role;
	}

	@Delete(":roleId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	async deleteRole(@Param("roleId") roleId: string) {
		const role = await this.service.deleteById(roleId);
		return role;
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleDto, HttpStatus.OK, { isArray: true })
	async getRolesByQuery(@Query() query: QueryRoleDto) {
		const { count, roles } = await this.service.getManyByQuery(query);

		return wrapResponse(roles, {
			message: "success",
			meta: query.toPageMetaDto(count),
		});
	}
}
