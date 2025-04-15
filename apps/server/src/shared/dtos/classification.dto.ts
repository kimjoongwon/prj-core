import { Classification } from '@prisma/client';
import { ClassField, UUIDField, UUIDFieldOptional } from '../decorators';
import { SpaceDto, UserDto, AbstractDto, CategoryDto, TimelineDto } from '.';
import { ContentDto } from './content.dto';

export class ClassificationDto extends AbstractDto implements Classification {
  @UUIDFieldOptional({ nullable: true, default: null })
  taskId: string;

  @UUIDFieldOptional({ nullable: true, default: null })
  fileId: string | null;

  @UUIDFieldOptional({ nullable: true, default: null })
  contentId: string | null;

  @UUIDFieldOptional({ nullable: true, default: null })
  timelineId: string | null;

  @UUIDFieldOptional({ nullable: true, default: null })
  userId: string | null;

  @UUIDFieldOptional({ nullable: true, default: null })
  spaceId: string | null;

  @UUIDFieldOptional({ nullable: true, default: null })
  roleId: string | null;

  @UUIDField()
  categoryId: string;

  @UUIDField()
  serviceId: string;

  @ClassField(() => CategoryDto, { required: false })
  category?: CategoryDto;

  @ClassField(() => UserDto, { required: false })
  user?: UserDto[];

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto[];

  @ClassField(() => TimelineDto, { required: false })
  timeline?: TimelineDto[];

  @ClassField(() => ContentDto, { required: false })
  content?: ContentDto[];

  @ClassField(() => ClassificationDto, { required: false })
  task?: ClassificationDto[];
}
