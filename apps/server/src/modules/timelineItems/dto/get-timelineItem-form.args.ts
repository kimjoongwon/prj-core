import { Field } from '@nestjs/graphql';

export class GetTimelineItemFormArgs {
  @Field(type => String)
  timelineItemId: string;

  @Field(type => String)
  timelineId: string;
}
