import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
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
import {
  CreateTimelineItemDto,
  TimelineItemDto,
  UpdateTimelineItemDto,
  TimelineItemQueryDto,
} from './dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';

@ApiTags('ADMIN_TIMELINE_ITEMS')
@Controller()
export class TimelineItemsController {
  constructor(private readonly service: TimelineItemsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async createTimelineItem(@Body() createTimelineItemDto: CreateTimelineItemDto) {
    const timelineItem = await this.service.create({
      data: createTimelineItemDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToClass(TimelineItemDto, timelineItem));
  }

  @Get(':timelineItemId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async getTimelineItem(@Param('timelineItemId') timelineItemId: string) {
    const timelineItem = await this.service.getUnique({
      where: {
        id: timelineItemId,
      },
    });
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
    const timelineItems = await this.service.removeMany({
      where: {
        id: {
          in: timelineItemIds,
        },
      },
      data: {
        removedAt: new Date(),
      },
    });
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
    const timelineItem = await this.service.update({
      where: {
        id: timelineItemId,
      },
      data: updateTimelineItemDto,
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(TimelineItemDto, timelineItem),
    );
  }

  @Patch(':timelineItemId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async removeTimelineItem(@Param('timelineItemId') timelineItemId: string) {
    const timelineItem = await this.service.remove({
      where: {
        id: timelineItemId,
      },
      data: {
        removedAt: new Date(),
      },
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(TimelineItemDto, timelineItem),
    );
  }

  @Delete(':timelineItemId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK)
  async deleteTimelineItem(@Param('timelineItemId') timelineItemId: string) {
    const timelineItem = await this.service.delete({
      where: {
        id: timelineItemId,
      },
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(TimelineItemDto, timelineItem),
    );
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TimelineItemDto, HttpStatus.OK, { isArray: true })
  async getTimelineItemsByQuery(
    @Query() query: TimelineItemQueryDto,
    @Headers('tenant-id') tenantId: string,
  ) {
    const { count, timelineItems } = await this.service.getManyByQuery(query.toArgs(tenantId));
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      timelineItems.map((timelineItem) => plainToInstance(TimelineItemDto, timelineItem)),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
