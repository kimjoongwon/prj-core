import { Profile } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '../../../entity';

export class ProfileEntity extends CommonEntity implements Profile {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  userId: string;
}

export class ProfileDto extends ProfileEntity {}
