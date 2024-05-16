import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity, Public } from '../../decorators';
import { User } from '../../decorators/user.decorator';
import { SpacesService } from './spaces.service';
import { UserDto } from '../../dto';
import { SpaceDto } from './dto';
import { ResponseEntity, ResponseStatus } from '../../entity';

@ApiTags('spaces')
@Controller()
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Get('accessible')
  @ApiResponseEntity(SpaceDto, { isArray: true })
  async getAccessibleAllSpace(@User() user: UserDto) {
    const spaceIds = user.tenants?.map(tenant => tenant.spaceId);
    const spaces = await this.spacesService.getAccessibleSpacesByIds(spaceIds);
    return new ResponseEntity(ResponseStatus['OK'], 'success', spaces);
  }

  @Public()
  @ApiResponse({ type: SpaceDto, isArray: true })
  @Get()
  async getAllSpace() {
    return this.spacesService.getAllSpace();
  }
}
