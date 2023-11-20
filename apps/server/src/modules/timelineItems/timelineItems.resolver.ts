import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TimelineItemsService } from './timelineItems.service';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CreateTimelineItemInput } from './dto/create-timelineItem.input';
import { GetTimelineItemsArgs } from './dto/get-timelineItems.args';
import { UpdateTimelineItemInput } from './dto/update-timelineItem.input';
import { PaginatedTimelineItem } from './models/paginated-timelineItem.model';
import { TimelineItemForm } from './models/timelineItem-form.model';
import { TimelineItem } from './models/timelineItem.model';

@Resolver(() => TimelineItem)
@UseGuards(GqlAuthGuard)
export class TimelineItemsResolver {
  constructor(private readonly timelineItemsService: TimelineItemsService) {}

  @Public()
  @Mutation(() => TimelineItem)
  createTimelineItem(
    @Args('createTimelineItemInput')
    createTimelineItemInput: CreateTimelineItemInput,
  ) {
    return this.timelineItemsService.create(createTimelineItemInput);
  }

  @Public()
  @Mutation(() => TimelineItem)
  updateTimelineItem(
    @Args('updateTimelineItemInput')
    updateTimelineItemInput: UpdateTimelineItemInput,
  ) {
    return this.timelineItemsService.update(updateTimelineItemInput);
  }

  @Public()
  @Mutation(() => TimelineItem)
  deleteTimelineItem(@Args('id') id: string) {
    return this.timelineItemsService.delete(id);
  }

  @Public()
  @Query(() => TimelineItem, { name: 'timeline_item' })
  getTimelineItem(@Args('id') id: string) {
    return this.timelineItemsService.findOne(id);
  }

  @Public()
  @Query(() => TimelineItemForm, { name: 'timeline_itemForm' })
  getTimelineItemForm() {
    return this.timelineItemsService.findForm();
  }

  @Public()
  @Query(() => PaginatedTimelineItem, { name: 'timeline_items' })
  getTimelineItems(@Args() args: GetTimelineItemsArgs) {
    return this.timelineItemsService.findPaginatedTimelineItem(args);
  }
}
