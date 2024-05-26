import { ApiProperty } from '@nestjs/swagger';
import { Group } from '@prisma/client';
import { AbstractEntity } from './common/abstract.entity';

export class GroupEntity extends AbstractEntity implements Group {
  @ApiProperty()
  name: string;

  @ApiProperty()
  spaceId: string;

  @ApiProperty()
  serviceId: string;
}
