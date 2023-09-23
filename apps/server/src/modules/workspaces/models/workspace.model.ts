import { User } from '@modules/users/models/user.model';
import { BaseEntity } from '@common';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Workspace extends BaseEntity {
  @Field()
  name: string;

  @Field(() => String, { description: '작업공간 전화번호' })
  phone: string;

  @Field(() => User, { description: '작업공간 소유주' })
  owner: User;
}
