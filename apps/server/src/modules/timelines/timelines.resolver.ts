import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { GetTimelinesArgs } from './dto/get-timelines.args';
import { CreateTimelineInput } from './dto/create-timeline.input';
import { UpdateTimelineInput } from './dto/update-timeline.input';
import { PaginatedTimeline } from './models/paginated-timeline.model';
import { TimelineForm } from './models/timeline-form.model';
import { Timeline } from './models/timeline.model';
import { get } from 'axios';
import { GetTimelineFormArgs } from './dto/get-timeline-form.args';

@Resolver(() => Timeline)
@UseGuards(GqlAuthGuard)
export class TimelinesResolver {
  constructor(private readonly timelinesService: TimelinesService) {}

  @Public()
  @Mutation(() => Timeline)
  createTimeline(
    @Args('createTimelineInput')
    createTimelineInput: CreateTimelineInput,
  ) {
    return this.timelinesService.create(createTimelineInput);
  }

  @Public()
  @Mutation(() => Timeline)
  updateTimeline(
    @Args('updateTimelineInput')
    updateTimelineInput: UpdateTimelineInput,
  ) {
    return this.timelinesService.update(updateTimelineInput);
  }

  @Public()
  @Mutation(() => Timeline)
  deleteTimeline(@Args('id') id: string) {
    return this.timelinesService.delete(id);
  }

  @Public()
  @Query(() => Timeline, { name: 'timeline' })
  getTimeline(@Args('id') id: string) {
    return this.timelinesService.findOne(id);
  }

  @Public()
  @Query(() => TimelineForm, { name: 'timelineForm' })
  getTimelineForm(@Args() args: GetTimelineFormArgs) {
    return this.timelinesService.findForm(args);
  }

  @Public()
  @Query(() => PaginatedTimeline, { name: 'timelines' })
  getTimelines(@Args() args: GetTimelinesArgs) {
    return this.timelinesService.findPaginatedTimeline(args);
  }
}
