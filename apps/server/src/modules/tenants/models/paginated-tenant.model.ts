import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../../common/models';
import { Tenant } from './tenant.model';

@ObjectType()
export class PaginatedTenant extends Paginated(Tenant) {}
