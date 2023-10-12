import { Field, Int, GraphQLISODateTime, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export class BaseForm {
  @Field(type => String, { nullable: true })
  cuid?: string;

  @Field(type => GraphQLISODateTime)
  createdAt: Date;

  @Field(type => GraphQLISODateTime)
  updatedAt: Date;
}
