import { ObjectType } from '@nestjs/graphql';
import { CategoryItem } from './category-item.model';
import { Paginated } from '../../../common/models';

@ObjectType()
export class PaginatedCategoryItem extends Paginated(CategoryItem) {}
