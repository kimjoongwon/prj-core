import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiEndpoints } from 'src/shared/types/enums/api-endpoints';
import { TimelineItemService } from './timeline-item.service';
import { Auth, ApiResponseEntity } from 'src/shared/decorators';
import { ResponseEntity, PageMetaDto } from '../common';
import { TenancyDto } from '../tenancy';
import {
  CreateTimelineItemDto,
  TimelineItemDto,
  UpdateTimelineItemDto,
  TimelineItemQueryDto,
} from './dto';

@ApiTags('ADMIN_TIMELINE_ITEMS')
@Controller(ApiEndpoints.ADMIN_TIMELINE_ITEMS)
export class TimelineItemController {
  constructor(private readonly timelineItemService: TimelineItemService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenancyDto, HttpStatus.OK)
  async createTimelineItem(@Body() createTimelineItemDto: CreateTimelineItemDto) {
    const timelineItem = await this.timelineItemService.create(createTimelineItemDto);
    return new ResponseEntity(HttpStatus.OK, '성공', new TimelineItemDto(timelineItem));
  }

  @Get(':timelineItemId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async getTimelineItem(@Param('timelineItemId') timelineItemId: string) {
    const timelineItem = await this.timelineItemService.getUnique(timelineItemId);
    return new ResponseEntity(HttpStatus.OK, '성공', new TimelineItemDto(timelineItem));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async removeTimelineItems(@Body() timelineItemIds: string[]) {
    const timelineItems = await this.timelineItemService.removeMany(timelineItemIds);
    return new ResponseEntity(HttpStatus.OK, '성공', timelineItems.count);
  }

  @Patch(':timelineItemId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async updateTimelineItem(
    @Param('timelineItemId') timelineItemId: string,
    @Body() updateTimelineItemDto: UpdateTimelineItemDto,
  ) {
    const timelineItem = await this.timelineItemService.update({
      id: timelineItemId,
      ...updateTimelineItemDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', new TimelineItemDto(timelineItem));
  }

  @Patch(':timelineItemId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async removeTimelineItem(@Param('timelineItemId') timelineItemId: string) {
    const timelineItem = await this.timelineItemService.remove(timelineItemId);
    return new ResponseEntity(HttpStatus.OK, '성공', new TimelineItemDto(timelineItem));
  }

  @Delete(':timelineItemId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async deleteTimelineItem(@Param('timelineItemId') timelineItemId: string) {
    const timelineItem = await this.timelineItemService.delete(timelineItemId);
    return new ResponseEntity(HttpStatus.OK, '성공', new TimelineItemDto(timelineItem));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK, { isArray: true })
  async getTimelineItemsByQuery(@Query() pageQueryDto: TimelineItemQueryDto) {
    const { count, timelineItems } = await this.timelineItemService.getManyByQuery(pageQueryDto);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      timelineItems.map((timelineItem) => new TimelineItemDto(timelineItem)),
      new PageMetaDto({
        pageQueryDto,
        itemCount: count,
      }),
    );
  }
}
