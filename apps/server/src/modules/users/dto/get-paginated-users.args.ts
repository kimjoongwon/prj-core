import { CursorBasedPaginationArgs, OffsetBasedPaginationArgs } from '@common';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetPaginatedUsersArgs extends OffsetBasedPaginationArgs {
  @Field(() => String, { nullable: true })
  email?: string;
}
