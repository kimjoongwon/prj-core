import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity, Auth, PageDto, PageService, ResponseEntity } from '@shared';
import { MainServicePageDto } from '../../../shared/domains/page/dtos/main-service-page.dto';

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

  @Get('main-service-pages')
  @Auth([], { public: true })
  @ApiResponseEntity(MainServicePageDto, 200, {
    isArray: true,
  })
  async getMainServicePages() {
    const pages = await this.pageService.getMainServicePages();
    return new ResponseEntity(200, '성공', pages);
  }
}
