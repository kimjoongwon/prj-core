import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommonEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ example: null })
  updatedAt: Date;

  @ApiPropertyOptional({ example: null })
  deletedAt: Date;
}
