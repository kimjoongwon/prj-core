import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from '../../../common/interfaces/base.interface';
import { User as CoCUser } from '@prisma/client';

@ObjectType()
export class UserEntity extends Base implements CoCUser {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;
}
