import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  HttpCode,
  Param,
  Patch,
  UploadedFiles,
} from '@nestjs/common';
import { Auth, ApiResponseEntity } from '../decorators';
import { CreateFileDto, FileDto } from '../dtos';
import { ResponseEntity } from '../entities/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from '../services/files.service';
import _ from 'lodash';
import { ApiFile } from '../decorators/swagger.schema';

@ApiTags('FILES')
@Controller()
export class FilesController {
  constructor(private readonly service: FilesService) {}

  @Get(':fileId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileDto, HttpStatus.OK)
  async getFileById(@Param('fileId') fileId: string) {
    const file = await this.service.getById(fileId);
    return new ResponseEntity(HttpStatus.OK, '성공', file.toDto());
  }

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseEntity(FileDto, HttpStatus.CREATED)
  async createFile(@Body() createFileDto: CreateFileDto) {
    const file = await this.service.create(createFileDto);
    return new ResponseEntity(HttpStatus.CREATED, 'success', file.toDto());
  }

  @Patch(':fileId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileDto, HttpStatus.OK)
  async removeFileById(@Param('fileId') fileId: string) {
    const fileEntity = await this.service.removeById(fileId);
    return new ResponseEntity(HttpStatus.OK, 'success', fileEntity.toDto());
  }

  @Patch(':fileId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileDto, HttpStatus.OK)
  @ApiFile(
    {
      name: 'files',
    },
    {
      isRequired: false,
    },
  )
  async updateFileById(
    @Param('fileId') fileId: string,
    @UploadedFiles() { files }: { files: Express.Multer.File[] },
  ) {
    const fileEntity = await this.service.updateById(fileId, files?.[0]);
    return new ResponseEntity(HttpStatus.OK, 'success', fileEntity.toDto());
  }
}
