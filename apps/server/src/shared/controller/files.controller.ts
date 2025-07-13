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
import { CreateFileDto, FileDto, ResponseEntity } from "@shared/schema";
import { ApiResponseEntity, Auth } from "../decorator";
import { ApiFile } from "../decorator/swagger.schema";
import { FilesService } from "../service/files.service";

@Controller()
export class FilesController {
  constructor(private readonly service: FilesService) {}

  @Get(":fileId")
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileDto, HttpStatus.OK)
  async getFileById(@Param("fileId") fileId: string) {
    const file = await this.service.getById(fileId);
    return new ResponseEntity(HttpStatus.OK, "성공", file?.toDto?.() ?? file);
  }

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseEntity(FileDto, HttpStatus.CREATED)
  async createFile(@Body() createFileDto: CreateFileDto) {
    const file = await this.service.create(createFileDto);
    return new ResponseEntity(HttpStatus.CREATED, "success", file?.toDto?.() ?? file);
  }

  @Patch(":fileId/removedAt")
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileDto, HttpStatus.OK)
  async removeFileById(@Param("fileId") fileId: string) {
    const fileEntity = await this.service.removeById(fileId);
    return new ResponseEntity(HttpStatus.OK, "success", fileEntity?.toDto?.() ?? fileEntity);
  }

  @Patch(":fileId")
  @Auth([])
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
  async updateFileById(
    @Param("fileId") fileId: string,
    @UploadedFiles() { files }: { files: FileDto[] },
  ) {
    const fileEntity = await this.service.updateById(fileId, files?.[0]);
    return new ResponseEntity(HttpStatus.OK, "success", fileEntity?.toDto?.() ?? fileEntity);
  }
}
