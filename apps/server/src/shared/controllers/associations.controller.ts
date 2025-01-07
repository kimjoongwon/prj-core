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
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorators';
import {
  AssociationDto,
  CreateAssociationDto,
  UpdateAssociationDto,
  AssociationQueryDto,
} from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { AssociationsService } from '../services';

@Controller()
export class AssociationsController {
  constructor(private readonly service: AssociationsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssociationDto, HttpStatus.OK)
  async createAssociation(
    @Param('groupId') groupId: string,
    @Param('serviceId') serviceId: string,
    @Body()
    createAssociationDto: CreateAssociationDto,
  ) {
    const association = await this.service.create(createAssociationDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssociationDto, association));
  }

  @Get(':associationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssociationDto, HttpStatus.OK)
  async getAssociation(
    @Param('associationId') associationId: string,
    @Param('groupId') groupId: string,
  ) {
    const association = await this.service.getUnique({
      where: { id: associationId, groupId: groupId },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssociationDto, association));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssociationDto, HttpStatus.OK)
  async removeAssociations(@Body() associationIds: string[]) {
    const associations = await this.service.updateMany({
      where: { id: { in: associationIds } },
      data: { removedAt: new Date() },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', associations.count);
  }

  @Patch(':associationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssociationDto, HttpStatus.OK)
  async updateAssociation(
    @Param('associationId') associationId: string,
    @Body() updateAssociationDto: UpdateAssociationDto,
  ) {
    const association = await this.service.update({
      where: { id: associationId },
      data: updateAssociationDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssociationDto, association));
  }

  @Patch(':associationId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssociationDto, HttpStatus.OK)
  async removeAssociation(@Param('associationId') associationId: string) {
    const association = await this.service.remove(associationId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssociationDto, association));
  }

  @Delete(':associationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssociationDto, HttpStatus.OK)
  async deleteAssociation(@Param('associationId') associationId: string) {
    const association = await this.service.deleteById(associationId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(AssociationDto, association));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(AssociationDto, HttpStatus.OK, { isArray: true })
  async getAssociationsByQuery(
    @Param('groupId') groupId: string,
    @Param('serviceId') serviceId: string,
    @Query() query: AssociationQueryDto,
  ) {
    query.groupId = groupId;
    query.serviceId = serviceId;

    const { count, associations } = await this.service.getManyByQuery(query.toArgs());

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      associations.map((association) => plainToInstance(AssociationDto, association)),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
