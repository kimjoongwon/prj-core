import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Profile as CoCProfile } from '@coc/db';
import { Base } from '../../../common/interfaces';

@ObjectType()
@InputType('inputProfile')
export class Profile extends Base implements CoCProfile {
  @Field(type => String)
  phone: string;

  @Field(type => String)
  nickname: string;

  @Field(type => String)
  userId: string;
}
