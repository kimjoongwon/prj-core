import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
