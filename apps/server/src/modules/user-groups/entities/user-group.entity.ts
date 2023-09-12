import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserGroup {
  @Field(() => String, { description: '유저그룹명' })
  name: string;
}
