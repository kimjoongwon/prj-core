import { Field, Int, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class BaseEntity {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  cuid: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
