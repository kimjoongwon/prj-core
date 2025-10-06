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
import {
	ApiResponseEntity,
	CreateUserAssociationDto,
	QueryUserAssociationDto,
	UpdateUserAssociationDto,
	UserAssociationDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { UserAssociationsService } from "../../service/resources/user-associations.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("USER-ASSOCIATIONS")
@Controller()
export class UserAssociationsController {
	constructor(private readonly service: UserAssociationsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserAssociationDto, HttpStatus.OK)
	async createUserAssociation(
		@Body() createUserAssociationDto: CreateUserAssociationDto,
	) {
		const userAssociation = await this.service.create(createUserAssociationDto);

		return plainToInstance(UserAssociationDto, userAssociation);
	}

	@Get(":userAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserAssociationDto, HttpStatus.OK)
	async getUserAssociation(
		@Param("userAssociationId") userAssociationId: string,
	) {
		const userAssociation = await this.service.getById(userAssociationId);
		return plainToInstance(UserAssociationDto, userAssociation);
	}

	@Patch("removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserAssociationDto, HttpStatus.OK)
	async removeUserAssociations(@Body() userAssociationIds: string[]) {
		// Note: updateMany is discontinued, this endpoint may need to be updated to handle individual calls
		const promises = userAssociationIds.map((id) =>
			this.service.removeById(id),
		);
		const results = await Promise.all(promises);
		const userAssociations = { count: results.length };
		return userAssociations.count;
	}

	@Patch(":userAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserAssociationDto, HttpStatus.OK)
	async updateUserAssociation(
		@Param("userAssociationId") userAssociationId: string,
		@Body() updateUserAssociationDto: UpdateUserAssociationDto,
	) {
		const userAssociation = await this.service.updateById(
			userAssociationId,
			updateUserAssociationDto,
		);
		return plainToInstance(UserAssociationDto, userAssociation);
	}

	@Patch(":userAssociationId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserAssociationDto, HttpStatus.OK)
	async removeUserAssociation(
		@Param("userAssociationId") userAssociationId: string,
	) {
		const userAssociation = await this.service.removeById(userAssociationId);
		return plainToInstance(UserAssociationDto, userAssociation);
	}

	@Delete(":userAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserAssociationDto, HttpStatus.OK)
	async deleteUserAssociation(
		@Param("userAssociationId") userAssociationId: string,
	) {
		const userAssociation = await this.service.deleteById(userAssociationId);
		return plainToInstance(UserAssociationDto, userAssociation);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserAssociationDto, HttpStatus.OK, { isArray: true })
	async getUserAssociationsByQuery(@Query() query: QueryUserAssociationDto) {
		const { userAssociations, count } =
			await this.service.getManyByQuery(query);
		return wrapResponse(plainToInstance(UserAssociationDto, userAssociations), {
			meta: query.toPageMetaDto(count),
		});
	}
}
