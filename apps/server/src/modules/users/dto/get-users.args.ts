import { PaginationArgs } from '@common';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetUsersArgs extends PaginationArgs {
  @Field({ defaultValue: '' })
  email: string;
}
