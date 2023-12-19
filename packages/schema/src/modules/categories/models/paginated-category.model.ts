import { ObjectType } from '@nestjs/graphql';
import { Category } from './category.model';
import { Paginated } from '../../../common/models';

@ObjectType()
export class PaginatedCategory extends Paginated(Category) {}
