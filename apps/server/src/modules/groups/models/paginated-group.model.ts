import { Paginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { Group } from './group.model';

@ObjectType()
export class PaginatedGroup extends Paginated(Group) {}
