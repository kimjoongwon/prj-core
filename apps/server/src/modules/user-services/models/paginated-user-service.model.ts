import { Paginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { UserService } from './user-service.model';

@ObjectType()
export class PaginatedUserService extends Paginated(UserService) {}
