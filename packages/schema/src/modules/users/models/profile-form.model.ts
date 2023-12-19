import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProfileForm {
  @Field(type => String)
  phone: string;

  @Field(type => String)
  nickname: string;
}
