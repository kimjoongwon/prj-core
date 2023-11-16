import { IntersectionType, ObjectType } from '@nestjs/graphql';
import { CreateSpaceInput } from '../dto/index';

@ObjectType()
class Form {}

@ObjectType()
export class SpaceForm extends IntersectionType(
  CreateSpaceInput,
  Form,
  ObjectType,
) {}
