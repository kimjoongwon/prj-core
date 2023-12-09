import {
  Field,
  IntersectionType,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { CreateUserInput } from '../dto/create-user.input';
import { Option } from '../../../common/models';

@ObjectType()
export class AdditionalForm {
  @Field(type => [Option])
  spaceOptions: Option[];

  @Field(type => String, { defaultValue: '' })
  password: string;

  @Field(type => [Option])
  roleOptions: Option[];
}

@ObjectType()
export class UserForm extends IntersectionType(
  CreateUserInput,
  AdditionalForm,
  ObjectType,
) {}

export const defaultUserForm: UserForm = {
  name: '',
  email: '',
  password: '',
  roleOptions: [],
  spaceOptions: [],
  roleId: '',
  spaceId: '',
  phone: '',
  nickname: '',
};
