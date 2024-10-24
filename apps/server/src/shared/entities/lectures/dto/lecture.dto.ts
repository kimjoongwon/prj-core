import { ClassField, UUIDField } from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { PostDto } from '../../posts';
import { SessionDto } from '../../sessions';
import { Lecture } from '../lecture.entity';

export class LectureDto extends AbstractDto implements Lecture {
  @UUIDField()
  postId: string;
  @UUIDField()
  sessionId: string;
  @UUIDField()
  tenantId: string;

  @ClassField(() => PostDto, { required: false })
  post?: PostDto;

  @ClassField(() => SessionDto, { required: false })
  session?: SessionDto;
}
