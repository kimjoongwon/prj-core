import { ObjectType, PartialType } from '@nestjs/graphql';
import { CreateWorkspaceInput } from '../dto';

@ObjectType()
export class WorkspaceForm extends PartialType(
  CreateWorkspaceInput,
  ObjectType,
) {}

export const workspaceForm = {
  name: '',
};
