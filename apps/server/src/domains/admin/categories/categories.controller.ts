import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ResponseEntity,
  ApiResponseEntity,
  Auth,
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoriesService,
} from '@shared';

@ApiTags('categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Auth()
  @ApiResponseEntity(CategoryDto, { isArray: true })
  @Get()
  getCategories(
    @Param() serviceSpaceDto: { spaceId: string; serviceId: string },
  ) {
    return this.categoriesService.getCategoriesByServiceSpace(serviceSpaceDto);
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category =
      await this.categoriesService.createCategory(createCategoryDto);
    return new ResponseEntity(
      HttpStatus.OK,
      'Category created',
      new CategoryDto(category),
    );
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Get(':categoryId')
  async getCategoryById(@Param('categoryId') categoryId: string) {
    const category = await this.categoriesService.getCategoryById(categoryId);

    return new ResponseEntity(
      HttpStatus.OK,
      'Category found',
      category ? new CategoryDto(category) : null,
    );
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Patch(':categoryId')
  async updateCategory(
    @Param('categoryId') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.updateCategory(
      id,
      updateCategoryDto,
    );
    return new ResponseEntity(
      HttpStatus.OK,
      'Category updated',
      new CategoryDto(category),
    );
  }
}
