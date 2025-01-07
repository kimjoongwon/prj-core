import { OmitType, PartialType } from '@nestjs/swagger';
import { CategoryDto } from '../../../dtos/category.dto';

export class UpdateCategoryDto extends PartialType(
  OmitType(CategoryDto, ['parent', 'children', 'space', 'service']),
) {}
