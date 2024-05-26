import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiResponseEntity,
  Public,
  ResponseEntity,
  SpaceDto,
  SpacesService,
  User,
  UserDto,
} from '@shared';

@ApiTags('spaces')
@Controller()
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Get('accessible')
  @ApiResponseEntity(SpaceDto, { isArray: true })
  async getAccessibleAllSpace(@User() user: UserDto) {
    const spaceIds = user.tenants?.map((tenant) => tenant.spaceId);
    const spaces = await this.spacesService.getAccessibleSpacesByIds(spaceIds);
    return new ResponseEntity(HttpStatus.OK, 'success', spaces);
  }

  @Public()
  @ApiResponse({ type: SpaceDto, isArray: true })
  @Get()
  async getAllSpace() {
    return this.spacesService.getAllSpace();
  }
}
