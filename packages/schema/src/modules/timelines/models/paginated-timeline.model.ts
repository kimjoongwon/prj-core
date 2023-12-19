import { Paginated } from '../../../common/models/paginated.model';
import { ObjectType } from '@nestjs/graphql';
import { Timeline } from './timeline.model';

@ObjectType()
export class PaginatedTimeline extends Paginated(Timeline) {}
