import { Category } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CommonEntity } from '../../../entity';

export class CategoryEntity extends CommonEntity implements Category {
  constructor(category: Category) {
    super();
    Object.assign(this, category);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ancestorIds: string[];

  @ApiProperty({ nullable: true })
  parentId: string;

  @ApiProperty()
  spaceId: string;

  @ApiProperty()
  serviceId: string;
}
