import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from '../../../common/dto';

@ArgsType()
export class GetPaginatedUserArgs extends PaginationArgs {
  @Field(() => String, { nullable: true })
  email?: string;
}
