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
	CreateSpaceAssociationDto,
	QuerySpaceAssociationDto,
	ResponseEntity,
	SpaceAssociationDto,
	UpdateSpaceAssociationDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ApiResponseEntity } from "../../decorator/api-response-entity.decorator";
import { Auth } from "../../decorator/auth.decorator";
import { SpaceAssociationsService } from "../../service/resource/space-associations.service";

@ApiTags("SPACE-ASSOCIATIONS")
@Controller()
export class SpaceAssociationsController {
	constructor(private readonly service: SpaceAssociationsService) {}

	@Post()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
	async createSpaceAssociation(
		@Body() createSpaceAssociationDto: CreateSpaceAssociationDto,
	) {
		const spaceAssociation = await this.service.create(
			createSpaceAssociationDto,
		);

		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SpaceAssociationDto, spaceAssociation),
		);
	}

	@Get(":spaceAssociationId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
	async getSpaceAssociation(
		@Param("spaceAssociationId") spaceAssociationId: string,
	) {
		const spaceAssociation = await this.service.getById(spaceAssociationId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SpaceAssociationDto, spaceAssociation),
		);
	}

	@Patch("removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
	async removeSpaceAssociations(@Body() spaceAssociationIds: string[]) {
		// Note: updateMany is discontinued, this endpoint may need to be updated to handle individual calls
		const promises = spaceAssociationIds.map((id) =>
			this.service.removeById(id),
		);
		const results = await Promise.all(promises);
		const spaceAssociations = { count: results.length };
		return new ResponseEntity(HttpStatus.OK, "성공", spaceAssociations.count);
	}

	@Patch(":spaceAssociationId")
	@Auth()
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
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SpaceAssociationDto, spaceAssociation),
		);
	}

	@Patch(":spaceAssociationId/removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
	async removeSpaceAssociation(
		@Param("spaceAssociationId") spaceAssociationId: string,
	) {
		const spaceAssociation = await this.service.removeById(spaceAssociationId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SpaceAssociationDto, spaceAssociation),
		);
	}

	@Delete(":spaceAssociationId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
	async deleteSpaceAssociation(
		@Param("spaceAssociationId") spaceAssociationId: string,
	) {
		const spaceAssociation = await this.service.deleteById(spaceAssociationId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SpaceAssociationDto, spaceAssociation),
		);
	}

	@Get()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK, { isArray: true })
	async getSpaceAssociationsByQuery(@Query() query: QuerySpaceAssociationDto) {
		const { spaceAssociations, count } =
			await this.service.getManyByQuery(query);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SpaceAssociationDto, spaceAssociations),
			query.toPageMetaDto(count),
		);
	}
}
