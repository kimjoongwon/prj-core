import { Paginated } from '@common/models';
import { ObjectType } from '@nestjs/graphql';
import { Role } from './role.model';

@ObjectType()
export class PaginatedRole extends Paginated(Role) {}
