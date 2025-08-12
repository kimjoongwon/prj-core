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
  CreateFileAssociationDto,
  FileAssociationDto,
  QueryFileAssociationDto,
  ResponseEntity,
  UpdateFileAssociationDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ApiResponseEntity } from "../../decorator/api-response-entity.decorator";
import { Auth } from "../../decorator/auth.decorator";
import { FileAssociationsService } from "../../service/resources/file-associations.service";

@ApiTags("FILE-ASSOCIATIONS")
@Controller()
export class FileAssociationsController {
  constructor(private readonly service: FileAssociationsService) {}

  @Post()
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async createFileAssociation(
    @Body() createFileAssociationDto: CreateFileAssociationDto
  ) {
    const fileAssociation = await this.service.create(createFileAssociationDto);

    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(FileAssociationDto, fileAssociation)
    );
  }

  @Get(":fileAssociationId")
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async getFileAssociation(
    @Param("fileAssociationId") fileAssociationId: string
  ) {
    const fileAssociation = await this.service.getById(fileAssociationId);
    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(FileAssociationDto, fileAssociation)
    );
  }

  @Patch("removedAt")
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async removeFileAssociations(@Body() fileAssociationIds: string[]) {
    // Process each ID individually since updateMany is discontinued
    const promises = fileAssociationIds.map((id) =>
      this.service.removeById(id)
    );
    const results = await Promise.all(promises);
    return new ResponseEntity(HttpStatus.OK, "성공", results.length);
  }

  @Patch(":fileAssociationId")
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async updateFileAssociation(
    @Param("fileAssociationId") fileAssociationId: string,
    @Body() updateFileAssociationDto: UpdateFileAssociationDto
  ) {
    const fileAssociation = await this.service.updateById(
      fileAssociationId,
      updateFileAssociationDto
    );
    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(FileAssociationDto, fileAssociation)
    );
  }

  @Patch(":fileAssociationId/removedAt")
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async removeFileAssociation(
    @Param("fileAssociationId") fileAssociationId: string
  ) {
    const fileAssociation = await this.service.removeById(fileAssociationId);
    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(FileAssociationDto, fileAssociation)
    );
  }

  @Delete(":fileAssociationId")
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK)
  async deleteFileAssociation(
    @Param("fileAssociationId") fileAssociationId: string
  ) {
    const fileAssociation = await this.service.deleteById(fileAssociationId);
    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(FileAssociationDto, fileAssociation)
    );
  }

  @Get()
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(FileAssociationDto, HttpStatus.OK, { isArray: true })
  async getFileAssociationsByQuery(@Query() query: QueryFileAssociationDto) {
    const { fileAssociations, count } =
      await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(FileAssociationDto, fileAssociations),
      query.toPageMetaDto(count)
    );
  }
}
