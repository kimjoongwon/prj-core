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
	CreateFileClassificationDto,
	FileClassificationDto,
	QueryFileClassificationDto,
	ResponseEntity,
	UpdateFileClassificationDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ApiResponseEntity, Auth } from "../decorator";
import { FileClassificationsService } from "../service/file-classifications.service";

@ApiTags("FILE-CLASSIFICATIONS")
@Controller()
export class FileClassificationsController {
	constructor(private readonly service: FileClassificationsService) {}
	@Post()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileClassificationDto, HttpStatus.OK)
	async createFileClassification(
		@Body() createFileClassificationDto: CreateFileClassificationDto,
	) {
		const fileClassification = await this.service.create(
			createFileClassificationDto,
		);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(FileClassificationDto, fileClassification),
		);
	}
	@Get(":fileClassificationId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileClassificationDto, HttpStatus.OK)
	async getFileClassification(@Param("id") id: string) {
		const fileClassification = await this.service.getById(id);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(FileClassificationDto, fileClassification),
		);
	}
	@Patch(":fileClassificationId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileClassificationDto, HttpStatus.OK)
	async updateFileClassification(
		@Param("id") id: string,
		@Body() updateFileClassificationDto: UpdateFileClassificationDto,
	) {
		const fileClassification = await this.service.updateById(
			id,
			updateFileClassificationDto,
		);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(FileClassificationDto, fileClassification),
		);
	}
	@Patch(":fileClassificationId/removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileClassificationDto, HttpStatus.OK)
	async removeFileClassification(@Param("id") id: string) {
		const fileClassification = await this.service.removeById(id);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(FileClassificationDto, fileClassification),
		);
	}
	@Delete(":fileClassificationId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileClassificationDto, HttpStatus.OK)
	async deleteFileClassification(@Param("id") id: string) {
		const fileClassification = await this.service.deleteById(id);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(FileClassificationDto, fileClassification),
		);
	}
	@Get()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileClassificationDto, HttpStatus.OK, { isArray: true })
	async getFileClassificationsByQuery(
		@Query() query: QueryFileClassificationDto,
	) {
		const { items, count } = await this.service.getManyByQuery(query);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(FileClassificationDto, items),
			query.toPageMetaDto(count),
		);
	}
}
