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
import { plainToInstance } from "class-transformer";
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
		return plainToInstance(RoleDto, role);
	}

	@Get(":roleId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	async getRole(@Param("roleId") roleId: string) {
		const role = await this.service.getById(roleId);
		return plainToInstance(RoleDto, role);
	}

	@Patch(":roleId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	async updateRole(
		@Param("roleId") roleId: string,
		@Body() updateRoleDto: UpdateRoleDto,
	) {
		const role = await this.service.updateById(roleId, updateRoleDto);
		return role?.toDto?.() ?? role;
	}

	@Patch(":roleId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	async removeRole(@Param("roleId") roleId: string) {
		const role = await this.service.removeById(roleId);
		return plainToInstance(RoleDto, role);
	}

	@Delete(":roleId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	async deleteRole(@Param("roleId") roleId: string) {
		const role = await this.service.deleteById(roleId);
		return plainToInstance(RoleDto, role);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleDto, HttpStatus.OK, { isArray: true })
	async getRolesByQuery(@Query() query: QueryRoleDto) {
		const { count, roles } = await this.service.getManyByQuery(query);

		return wrapResponse(
			roles.map((role) => role?.toDto?.() ?? role),
			{
				message: "success",
				meta: query.toPageMetaDto(count),
			},
		);
	}
}
