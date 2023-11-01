import { Paginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { Workspace } from './workspace.model';

@ObjectType()
export class PaginatedWorkspace extends Paginated(Workspace) {}
