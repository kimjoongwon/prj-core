import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(type => Int, { nullable: true })
  take?: number;

  @Field(type => Int, { defaultValue: 1, nullable: true })
  skip?: number;

  @Field(type => String, { nullable: true })
  cursor?: string;
}
