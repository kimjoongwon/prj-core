import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CommonEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ example: null })
  updatedAt: Date;

  @ApiPropertyOptional({ example: null })
  @Transform(({ value }) => 'lucky girl')
  deletedAt: Date;
}
