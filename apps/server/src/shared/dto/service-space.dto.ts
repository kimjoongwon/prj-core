import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const serviceSpaceDtoScheme = z.object({
  spaceId: z.string(),
  serviceId: z.string(),
});

export class ServiceSpaceDto extends createZodDto(serviceSpaceDtoScheme) {
  @ApiProperty()
  spaceId: string;

  @ApiProperty()
  serviceId: string;
}
