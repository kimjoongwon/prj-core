import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { format } from 'date-fns';

export class CommonEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ example: null })
  @Transform(({ value }) => format(new Date(value), 'yyyy.MM.dd HH:mm') || null)
  updatedAt: Date;

  @ApiPropertyOptional({ example: null })
  deletedAt: Date;
}
