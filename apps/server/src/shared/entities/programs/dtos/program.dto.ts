import { ClassField, NumberField, StringField, UUIDField } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { PostDto } from '../../posts';
import { TimelineItemDto } from '../../timeline-items';
import { Program } from '../program.entity';

export class ProgramDto extends AbstractDto implements Program {
  @UUIDField()
  postId: string;

  @UUIDField()
  timelineItemId: string;

  @StringField()
  address: string;

  @NumberField()
  maxCapacity: number;

  @NumberField()
  minCapacity: number;

  @UUIDField()
  tenantId: string;

  @ClassField(() => PostDto, { required: false })
  post?: PostDto;

  @ClassField(() => TimelineItemDto, { required: false })
  timelineItem?: TimelineItemDto;
}
