import { Paginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { Category } from './category.model';

@ObjectType()
export class PaginatedCategory extends Paginated(Category) {}
