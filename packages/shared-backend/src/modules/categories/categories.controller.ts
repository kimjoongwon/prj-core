import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ServiceSpaceDto } from '../../dto';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { Auth } from '../../decorators';

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
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponseEntity(CategoryDto)
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Auth()
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, type: CategoryDto })
  @Patch(':categoryId')
  update(
    @Param('categoryId') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
