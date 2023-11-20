import { ObjectType, IntersectionType } from '@nestjs/graphql';
import { CreateTimelineInput } from '../dto/create-timeline.input';

@ObjectType()
class AdditionalForm {}

@ObjectType()
export class TimelineForm extends IntersectionType(
  CreateTimelineInput,
  AdditionalForm,
  ObjectType,
) {}

export const defaultTimelineForm: TimelineForm = {
  tenantId: '',
  sessionId: '',
};
