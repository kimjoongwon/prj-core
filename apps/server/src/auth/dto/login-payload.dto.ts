import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
export class LoginPayloadDto {
  @ApiProperty({
    example: 'PROMISE@gmail.com',
  })
  @Expose()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'rkdmf12!@',
  })
  @Expose()
  @IsString()
  password: string;
}
