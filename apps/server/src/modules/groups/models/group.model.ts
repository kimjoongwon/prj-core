import { Field, ObjectType } from '@nestjs/graphql';
import { Group as CoCGroup } from '@coc/database';
import { Base } from '../../../common/interfaces';

@ObjectType()
export class Group extends Base implements CoCGroup {
  @Field(type => String)
  tenantId: string;

  @Field(type => String)
  serviceId: string;

  @Field(type => String)
  name: string;
}
