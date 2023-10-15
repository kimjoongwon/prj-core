import { PaginationArgs } from '@common';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetPaginatedUserArgs extends PaginationArgs {
  @Field(() => String, { nullable: true })
  email?: string;
}
