import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ServiceSpaceDto } from '../../dto';
import { Public } from '../../decorators';

@ApiTags('categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiBearerAuth()
  @ApiParam({ name: 'serviceId', type: 'string' })
  @ApiParam({ name: 'spaceId', type: 'string' })
  @ApiResponse({ status: 200, type: [CategoryDto] })
  getCategories(@Param() params: ServiceSpaceDto) {
    return this.categoriesService.getCategoriesByServiceSpace(params);
  }

  @Public()
  @Get()
  getSchema() {}
  getForm() {
    const form = {
      createDto: {},
      fields: {},
      schema: {},
    };
    return form;
  }

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, type: CategoryDto })
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':categoryId')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, type: CategoryDto })
  update(
    @Param('categoryId') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
