import { Field, ObjectType } from '@nestjs/graphql';
import { User as CoCUser } from '@prisma/client';
import { Base } from '../../../common/interfaces';

@ObjectType()
export class UserEntity extends Base implements CoCUser {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;
}
