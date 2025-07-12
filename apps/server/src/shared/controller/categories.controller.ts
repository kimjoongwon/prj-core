import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  CategoryDto,
  type CreateCategoryDto,
  type QueryCategoryDto,
  ResponseEntity,
  type UpdateCategoryDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ApiResponseEntity, Auth } from "../decorator";
import type { CategoriesService } from "../service/services";

@ApiTags("CATEGORIES")
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }
  @Auth([])
  @ApiResponseEntity(CategoryDto, HttpStatus.OK, { isArray: true })
  @Get()
  async getCategoriesByQuery(@Query() query: QueryCategoryDto) {
    const { categories, count } = await this.categoriesService.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'Successfully fetched categories',
      categories.map((category) => plainToInstance(CategoryDto, category)),
      query.toPageMetaDto(count)
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
      plainToInstance(CategoryDto, category)
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
      plainToInstance(CategoryDto, category)
    );
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Patch(":categoryId")
  async updateCategoryById(
    @Param('categoryId') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.updateById(
      id,
      updateCategoryDto,
    );
    return new ResponseEntity(
      HttpStatus.OK,
      "Category updated",
      plainToInstance(CategoryDto, category),
    );
  }

  @Auth()
  @ApiResponseEntity(CategoryDto)
  @Delete(':categoryId')
  async deleteCategoryById(@Param('categoryId') id: string) {
    await this.categoriesService.deleteById(id);
    return new ResponseEntity(HttpStatus.OK, 'Category deleted');
  }
}
