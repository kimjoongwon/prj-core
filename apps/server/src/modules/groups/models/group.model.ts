import { Base } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';
import { Group as CoCGroup } from '@coc/db';

@ObjectType()
export class Group extends Base implements CoCGroup {
  @Field(type => String)
  tenantId: string;

  @Field(type => GraphQLJSONObject)
  name: CoCGroup['name'];

  @Field(type => String)
  serviceId: string;
}
