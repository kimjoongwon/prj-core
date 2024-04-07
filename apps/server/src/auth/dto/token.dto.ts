import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'nestjs-zod/z';

const tokenDtoSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export class TokenDto extends createZodDto(tokenDtoSchema) {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}
