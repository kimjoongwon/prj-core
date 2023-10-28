import { Paginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { Service } from './service.model';

@ObjectType()
export class PaginatedService extends Paginated(Service) {}
