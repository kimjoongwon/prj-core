import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Space as CoCSpace } from '@coc/db';
import { Base } from '../../../common/interfaces';

@ObjectType()
@InputType('SpaceInput')
export class Space extends Base implements CoCSpace {
  @Field(type => String)
  name: string;

  @Field(type => String)
  phone: string;

  @Field(type => String)
  address: string;
}
