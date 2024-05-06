import { ApiProperty } from '@nestjs/swagger';
import { Service } from '@prisma/client';

export enum SERVICE_NAME {
  SPACE = 'SPACE',
  USER = 'USER',
  SETTING = 'SETTING',
}

export class ServiceEntity implements Service {
  @ApiProperty()
  id: string;

  @ApiProperty({ nullable: true })
  label: string;

  @ApiProperty({
    enum: SERVICE_NAME,
  })
  name: SERVICE_NAME;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({
    example: null,
  })
  updatedAt: Date | null;

  @ApiProperty({
    example: null,
  })
  deletedAt: Date | null;
}
