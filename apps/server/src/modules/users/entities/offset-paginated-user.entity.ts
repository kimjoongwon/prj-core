import { OffsetPaginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class OffsetBasedPaginatedUser extends OffsetPaginated(User) {}
