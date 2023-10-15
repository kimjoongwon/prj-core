import { Paginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { CategoryItem } from './category-item.entity';

@ObjectType()
export class PaginatedCategoryItem extends Paginated(CategoryItem) {}
