import { ApiProperty } from '@nestjs/swagger';

export class OptionDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  value: string;
}
