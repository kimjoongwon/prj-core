import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from './pagination.args';

@ArgsType()
export class QueryArgs extends PaginationArgs {
  @Field(type => String, { nullable: true })
  name: string;

  @Field(type => Number, { nullable: true })
  startTimestamp: number;

  @Field(type => Number, { nullable: true })
  endTimestamp: number;
}
