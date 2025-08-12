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
  CreateSpaceClassificationDto,
  QuerySpaceClassificationDto,
  ResponseEntity,
  SpaceClassificationDto,
  UpdateSpaceClassificationDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ApiResponseEntity, Auth } from "../../decorator";
import { SpaceClassificationsService } from "../../service/resources/space-classifications.service";

@ApiTags("SPACE-CLASSIFICATIONS")
@Controller()
export class SpaceClassificationsController {
  constructor(private readonly service: SpaceClassificationsService) {}

  @Post()
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK)
  async createSpaceClassification(
    @Body() createSpaceClassificationDto: CreateSpaceClassificationDto
  ) {
    const spaceClassification = await this.service.create(
      createSpaceClassificationDto
    );
    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(SpaceClassificationDto, spaceClassification)
    );
  }

  @Get(":spaceClassification")
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK)
  async getSpaceClassification(@Param("id") id: string) {
    const spaceClassification = await this.service.getById(id);
    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(SpaceClassificationDto, spaceClassification)
    );
  }

  @Patch(":spaceClassificationId")
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK)
  async updateSpaceClassification(
    @Param("id") id: string,
    @Body() updateSpaceClassificationDto: UpdateSpaceClassificationDto
  ) {
    const spaceClassification = await this.service.updateById(
      id,
      updateSpaceClassificationDto
    );
    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(SpaceClassificationDto, spaceClassification)
    );
  }

  @Patch(":spaceClassificationId/removedAt")
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK)
  async removeSpaceClassification(@Param("id") id: string) {
    const spaceClassification = await this.service.removeById(id);
    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(SpaceClassificationDto, spaceClassification)
    );
  }

  @Delete(":spaceClassificationId")
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK)
  async deleteSpaceClassification(@Param("id") id: string) {
    const spaceClassification = await this.service.deleteById(id);
    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(SpaceClassificationDto, spaceClassification)
    );
  }

  @Get()
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceClassificationDto, HttpStatus.OK, { isArray: true })
  async getSpaceClassificationsByQuery(
    @Query() query: QuerySpaceClassificationDto
  ) {
    const { items, count } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      "성공",
      plainToInstance(SpaceClassificationDto, items),
      query.toPageMetaDto(count)
    );
  }
}
