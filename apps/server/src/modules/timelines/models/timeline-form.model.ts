import {
  ObjectType,
  IntersectionType,
  Field,
  OmitType,
  InputType,
} from '@nestjs/graphql';
import { CreateTimelineInput } from '../dto/create-timeline.input';
import { Session } from '../../sessions/models/session.model';
import { TimelineItem } from '../../timelineItems/models/timelineItem.model';

@ObjectType()
class AdditionalForm {
  @Field(() => Session, { nullable: true })
  session: Session;

  @Field(() => [TimelineItem], {
    defaultValue: [],
  })
  timelineItems: TimelineItem[];
}

@ObjectType()
export class TimelineForm extends IntersectionType(
  CreateTimelineInput,
  AdditionalForm,
  ObjectType,
) {
  @Field(() => Date, { nullable: true })
  date: Date;
}

export const defaultTimelineForm: TimelineForm = {
  sessionId: '',
  date: null,
  name: '',
  session: new Session(),
  timelineItems: [],
};
