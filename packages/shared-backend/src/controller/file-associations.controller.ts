import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { FileAssociationsService } from '../service/file-associations.service';
import { CreateFileAssociationDto } from '../dto/create/create-file-association.dto';
import { UpdateFileAssociationDto } from '../dto/update/update-file-association.dto';
import { QueryFileAssociationDto } from '../dto/query/query-file-association.dto';
import { FileAssociationDto } from '../dto/file-association.dto';
import { Auth } from '../decorator/auth.decorator';
import { ApiResponseEntity } from '../decorator/api-response-entity.decorator';
import { ResponseEntity } from '../entity';
import { PageMetaDto } from '../dto/query/page-meta.dto';

@ApiTags('FILE-ASSOCIATIONS')
@Controller()
export class FileAssociationsController {
  constructor(private readonly service: FileAssociationsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async createFileAssociation(@Body() createFileAssociationDto: CreateFileAssociationDto) {
    const fileAssociation = await this.service.create(createFileAssociationDto);

    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(FileAssociationDto, fileAssociation),
    );
  }

  @Get(':fileAssociationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async getFileAssociation(@Param('fileAssociationId') fileAssociationId: string) {
    const fileAssociation = await this.service.getUnique({
      where: { id: fileAssociationId },
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(FileAssociationDto, fileAssociation),
    );
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async removeFileAssociations(@Body() fileAssociationIds: string[]) {
    const fileAssociations = await this.service.updateMany({
      where: { id: { in: fileAssociationIds } },
      data: { removedAt: new Date() },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', fileAssociations.count);
  }

  @Patch(':fileAssociationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async updateFileAssociation(
    @Param('fileAssociationId') fileAssociationId: string,
    @Body() updateFileAssociationDto: UpdateFileAssociationDto,
  ) {
    const fileAssociation = await this.service.update({
      where: { id: fileAssociationId },
      data: updateFileAssociationDto,
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(FileAssociationDto, fileAssociation),
    );
  }

  @Patch(':fileAssociationId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async removeFileAssociation(@Param('fileAssociationId') fileAssociationId: string) {
    const fileAssociation = await this.service.remove(fileAssociationId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(FileAssociationDto, fileAssociation),
    );
  }

  @Delete(':fileAssociationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async deleteFileAssociation(@Param('fileAssociationId') fileAssociationId: string) {
    const fileAssociation = await this.service.deleteById(fileAssociationId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(FileAssociationDto, fileAssociation),
    );
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK, { isArray: true })
  async getFileAssociationsByQuery(@Query() query: QueryFileAssociationDto) {
    const { fileAssociations, count } = await this.service.getFileAssociationsByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(FileAssociationDto, fileAssociations),
      query.toPageMetaDto(count),
    );
  }
}
