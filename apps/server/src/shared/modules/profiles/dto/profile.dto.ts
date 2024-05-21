import { Profile } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '../../../entities';

export class ProfileEntity extends AbstractEntity implements Profile {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  userId: string;
}

export class ProfileDto extends ProfileEntity {}
