import { ObjectType } from '@nestjs/graphql';
import { Role } from './role.model';
import { Paginated } from '../../../common/models';

@ObjectType()
export class PaginatedRole extends Paginated(Role) {}
