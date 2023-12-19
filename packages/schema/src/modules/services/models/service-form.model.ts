import { ObjectType, PartialType } from '@nestjs/graphql';
import { CreateServiceInput } from '../dto/create-service.input';

@ObjectType()
export class ServiceForm extends PartialType(CreateServiceInput, ObjectType) {}

export const serviceForm: ServiceForm = {
  name: '',
};
