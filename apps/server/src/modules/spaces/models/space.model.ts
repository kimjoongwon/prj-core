import { Base } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Space as CoCSpace } from '@coc/db';

@ObjectType()
export class Space extends Base implements CoCSpace {
  @Field(type => String)
  name: string;

  @Field(type => String)
  phone: string;

  @Field(type => String)
  address: string;
}
