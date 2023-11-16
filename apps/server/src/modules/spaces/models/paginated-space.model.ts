import { Paginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { Space } from './space.model';

@ObjectType()
export class PaginatedSpace extends Paginated(Space) {}
