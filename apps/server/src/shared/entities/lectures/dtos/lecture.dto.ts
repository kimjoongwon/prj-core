import { ClassField, NumberField, StringField, UUIDField } from '../../../decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { TimelineItem, TimelineItemDto } from '../../timeline-items';
import { Lecture } from '../lecture.entity';

export class LectureDto extends AbstractDto implements Lecture {
  @UUIDField()
  timlineItemId: string;
  @UUIDField()
  exerciseId: string;
  @ClassField(() => TimelineItemDto, { required: false })
  timelineItem?: TimelineItemDto;
  // @ClassField(() => ExerciseDto, { required: false })
}
