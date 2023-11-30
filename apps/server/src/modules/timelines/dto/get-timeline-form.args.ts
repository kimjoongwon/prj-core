import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetTimelineFormArgs {
  @Field(type => String)
  timelineId: string;

  @Field(type => String)
  sessionId: string;
}
