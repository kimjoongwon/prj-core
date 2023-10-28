import { ObjectType, PartialType } from '@nestjs/graphql';
import { CreateUserServiceInput } from '../dto';

@ObjectType()
export class UserServiceForm extends PartialType(
  CreateUserServiceInput,
  ObjectType,
) {}

export const userServiceForm = {
  name: '',
};
