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
import { TimelineItemsService } from './timeline-items.service';
import { ResponseEntity, PageMetaDto } from '../common';
import { TenancyDto } from '../tenancies';
import {
  CreateTimelineItemDto,
  TimelineItemDto,
  UpdateTimelineItemDto,
  TimelineItemQueryDto,
} from './dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ApiEndpoints } from '../../types/enums/api-endpoints';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';

@ApiTags('ADMIN_TIMELINE_ITEMS')
@Controller(ApiEndpoints.ADMIN_TIMELINE_ITEMS)
export class TimelineItemsController {
  constructor(private readonly service: TimelineItemsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenancyDto, HttpStatus.OK)
  async createTimelineItem(@Body() createTimelineItemDto: CreateTimelineItemDto) {
    const timelineItem = await this.service.create(createTimelineItemDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToClass(TimelineItemDto, timelineItem));
  }

  @Get(':timelineItemId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async getTimelineItem(@Param('timelineItemId') timelineItemId: string) {
    const timelineItem = await this.service.getUnique(timelineItemId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(TimelineItemDto, timelineItem),
    );
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async removeTimelineItems(@Body() timelineItemIds: string[]) {
    const timelineItems = await this.service.removeMany(timelineItemIds);
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
    const timelineItem = await this.service.update(timelineItemId, updateTimelineItemDto);
    return new ResponseEntity(HttpStatus.OK, '성공', new TimelineItemDto(timelineItem));
  }

  @Patch(':timelineItemId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async removeTimelineItem(@Param('timelineItemId') timelineItemId: string) {
    const timelineItem = await this.service.remove(timelineItemId);
    return new ResponseEntity(HttpStatus.OK, '성공', new TimelineItemDto(timelineItem));
  }

  @Delete(':timelineItemId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async deleteTimelineItem(@Param('timelineItemId') timelineItemId: string) {
    const timelineItem = await this.service.delete(timelineItemId);
    return new ResponseEntity(HttpStatus.OK, '성공', new TimelineItemDto(timelineItem));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK, { isArray: true })
  async getTimelineItemsByQuery(@Query() pageQueryDto: TimelineItemQueryDto) {
    const { count, timelineItems } = await this.service.getManyByQuery(pageQueryDto);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      timelineItems.map((timelineItem) => plainToInstance(TimelineItemDto, timelineItem)),
      new PageMetaDto({
        pageQueryDto,
        itemCount: count,
      }),
    );
  }
}
