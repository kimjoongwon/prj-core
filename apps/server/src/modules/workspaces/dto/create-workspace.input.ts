import { InputType, Int, Field, PartialType, OmitType } from '@nestjs/graphql';
import { Workspace } from '../entities/workspace.entity';

@InputType()
export class CreateWorkspaceInput extends OmitType(
  Workspace,
  ['updatedAt', 'createdAt'] as const,
  InputType,
) {}
