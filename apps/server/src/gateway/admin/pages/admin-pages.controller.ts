import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity, Auth, PageDto, PageService, ResponseEntity } from '@shared';

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
    return new ResponseEntity(200, '성공', this.pageService.getPages());
  }
}
