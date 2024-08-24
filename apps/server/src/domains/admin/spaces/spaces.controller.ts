import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiEndpoints,
  ApiResponseEntity,
  Auth,
  Public,
  ResponseEntity,
  SpaceDto,
  SpaceService,
} from '@shared';

@ApiTags('ADMIN_SPACES')
@Controller(ApiEndpoints.ADMIN_SPACES)
export class SpacesController {
  constructor(private readonly spaceService: SpaceService) {}

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

  @Public()
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
