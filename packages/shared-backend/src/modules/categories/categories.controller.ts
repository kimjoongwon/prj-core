import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ServiceSpaceDto } from '../../dto';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { Auth } from '../../decorators';
import { ResponseEntity, ResponseStatus } from '../../entity';

@ApiTags('categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Auth()
  @ApiResponseEntity(CategoryDto, { isArray: true })
  @Get()
  getCategories(@Param() serviceSpaceDto: ServiceSpaceDto) {
    return this.categoriesService.getCategoriesByServiceSpace(serviceSpaceDto);
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category =
      await this.categoriesService.createCategory(createCategoryDto);
    return new ResponseEntity(
      ResponseStatus.CREATED,
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
      ResponseStatus.OK,
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
      ResponseStatus.OK,
      'Category updated',
      new CategoryDto(category),
    );
  }
}
