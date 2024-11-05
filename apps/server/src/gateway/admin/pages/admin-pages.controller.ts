import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity, PageDto, PageService, ResponseEntity } from '@shared';
import { plainToInstance } from 'class-transformer';

@ApiTags('ADMIN_PAGES')
@Controller()
export class AdminPagesController {
  constructor(private readonly pageService: PageService) {}

  @ApiResponseEntity(PageDto, HttpStatus.OK, { isArray: true })
  @Get(':type')
  async getAllPageByType(@Param('type') type) {
    return new ResponseEntity(HttpStatus.OK, '성공', []);
  }
}
