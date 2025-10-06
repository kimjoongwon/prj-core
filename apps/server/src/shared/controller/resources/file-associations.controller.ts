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
	CreateFileAssociationDto,
	FileAssociationDto,
	QueryFileAssociationDto,
	UpdateFileAssociationDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { FileAssociationsService } from "../../service/resources/file-associations.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("FILE-ASSOCIATIONS")
@Controller()
export class FileAssociationsController {
	constructor(private readonly service: FileAssociationsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
	async createFileAssociation(
		@Body() createFileAssociationDto: CreateFileAssociationDto,
	) {
		const fileAssociation = await this.service.create(createFileAssociationDto);

		return plainToInstance(FileAssociationDto, fileAssociation);
	}

	@Get(":fileAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
	async getFileAssociation(
		@Param("fileAssociationId") fileAssociationId: string,
	) {
		const fileAssociation = await this.service.getById(fileAssociationId);
		return plainToInstance(FileAssociationDto, fileAssociation);
	}

	@Patch("removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
	async removeFileAssociations(@Body() fileAssociationIds: string[]) {
		// Process each ID individually since updateMany is discontinued
		const promises = fileAssociationIds.map((id) =>
			this.service.removeById(id),
		);
		const results = await Promise.all(promises);
		return results.length;
	}

	@Patch(":fileAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
	async updateFileAssociation(
		@Param("fileAssociationId") fileAssociationId: string,
		@Body() updateFileAssociationDto: UpdateFileAssociationDto,
	) {
		const fileAssociation = await this.service.updateById(
			fileAssociationId,
			updateFileAssociationDto,
		);
		return plainToInstance(FileAssociationDto, fileAssociation);
	}

	@Patch(":fileAssociationId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
	async removeFileAssociation(
		@Param("fileAssociationId") fileAssociationId: string,
	) {
		const fileAssociation = await this.service.removeById(fileAssociationId);
		return plainToInstance(FileAssociationDto, fileAssociation);
	}

	@Delete(":fileAssociationId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
	async deleteFileAssociation(
		@Param("fileAssociationId") fileAssociationId: string,
	) {
		const fileAssociation = await this.service.deleteById(fileAssociationId);
		return plainToInstance(FileAssociationDto, fileAssociation);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileAssociationDto, HttpStatus.OK, { isArray: true })
	async getFileAssociationsByQuery(@Query() query: QueryFileAssociationDto) {
		const { fileAssociations, count } =
			await this.service.getManyByQuery(query);
		return wrapResponse(plainToInstance(FileAssociationDto, fileAssociations), {
			meta: query.toPageMetaDto(count),
		});
	}
}
