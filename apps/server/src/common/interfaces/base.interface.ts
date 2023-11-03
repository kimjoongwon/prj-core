import { Field, InterfaceType, ID } from '@nestjs/graphql';

@InterfaceType()
export class Base {
  @Field(type => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field(type => Date, { nullable: true })
  updatedAt: Date;

  @Field(type => Date, { nullable: true })
  deletedAt: Date;
}
