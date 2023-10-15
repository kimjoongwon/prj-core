import { Field, GraphQLISODateTime, InterfaceType, ID } from '@nestjs/graphql';

@InterfaceType()
export class BaseEntity {
  @Field(type => ID)
  id: string;

  @Field(type => GraphQLISODateTime)
  createdAt: Date;

  @Field(type => GraphQLISODateTime)
  updatedAt: Date;
}
