import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	CreateSpaceAssociationDto,
	QuerySpaceAssociationDto,
	SpaceAssociationDto,
	UpdateSpaceAssociationDto,
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
import { SpaceAssociationsService } from "../../service/resources/space-associations.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("SPACE-ASSOCIATIONS")
@Controller()
export class SpaceAssociationsController {
	constructor(private readonly service: SpaceAssociationsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
	async createSpaceAssociation(
		@Body() createSpaceAssociationDto: CreateSpaceAssociationDto,
	) {
		const spaceAssociation = await this.service.create(
			createSpaceAssociationDto,
		);

		return spaceAssociation;
	}

	@Get(":spaceAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
	async getSpaceAssociation(
		@Param("spaceAssociationId") spaceAssociationId: string,
	) {
		const spaceAssociation = await this.service.getById(spaceAssociationId);
		return spaceAssociation;
	}

	@Patch("removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
	async removeSpaceAssociations(@Body() spaceAssociationIds: string[]) {
		// Note: updateMany is discontinued, this endpoint may need to be updated to handle individual calls
		const promises = spaceAssociationIds.map((id) =>
			this.service.removeById(id),
		);
		const results = await Promise.all(promises);
		const spaceAssociations = { count: results.length };
		return spaceAssociations.count;
	}

	@Patch(":spaceAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
	async updateSpaceAssociation(
		@Param("spaceAssociationId") spaceAssociationId: string,
		@Body() updateSpaceAssociationDto: UpdateSpaceAssociationDto,
	) {
		const spaceAssociation = await this.service.updateById(
			spaceAssociationId,
			updateSpaceAssociationDto,
		);
		return spaceAssociation;
	}

	@Patch(":spaceAssociationId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
	async removeSpaceAssociation(
		@Param("spaceAssociationId") spaceAssociationId: string,
	) {
		const spaceAssociation = await this.service.removeById(spaceAssociationId);
		return spaceAssociation;
	}

	@Delete(":spaceAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
	async deleteSpaceAssociation(
		@Param("spaceAssociationId") spaceAssociationId: string,
	) {
		const spaceAssociation = await this.service.deleteById(spaceAssociationId);
		return spaceAssociation;
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK, { isArray: true })
	async getSpaceAssociationsByQuery(@Query() query: QuerySpaceAssociationDto) {
		const { spaceAssociations, count } =
			await this.service.getManyByQuery(query);
		return wrapResponse(spaceAssociations, {
			meta: query.toPageMetaDto(count),
		});
	}
}
