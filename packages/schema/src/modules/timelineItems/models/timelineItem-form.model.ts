import { ObjectType, IntersectionType, Field } from '@nestjs/graphql';
import { CreateTimelineItemInput } from '../dto/create-timelineItem.input';

@ObjectType()
class AdditionalForm {
  @Field(type => Date, { nullable: true })
  startDateTime: Date;

  @Field(type => Date, { nullable: true })
  endDateTime: Date;
}

@ObjectType()
export class TimelineItemForm extends IntersectionType(
  CreateTimelineItemInput,
  AdditionalForm,
  ObjectType,
) {}

export const defaultTimelineItemForm: TimelineItemForm = {
  title: '',
  description: '',
  address: '',
  timelineId: null,
  startDateTime: null,
  endDateTime: null,
  maxCapacity: 0,
  minCapacity: 0,
  sessionId: '',
};
