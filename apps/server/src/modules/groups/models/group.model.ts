import { Base } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';

@ObjectType()
class PT {
  @Field(type => String)
  ko: string;

  @Field(type => String)
  en: string;
}

@ObjectType()
export class Group extends Base {
  @Field(type => GraphQLJSONObject)
  name: Locale;

  @Field(type => String)
  serviceId: string;

  @Field(type => String)
  categoryId: string;
}
