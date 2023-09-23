import { Paginated } from '@common';
import { Workspace } from './workspace.model';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedWorkspace extends Paginated(Workspace) {}
