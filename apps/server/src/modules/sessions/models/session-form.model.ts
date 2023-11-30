import { ObjectType, IntersectionType } from '@nestjs/graphql';
import { CreateSessionInput } from '../dto/create-session.input';

@ObjectType()
class AdditionalForm {}

@ObjectType()
export class SessionForm extends IntersectionType(
  CreateSessionInput,
  AdditionalForm,
  ObjectType,
) {}

export const defaultSessionForm: SessionForm = {
  name: '',
  tenantId: '',
  dates: [],
};
