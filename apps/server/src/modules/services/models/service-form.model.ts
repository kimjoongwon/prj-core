import { ObjectType, PartialType } from '@nestjs/graphql';
import { CreateServiceInput } from '../dto';

@ObjectType()
export class ServiceForm extends PartialType(CreateServiceInput, ObjectType) {}

export const serviceForm = {
  name: '',
};
