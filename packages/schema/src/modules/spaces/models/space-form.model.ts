import { IntersectionType, ObjectType } from '@nestjs/graphql';
import { CreateSpaceInput } from '../dto/create-space.input';

@ObjectType()
class Form {}

@ObjectType()
export class SpaceForm extends IntersectionType(
  CreateSpaceInput,
  Form,
  ObjectType,
) {}

export const defaultSpaceForm: SpaceForm = {
  name: '',
  phone: '',
  address: '',
};
