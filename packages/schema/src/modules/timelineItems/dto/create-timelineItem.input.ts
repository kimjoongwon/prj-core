import { InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { BASE_FIELDS } from '../../../common/constants';
import { TimelineItem } from '../models/timelineItem.model';

@InputType()
export class CreateTimelineItemInput extends OmitType(
  TimelineItem,
  [...BASE_FIELDS],
  InputType,
) {}
