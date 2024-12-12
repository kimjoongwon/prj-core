import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Patch,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '../common/entities/response.entity';
import { plainToInstance } from 'class-transformer';
import { PageMetaDto } from '../common';
import {
  CreateClassificationDto,
  ClassificationDto,
  UpdateClassificationDto,
  ClassificationQueryDto,
  CreateClassificationDtos,
} from '../classifications/dtos';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { ClassificationsService } from './classifications.service';

@ApiTags('ADMIN_CLASSIFICATIONS')
@Controller()
export class ClassificationsController {
  constructor(private readonly service: ClassificationsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ClassificationDto, HttpStatus.OK)
  async createClassification(@Body() createClassificationDto: CreateClassificationDto) {
    const classification = await this.service.create({
      data: createClassificationDto,
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(ClassificationDto, classification),
    );
  }

  @Post('/bulk')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ClassificationDto, HttpStatus.OK)
  async createClassifications(@Body() createClassificationDtos: CreateClassificationDtos) {
    const classifications = await this.service.createMany({
      data: createClassificationDtos.items,
      skipDuplicates: true,
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(ClassificationDto, classifications.count),
    );
  }

  @Get(':classificationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ClassificationDto, HttpStatus.OK)
  async getClassification(@Param('classificationId') classificationId: string) {
    const classification = await this.service.getUnique({ where: { id: classificationId } });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(ClassificationDto, classification),
    );
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ClassificationDto, HttpStatus.OK)
  async removeClassifications(@Body() classificationIds: string[]) {
    const classifications = await this.service.removeMany(classificationIds);
    return new ResponseEntity(HttpStatus.OK, '성공', classifications.count);
  }

  @Patch(':classificationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ClassificationDto, HttpStatus.OK)
  async updateClassification(
    @Param('classificationId') classificationId: string,
    @Body() updateClassificationDto: UpdateClassificationDto,
  ) {
    const classification = await this.service.update({
      where: { id: classificationId },
      data: updateClassificationDto,
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(ClassificationDto, classification),
    );
  }

  @Patch(':classificationId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ClassificationDto, HttpStatus.OK)
  async removeClassification(@Param('classificationId') classificationId: string) {
    const classification = await this.service.remove(classificationId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(ClassificationDto, classification),
    );
  }

  @Delete(':classificationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ClassificationDto, HttpStatus.OK)
  async deleteClassification(@Param('classificationId') classificationId: string) {
    const classification = await this.service.delete(classificationId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(ClassificationDto, classification),
    );
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ClassificationDto, HttpStatus.OK, { isArray: true })
  async getClassificationsByQuery(
    @Query() query: ClassificationQueryDto,
    @Headers('tenantId') tenantId: string,
  ) {
    const { count, classifications } = await this.service.getManyByQuery(query.toArgs());

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      classifications.map((classification) => plainToInstance(ClassificationDto, classification)),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
