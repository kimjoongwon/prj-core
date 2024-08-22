import { Controller, Post, Body, Patch, Param, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ResponseEntity,
  ApiResponseEntity,
  Auth,
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryService,
  ApiEndpoints,
} from '@shared';

@ApiTags('ADMIN_CATEGORY')
@Controller(ApiEndpoints.ADMIN_CATEGORIES)
export class CategoriesController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth()
  @ApiResponseEntity(CategoryDto, HttpStatus.OK, { isArray: true })
  @Get()
  getCategories(@Param() serviceSpaceDto: { spaceId: string; serviceId: string }) {
    return this.categoryService.getCategoriesByServiceSpace(serviceSpaceDto);
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(createCategoryDto);
    return new ResponseEntity(HttpStatus.OK, 'Category created', new CategoryDto(category));
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Get(':categoryId')
  async findCategoryById(@Param('categoryId') categoryId: string) {
    const category = await this.categoryService.findCategoryById(categoryId);

    return new ResponseEntity(
      HttpStatus.OK,
      'Category found',
      category ? new CategoryDto(category) : category,
    );
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Patch(':categoryId')
  async updateCategory(
    @Param('categoryId') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.updateCategory(id, updateCategoryDto);
    return new ResponseEntity(HttpStatus.OK, 'Category updated', new CategoryDto(category));
  }
}
