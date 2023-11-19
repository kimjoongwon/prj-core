import { ObjectType } from '@nestjs/graphql';
import { Tenant } from './tenant.model';
import { Paginated } from '../../../common/models';

@ObjectType()
export class PaginatedTenant extends Paginated(Tenant) {}
