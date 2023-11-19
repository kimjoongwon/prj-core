import { Field, InterfaceType, ID } from '@nestjs/graphql';

@InterfaceType()
export class Base {
  @Field(type => String)
  id: string;

  @Field(type => Date)
  createdAt: Date;

  @Field(type => Date, { nullable: true })
  updatedAt: Date;

  @Field(type => Date, { nullable: true })
  deletedAt: Date;
}
