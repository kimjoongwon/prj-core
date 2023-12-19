import { ObjectType } from '@nestjs/graphql';
import { Service } from './service.model';
import { Paginated } from '../../../common/models';

@ObjectType()
export class PaginatedService extends Paginated(Service) {}
