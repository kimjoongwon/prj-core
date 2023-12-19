import { ObjectType } from '@nestjs/graphql';
import { Space } from './space.model';
import { Paginated } from '../../../common/models';

@ObjectType()
export class PaginatedSpace extends Paginated(Space) {}
