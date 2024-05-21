import { AbstractDto } from 'src/shared/dto';
import { CategoryEntity } from '../entities/category.entity';
import { StringField } from 'src/shared/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto extends AbstractDto {
  @StringField()
  name: string;

  @ApiProperty({ type: [String] })
  ancestorIds: string[];

  @StringField({ nullable: true })
  parentId: string | null;

  @StringField()
  spaceId: string;

  @StringField()
  serviceId: string;

  constructor(categoryEntity: CategoryEntity) {
    super(categoryEntity);
    this.name = categoryEntity.name;
    this.ancestorIds = categoryEntity.ancestorIds;
    this.parentId = categoryEntity.parentId;
    this.spaceId = categoryEntity.spaceId;
    this.serviceId = categoryEntity.serviceId;
  }
}
