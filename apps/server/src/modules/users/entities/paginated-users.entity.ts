import { Paginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class PaginatedUsers extends Paginated(User) {}
