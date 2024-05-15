import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommonModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt: Date;
}
