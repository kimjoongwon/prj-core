import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	CreateSpaceClassificationDto,
	QuerySpaceClassificationDto,
	SpaceClassificationDto,
	UpdateSpaceClassificationDto,
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
import { SpaceClassificationsService } from "../../service/resources/space-classifications.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("SPACE-CLASSIFICATIONS")
@Controller()
export class SpaceClassificationsController {
	constructor(private readonly service: SpaceClassificationsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK)
	async createSpaceClassification(
		@Body() createSpaceClassificationDto: CreateSpaceClassificationDto,
	) {
		const spaceClassification = await this.service.create(
			createSpaceClassificationDto,
		);
		return spaceClassification;
	}

	@Get(":spaceClassificationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK)
	async getSpaceClassification(@Param("spaceClassificationId") id: string) {
		const spaceClassification = await this.service.getById(id);
		return spaceClassification;
	}

	@Patch(":spaceClassificationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK)
	async updateSpaceClassification(
		@Param("spaceClassificationId") id: string,
		@Body() updateSpaceClassificationDto: UpdateSpaceClassificationDto,
	) {
		const spaceClassification = await this.service.updateById(
			id,
			updateSpaceClassificationDto,
		);
		return spaceClassification;
	}

	@Patch(":spaceClassificationId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK)
	async removeSpaceClassification(@Param("spaceClassificationId") id: string) {
		const spaceClassification = await this.service.removeById(id);
		return spaceClassification;
	}

	@Delete(":spaceClassificationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK)
	async deleteSpaceClassification(@Param("spaceClassificationId") id: string) {
		const spaceClassification = await this.service.deleteById(id);
		return spaceClassification;
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK, { isArray: true })
	async getSpaceClassificationsByQuery(
		@Query() query: QuerySpaceClassificationDto,
	) {
		const { items, count } = await this.service.getManyByQuery(query);
		return wrapResponse(items, {
			meta: query.toPageMetaDto(count),
		});
	}
}
