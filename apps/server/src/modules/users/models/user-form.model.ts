import { Field, ObjectType } from '@nestjs/graphql';
import { ProfileForm } from './profile-form.model';

@ObjectType()
export class UserForm {
  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;

  @Field(type => ProfileForm)
  profile: ProfileForm;
}

export const userForm = {
  id: '',
  email: '',
  password: '',
  profile: {
    nickname: '',
    phone: '',
  },
};
