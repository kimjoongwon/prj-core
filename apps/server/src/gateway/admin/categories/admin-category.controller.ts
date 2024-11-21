import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity, Auth, CategoryDto, ResponseEntity } from '@shared';
import { CategoryService } from './admin-categories.service';
import { plainToInstance } from 'class-transformer';

@ApiTags('ADMIN_CATEGORY')
@Controller()
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('children')
  @ApiCookieAuth('accessToken')
  @Auth([])
  @ApiResponseEntity(CategoryDto, HttpStatus.OK, { isArray: true })
  async getChildrenCategories(@Query('ancestorIds') ancestorIds: string[]) {
    const categories = await this.categoryService.getChildCategories(ancestorIds);
    return new ResponseEntity(
      HttpStatus.OK,
      '자식 카테고리 조회 성공',
      categories?.map((category) => plainToInstance(CategoryDto, category)),
    );
  }

  @Get(':categoryId/ancestors')
  @ApiResponseEntity(CategoryDto, HttpStatus.OK, { isArray: true })
  async getAncestorCategories(@Param('categoryId') categoryId: string) {
    const ancestorCategories = await this.categoryService.getAncestorCategories(categoryId);

    return new ResponseEntity(
      HttpStatus.OK,
      '부모 카테고리 조회 성공',
      ancestorCategories?.map((category) => plainToInstance(CategoryDto, category)),
    );
  }
}
