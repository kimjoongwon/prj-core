import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  HttpStatus,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../../decorators';
import { ResponseEntity } from '../common';
import { CategoriesService } from './categories.service';
import { CategoryDto, CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto } from './dtos';

@ApiTags('ADMIN_CATEGORY')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Auth([])
  @ApiResponseEntity(CategoryDto, HttpStatus.OK, { isArray: true })
  @Get()
  async getCategoriesByQuery(@Query() query: CategoryQueryDto) {
    const { categories, count } = await this.categoriesService.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'Successfully fetched categories',
      categories.map((category) => plainToInstance(CategoryDto, category)),
      query.toPageMetaDto(count),
    );
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create({
      data: createCategoryDto,
    });
    return new ResponseEntity(
      HttpStatus.OK,
      'Category created',
      plainToInstance(CategoryDto, category),
    );
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Get(':categoryId')
  async getCategoryById(@Param('categoryId') categoryId: string) {
    const category = await this.categoriesService.findCategoryById(categoryId);

    return new ResponseEntity(
      HttpStatus.OK,
      'Category found',
      plainToInstance(CategoryDto, category),
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

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Delete(':categoryId')
  async deleteCategory(@Param('categoryId') id: string) {
    await this.categoriesService.deleteById(id);
    return new ResponseEntity(HttpStatus.OK, 'Category deleted');
  }
}
