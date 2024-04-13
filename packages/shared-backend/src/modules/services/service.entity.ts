import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Service } from '@prisma/client';

export class ServiceEntity implements Service {
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: $Enums.SERVICE_NAME,
  })
  name: $Enums.SERVICE_NAME;

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
