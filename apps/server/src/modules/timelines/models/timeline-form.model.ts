import { ObjectType, IntersectionType, Field } from '@nestjs/graphql';
import { CreateTimelineInput } from '../dto/create-timeline.input';
import { Option } from '../../../common/models';

@ObjectType()
class AdditionalForm {
  @Field(type => [Option])
  timelineItemOptions: Option[];
}

@ObjectType()
export class TimelineForm extends IntersectionType(
  CreateTimelineInput,
  AdditionalForm,
  ObjectType,
) {}

export const defaultTimelineForm: TimelineForm = {
  tenantId: '',
  sessionId: '',
  timelineItemIds: [],
  timelineItemOptions: [],
};
