import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth, BuilderService, ResponseEntity } from '@shared';

@ApiTags('ADMIN_BUILDER')
@Controller()
export class AdminBuilderController {
  constructor(private readonly builderService: BuilderService) {}

  @Get()
  @Auth([], { public: true })
  // @ApiResponseEntity(null, 200)
  async getAppBuilder() {
    const pages = await this.builderService.getAppBuilder();
    return new ResponseEntity(200, '성공', pages);
  }

  @Get('/nav-items')
  @Auth([], { public: true })
  // @ApiResponseEntity(null, 200)
  async getNavItems() {
    const pages = await this.builderService.getNavItems();
    return new ResponseEntity(200, '성공', pages);
  }
}
