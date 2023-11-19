import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from '../../../common/dto';

@ArgsType()
export class GetCategoryItemsArgs extends PaginationArgs {}
