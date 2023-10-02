import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';

export const userDefaultObject = {
  email: '',
  password: '',
  profile: {
    nickname: '',
    phone: '',
  },
};
@ObjectType()
export class ProfileDefaultObject {
  @Field()
  phone: string;

  @Field()
  nickname: string;
}

@ObjectType()
export class UserDefaultObject {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field(type => ProfileDefaultObject)
  profile: ProfileDefaultObject;
}
