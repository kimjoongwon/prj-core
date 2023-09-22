import { ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { Paginated } from '@common';

@ObjectType()
export class PaginatedUser extends Paginated(User) {}
