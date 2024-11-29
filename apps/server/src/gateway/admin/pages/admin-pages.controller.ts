import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity, Auth, PageDto, PageService, ResponseEntity, RouteDto } from '@shared';

@ApiTags('ADMIN_PAGES')
@Controller()
export class AdminPagesController {
  constructor(private readonly pageService: PageService) {}

  @Get()
  @Auth([], { public: true })
  @ApiResponseEntity(PageDto, 200, {
    isArray: true,
  })
  async getPages() {
    const pages = await this.pageService.getPages();
    return new ResponseEntity(200, '성공', pages);
  }

  @Get('main-service-routes')
  @Auth([], { public: true })
  @ApiResponseEntity(RouteDto, 200, {
    isArray: true,
  })
  async getMainServiceRoutes() {
    const pages = await this.pageService.getMainServiceRoutes();
    return new ResponseEntity(200, '성공', pages);
  }

  @Get('service-item-routes')
  @Auth([], { public: true })
  @ApiResponseEntity(RouteDto, 200, {
    isArray: true,
  })
  async getServiceItemRoutes() {
    const pages = await this.pageService.getServiceItemRoutes();
    return new ResponseEntity(200, '성공', pages);
  }
}
