import { ApiFile, ApiResponseEntity } from "@cocrepo/decorator";
import { CreateFileDto, FileDto } from "@cocrepo/dto";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UploadedFiles,
} from "@nestjs/common";
import { ResponseMessage } from "../../decorator/response-message.decorator";
import { FilesService } from "../../service/resources/files.service";

@Controller()
export class FilesController {
	constructor(private readonly service: FilesService) {}

	@Get(":fileId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileDto, HttpStatus.OK)
	async getFileById(@Param("fileId") fileId: string) {
		const file = await this.service.getById(fileId);
		return file?.toDto?.() ?? file;
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiResponseEntity(FileDto, HttpStatus.CREATED)
	@ResponseMessage("success")
	async createFile(@Body() createFileDto: CreateFileDto) {
		const file = await this.service.create(createFileDto);
		return file?.toDto?.() ?? file;
	}

	@Patch(":fileId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileDto, HttpStatus.OK)
	@ResponseMessage("success")
	async removeFileById(@Param("fileId") fileId: string) {
		const fileEntity = await this.service.removeById(fileId);
		return fileEntity?.toDto?.() ?? fileEntity;
	}

	@Patch(":fileId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(FileDto, HttpStatus.OK)
	@ApiFile(
		{
			name: "files",
		},
		{
			isRequired: false,
		},
	)
	@ResponseMessage("success")
	async updateFileById(
		@Param("fileId") fileId: string,
		@UploadedFiles() { files }: { files: FileDto[] },
	) {
		const fileEntity = await this.service.updateById(fileId, files?.[0]);
		return fileEntity?.toDto?.() ?? fileEntity;
	}
}
