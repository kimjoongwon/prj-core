import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseEntity, CategoryDto } from '@shared';
import { CategoryService } from './admin-categories.service';

@ApiTags('ADMIN_CATEGORY')
@Controller()
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('children')
  @ApiResponseEntity(CategoryDto, HttpStatus.OK, { isArray: true })
  getChildrenCategories(@Query('ancestorIds') ancestorIds: string[]) {
    return this.categoryService.getChildCategories(ancestorIds);
  }
}
