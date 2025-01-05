import { Group as GroupEntity, Service, Space } from '@prisma/client';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { GroupDto } from './dtos';
import { plainToInstance } from 'class-transformer';

export class Group extends AbstractEntity implements GroupEntity {
  name: string;
  serviceId: string;
  spaceId: string;
  space?: Space;
  service?: Service;

  toDto(): GroupDto {
    return plainToInstance(GroupDto, this);
  }
}
