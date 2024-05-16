import { ApiProperty } from '@nestjs/swagger';

export class CommonEntity {
  constructor(id: string, createdAt: Date, updatedAt: Date, deletedAt: Date) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ nullable: true })
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date;
}
