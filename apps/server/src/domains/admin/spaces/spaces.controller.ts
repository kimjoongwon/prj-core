import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiEndpoints,
  ApiResponseEntity,
  Auth,
  CreateSpaceDto,
  PageMetaDto,
  ResponseEntity,
  SpaceDto,
  SpaceQueryDto,
  SpaceService,
} from '@shared';

@ApiTags('ADMIN_SPACES')
@Controller(ApiEndpoints.ADMIN_SPACES)
export class SpacesController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async createSpace(createSpaceDto: CreateSpaceDto) {
    const space = await this.spaceService.create(createSpaceDto);
    return new ResponseEntity(HttpStatus.OK, '성공', new SpaceDto(space));
  }

  @Get(':spaceId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async getSpace(spaceId: string) {
    const space = await this.spaceService.getUnique(spaceId);
    return new ResponseEntity(HttpStatus.OK, '성공', new SpaceDto(space));
  }

  @Patch(':spaceId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async updateSpace(spaceId: string, updateSpaceDto: CreateSpaceDto) {
    const space = await this.spaceService.update({ id: spaceId, ...updateSpaceDto });
    return new ResponseEntity(HttpStatus.OK, '성공', new SpaceDto(space));
  }

  @Patch(':spaceId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async removeSpace(spaceId: string) {
    const space = await this.spaceService.remove(spaceId);
    return new ResponseEntity(HttpStatus.OK, '성공', new SpaceDto(space));
  }

  @Delete(':spaceId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK)
  async deleteSpace(spaceId: string) {
    const space = await this.spaceService.delete(spaceId);
    return new ResponseEntity(HttpStatus.OK, '성공', new SpaceDto(space));
  }

  @Get('spaces')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SpaceDto, HttpStatus.OK, { isArray: true })
  async getSpacesByQuery(@Query() pageQueryDto: SpaceQueryDto) {
    const { count, spaces } = await this.spaceService.getManyByQuery(pageQueryDto);

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
    const spaces = await this.spaceService.getAccessibleSpaces();
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      spaces.map((space) => new SpaceDto(space)),
    );
  }

  @Auth([])
  @ApiResponse({ type: SpaceDto, isArray: true })
  @Get()
  async getAllSpace() {
    const spaces = await this.spaceService.getAllSpace();
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      spaces.map((space) => new SpaceDto(space)),
    );
  }
}
