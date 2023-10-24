import { Field, InterfaceType, ID } from '@nestjs/graphql';

@InterfaceType()
export class BaseEntity {
  @Field(type => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt: Date;
}
