import { PartialType } from '@nestjs/swagger';
import { TimelineDto } from '../timeline.dto';

export class UpdateTimelineDto extends PartialType(TimelineDto) {}
