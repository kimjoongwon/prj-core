import { CursorPaginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class CursorBasedPaginatedUser extends CursorPaginated(User) {}
