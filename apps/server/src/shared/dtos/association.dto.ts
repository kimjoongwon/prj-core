import { Association } from '@prisma/client';
import { ClassField, UUIDField, UUIDFieldOptional } from '../decorators/field.decorators';
import { AbstractDto, GroupDto, UserDto, ServiceDto, TenancyDto, RoutineDto, TimelineDto } from '.';
import { ContentDto } from './content.dto';

export class AssociationDto extends AbstractDto implements Association {
  @UUIDFieldOptional({ nullable: true })
  contentId: string | null;

  @UUIDFieldOptional({ nullable: true })
  timelineId: string | null;

  @UUIDFieldOptional({ nullable: true })
  roleId: string | null;

  @UUIDFieldOptional({ nullable: true })
  groupId: string | null;

  @UUIDFieldOptional({ nullable: true })
  userId: string | null;

  @UUIDFieldOptional({ nullable: true })
  spaceId: string | null;

  @UUIDFieldOptional({ nullable: true })
  postId: string | null;

  @UUIDField()
  serviceId: string;

  @ClassField(() => GroupDto, { required: false, swagger: false })
  group?: GroupDto;

  @ClassField(() => UserDto, { required: false, swagger: false })
  user?: GroupDto;

  @ClassField(() => TimelineDto, { required: false, swagger: false })
  timeline?: TimelineDto;

  @ClassField(() => ContentDto, { required: false, swagger: false })
  content?: ContentDto;

  @ClassField(() => ServiceDto, { required: false, swagger: false })
  service?: ServiceDto;
}
