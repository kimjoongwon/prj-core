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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorators';
import { SpaceDto, CreateSpaceDto, UpdateSpaceDto, SpaceQueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities';
import { SpacesService } from '../services';

@ApiTags('ADMIN_SPACES')
@Controller()
export class SpacesController {
  constructor(private readonly service: SpacesService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async createSpace(@Body() createSpaceDto: CreateSpaceDto) {
    const space = await this.service.create({ data: createSpaceDto });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SpaceDto, space));
  }

  @Get(':spaceId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async getSpace(@Param('spaceId') spaceId: string) {
    const space = await this.service.getUnique({ where: { id: spaceId } });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SpaceDto, space));
  }

  @Patch(':spaceId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async updateSpace(@Param('spaceId') spaceId: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    const space = await this.service.update(spaceId, updateSpaceDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SpaceDto, space));
  }

  @Patch(':spaceId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async removeSpace(@Param('spaceId') spaceId: string) {
    const space = await this.service.remove(spaceId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SpaceDto, space));
  }

  @Delete(':spaceId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async deleteSpace(@Param('spaceId') spaceId: string) {
    const space = await this.service.delete(spaceId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SpaceDto, space));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK, { isArray: true })
  async getSpacesByQuery(@Query() pageQueryDto: SpaceQueryDto) {
    const { count, spaces } = await this.service.getManyByQuery(pageQueryDto);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      spaces.map((space) => plainToInstance(SpaceDto, space)),
      new PageMetaDto(pageQueryDto.skip, pageQueryDto.take, count),
    );
  }
}
