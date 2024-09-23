import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiEndpoints } from '@shared';

@ApiTags('ADMIN_TIMELINE_ITEMS')
@Controller(ApiEndpoints.ADMIN_TIMELINE_ITEMS)
export class AdminTimelineItemsController {}
