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
import { SpaceAssociationsService } from '../service/space-associations.service';
import { CreateSpaceAssociationDto } from '@shared/schema';
import { UpdateSpaceAssociationDto } from '@shared/schema';
import { QuerySpaceAssociationDto } from '@shared/schema';
import { SpaceAssociationDto } from '@shared/schema';
import { Auth } from '../decorator/auth.decorator';
import { ApiResponseEntity } from '../decorator/api-response-entity.decorator';
import { ResponseEntity } from '@shared/schema';

@ApiTags('SPACE-ASSOCIATIONS')
@Controller()
export class SpaceAssociationsController {
  constructor(private readonly service: SpaceAssociationsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
  async createSpaceAssociation(@Body() createSpaceAssociationDto: CreateSpaceAssociationDto) {
    const spaceAssociation = await this.service.create(createSpaceAssociationDto);

    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(SpaceAssociationDto, spaceAssociation),
    );
  }

  @Get(':spaceAssociationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
  async getSpaceAssociation(@Param('spaceAssociationId') spaceAssociationId: string) {
    const spaceAssociation = await this.service.getUnique({
      where: { id: spaceAssociationId },
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(SpaceAssociationDto, spaceAssociation),
    );
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
  async removeSpaceAssociations(@Body() spaceAssociationIds: string[]) {
    const spaceAssociations = await this.service.updateMany({
      where: { id: { in: spaceAssociationIds } },
      data: { removedAt: new Date() },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', spaceAssociations.count);
  }

  @Patch(':spaceAssociationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
  async updateSpaceAssociation(
    @Param('spaceAssociationId') spaceAssociationId: string,
    @Body() updateSpaceAssociationDto: UpdateSpaceAssociationDto,
  ) {
    const spaceAssociation = await this.service.update({
      where: { id: spaceAssociationId },
      data: updateSpaceAssociationDto,
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(SpaceAssociationDto, spaceAssociation),
    );
  }

  @Patch(':spaceAssociationId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
  async removeSpaceAssociation(@Param('spaceAssociationId') spaceAssociationId: string) {
    const spaceAssociation = await this.service.remove(spaceAssociationId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(SpaceAssociationDto, spaceAssociation),
    );
  }

  @Delete(':spaceAssociationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK)
  async deleteSpaceAssociation(@Param('spaceAssociationId') spaceAssociationId: string) {
    const spaceAssociation = await this.service.deleteById(spaceAssociationId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(SpaceAssociationDto, spaceAssociation),
    );
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceAssociationDto, HttpStatus.OK, { isArray: true })
  async getSpaceAssociationsByQuery(@Query() query: QuerySpaceAssociationDto) {
    const { spaceAssociations, count } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(SpaceAssociationDto, spaceAssociations),
      query.toPageMetaDto(count),
    );
  }
}
