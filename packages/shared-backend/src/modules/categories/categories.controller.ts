import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ServiceSpaceDto } from '../../dto';
import { ResponseEntity } from '../../entity';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { CategoryEntity } from './entities/category.entity';

@ApiTags('categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiBearerAuth()
  // @ApiParam({
  //   name: 'serviceId',
  //   type: 'string',
  //   example: 'cltbdwy4t0000aze04ql33b9s',
  // })
  // @ApiParam({
  //   name: 'spaceId',
  //   type: 'string',
  //   example: 'cluh249ey0000xmps4yq8kwym',
  // })
  @ApiBearerAuth()
  @ApiResponseEntity(CategoryEntity)
  getCategories(@Param() serviceSpaceDto: ServiceSpaceDto) {
    return this.categoriesService.getCategoriesByServiceSpace(serviceSpaceDto);
  }

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, type: ResponseEntity<CategoryDto> })
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
