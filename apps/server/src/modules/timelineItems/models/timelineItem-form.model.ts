import { ObjectType, IntersectionType } from '@nestjs/graphql';
import { CreateTimelineItemInput } from '../dto/create-timelineItem.input';

@ObjectType()
class AdditionalForm {}

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
  timelineId: '',
  startDateTime: undefined,
  endDateTime: undefined,
  maxCapacity: 0,
  minCapacity: 0,
};
