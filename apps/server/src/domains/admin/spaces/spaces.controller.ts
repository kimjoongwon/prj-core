import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiEndpoints,
  ApiResponseEntity,
  Public,
  ResponseEntity,
  SpaceDto,
  SpaceService,
  User,
  UserDto,
} from '@shared';

@ApiTags('ADMIN_SPACES')
@Controller(ApiEndpoints.ADMIN_SPACES)
export class SpacesController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get('accessible')
  @ApiResponseEntity(SpaceDto, { isArray: true })
  async getAccessibleAllSpace(@User() user: UserDto) {
    const spaceIds = user.tenants.map((tenant) => tenant.tenancy.spaceId);
    const spaces = await this.spaceService.getAccessibleSpacesByIds(spaceIds);
    return new ResponseEntity(HttpStatus.OK, 'success', spaces);
  }

  @Public()
  @ApiResponse({ type: SpaceDto, isArray: true })
  @Get()
  async getAllSpace() {
    return this.spaceService.getAllSpace();
  }
}
