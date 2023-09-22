import { PaginationArgs } from '@common';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetPaginatedWorkspaceArgs extends PaginationArgs {
  @Field(() => String, { nullable: true })
  email?: string;
}
