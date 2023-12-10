import { Field, ObjectType } from '@nestjs/graphql';
import { Profile as CoCProfile } from '@prisma/client';
import { Base } from '../../../common/interfaces';

@ObjectType()
export class ProfileEntity extends Base implements CoCProfile {
  @Field()
  phone: string;

  @Field()
  nickname: string;

  @Field()
  userId: string;
}
