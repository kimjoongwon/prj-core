import { ObjectType, PartialType } from '@nestjs/graphql';
import { UpdateServiceInput } from '../dto/update-service.input';

@ObjectType()
export class ServiceForm extends PartialType(UpdateServiceInput, ObjectType) {}

export const serviceForm = {
  name: '',
  categoryId: '',
};
