import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class CursorBasedPaginationArgs {
  @Field(type => Int)
  take?: number;

  @Field(type => String)
  cursor: string;

  @Field(type => Int, { defaultValue: 1 })
  skip?: number;
}
