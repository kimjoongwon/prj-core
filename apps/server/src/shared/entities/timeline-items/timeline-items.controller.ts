import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimelineItemsService } from './timeline-items.service';
import { CreateTimelineItemDto } from './dto/create-timeline-item.dto';
import { UpdateTimelineItemDto } from './dto/update-timeline-item.dto';

@Controller('timeline-items')
export class TimelineItemsController {
  constructor(private readonly timelineItemsService: TimelineItemsService) {}

  @Post()
  create(@Body() createTimelineItemDto: CreateTimelineItemDto) {
    return this.timelineItemsService.create(createTimelineItemDto);
  }

  @Get()
  findAll() {
    return this.timelineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timelineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimelineItemDto: UpdateTimelineItemDto) {
    return this.timelineItemsService.update(+id, updateTimelineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timelineItemsService.remove(+id);
  }
}
