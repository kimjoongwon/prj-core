import { Field, InterfaceType, ID } from '@nestjs/graphql';

@InterfaceType()
export class Base {
  @Field(type => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt: Date;
}
