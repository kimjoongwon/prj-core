import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Timeline } from '../models/timeline.model';

@InputType()
export class UpdateTimelineInput extends PartialType(Timeline, InputType) {
  @Field(type => ID!, { nullable: true })
  id: string;
}
