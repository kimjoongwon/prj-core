import { IntersectionType, ObjectType } from '@nestjs/graphql';
import { CreateWorkspaceInput } from '../dto';

@ObjectType()
class Form {}

@ObjectType()
export class WorkspaceForm extends IntersectionType(
  CreateWorkspaceInput,
  Form,
  ObjectType,
) {}
