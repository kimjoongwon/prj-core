import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('serviceId') serviceId: string,
  ) {
    const category = await this.categoriesService.create(createCategoryDto);
    return new ResponseEntity(
      ResponseStatus.CREATED,
      'Category created',
      new CategoryDto(category),
    );
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Patch(':categoryId')
  update(
    @Param('serviceId') serviceId: string,
    @Param('categoryId') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
