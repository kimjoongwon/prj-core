import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { TimelineItem } from '../models/timelineItem.model';

@InputType()
export class UpdateTimelineItemInput extends PartialType(
  TimelineItem,
  InputType,
) {
  @Field(type => ID!, { nullable: true })
  id: string;
}
