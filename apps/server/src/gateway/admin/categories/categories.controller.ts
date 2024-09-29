import { Controller, Post, Body, Patch, Param, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ResponseEntity,
  ApiResponseEntity,
  Auth,
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoriesService,
  ApiEndpoints,
} from '@shared';
import { plainToInstance } from 'class-transformer';

@ApiTags('ADMIN_CATEGORY')
@Controller(ApiEndpoints.ADMIN_CATEGORIES)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Auth()
  @ApiResponseEntity(CategoryDto, HttpStatus.OK, { isArray: true })
  @Get()
  getCategories(@Param() serviceSpaceDto: { spaceId: string; serviceId: string }) {
    return this.categoriesService.getCategoriesByServiceSpace(serviceSpaceDto);
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.createCategory(createCategoryDto);
    return new ResponseEntity(
      HttpStatus.OK,
      'Category created',
      plainToInstance(CategoryDto, category),
    );
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Get(':categoryId')
  async findCategoryById(@Param('categoryId') categoryId: string) {
    const category = await this.categoriesService.findCategoryById(categoryId);

    return new ResponseEntity(
      HttpStatus.OK,
      'Category found',
      category ? plainToInstance(CategoryDto, category) : category,
    );
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Patch(':categoryId')
  async updateCategory(
    @Param('categoryId') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.updateCategory(id, updateCategoryDto);
    return new ResponseEntity(
      HttpStatus.OK,
      'Category updated',
      plainToInstance(CategoryDto, category),
    );
  }
}
