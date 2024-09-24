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
import {
  ApiEndpoints,
  ApiResponseEntity,
  Auth,
  CreateSpaceDto,
  PageMetaDto,
  RemoveManySpaceDto,
  ResponseEntity,
  SpaceDto,
  SpaceQueryDto,
  SpacesService,
  TenancyDto,
  UpdateSpaceDto,
} from '@shared';

@ApiTags('ADMIN_SPACES')
@Controller(ApiEndpoints.ADMIN_SPACES)
export class SpacesController {
  constructor(private readonly service: SpacesService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenancyDto, HttpStatus.OK)
  async createSpace(@Body() createSpaceDto: CreateSpaceDto) {
    const space = await this.service.create({ data: createSpaceDto });
    return new ResponseEntity(HttpStatus.OK, '성공', new SpaceDto(space));
  }

  @Get(':spaceId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async getSpace(@Param('spaceId') spaceId: string) {
    const space = await this.service.getUnique({ where: { id: spaceId } });
    return new ResponseEntity(HttpStatus.OK, '성공', new SpaceDto(space));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async removeSpaces(@Body() { spaceIds }: RemoveManySpaceDto) {
    const spaces = await this.service.removeMany(spaceIds);
    return new ResponseEntity(HttpStatus.OK, '성공', spaces.count);
  }

  @Patch(':spaceId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async updateSpace(@Param('spaceId') spaceId: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    const space = await this.service.update(spaceId, updateSpaceDto);
    return new ResponseEntity(HttpStatus.OK, '성공', new SpaceDto(space));
  }

  @Patch(':spaceId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async removeSpace(@Param('spaceId') spaceId: string) {
    const space = await this.service.remove(spaceId);
    return new ResponseEntity(HttpStatus.OK, '성공', new SpaceDto(space));
  }

  @Delete(':spaceId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async deleteSpace(@Param('spaceId') spaceId: string) {
    const space = await this.service.delete(spaceId);
    return new ResponseEntity(HttpStatus.OK, '성공', new SpaceDto(space));
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
      spaces.map((space) => new SpaceDto(space)),
      new PageMetaDto({
        pageQueryDto,
        itemCount: count,
      }),
    );
  }

  @Get('accessible-spaces')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK, { isArray: true })
  async getAccessibleSpaces() {
    const spaces = await this.service.getAccessibleSpaces();
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      spaces.map((space) => new SpaceDto(space)),
    );
  }
}
