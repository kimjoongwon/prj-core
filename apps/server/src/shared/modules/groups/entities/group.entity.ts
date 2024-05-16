import { ApiProperty } from '@nestjs/swagger';
import { Group } from '@prisma/client';
import { CommonEntity } from '../../../entity/common.entity';

export class GroupEntity extends CommonEntity implements Group {
  @ApiProperty()
  name: string;

  @ApiProperty()
  spaceId: string;

  @ApiProperty()
  serviceId: string;
}
