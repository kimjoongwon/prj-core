import { Paginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { Tenant } from './tenant.model';

@ObjectType()
export class PaginatedTenant extends Paginated(Tenant) {}
