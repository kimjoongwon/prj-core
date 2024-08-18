import { OmitType } from '@nestjs/swagger';
import { GroupEntity } from '../group.entity';

export class CreateGroupDto extends OmitType(GroupEntity, [
  'createdAt',
  'deletedAt',
  'updatedAt',
  'id',
]) {}
