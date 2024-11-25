import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity, Auth, PageDto, PageService, ResponseEntity } from '@shared';
import { MainNavbarItemDto } from '../../../shared/domains/page/dtos/main-service-page.dto';

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

  @Get('main-navbar-items')
  @Auth([], { public: true })
  @ApiResponseEntity(MainNavbarItemDto, 200, {
    isArray: true,
  })
  async getMainNavbarItems() {
    const pages = await this.pageService.getMainNavbarItems();
    return new ResponseEntity(200, '성공', pages);
  }
}
