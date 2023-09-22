import { BaseEntity } from '@common';
import { User } from '@modules/users/models/user.model';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Workspace extends BaseEntity {
  @Field(() => String, { description: '작업공간명' })
  name: string;

  @Field(() => String, { description: '작업공간 전화번호' })
  phone: string;

  @Field(() => User, { description: '작업공간 소유주' })
  owner: string[];
}
