import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimelineItemService } from './timeline-item.service';
import { CreateTimelineItemDto } from './dto/create-timeline-item.dto';
import { UpdateTimelineItemDto } from './dto/update-timeline-item.dto';

@Controller('timeline-item')
export class TimelineItemController {
  constructor(private readonly timelineItemService: TimelineItemService) {}

  @Post()
  create(@Body() createTimelineItemDto: CreateTimelineItemDto) {
    return this.timelineItemService.create(createTimelineItemDto);
  }

  @Get()
  findAll() {
    return this.timelineItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timelineItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimelineItemDto: UpdateTimelineItemDto) {
    return this.timelineItemService.update(+id, updateTimelineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timelineItemService.remove(+id);
  }
}
