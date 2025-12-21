import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	CreateRoleAssociationDto,
	QueryRoleAssociationDto,
	RoleAssociationDto,
	UpdateRoleAssociationDto,
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
import { RoleAssociationsService } from "../../service/resources/role-associations.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("ROLE-ASSOCIATIONS")
@Controller()
export class RoleAssociationsController {
	constructor(private readonly service: RoleAssociationsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
	async createRoleAssociation(
		@Body() createRoleAssociationDto: CreateRoleAssociationDto,
	) {
		const roleAssociation = await this.service.create(createRoleAssociationDto);

		return plainToInstance(RoleAssociationDto, roleAssociation);
	}

	@Get(":roleAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
	async getRoleAssociation(
		@Param("roleAssociationId") roleAssociationId: string,
	) {
		const roleAssociation = await this.service.getById(roleAssociationId);
		return plainToInstance(RoleAssociationDto, roleAssociation);
	}

	@Patch("removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
	async removeRoleAssociations(@Body() roleAssociationIds: string[]) {
		// Note: updateMany is discontinued, this endpoint may need to be updated to handle individual calls
		const promises = roleAssociationIds.map((id) =>
			this.service.removeById(id),
		);
		const results = await Promise.all(promises);
		const roleAssociations = { count: results.length };
		return roleAssociations.count;
	}

	@Patch(":roleAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
	async updateRoleAssociation(
		@Param("roleAssociationId") roleAssociationId: string,
		@Body() updateRoleAssociationDto: UpdateRoleAssociationDto,
	) {
		const roleAssociation = await this.service.updateById(
			roleAssociationId,
			updateRoleAssociationDto,
		);
		return plainToInstance(RoleAssociationDto, roleAssociation);
	}

	@Patch(":roleAssociationId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
	async removeRoleAssociation(
		@Param("roleAssociationId") roleAssociationId: string,
	) {
		const roleAssociation = await this.service.removeById(roleAssociationId);
		return plainToInstance(RoleAssociationDto, roleAssociation);
	}

	@Delete(":roleAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
	async deleteRoleAssociation(
		@Param("roleAssociationId") roleAssociationId: string,
	) {
		const roleAssociation = await this.service.deleteById(roleAssociationId);
		return plainToInstance(RoleAssociationDto, roleAssociation);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoleAssociationDto, HttpStatus.OK, { isArray: true })
	async getRoleAssociationsByQuery(@Query() query: QueryRoleAssociationDto) {
		const { roleAssociations, count } =
			await this.service.getManyByQuery(query);
		return wrapResponse(plainToInstance(RoleAssociationDto, roleAssociations), {
			meta: query.toPageMetaDto(count),
		});
	}
}
