import { Paginated } from '../../../common/models/paginated.model';
import { ObjectType } from '@nestjs/graphql';
import { TimelineItem } from './timelineItem.model';

@ObjectType()
export class PaginatedTimelineItem extends Paginated(TimelineItem) {}
