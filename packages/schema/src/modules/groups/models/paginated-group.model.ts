import { ObjectType } from '@nestjs/graphql';
import { Group } from './group.model';
import { Paginated } from '../../../common/models';

@ObjectType()
export class PaginatedGroup extends Paginated(Group) {}
