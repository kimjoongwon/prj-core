import { ObjectType, PartialType } from '@nestjs/graphql';
import { CreateTestTestInput } from '../dto';

@ObjectType()
export class TestTestForm extends PartialType(
  CreateTestTestInput,
  ObjectType,
) {}

export const testTestForm = {
  name: '',
};
