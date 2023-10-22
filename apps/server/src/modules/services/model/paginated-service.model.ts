import { Paginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { Service } from './service.entity';

@ObjectType()
export class PaginatedService extends Paginated(Service) {}
