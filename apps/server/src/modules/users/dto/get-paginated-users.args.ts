import { CursorBasedPaginationArgs } from '@common';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetPaginatedUsersArgs extends CursorBasedPaginationArgs {
  @Field(() => String, { nullable: true })
  email?: string;
}
