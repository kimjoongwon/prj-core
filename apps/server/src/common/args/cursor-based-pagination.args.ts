import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class CursorBasedPaginationArgs {
  @Field(type => Int, { nullable: true })
  take?: number;

  @Field(type => String, { nullable: true })
  cursor?: string;

  @Field(type => Int, { defaultValue: 1, nullable: true })
  skip?: number;

  @Field(type => Int, { defaultValue: 1, nullable: true })
  page?: number;
}
