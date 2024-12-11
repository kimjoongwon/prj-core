import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ADMIN_TIMELINE_ITEMS')
@Controller()
export class AdminTimelineItemsController {}
