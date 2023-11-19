import { IntersectionType, ObjectType } from '@nestjs/graphql';
import { SignupInput } from '../dto/signup.input';
import { ProfileInput } from '../dto/profile.input';

@ObjectType()
class AdditionalForm {}

@ObjectType()
export class SignUpForm extends IntersectionType(
  SignupInput,
  AdditionalForm,
  ObjectType,
) {}

export const defaultSignUpForm: SignUpForm = {
  email: '',
  password: '',
  name: '',
  profile: new ProfileInput(),
};
