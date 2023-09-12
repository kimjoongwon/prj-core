import { BaseEntity } from '@common';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Workspace extends BaseEntity {
  @Field(() => String, { description: '소유주' })
  name: string;

  @Field(() => String, { description: '소유주' })
  userId: string[];

  @Field(() => String, { description: '워크스페이스 오너' })
  phone: string;
}
