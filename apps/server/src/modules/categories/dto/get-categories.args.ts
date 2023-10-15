import { PaginationArgs } from '@common';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetCategoriesArgs extends PaginationArgs {}
