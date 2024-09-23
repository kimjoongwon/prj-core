import { PartialType } from '@nestjs/swagger';
import { CreateTimelineItemDto } from './create-timeline-item.dto';
import { StringField } from '../../../decorators/field.decorators';

export class UpdateTimelineItemDto extends PartialType(CreateTimelineItemDto) {
  @StringField()
  id: string;
}
